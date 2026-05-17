import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getAppUrl } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FarcasterProvider } from "@/components/farcaster-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "BaseScore - Unofficial Base Airdrop Points Checker & Rank Simulator",
  description:
    "Check your unofficial Base activity score, simulate airdrop tiers, review wallet activity, and share your Base farming rank.",
  keywords: [
    "Base",
    "Base airdrop",
    "Base points checker",
    "BaseScore",
    "Base wallet checker",
    "airdrop simulator"
  ],
  authors: [{ name: "BaseScore" }],
  openGraph: {
    title: "BaseScore - Unofficial Base Airdrop Points Checker",
    description: "Paste a Base wallet, get a clean 100-point activity score, and share the result.",
    url: appUrl,
    siteName: "BaseScore",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "BaseScore preview card"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseScore - Unofficial Base Airdrop Points Checker",
    description: "Check your unofficial Base score and share your rank.",
    images: ["/api/og"]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  },
  manifest: "/manifest.webmanifest",
  other: {
    "base:app_id": "6a09cbbe55ab01a7700e0d8a",
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/api/og`,
      button: {
        title: "Check Your BaseScore",
        action: {
          type: "launch_frame",
          name: "BaseScore",
          url: appUrl,
          splashImageUrl: `${appUrl}/splash.png`,
          splashBackgroundColor: "#000000",
        },
      },
    }),
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body className="font-sans antialiased bg-black text-white">
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
