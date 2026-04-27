import { createPublicClient, formatEther, http, type Address } from "viem";
import { base, mainnet } from "viem/chains";

const BASE_RPC_URL = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const ETH_RPC_URL = process.env.ETH_RPC_URL || "https://eth.llamarpc.com";

const baseClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL, {
    retryCount: 1,
    timeout: 8_000
  })
});

const ethClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_RPC_URL, {
    retryCount: 1,
    timeout: 8_000
  })
});

export async function resolveEnsName(name: string) {
  return ethClient.getEnsAddress({
    name: name.toLowerCase()
  });
}

export async function getBaseBalanceEth(address: Address) {
  const balance = await baseClient.getBalance({ address });
  return Number(formatEther(balance));
}
