"use client";

import { motion } from "framer-motion";
import { shareText, visibilityBlocks } from "@/lib/format";
import type { ScanResult } from "@/lib/types";

type PosterProps = {
  result: ScanResult;
};

export function Poster({ result }: PosterProps) {
  async function copy() {
    await navigator.clipboard.writeText(shareText(result.name, result.score, result.mentioned));
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 mx-auto w-full max-w-xl poster-card p-6 md:p-8"
    >
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.24em] text-white/45">
        <span>ONE SHEET</span>
        <span className={result.mentioned ? "text-mention" : "text-white/45"}>
          {result.mentioned ? "NAMED" : "0 MENTIONS"}
        </span>
      </div>
      <h2 className="mt-6 font-display text-4xl leading-none text-white md:text-5xl">{result.name}</h2>
      <p className="mt-5 font-mono text-xl text-mention">
        {visibilityBlocks(result.score)}  {result.score}
      </p>
      <p className="mt-5 font-mono text-[12px] leading-relaxed text-white/70">{result.excerpt}</p>
      <p className="mt-6 font-mono text-[10px] tracking-[0.18em] text-white/35">
        scanned via dipuckjones.com
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={copy} className="hud-btn">
          Copy still
        </button>
        <a
          className="hud-btn"
          href={`/api/og?name=${encodeURIComponent(result.name)}&score=${result.score}&mentioned=${result.mentioned ? "1" : "0"}`}
        >
          Open poster
        </a>
      </div>
    </motion.section>
  );
}
