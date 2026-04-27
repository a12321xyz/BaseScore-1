import type { NormalizedTx } from "@/lib/types";

const BLOCKSCOUT_API_URL = "https://base.blockscout.com/api";
const BASESCAN_API_URL = "https://api.basescan.org/api";
const PAGE_SIZE = 2500;
const MAX_PAGES = 1;

interface BlockscoutResponse<T> {
  status: string;
  message: string;
  result: T;
}

interface BlockscoutTx {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timeStamp: string;
  input: string;
  functionName?: string;
  isError?: string;
  txreceipt_status?: string;
}

export interface TransactionFetchResult {
  transactions: NormalizedTx[];
  firstTransaction: NormalizedTx | null;
  hitLimit: boolean;
}

export class BlockscoutError extends Error {
  status = 502;
  code = "EXPLORER_ERROR";
}

function buildUrl(baseUrl: string, params: Record<string, string | number>) {
  const url = new URL(baseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  if (baseUrl === BASESCAN_API_URL && process.env.BASESCAN_API_KEY) {
    url.searchParams.set("apikey", process.env.BASESCAN_API_KEY);
  } else if (baseUrl === BLOCKSCOUT_API_URL && process.env.BLOCKSCOUT_API_KEY) {
    url.searchParams.set("apikey", process.env.BLOCKSCOUT_API_KEY);
  }

  return url;
}

async function fetchJsonWithFallback<T>(params: Record<string, string | number>): Promise<BlockscoutResponse<T>> {
  const urlsToTry = [
    buildUrl(BASESCAN_API_URL, params),
    buildUrl(BLOCKSCOUT_API_URL, params)
  ];
  
  let lastError: Error | null = null;
  
  for (const url of urlsToTry) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          accept: "application/json"
        }
      });

      if (response.status === 429) {
        throw new BlockscoutError("Rate limited");
      }

      if (!response.ok) {
        throw new BlockscoutError(`Explorer returned HTTP ${response.status}.`);
      }

      const data = await response.json() as BlockscoutResponse<T>;
      
      // Some APIs return status "0" for rate limiting
      if (data.status === "0" && typeof data.result === "string" && data.result.toLowerCase().includes("rate limit")) {
         throw new BlockscoutError("Rate limited in payload");
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        lastError = new BlockscoutError("Request timed out.");
      } else {
        lastError = error instanceof Error ? error : new Error("Unknown error");
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  
  throw lastError || new BlockscoutError("All explorer requests failed.");
}

function normalizeTx(tx: BlockscoutTx): NormalizedTx {
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to || null,
    valueWei: tx.value || "0",
    gasUsed: tx.gasUsed || "0",
    gasPrice: tx.gasPrice || "0",
    timestamp: Number(tx.timeStamp || 0) * 1000,
    input: tx.input || "0x",
    functionName: tx.functionName || "",
    isError: tx.isError === "1" || tx.txreceipt_status === "0"
  };
}

function hasNoTransactions<T>(payload: BlockscoutResponse<T>) {
  return payload.status === "0" && String(payload.result).toLowerCase().includes("no transactions");
}

export async function getAddressBalanceWei(address: string) {
  const payload = await fetchJsonWithFallback<string>({
    module: "account",
    action: "balance",
    address,
    tag: "latest"
  });

  if (payload.status === "0") {
    throw new BlockscoutError(payload.message || "Could not fetch wallet balance.");
  }

  return payload.result || "0";
}

async function getTxPage(address: string, page: number, sort: "asc" | "desc") {
  const payload = await fetchJsonWithFallback<BlockscoutTx[] | string>({
    module: "account",
    action: "txlist",
    address,
    startblock: 0,
    endblock: 99999999,
    page,
    offset: PAGE_SIZE,
    sort
  });

  if (hasNoTransactions(payload)) {
    return [];
  }

  if (payload.status === "0" || !Array.isArray(payload.result)) {
    throw new BlockscoutError(payload.message || "Could not fetch wallet transactions.");
  }

  return payload.result.map(normalizeTx);
}

export async function getAddressTransactions(address: string): Promise<TransactionFetchResult> {
  const transactions: NormalizedTx[] = [];
  let hitLimit = false;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const pageItems = await getTxPage(address, page, "desc");
    transactions.push(...pageItems);

    if (pageItems.length < PAGE_SIZE) {
      break;
    }

    if (page === MAX_PAGES) {
      hitLimit = true;
    }
  }

  let firstTransaction: NormalizedTx | null = null;

  try {
    const firstPage = await getTxPage(address, 1, "asc");
    firstTransaction = firstPage[0] || transactions.at(-1) || null;
  } catch {
    firstTransaction = transactions.at(-1) || null;
  }

  return {
    transactions,
    firstTransaction,
    hitLimit
  };
}
