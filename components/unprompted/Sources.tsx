"use client";

import { motion } from "framer-motion";
import { EXHIBITS } from "@/lib/exhibits";

export function Sources() {
  return (
    <section className="relative z-20 mx-auto w-full max-w-5xl">
      <p className="font-mono text-[10px] tracking-[0.28em] text-white/40">SOURCES THE MODELS USED — OR IGNORED</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {EXHIBITS.map((exhibit, index) => (
          <motion.article
            key={exhibit.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="source-slab"
          >
            <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] tracking-[0.18em] text-white/40">
              <span>SRC {exhibit.letter}</span>
              <span>{exhibit.dates}</span>
            </div>
            <h3 className="mt-3 font-display text-2xl text-white">{exhibit.org}</h3>
            <p className="mt-1 text-sm text-white/65">{exhibit.role}</p>
            <p className="mt-4 font-mono text-mention">{exhibit.figure}</p>
            <p className="font-mono text-[11px] text-white/40">{exhibit.figureLabel}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">{exhibit.note}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
