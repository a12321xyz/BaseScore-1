import { Boxes } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProtocolHit } from "@/lib/types";

export function ProtocolFingerprint({ protocols }: { protocols: ProtocolHit[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Protocol Fingerprint</CardTitle>
        <CardDescription>Known Base apps detected from the analyzed transaction set.</CardDescription>
      </CardHeader>
      <CardContent>
        {protocols.length ? (
          <div className="grid gap-[1px] bg-[#1a1a1a] sm:grid-cols-2 border border-[#1a1a1a]">
            {protocols.map((protocol) => (
              <div key={protocol.name} className="bg-black p-6">
                <div className="flex items-center gap-4 border-b border-[#1a1a1a] pb-4">
                  <div className="flex h-12 w-12 items-center justify-center border" style={{ borderColor: `${protocol.color}55`, backgroundColor: `${protocol.color}11` }}>
                    <Boxes className="h-5 w-5" style={{ color: protocol.color }} />
                  </div>
                  <div>
                    <p className="font-space font-bold text-white tracking-tight">{protocol.name}</p>
                    <p className="font-mono text-[10px] uppercase text-[#666] tracking-widest mt-1">VOL: {protocol.interactions}</p>
                  </div>
                </div>
                <div className="mt-4 inline-block font-mono text-[9px] font-bold tracking-widest border px-2 py-1 uppercase" style={{ borderColor: `${protocol.color}55`, color: protocol.color }}>
                  {protocol.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#333] bg-[#050505] p-8 text-center text-sm text-[#666] font-mono uppercase tracking-widest">
            NO_KNOWN_PROTOCOL_MATCHES // SCAN_COMPLETED
          </div>
        )}
      </CardContent>
    </Card>
  );
}
