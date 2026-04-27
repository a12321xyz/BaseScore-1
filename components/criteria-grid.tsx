import type { CriteriaResult } from "@/lib/types";

export function CriteriaGrid({ criteria }: { criteria: CriteriaResult[] }) {
  return (
    <div className="border border-[#1a1a1a] bg-black">
      <div className="p-6 md:p-8 border-b border-[#1a1a1a]">
        <h3 className="font-space font-bold text-white text-xl uppercase tracking-wider">Evaluation Matrix</h3>
        <p className="text-[#666] font-mono text-sm mt-2">ALGORITHMIC TRUTHS. ZERO-KNOWLEDGE ASSUMPTIONS.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[1px] bg-[#1a1a1a]">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`p-6 transition-colors ${item.earned ? 'bg-[#050505] hover:bg-[#00ff00]/[0.02]' : 'bg-[#050505] hover:bg-[#111]'}`}
          >
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="font-space font-bold text-white truncate">{item.label}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#888] font-space">{item.description}</p>
              </div>
              <div className="shrink-0 text-right">
                 {item.earned ? (
                   <span className="text-[#00ff00] font-mono font-bold">{item.points}/{item.maxPoints}</span>
                 ) : (
                   <span className="text-[#444] font-mono">{item.points}/{item.maxPoints}</span>
                 )}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-[#222] pt-4 text-xs font-mono">
              <span className="text-[#666] uppercase tracking-wider truncate max-w-[200px]">{item.value}</span>
              <span className={item.earned ? "text-[#00ff00]" : "text-[#444]"}>
                {item.earned ? "PASS" : "FAIL"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
