"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const sessionStorageKey = "portfolio-analytics-session";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    try {
      let sessionId = sessionStorage.getItem(sessionStorageKey);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(sessionStorageKey, sessionId);
      }

      void fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: pathname, sessionId }),
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      // Analytics should never interfere with browsing.
    }
  }, [pathname]);

  return null;
}