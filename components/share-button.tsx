"use client";

import { Share2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/types";
import { useState } from "react";

export function ShareButton({ result }: { result: AnalysisResult }) {
  const [copied, setCopied] = useState(false);

  function share() {
    const baseUrl = window.location.origin;
    const resultUrl = `${baseUrl}/analyze?address=${encodeURIComponent(result.resolvedAddress)}&score=${result.score}&tier=${encodeURIComponent(result.tier)}`;
    const text = `My BaseScore is ${result.tier}: ${result.score}/100 pts on the unofficial Base airdrop checker.\n\nCheck yours:`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(resultUrl)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  async function copyImage() {
    const imageUrl = `/api/og?address=${encodeURIComponent(result.resolvedAddress)}&score=${result.score}&tier=${encodeURIComponent(result.tier)}`;
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      
      try {
        const pngBlob = new Blob([blob], { type: "image/png" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": pngBlob
          })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback for browsers/iframes without clipboard access
        window.open(imageUrl, '_blank');
      }
    } catch (e) {
      console.error("Failed to copy image", e);
      window.open(imageUrl, '_blank');
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button onClick={share} type="button" className="w-full h-12 bg-[#00ff00] text-black hover:bg-[#00cc00] font-mono font-bold tracking-widest text-[10px] rounded-none px-4">
        <Share2 className="mr-2 h-3 w-3" />
        POST TO X
      </Button>
      <Button onClick={copyImage} type="button" variant="ghost" className="w-full h-12 border border-[#333] text-[#ccc] bg-transparent hover:bg-[#111] hover:text-white font-mono font-bold tracking-widest text-[10px] rounded-none px-4">
        <ImageIcon className="mr-2 h-3 w-3" />
        {copied ? "COPIED!" : "COPY IMAGE"}
      </Button>
    </div>
  );
}
