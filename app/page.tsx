import { Disclaimer } from "@/components/disclaimer";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <main className="grid-shell relative overflow-hidden">
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <Hero />
        <section className="mb-12 border border-[#1a1a1a] bg-black p-10 sm:p-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#666] mb-12">EVALUATION TIERS</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "Mythic", label: "text-[#ff00ff] border-[#ff00ff]/30 bg-[#ff00ff]/10", score: "80-100", copy: "Top percentile. Extreme volume, diverse protocol usage, consistent activity." },
              { id: "Gold", label: "text-amber-400 border-amber-400/30 bg-amber-400/10", score: "60-79", copy: "High conviction. Active participant bridging multiple months." },
              { id: "Silver", label: "text-slate-300 border-slate-300/30 bg-slate-300/10", score: "40-59", copy: "Standard active. Moderate volume and transaction history." },
              { id: "Uncommon", label: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10", score: "25-39", copy: "Casual user. Limited protocol interaction or lower volume." },
              { id: "Eligible", label: "text-[#00ff00] border-[#00ff00]/30 bg-[#00ff00]/10", score: "10-24", copy: "Base line. Meets minimum criteria for potential ecosystem interaction." },
              { id: "Unranked", label: "text-[#666] border-[#333] bg-[#050505]", score: "0-9", copy: "Insufficient data or flagged. Try bridging more assets or interacting." }
            ].map(({ id, label, score, copy }) => (
              <div key={id} className="space-y-4">
                <div className={`inline-flex items-center justify-center border px-4 py-1.5 text-sm font-bold uppercase tracking-widest font-mono ${label}`}>
                  {id}
                </div>
                <div className="flex justify-between items-center text-sm font-mono tracking-widest text-[#444] uppercase">
                  <span>Score Range</span>
                  <span className="text-white">{score}</span>
                </div>
                <p className="text-base leading-relaxed text-[#888] font-space">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-[1px] py-12 md:grid-cols-3 bg-[#1a1a1a] border border-[#1a1a1a] mb-16">
          {[
            ["100-point algorithm", "Arbitrum-style criteria adapted for Base activity, wallet age, protocols, gas, and diversity."],
            ["Zero connectivity", "Paste an address or ENS. BaseScore never asks for signatures, auth, or private data."],
            ["Open transmission", "Clean diagnostic cards, X share text, dynamic OG previews, and a mobile-first dashboard."]
          ].map(([title, copy]) => (
            <div key={title} className="bg-black p-8 transition-colors hover:bg-[#050505]">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00ff00] mb-4">{title}</p>
              <p className="text-sm leading-relaxed text-[#888] font-space">{copy}</p>
            </div>
          ))}
        </section>

        <Disclaimer />
        <SiteFooter />
      </div>
    </main>
  );
}
