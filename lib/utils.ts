import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Tier } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddress(address: string, leading = 6, trailing = 4) {
  if (!address) {
    return "";
  }

  if (address.length <= leading + trailing + 3) {
    return address;
  }

  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}

export function formatNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatEth(value: number, maximumFractionDigits = 4) {
  if (!Number.isFinite(value)) {
    return "0 ETH";
  }

  if (value > 0 && value < 0.0001) {
    return "<0.0001 ETH";
  }

  return `${formatNumber(value, maximumFractionDigits)} ETH`;
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

export function tierTone(tier: Tier) {
  switch (tier) {
    case "Mythic":
      return "text-[#ff00ff] border-[#ff00ff]/30 bg-[#ff00ff]/10";
    case "Gold":
      return "text-amber-400 border-amber-400/30 bg-amber-400/10";
    case "Silver":
      return "text-slate-300 border-slate-300/30 bg-slate-300/10";
    case "Uncommon":
      return "text-cyan-400 border-cyan-400/30 bg-cyan-400/10";
    case "Eligible":
      return "text-[#00ff00] border-[#00ff00]/30 bg-[#00ff00]/10";
    default:
      return "text-[#666] border-[#333] bg-[#050505]";
  }
}

export function getAppUrl() {
  return (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function dateKey(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10);
}
