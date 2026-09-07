"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EXHIBITS } from "@/lib/exhibits";

export function ExhibitList() {
  const reduce = useReducedMotion();

  return (
    <section className="hairline-t py-16">
      <p className="font-mono text-[10px] text-ink-muted">Exhibits</p>
      <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight">
        The interrogation resolves here.
      </h2>
      <p className="mt-4 max-w-xl font-serif text-[1.05rem] leading-[1.6]">
        Not a résumé — the record the models are citing, or failing to cite. One number per
        file. Thirteen years, read in order.
      </p>
      <ol className="mt-12 space-y-0">
        {EXHIBITS.map((exhibit, index) => (
          <motion.li
            key={exhibit.id}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : index * 0.04 }}
            className="hairline-t py-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] text-ink-muted">Exhibit {exhibit.letter}</p>
              <p className="font-mono text-[10px] text-ink-muted">{exhibit.dates}</p>
            </div>
            <h3 className="mt-3 font-serif text-2xl leading-tight">{exhibit.org}</h3>
            <p className="mt-1 font-serif text-base leading-relaxed text-ink">{exhibit.role}</p>
            <p className="mt-5 font-mono text-stamp">{exhibit.figure}</p>
            <p className="font-mono text-[11px] text-ink-muted">{exhibit.figureLabel}</p>
            <p className="mt-4 max-w-xl font-serif text-[1.05rem] leading-[1.6]">{exhibit.note}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
