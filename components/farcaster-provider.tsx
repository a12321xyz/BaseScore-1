"use client";

import { useEffect, useState, useCallback } from "react";
import sdk from "@farcaster/miniapp-sdk";

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  const initSDK = useCallback(async () => {
    try {
      // Only initialize in a Farcaster context (iframe)
      if (typeof window !== "undefined") {
        await sdk.actions.ready();
      }
    } catch (error) {
      // Silently fail if not in a Farcaster context (e.g. normal browser)
      console.debug("[BaseScore] Not in Farcaster context:", error);
    } finally {
      setIsSDKLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isSDKLoaded) {
      initSDK();
    }
  }, [isSDKLoaded, initSDK]);

  return <>{children}</>;
}
