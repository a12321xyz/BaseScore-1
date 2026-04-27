export type Tier = "Mythic" | "Gold" | "Silver" | "Uncommon" | "Eligible" | "No Signal";

export type InputType = "address" | "ens";

export type ProtocolCategory = "DEX" | "Bridge" | "Lending" | "NFT" | "Social" | "Token" | "Creator" | "Other";

export type SybilLevel = "Low" | "Medium" | "High";

export interface NormalizedTx {
  hash: string;
  from: string;
  to: string | null;
  valueWei: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  input: string;
  functionName: string;
  isError: boolean;
}

export interface CriteriaResult {
  id: string;
  label: string;
  description: string;
  earned: boolean;
  points: number;
  maxPoints: number;
  value: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
  valueEth: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ProtocolDefinition {
  name: string;
  category: ProtocolCategory;
  addresses: string[];
  color: string;
  label: string;
}

export interface ProtocolHit {
  name: string;
  category: ProtocolCategory;
  interactions: number;
  color: string;
  label: string;
}

export interface SybilAssessment {
  level: SybilLevel;
  score: number;
  signals: string[];
}

export interface WalletMetrics {
  balanceEth: number;
  txCount: number;
  analyzedTxCount: number;
  activeDays: number;
  activeWeeks: number;
  activeMonths: number;
  walletAgeDays: number;
  firstTxDate: string | null;
  uniqueContracts: number;
  valueMovedEth: number;
  gasSpentEth: number;
  bridgeInteractions: number;
  dexInteractions: number;
  lendingInteractions: number;
  tokenInteractions: number;
  nftInteractions: number;
  protocolsTouched: number;
  repetitiveRatio: number;
  maxDailyTransactions: number;
}

export interface AnalysisResult {
  address: string;
  resolvedAddress: string;
  displayAddress: string;
  inputType: InputType;
  score: number;
  maxScore: 100;
  tier: Tier;
  criteria: CriteriaResult[];
  metrics: WalletMetrics;
  heatmap: HeatmapDay[];
  protocols: ProtocolHit[];
  sybil: SybilAssessment;
  warnings: string[];
  estimated: boolean;
  generatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  label: string;
  score: number;
  tier: Tier;
  protocols: string[];
  value: string;
}
