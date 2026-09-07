"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMode = () => {
      const enabled = fine.matches && !reduced.matches;
      document.body.classList.toggle("has-custom-cursor", enabled);
      root.style.opacity = enabled ? "1" : "0";
    };

    applyMode();
    fine.addEventListener("change", applyMode);
    reduced.addEventListener("change", applyMode);

    const xTo = gsap.quickTo(root, "x", { duration: 0.16, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.16, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches) return;
      xTo(event.clientX);
      yTo(event.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      document.body.classList.remove("has-custom-cursor");
      fine.removeEventListener("change", applyMode);
      reduced.removeEventListener("change", applyMode);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden opacity-0 md:block"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <div className="relative h-11 w-11 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 rounded-full border border-ink" />
        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
        <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-stamp" />
      </div>
    </div>
  );
}
