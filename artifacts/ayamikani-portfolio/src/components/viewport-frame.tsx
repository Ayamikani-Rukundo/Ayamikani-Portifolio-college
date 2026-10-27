"use client";

import { useEffect } from "react";

export default function ViewportFrame() {
  useEffect(() => {
    const root = document.documentElement;
    let animationFrame = 0;
    let activeTimer = 0;

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === "touch" || animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        const edgeDistance = Math.min(
          event.clientX,
          window.innerWidth - event.clientX,
          event.clientY,
          window.innerHeight - event.clientY,
        );
        root.classList.toggle("edge-near", edgeDistance < 72);
        animationFrame = 0;
      });
    }

    function onPointerDown() {
      root.classList.add("edge-active");
      window.clearTimeout(activeTimer);
      activeTimer = window.setTimeout(() => root.classList.remove("edge-active"), 650);
    }

    function onPointerLeave() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      root.classList.remove("edge-near");
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("resize", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("resize", onPointerLeave);
      window.clearTimeout(activeTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
