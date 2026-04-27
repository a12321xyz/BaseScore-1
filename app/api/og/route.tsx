import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") || "--";
  const tier = searchParams.get("tier") || "Unofficial";
  const address = searchParams.get("address") || "Base wallet";
  const shortAddress = address.length > 18 ? `${address.slice(0, 8)}...${address.slice(-6)}` : address;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          color: "white",
          background: "black",
          fontFamily: "monospace"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #1a1a1a", paddingBottom: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 16, color: "#666", letterSpacing: 4 }}>SOURCE REPOSITORY</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>a12321xyz / BaseScore</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <div style={{ fontSize: 16, color: "#666", letterSpacing: 4 }}>EVALUATION</div>
            <div style={{ fontSize: 24, color: "#00ff00", letterSpacing: -1 }}>OPEN-SOURCE (PRE-ALPHA)</div>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <div style={{ fontSize: 140, fontWeight: 900, lineHeight: 0.8, letterSpacing: -6 }}>{score}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 60, color: "#666", fontStyle: "italic", lineHeight: 0.8 }}>/ 100</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", padding: "8px 16px", border: "2px solid rgba(255,165,0,0.5)", color: "orange", letterSpacing: 4, fontFamily: "monospace", fontSize: 20, fontWeight: "bold" }}>
                {tier.toUpperCase()} TIER
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#00ff00" }}></div>
                <div style={{ fontSize: 16, color: "#00ff00", letterSpacing: 2, fontFamily: "monospace", fontWeight: "bold" }}>STABLE BUILD</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 40 }}>
           <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 28, color: "#888" }}>
             <span style={{ display: "flex" }}>Evaluating: </span>
             <span style={{ display: "flex", color: "#fff", fontWeight: "bold" }}>{shortAddress}</span>
           </div>
           <div style={{ display: "flex", fontSize: 48, fontWeight: 900, letterSpacing: -1 }}>{`MAPPED TIER: ${tier}`}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "#444", fontSize: 16, letterSpacing: 2, borderTop: "1px solid #1a1a1a", paddingTop: 40, marginTop: "auto" }}>
          <div>SYS_REF: BS-0982-A</div>
          <div>ALG_V2.0.0</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
