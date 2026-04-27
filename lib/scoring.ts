import { formatEther } from "viem";
import { detectProtocols, getProtocolForAddress } from "@/lib/protocols";
import { dateKey } from "@/lib/utils";
import type {
  AnalysisResult,
  CriteriaResult,
  HeatmapDay,
  NormalizedTx,
  ProtocolHit,
  SybilAssessment,
  Tier,
  WalletMetrics
} from "@/lib/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function weiToEth(valueWei: string) {
  try {
    return Number(formatEther(BigInt(valueWei || "0")));
  } catch {
    return 0;
  }
}

function getWeekKey(timestamp: number) {
  const date = new Date(timestamp);
  const firstDay = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - firstDay.getTime()) / DAY_MS);
  const week = Math.ceil((dayOfYear + firstDay.getUTCDay() + 1) / 7);

  return `${date.getUTCFullYear()}-${week}`;
}

function getMonthKey(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
}

function looksLikeContractCall(tx: NormalizedTx) {
  return Boolean(tx.to && tx.input && tx.input !== "0x");
}

function includesAny(value: string, words: string[]) {
  const normalized = value.toLowerCase();
  return words.some((word) => normalized.includes(word));
}

function buildHeatmap(transactions: NormalizedTx[]): HeatmapDay[] {
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const startUtc = todayUtc - 363 * DAY_MS;
  const dayMap = new Map<string, { count: number; valueEth: number }>();

  for (let index = 0; index < 364; index += 1) {
    const date = new Date(startUtc + index * DAY_MS).toISOString().slice(0, 10);
    dayMap.set(date, { count: 0, valueEth: 0 });
  }

  for (const tx of transactions) {
    if (tx.timestamp < startUtc || tx.timestamp > todayUtc + DAY_MS) {
      continue;
    }

    const key = dateKey(tx.timestamp);
    const current = dayMap.get(key);

    if (!current) {
      continue;
    }

    current.count += 1;
    current.valueEth += weiToEth(tx.valueWei);
  }

  return Array.from(dayMap.entries()).map(([date, value]) => {
    let level: HeatmapDay["level"] = 0;

    if (value.count >= 10) {
      level = 4;
    } else if (value.count >= 5) {
      level = 3;
    } else if (value.count >= 2) {
      level = 2;
    } else if (value.count >= 1) {
      level = 1;
    }

    return {
      date,
      count: value.count,
      valueEth: value.valueEth,
      level
    };
  });
}

function assessSybilRisk(metrics: WalletMetrics): SybilAssessment {
  let score = 0;
  const signals: string[] = [];

  if (metrics.walletAgeDays < 14 && metrics.txCount > 0) {
    score += 20;
    signals.push("Wallet is very new.");
  }

  if (metrics.activeDays < 3 && metrics.txCount >= 10) {
    score += 18;
    signals.push("Activity is concentrated into very few days.");
  }

  if (metrics.uniqueContracts < 3 && metrics.txCount >= 10) {
    score += 18;
    signals.push("Low contract diversity for the transaction count.");
  }

  if (metrics.repetitiveRatio > 0.6 && metrics.txCount >= 10) {
    score += 20;
    signals.push("Many transactions target the same address.");
  }

  if (metrics.valueMovedEth < 0.01 && metrics.txCount >= 10) {
    score += 12;
    signals.push("Low meaningful value movement detected.");
  }

  if (metrics.maxDailyTransactions >= 25 && metrics.activeDays <= 2) {
    score += 12;
    signals.push("Burst activity pattern detected.");
  }

  const boundedScore = Math.min(100, score);

  if (signals.length === 0) {
    signals.push("No obvious automated pattern from the available data.");
  }

  return {
    score: boundedScore,
    level: boundedScore >= 65 ? "High" : boundedScore >= 35 ? "Medium" : "Low",
    signals
  };
}

function tierFromScore(score: number): Tier {
  if (score >= 85) {
    return "Mythic";
  }

  if (score >= 65) {
    return "Gold";
  }

  if (score >= 40) {
    return "Silver";
  }

  if (score >= 20) {
    return "Uncommon";
  }

  if (score >= 5) {
    return "Eligible";
  }

  return "No Signal";
}

