import { NextResponse } from "next/server";
import { AnalyzerError, analyzeWallet } from "@/lib/analyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address") || "";

  if (!address.trim()) {
    return NextResponse.json(
      {
        error: "Missing address. Add ?address=0x... or enter an ENS name.",
        code: "MISSING_ADDRESS"
      },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeWallet(address);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300"
      }
    });
  } catch (error) {
    if (error instanceof AnalyzerError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code
        },
        {
          status: error.status,
          headers: {
            "Cache-Control": error.status === 429 ? "public, s-maxage=45" : "no-store"
          }
        }
      );
    }

    return NextResponse.json(
      {
        error: "Wallet analysis failed. Try again shortly.",
        code: "ANALYSIS_FAILED"
      },
      { status: 500 }
    );
  }
}
