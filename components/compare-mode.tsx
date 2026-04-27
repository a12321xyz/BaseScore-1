"use client";

import { FormEvent, useState } from "react";
import { Loader2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatEth, formatNumber, shortAddress, tierTone } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/types";

interface ApiErrorResponse {
  error?: string;
}

export function CompareMode({ currentResult }: { currentResult: AnalysisResult }) {
  const [address, setAddress] = useState("");
  const [secondResult, setSecondResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/analyze?address=${encodeURIComponent(trimmed)}`);
      const payload = (await response.json()) as AnalysisResult | ApiErrorResponse;

      if (!response.ok) {
        throw new Error((payload as ApiErrorResponse).error || "Comparison failed.");
      }

      setSecondResult(payload as AnalysisResult);
    } catch (compareError) {
      setSecondResult(null);
      setError(compareError instanceof Error ? compareError.message : "Comparison failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Mode</CardTitle>
        <CardDescription>Paste a second wallet to compare score, activity, protocols, gas, and risk side by side.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-2 md:flex-row bg-[#050505] border border-[#1a1a1a] p-2">
          <Input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x... or ENS" className="flex-1 bg-transparent border-none rounded-none focus-visible:ring-0" />
          <Button type="submit" disabled={loading || !address.trim()} className="rounded-none bg-[#00ff00] text-black hover:bg-[#00cc00] font-mono font-bold tracking-widest uppercase">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scale className="mr-2 h-4 w-4" />}
            {loading ? "PROCESSING..." : "COMPARE"}
          </Button>
        </form>
        {error ? <p className="border border-[#ff0000]/50 bg-[#ff0000]/10 p-4 text-sm font-mono text-[#ff0000]">{error}</p> : null}
        <div className="grid gap-[1px] bg-[#1a1a1a] lg:grid-cols-2 border border-[#1a1a1a]">
          <CompareCard title="Primary Target" result={currentResult} />
          {secondResult ? (
            <CompareCard title="Secondary Target" result={secondResult} />
          ) : (
            <div className="bg-[#050505] p-8 text-center text-sm text-[#666] font-mono tracking-widest uppercase flex items-center justify-center min-h-[300px]">
              AWAITING_INPUT // SECONDARY_TARGET
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CompareCard({ title, result }: { title: string; result: AnalysisResult }) {
  return (
    <div className="bg-black p-6 md:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-[#1a1a1a] pb-6">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#888]">{title}</p>
          <p className="mt-2 text-xl md:text-2xl font-space font-bold text-white break-all">{shortAddress(result.resolvedAddress, 8, 6)}</p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-black font-space text-white">{result.score}</span>
            <span className="text-sm md:text-base text-[#666] italic font-light font-space">/ 100</span>
          </div>
          <div className={`mt-2 text-[10px] font-mono tracking-widest uppercase ${tierTone(result.tier)} border px-2 py-1 w-max`}>{result.tier}</div>
        </div>
      </div>
      <div className="mt-6 grid gap-[1px] bg-[#1a1a1a] sm:grid-cols-2 border border-[#1a1a1a]">
        <MiniMetric label="Total TX" value={formatNumber(result.metrics.txCount)} />
        <MiniMetric label="Uptime days" value={formatNumber(result.metrics.activeDays)} />
        <MiniMetric label="Value Moved" value={formatEth(result.metrics.valueMovedEth)} />
        <MiniMetric label="Wallet Age" value={`${formatNumber(result.metrics.walletAgeDays)} days`} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#050505] p-4 text-center">
      <p className="text-[10px] uppercase font-mono tracking-widest text-[#666]">{label}</p>
      <p className="mt-2 text-lg font-bold font-space text-white">{value}</p>
    </div>
  );
}