// ... keeping assessSybilRisk mapping the same.

function criterion(
  id: string,
  label: string,
  description: string,
  earned: boolean,
  value: string,
  weight: number
): CriteriaResult {
  return {
    id,
    label,
    description,
    earned,
    value,
    points: earned ? weight : 0,
    maxPoints: weight
  };
}

export interface BuildAnalysisInput {
  address: string;
  displayAddress: string;
  inputType: "address" | "ens";
  transactions: NormalizedTx[];
  firstTransaction: NormalizedTx | null;
  balanceEth: number;
  warnings: string[];
  estimated: boolean;
}

export function buildAnalysis(input: BuildAnalysisInput): AnalysisResult {
  const addressLower = input.address.toLowerCase();
  const successfulTxs = input.transactions.filter(tx => !tx.isError);

  const activeDays = new Set<string>();
  const activeWeeks = new Set<string>();
  const activeMonths = new Set<string>();
  const uniqueContracts = new Set<string>();
  const toCounts = new Map<string, number>();
  const dailyCounts = new Map<string, number>();

  let valueMovedEth = 0;
  let gasSpentEth = 0;
  let bridgeInteractions = 0;
  let dexInteractions = 0;
  let lendingInteractions = 0;
  let tokenInteractions = 0;
  let nftInteractions = 0;

  for (const tx of successfulTxs) {
    if (!tx.timestamp) {
      continue;
    }

    const day = dateKey(tx.timestamp);
    activeDays.add(day);
    activeWeeks.add(getWeekKey(tx.timestamp));
    activeMonths.add(getMonthKey(tx.timestamp));
    dailyCounts.set(day, (dailyCounts.get(day) || 0) + 1);

    valueMovedEth += weiToEth(tx.valueWei);

    if (tx.from.toLowerCase() === addressLower) {
      gasSpentEth += weiToEth((BigInt(tx.gasUsed || "0") * BigInt(tx.gasPrice || "0")).toString());
    }

    if (looksLikeContractCall(tx) && tx.to) {
      uniqueContracts.add(tx.to.toLowerCase());
    }

    if (tx.to) {
      const key = tx.to.toLowerCase();
      toCounts.set(key, (toCounts.get(key) || 0) + 1);
    }

    const protocol = getProtocolForAddress(tx.to);
    const functionName = tx.functionName || "";

    if (protocol?.category === "Bridge" || includesAny(functionName, ["bridge", "depositeth", "withdraw"])) {
      bridgeInteractions += 1;
    }

    if (protocol?.category === "DEX" || includesAny(functionName, ["swap", "exactinput", "exactoutput"])) {
      dexInteractions += 1;
    }

    if (protocol?.category === "Lending" || includesAny(functionName, ["borrow", "repay", "supply", "withdraw"] )) {
      lendingInteractions += 1;
    }

    if (protocol?.category === "Token" || includesAny(functionName, ["transfer", "approve", "permit"])) {
      tokenInteractions += 1;
    }

    if (["NFT", "Creator", "Social"].includes(protocol?.category || "") || includesAny(functionName, ["mint", "collect", "buyshares"])) {
      nftInteractions += 1;
    }
  }

  const firstTimestamp = input.firstTransaction?.timestamp || successfulTxs.at(-1)?.timestamp || 0;
  const walletAgeDays = firstTimestamp ? Math.max(0, Math.floor((Date.now() - firstTimestamp) / DAY_MS)) : 0;
  const maxToCount = Math.max(0, ...Array.from(toCounts.values()));
  const maxDailyTransactions = Math.max(0, ...Array.from(dailyCounts.values()));
  const protocols: ProtocolHit[] = detectProtocols(successfulTxs);

  const metrics: WalletMetrics = {
    balanceEth: input.balanceEth,
    txCount: input.transactions.length,
    analyzedTxCount: successfulTxs.length,
    activeDays: activeDays.size,
    activeWeeks: activeWeeks.size,
    activeMonths: activeMonths.size,
    walletAgeDays,
    firstTxDate: firstTimestamp ? new Date(firstTimestamp).toISOString() : null,
    uniqueContracts: uniqueContracts.size,
    valueMovedEth,
    gasSpentEth,
    bridgeInteractions,
    dexInteractions,
    lendingInteractions,
    tokenInteractions,
    nftInteractions,
    protocolsTouched: protocols.length,
    repetitiveRatio: successfulTxs.length ? maxToCount / successfulTxs.length : 0,
    maxDailyTransactions
  };

  const sybil = assessSybilRisk(metrics);

  const criteria = [
    criterion("base-balance", "Base ETH holder", "Wallet holds native ETH on Base.", metrics.balanceEth > 0.00001, `${metrics.balanceEth.toFixed(5)} ETH`, 5),
    criterion("meaningful-balance", "Meaningful balance", "Wallet has enough ETH to look actively funded.", metrics.balanceEth >= 0.01, `${metrics.balanceEth.toFixed(4)} ETH`, 10),
    criterion("ten-transactions", "10+ transactions", "Basic Base transaction activity.", metrics.txCount >= 10, `${metrics.txCount} analyzed`, 5),
    criterion("fifty-transactions", "50+ transactions", "Stronger repeat activity signal.", metrics.txCount >= 50, `${metrics.txCount} analyzed`, 10),
    criterion("active-days", "7+ active days", "Activity spread across multiple days.", metrics.activeDays >= 7, `${metrics.activeDays} days`, 5),
    criterion("active-weeks", "4+ active weeks", "Activity persisted across several weeks.", metrics.activeWeeks >= 4, `${metrics.activeWeeks} weeks`, 5),
    criterion("active-months", "3+ active months", "Longer-term Base presence.", metrics.activeMonths >= 3, `${metrics.activeMonths} months`, 5),
    criterion("wallet-age", "90+ day wallet age", "First available Base transaction is older than 90 days.", metrics.walletAgeDays >= 90, `${metrics.walletAgeDays} days`, 5),
    criterion("bridge-activity", "Bridge activity", "Bridge-like activity or Base bridge interaction detected.", metrics.bridgeInteractions >= 1, `${metrics.bridgeInteractions} hits`, 5),
    criterion("value-moved", "Meaningful value moved", "Wallet moved at least 0.1 ETH of native value in analyzed transactions.", metrics.valueMovedEth >= 0.1, `${metrics.valueMovedEth.toFixed(4)} ETH`, 5),
    criterion("gas-spent", "Gas spent", "Wallet paid meaningful gas on Base.", metrics.gasSpentEth >= 0.001, `${metrics.gasSpentEth.toFixed(5)} ETH`, 5),
    criterion("unique-contracts", "10+ unique contracts", "Contract diversity across Base apps.", metrics.uniqueContracts >= 10, `${metrics.uniqueContracts} contracts`, 5),
    criterion("protocols", "3+ known protocols", "Touched multiple known Base apps.", metrics.protocolsTouched >= 3, `${metrics.protocolsTouched} protocols`, 5),
    criterion("dex", "DEX activity", "Swap or DEX protocol interaction detected.", metrics.dexInteractions >= 1, `${metrics.dexInteractions} hits`, 5),
    criterion("lending", "Lending or DeFi", "Lending or DeFi-like interaction detected.", metrics.lendingInteractions >= 1, `${metrics.lendingInteractions} hits`, 5),
    criterion("token", "Token or stablecoin", "Token transfer, approval, or stablecoin interaction detected.", metrics.tokenInteractions >= 1, `${metrics.tokenInteractions} hits`, 5),
    criterion("nft", "NFT or creator", "NFT, creator, or social collectible activity detected.", metrics.nftInteractions >= 1, `${metrics.nftInteractions} hits`, 5),
    criterion("sybil", "Low sybil-risk pattern", "Available activity does not look highly automated.", sybil.level !== "High", `${sybil.level} risk`, 5)
  ];

  const score = criteria.reduce((sum, item) => sum + item.points, 0);
  const tier = tierFromScore(score);

  return {
    address: input.address,
    resolvedAddress: input.address,
    displayAddress: input.displayAddress,
    inputType: input.inputType,
    score,
    maxScore: 100,
    tier,
    criteria,
    metrics,
    heatmap: buildHeatmap(successfulTxs),
    protocols,
    sybil,
    warnings: input.warnings,
    estimated: input.estimated,
    generatedAt: new Date().toISOString()
  };
}
