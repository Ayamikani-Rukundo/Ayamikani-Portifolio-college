"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const tables = ["profile", "social_links", "projects", "activities"] as const;

export default function PortfolioLiveSync() {
  const router = useRouter();
  const [disconnected, setDisconnected] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createSupabaseBrowserClient();
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;
    const channel = supabase.channel("portfolio-live-sync");

    for (const table of tables) {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          if (refreshTimeout) clearTimeout(refreshTimeout);
          refreshTimeout = setTimeout(() => router.refresh(), 150);
        },
      );
    }

    channel.subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        console.error("Portfolio live updates could not connect.", error);
        setDisconnected(true);
      } else if (status === "SUBSCRIBED") {
        setDisconnected(false);
      }
    });

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return disconnected ? (
    <div className="live-sync-warning" role="status">
      Live updates disconnected. Refresh the page to check for recent changes.
    </div>
  ) : null;
}
