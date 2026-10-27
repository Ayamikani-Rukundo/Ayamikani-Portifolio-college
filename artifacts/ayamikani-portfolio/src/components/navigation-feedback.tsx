"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavigationFeedback() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimer = useRef<number | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;

      const nextUrl = new URL(link.href, window.location.href);
      if (
        pathname === null ||
        nextUrl.origin !== window.location.origin ||
        nextUrl.pathname === pathname
      ) {
        return;
      }

      setIsNavigating(true);
      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }
      navigationTimer.current = window.setTimeout(() => {
        setIsNavigating(false);
        navigationTimer.current = null;
      }, 20_000);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  useEffect(() => {
    setIsNavigating(false);
    if (navigationTimer.current !== null) {
      window.clearTimeout(navigationTimer.current);
      navigationTimer.current = null;
    }
  }, [pathname]);

  return (
    <div
      className="navigation-progress"
      data-active={isNavigating}
      role={isNavigating ? "status" : undefined}
      aria-label={isNavigating ? "Loading page" : undefined}
    >
      {isNavigating && <span className="sr-only">Loading page</span>}
    </div>
  );
}
