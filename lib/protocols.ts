import type { NormalizedTx, ProtocolDefinition, ProtocolHit } from "@/lib/types";

export const PROTOCOLS: ProtocolDefinition[] = [
  {
    name: "Base Bridge",
    category: "Bridge",
    label: "Bridge",
    color: "#38bdf8",
    addresses: [
      "0x4200000000000000000000000000000000000010",
      "0x49048044d57e1c92a77f79988d21fa8faf74e97e"
    ]
  },
  {
    name: "Aerodrome",
    category: "DEX",
    label: "DEX",
    color: "#60a5fa",
    addresses: [
      "0xcf77a3ba9a5ca399b7c97c74d54e5bc4d4febf58",
      "0x827922686190790b37229fd06084350e74485b72"
    ]
  },
  {
    name: "Uniswap",
    category: "DEX",
    label: "DEX",
    color: "#fb7185",
    addresses: [
      "0x6ff5693b99212da76ad316178a184ab56d299b43",
      "0x2626664c2603336e57b271c5c0b26f421741e481"
    ]
  },
  {
    name: "Moonwell",
    category: "Lending",
    label: "Lending",
    color: "#22d3ee",
    addresses: [
      "0xfbb21d0380bee3312b33c4353c8936a0f13ef26c",
      "0x628ff693426583d9a7fb391e54366292f509d457"
    ]
  },
  {
    name: "Aave",
    category: "Lending",
    label: "Lending",
    color: "#a78bfa",
    addresses: ["0xa238dd80c259a72e81d7e4664a9801593f98d1c5"]
  },
  {
    name: "Compound",
    category: "Lending",
    label: "Lending",
    color: "#34d399",
    addresses: ["0xb125e6687d4313864e53df431d5425969c15eb2f"]
  },
  {
    name: "OpenSea",
    category: "NFT",
    label: "NFT",
    color: "#0ea5e9",
    addresses: [
      "0x0000000000000068f116a894984e2db1123eb395",
      "0x00000000000001ad428e4906ae43d8f9852d0dd6",
      "0x00000000000000adc04c56bf30ac9d3c0aaf14dc"
    ]
  },
  {
    name: "Zora",
    category: "Creator",
    label: "Creator",
    color: "#f472b6",
    addresses: [
      "0x7777777f279eba3d3ad8f4e708545291a6fdba8b",
      "0x04e2516a2c207e84a1839755675dfd8ef6302f0a"
    ]
  },
  {
    name: "FriendTech",
    category: "Social",
    label: "Social",
    color: "#06b6d4",
    addresses: ["0xcf205808ed36593aa40a44f10c7f7c2f67d4a4d4"]
  }
];

const ADDRESS_TO_PROTOCOL = new Map<string, ProtocolDefinition>();

for (const protocol of PROTOCOLS) {
  for (const address of protocol.addresses) {
    ADDRESS_TO_PROTOCOL.set(address.toLowerCase(), protocol);
  }
}

export function getProtocolForAddress(address: string | null) {
  if (!address) {
    return null;
  }

  return ADDRESS_TO_PROTOCOL.get(address.toLowerCase()) || null;
}

export function detectProtocols(transactions: NormalizedTx[]): ProtocolHit[] {
  const counts = new Map<string, ProtocolHit>();

  for (const tx of transactions) {
    const protocol = getProtocolForAddress(tx.to);

    if (!protocol) {
      continue;
    }

    const current = counts.get(protocol.name);

    if (current) {
      current.interactions += 1;
      continue;
    }

    counts.set(protocol.name, {
      name: protocol.name,
      category: protocol.category,
      interactions: 1,
      color: protocol.color,
      label: protocol.label
    });
  }

  return Array.from(counts.values()).sort((a, b) => b.interactions - a.interactions);
}
