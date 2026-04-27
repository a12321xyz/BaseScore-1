import type { Metadata } from "next";
import { AnalyzeDashboard } from "@/components/analyze-dashboard";

interface AnalyzePageProps {
  searchParams: Promise<{
    address?: string;
    score?: string;
    tier?: string;
  }>;
}

export async function generateMetadata({ searchParams }: AnalyzePageProps): Promise<Metadata> {
  const params = await searchParams;
  const address = params.address || "";
  const score = params.score || "--";
  const tier = params.tier || "Unofficial";
  const imageUrl = `/api/og?address=${encodeURIComponent(address)}&score=${encodeURIComponent(score)}&tier=${encodeURIComponent(tier)}`;

  return {
    title: address ? `${tier} RANK // BaseScore ${score}/100` : "Analyze Target - BaseScore",
    description: "Unofficial Base wallet activity score and airdrop rank simulator.",
    openGraph: {
      title: address ? `${tier} Rank // BaseScore ${score}/100` : "BaseScore Systems Analysis",
      description: "Run an algorithmic Base wallet activity diagnostic and share the result.",
      images: [imageUrl]
    },
    twitter: {
      card: "summary_large_image",
      title: address ? `${tier} Rank // BaseScore ${score}/100` : "BaseScore Systems Analysis",
      description: "Run an algorithmic Base wallet activity diagnostic and share the result.",
      images: [imageUrl]
    }
  };
}

export default async function AnalyzePage({ searchParams }: AnalyzePageProps) {
  const params = await searchParams;

  return <AnalyzeDashboard initialAddress={params.address || ""} />;
}
