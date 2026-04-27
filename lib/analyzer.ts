import { formatEther, type Address } from "viem";
import { resolveWalletInput, AddressInputError } from "@/lib/address";
import { getAddressBalanceWei, getAddressTransactions, BlockscoutError } from "@/lib/blockscout";
import { getCached, pruneCache, setCached } from "@/lib/cache";
import { getBaseBalanceEth } from "@/lib/rpc";
import { buildAnalysis } from "@/lib/scoring";
import type { AnalysisResult, NormalizedTx } from "@/lib/types";

const CACHE_TTL_SECONDS = 180;
const ERROR_CACHE_TTL_SECONDS = 45;

export class AnalyzerError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 500, code = "ANALYZER_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function getBalance(address: Address, warnings: string[]) {
  try {
    const balanceWei = await getAddressBalanceWei(address);
    return Number(formatEther(BigInt(balanceWei || "0")));
  } catch {
    try {
      warnings.push("Blockscout balance lookup failed. Used Base public RPC fallback.");
      return await getBaseBalanceEth(address);
    } catch {
      warnings.push("Could not fetch wallet balance. Balance-dependent points may be understated.");
      return 0;
    }
  }
}

async function getTransactions(address: Address, warnings: string[]) {
  try {
    return await getAddressTransactions(address);
  } catch (error) {
    if (error instanceof BlockscoutError && error.status === 429) {
      throw new AnalyzerError(error.message, 429, error.code);
    }

    warnings.push("Could not fetch full transaction history from Blockscout. Showing partial score.");
    return {
      transactions: [] as NormalizedTx[],
      firstTransaction: null,
      hitLimit: false
    };
  }
}

export async function analyzeWallet(input: string): Promise<AnalysisResult> {
  pruneCache();

  let resolved;

  try {
    resolved = await resolveWalletInput(input);
  } catch (error) {
    if (error instanceof AddressInputError) {
      throw new AnalyzerError(error.message, error.status, error.code);
    }

    throw new AnalyzerError("Could not resolve wallet input.", 400, "INVALID_ADDRESS");
  }

  const cacheKey = `analysis:base:${resolved.resolvedAddress.toLowerCase()}`;
  const cached = await getCached<AnalysisResult>(cacheKey);

  if (cached) {
    return {
      ...cached,
      address: resolved.resolvedAddress,
      resolvedAddress: resolved.resolvedAddress,
      displayAddress: resolved.displayAddress,
      inputType: resolved.inputType
    };
  }

  const errorCacheKey = `analysis-error:base:${resolved.resolvedAddress.toLowerCase()}`;
  const cachedError = await getCached<{ message: string; status: number; code: string }>(errorCacheKey);

  if (cachedError) {
    throw new AnalyzerError(cachedError.message, cachedError.status, cachedError.code);
  }

  const warnings: string[] = [];
  const [balanceEth, txResult] = await Promise.all([
    getBalance(resolved.resolvedAddress, warnings),
    getTransactions(resolved.resolvedAddress, warnings)
  ]);

  if (txResult.hitLimit) {
    warnings.push("Large wallet detected. Score is estimated from the latest 2500 transactions plus first-transaction lookup.");
  }

  const result = buildAnalysis({
    address: resolved.resolvedAddress,
    displayAddress: resolved.displayAddress,
    inputType: resolved.inputType,
    transactions: txResult.transactions,
    firstTransaction: txResult.firstTransaction,
    balanceEth,
    warnings,
    estimated: txResult.hitLimit || warnings.length > 0
  });

  await setCached(cacheKey, result, CACHE_TTL_SECONDS);

  return result;
}

export async function cacheAnalyzerError(address: string, error: AnalyzerError) {
  await setCached(
    `analysis-error:base:${address.toLowerCase()}`,
    {
      message: error.message,
      status: error.status,
      code: error.code
    },
    ERROR_CACHE_TTL_SECONDS
  );
}
