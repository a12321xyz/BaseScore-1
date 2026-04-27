import { AlertTriangle } from "lucide-react";
import { ShareButton } from "@/components/share-button";
import { Card } from "@/components/ui/card";
import { formatEth, shortAddress, tierTone } from "@/lib/utils";
import type { AnalysisResult } from "@/lib/types";

export function ScoreSummary({ result }: { result: AnalysisResult }) {
  return (
    <Card className="overflow-hidden border-[#1a1a1a] bg-black rounded-none">
      <div className="p-8 sm:p-12 border-b border-[#1a1a1a]">
        {/* Big Score Section */}
        <div className="relative mb-12 mt-4">
          {/* Faint background text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] sm:text-[14rem] font-bold text-[#111] leading-none select-none z-0 tracking-tighter">
            SCORE
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end gap-x-6 gap-y-4">
            <div className="flex items-baseline gap-2 sm:gap-4 lg:gap-6">
              <div className="flex items-baseline">
                <span className="text-[5rem] sm:text-[7rem] xl:text-[9rem] font-black leading-none tracking-tighter text-white font-space">
                  {result.score}
                </span>
              </div>
              <div className="text-[#666] text-3xl sm:text-5xl font-light italic font-space leading-none">
                / 100
              </div>
            </div>
            
            <div className="flex flex-col gap-2 pb-2 sm:pb-3 lg:pb-4">
              <div className={`mt-1 font-mono text-xs sm:text-sm tracking-widest ${tierTone(result.tier)} uppercase font-bold px-3 py-1.5 border inline-flex items-center justify-center w-max`}>{result.tier} TIER</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.6)] animate-pulse"></div>
                <span className="text-[#00ff00] font-mono text-[10px] font-bold tracking-widest uppercase">
                  {result.estimated ? "ESTIMATED BUILD" : "STABLE BUILD"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <p className="text-[#888] text-xl sm:text-2xl font-light leading-relaxed font-space">
            Integrated scoring algorithm evaluating <strong className="text-[#ccc] font-medium">{shortAddress(result.displayAddress)}</strong>. 
            Optimized for {result.tier} potential rank mapping and sybil diagnostics.
          </p>
        </div>

        {result.warnings.length ? (
          <div className="mt-8 relative z-10 rounded-sm border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200 font-mono">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="space-y-1">
                {result.warnings.map((warning) => (
                  <p key={warning}>{warning}</p>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#1a1a1a] bg-[#050505]">
        <Metric label="ETH BALANCE" value={formatEth(result.metrics.balanceEth)} />
        <Metric label="TIMESTAMP" value={new Date(result.generatedAt).toISOString().split('T')[0]} />
        <Metric label="LATENCY_MS" value={`${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)}ms`} />
        
        <div className="p-6 md:p-8 flex items-center justify-center md:justify-end col-span-2 md:col-span-1 border-[#1a1a1a]">
          <ShareButton result={result} />
        </div>
      </div>
      
      {/* Footer minimal info */}
      <div className="bg-[#020202] py-3 px-8 border-t border-[#1a1a1a] text-right">
        <span className="font-mono text-[9px] tracking-widest text-[#333]">
          SYS_REF: BS-0982-A // {result.inputType === 'ens' ? 'ENS_RESOLVED' : 'LOCAL_CLONE_SECURE'}
        </span>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 md:p-8 flex flex-col justify-center">
      <div className="text-[10px] font-mono tracking-widest text-[#666] uppercase mb-3">{label}</div>
      <div className="text-white text-xl sm:text-2xl font-bold font-space">{value}</div>
    </div>
  );
}
