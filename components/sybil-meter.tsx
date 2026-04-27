import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SybilAssessment } from "@/lib/types";

export function SybilMeter({ assessment }: { assessment: SybilAssessment }) {
  const isHighRisk = assessment.level === "High";
  const colorClass = isHighRisk ? "text-[#ff0000]" : (assessment.level === "Medium" ? "text-amber-500" : "text-[#00ff00]");
  const bgClass = isHighRisk ? "bg-[#ff0000]" : (assessment.level === "Medium" ? "bg-amber-500" : "bg-[#00ff00]");
  const bgSubClass = isHighRisk ? "bg-[#ff0000]/10" : (assessment.level === "Medium" ? "bg-amber-500/10" : "bg-[#00ff00]/10");
  const borderClass = isHighRisk ? "border-[#ff0000]/20" : (assessment.level === "Medium" ? "border-amber-500/20" : "border-[#00ff00]/20");
  
  const Icon = isHighRisk ? ShieldAlert : ShieldCheck;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sybil Diagnostics</CardTitle>
        <CardDescription>Heuristic bot-risk signal from activity spread, diversity, wallet age, and repetition.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center border ${borderClass} ${bgSubClass}`}>
              <Icon className={`h-6 w-6 ${colorClass}`} />
            </div>
            <div>
              <div className={`font-mono text-xs font-bold tracking-widest uppercase ${colorClass}`}>
                {assessment.level} RISK LEVEL
              </div>
              <p className="mt-1 text-sm text-[#888] font-space">Diagnostic score: {assessment.score}/100</p>
            </div>
          </div>
        </div>
        <Progress value={assessment.score} className="mt-6" indicatorClassName={bgClass} />
        <div className="mt-6 space-y-[1px] bg-[#1a1a1a]">
          {assessment.signals.map((signal) => (
            <div key={signal} className="bg-black border border-[#1a1a1a] p-4 text-sm text-[#ccc] font-space">
              <span className={`inline-block w-1.5 h-1.5 rounded-sm mr-3 ${bgClass}`}></span>
              {signal}
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-[#666] font-mono tracking-wide uppercase">SYS: NOTE_THIS_IS_A_HEURISTIC_NOT_ABSOLUTE_PROOF</p>
      </CardContent>
    </Card>
  );
}
