"use client";

import { motion } from "framer-motion";
import { CHAPTERS, type ChapterId } from "@/lib/compose";
import { EXHIBITS } from "@/lib/exhibits";

type ChapterProps = {
  id: ChapterId;
  onClose: () => void;
  onScan?: () => void;
};

function KineticTitle({ text }: { text: string }) {
  return (
    <h2 className="chapter__title">
      {text.split("").map((ch, index) => (
        <span key={`${ch}-${index}`} className="chapter__letter">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.22 + index * 0.028, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

export function Chapter({ id, onClose, onScan }: ChapterProps) {
  const data = CHAPTERS[id];

  return (
    <motion.section
      className="chapter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="chapter__wipe"
          style={{ top: `${index * 33.333}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 1, 0] }}
          transition={{ duration: 0.85, delay: index * 0.05, times: [0, 0.32, 0.62, 1], ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <motion.div
        className="chapter__panel"
        initial={{ x: "-10%", clipPath: "inset(0 100% 0 0)" }}
        animate={{ x: "0%", clipPath: "inset(0 0% 0 0)" }}
        exit={{ x: "-8%", opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="chapter__ghost" aria-hidden>
          {data.figure}
        </p>
        <p className="chapter__kicker">{data.kicker}</p>
        <KineticTitle text={data.title} />
        {data.lines.map((line, index) => (
          <motion.p
            key={line}
            className="chapter__copy"
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.42 + index * 0.1, duration: 0.5 }}
          >
            {line}
          </motion.p>
        ))}

        {id === "work" ? (
          <div className="chapter__grid">
            {EXHIBITS.map((exhibit, index) => (
              <motion.article
                key={exhibit.id}
                className="chapter__card"
                initial={{ y: 28, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 + index * 0.07, duration: 0.45 }}
              >
                <h3>
                  {exhibit.org}
                </h3>
                <p>{exhibit.note}</p>
                <span className="chapter__meta">
                  {exhibit.role} · {exhibit.figure} · {exhibit.dates}
                </span>
              </motion.article>
            ))}
          </div>
        ) : null}

        {id === "contact" ? (
          <motion.div className="chapter__links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <a href="mailto:rush2dipuck@gmail.com">rush2dipuck@gmail.com</a>
            <a href="https://www.linkedin.com/in/dipuckjones/" target="_blank" rel="noreferrer">
              linkedin.com/in/dipuckjones
            </a>
          </motion.div>
        ) : null}

        {id === "bomb" && onScan ? (
          <motion.button
            type="button"
            className="chapter__cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            onClick={onScan}
          >
            Drop a name
          </motion.button>
        ) : null}

        <button type="button" className="chapter__back" onClick={onClose}>
          Back to field
        </button>
      </motion.div>
    </motion.section>
  );
}
