"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktop = window.matchMedia("(min-width: 768px)");
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const enabled = () => desktop.matches && !touchOnly.matches && !reduced.matches;

    const applyMode = () => {
      const on = enabled();
      document.body.classList.toggle("has-custom-cursor", on);
      if (!on) root.style.opacity = "0";
    };

    gsap.set(root, { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 0 });
    const xTo = gsap.quickTo(root, "x", { duration: 0.16, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.16, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      if (!enabled()) return;
      xTo(event.clientX);
      yTo(event.clientY);
      root.style.opacity = "1";
    };

    applyMode();
    desktop.addEventListener("change", applyMode);
    touchOnly.addEventListener("change", applyMode);
    reduced.addEventListener("change", applyMode);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      document.body.classList.remove("has-custom-cursor");
      desktop.removeEventListener("change", applyMode);
      touchOnly.removeEventListener("change", applyMode);
      reduced.removeEventListener("change", applyMode);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
    >
      <div className="relative h-11 w-11">
        <span className="absolute inset-0 rounded-full border border-ink" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stamp" />
      </div>
    </div>
  );
}
