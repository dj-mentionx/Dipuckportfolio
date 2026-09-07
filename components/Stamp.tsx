"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Stamp() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none relative select-none sm:absolute sm:-right-2 sm:top-4 lg:right-6"
      initial={reduce ? false : { scale: 2.1, rotate: -22, y: -72, opacity: 0 }}
      animate={{ scale: 1, rotate: -8, y: 0, opacity: 1 }}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 380, damping: 18, delay: 0.28 }
      }
    >
      <div className="border-[3px] border-double border-stamp px-3 py-2 text-stamp">
        <p className="font-mono text-[11px] leading-none">DECLASSIFIED</p>
        <p className="mt-1 font-mono text-[10px] leading-none">07 SEP 2026</p>
      </div>
    </motion.div>
  );
}
