"use client";

import { FormEvent, useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Loader2, Search } from "lucide-react";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { CompareMode } from "@/components/compare-mode";
import { CriteriaGrid } from "@/components/criteria-grid";
import { Disclaimer } from "@/components/disclaimer";
import { ProtocolFingerprint } from "@/components/protocol-fingerprint";
import { ScoreSummary } from "@/components/score-summary";
import { SiteFooter } from "@/components/site-footer";
import { SybilMeter } from "@/components/sybil-meter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AnalysisResult } from "@/lib/types";

interface ApiErrorResponse {
  error?: string;
  code?: string;
}

export function AnalyzeDashboard({ initialAddress }: { initialAddress: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [address, setAddress] = useState(initialAddress);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAnalysis = useCallback(
    async (value: string, updateUrl: boolean) => {
      const trimmed = value.trim();

      if (!trimmed) {
        setError("Enter a Base wallet address or ENS name.");
        return;
      }

      setLoading(true);
      setError("");

      if (updateUrl) {
        startTransition(() => {
          router.replace(`/analyze?address=${encodeURIComponent(trimmed)}`);
        });
      }

      try {
        const response = await fetch(`/api/analyze?address=${encodeURIComponent(trimmed)}`);
        const payload = (await response.json()) as AnalysisResult | ApiErrorResponse;

        if (!response.ok) {
          const apiError = payload as ApiErrorResponse;
          throw new Error(apiError.error || "Analysis failed. Try again shortly.");
        }

        setResult(payload as AnalysisResult);
      } catch (fetchError) {
        setResult(null);
        setError(fetchError instanceof Error ? fetchError.message : "Analysis failed. Try again shortly.");
      } finally {
        setLoading(false);
      }
    },
    [router, startTransition]
  );

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
      void loadAnalysis(initialAddress, false);
    }
  }, [initialAddress, loadAnalysis]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadAnalysis(address, true);
  }

  return (
    <main className="grid-shell relative min-h-screen overflow-hidden">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#1a1a1a] pb-6">
          <Button asChild variant="ghost" className="w-fit text-[#888] font-mono hover:text-white rounded-none hover:bg-transparent px-0">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              RETURN TO HOME
            </Link>
          </Button>
          <div className="border border-[#333] bg-black px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-[#888]">
            UNOFFICIAL AND SPECULATIVE
          </div>
        </div>

        <section className="mb-12 border border-[#1a1a1a] bg-[#050505] p-2">
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Enter Base wallet address or ENS"
              className="h-14 flex-1 border-transparent bg-transparent text-base font-mono rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#444]"
              spellCheck={false}
            />
            <Button type="submit" size="lg" disabled={loading || !address.trim()} className="rounded-none bg-[#00ff00] text-black hover:bg-[#00cc00] h-14 font-mono font-bold tracking-widest uppercase px-8">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {loading ? "PROCESSING..." : "EXECUTE"}
            </Button>
          </form>
        </section>

        {error ? (
          <div className="mb-12 border border-[#ff0000]/50 bg-[#ff0000]/10 p-6 text-[#ff0000] rounded-none">
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="font-mono">
                <p className="font-bold tracking-widest uppercase text-sm">ANALYSIS FAILURE</p>
                <p className="mt-2 text-sm text-[#ff0000]/80">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        {loading && !result ? <LoadingState /> : null}

        {result ? (
          <div className="space-y-8">
            <ScoreSummary result={result} />
            <CriteriaGrid criteria={result.criteria} />
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
              <ActivityHeatmap days={result.heatmap} />
              <SybilMeter assessment={result.sybil} />
            </div>
            <div className="grid gap-8">
              <ProtocolFingerprint protocols={result.protocols} />
            </div>
            <CompareMode currentResult={result} />
            <Disclaimer />
          </div>
        ) : null}

        {!loading && !result ? (
          <div className="space-y-8">
            <Disclaimer />
          </div>
        ) : null}

        <SiteFooter />
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-[1px] lg:grid-cols-3 bg-[#1a1a1a] border border-[#1a1a1a]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-[#050505] p-6 text-left">
          <div className="h-5 w-5 bg-[#222] animate-pulse rounded-sm mb-4" />
          <div className="h-3 w-1/2 bg-[#222] animate-pulse rounded-sm mb-2" />
          <div className="h-3 w-3/4 bg-[#222] animate-pulse rounded-sm" />
        </div>
      ))}
    </div>
  );
}
