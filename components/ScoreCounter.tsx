"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type ScoreCounterProps = {
  score: number;
  scanned: number;
  total: number;
};

export function ScoreCounter({ score, scanned, total }: ScoreCounterProps) {
  const value = useMotionValue(0);
  const spring = useSpring(value, { stiffness: 90, damping: 18 });
  const display = useTransform(spring, (latest) => Math.round(latest).toString().padStart(2, "0"));

  useEffect(() => {
    value.set(score);
  }, [score, value]);

  return (
    <aside className="hairline bg-paper px-3 py-2 sm:px-4">
      <p className="font-mono text-[10px] text-ink-muted">AI visibility score</p>
      <div className="mt-1 flex items-baseline gap-3">
        <motion.span className="font-mono text-3xl leading-none text-stamp">{display}</motion.span>
        <span className="font-mono text-[10px] text-ink-muted">
          {scanned}/{total} files opened
        </span>
      </div>
    </aside>
  );
}
