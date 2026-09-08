"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  to: number;
  duration?: number;
  suffix?: string;
};

export function CountUp({ to, duration = 1100, suffix = "" }: CountUpProps) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(to);
      return;
    }
    let raf = 0;
    const origin = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - origin) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}
