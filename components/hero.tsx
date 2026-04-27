"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Gauge, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      return;
    }
    setLoading(true);
    router.push(`/analyze?address=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-start gap-12 pt-12 pb-4 text-center sm:pt-20 sm:pb-8 md:pt-24 md:pb-8">
      <div className="inline-flex items-center gap-2 border border-[#333] bg-black px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-[#888]">
        <div className="h-2 w-2 bg-[#00ff00] rounded-sm"></div>
        Unofficial Base Activity Simulator
      </div>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-balance text-6xl font-black tracking-tighter text-white sm:text-8xl lg:text-9xl font-space">
          BaseScore
        </h1>
        <p className="text-balance text-lg leading-relaxed text-[#888] sm:text-2xl font-space font-light max-w-2xl mx-auto">
          Paste a Base wallet. Get a clean 100-point activity diagnostic. Rank mapping runs locally. No signatures required.
        </p>
      </div>
      <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-3xl flex-col gap-3 p-2 bg-[#050505] border border-[#1a1a1a] sm:flex-row">
        <Input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="h-14 flex-1 border-transparent bg-transparent text-base font-mono rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="0x... or ENS"
          spellCheck={false}
        />
        <Button size="lg" type="submit" disabled={!address.trim() || loading} className="rounded-none bg-[#fff] text-black hover:bg-[#ccc] h-14 font-mono font-bold tracking-widest uppercase px-8">
          {loading ? "PROCESSING..." : "EXECUTE"}
          {loading ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
      <div className="grid w-full max-w-4xl gap-[1px] bg-[#1a1a1a] sm:grid-cols-3 border border-[#1a1a1a]">
        {[
          [Gauge, "100-point heuristic", "Activity, age, protocols, diversity"],
          [ShieldCheck, "Zero signatures", "No auth, no database, no wallet connect"],
          [Sparkles, "Pre-alpha export", "Share link, OG card, local wallet saves"]
        ].map(([Icon, title, copy]) => {
          const TypedIcon = Icon as typeof Gauge;
          return (
            <div key={String(title)} className="bg-black p-6 text-left">
              <TypedIcon className="h-5 w-5 text-[#444]" />
              <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-white">{title as string}</p>
              <p className="mt-2 text-sm text-[#666]">{copy as string}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
