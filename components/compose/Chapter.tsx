"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CHAPTERS, type ChapterId } from "@/lib/compose";
import { EXHIBITS } from "@/lib/exhibits";
import { CountUp } from "./CountUp";
import { Scramble } from "./Scramble";

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
            initial={{ y: "120%", rotateX: 75 }}
            animate={{ y: "0%", rotateX: 0 }}
            transition={{ delay: 0.28 + index * 0.032, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState<string | null>(EXHIBITS[0]?.id ?? null);

  async function copyMail() {
    await navigator.clipboard.writeText("rush2dipuck@gmail.com");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <motion.section className="chapter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="chapter__wipe"
          style={{ top: `${index * 25}%`, height: "25%" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 1, 0] }}
          transition={{ duration: 0.78, delay: index * 0.045, times: [0, 0.3, 0.58, 1], ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      <motion.div
        className="chapter__panel"
        initial={{ x: "-12%", clipPath: "inset(0 100% 0 0)" }}
        animate={{ x: "0%", clipPath: "inset(0 0% 0 0)" }}
        exit={{ x: "-8%", opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="chapter__ghost" aria-hidden>
          {id === "about" ? <CountUp to={13} /> : data.figure}
        </p>
        <p className="chapter__kicker">{data.kicker}</p>
        <KineticTitle text={data.title} />
        {data.lines.map((line, index) => (
          <p key={line} className="chapter__copy">
            <Scramble text={line} delay={420 + index * 160} />
          </p>
        ))}

        {id === "work" ? (
          <div className="reel">
            {EXHIBITS.map((exhibit, index) => (
              <motion.button
                key={exhibit.id}
                type="button"
                className={`reel__row ${open === exhibit.id ? "is-open" : ""}`}
                initial={{ x: index % 2 === 0 ? -64 : 64, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setOpen(exhibit.id)}
              >
                <span className="reel__index">0{index + 1}</span>
                <span className="reel__org">{exhibit.org}</span>
                <span className="reel__fig">{exhibit.figure}</span>
                <span className="reel__note">
                  {exhibit.role} · {exhibit.dates}
                  <br />
                  {exhibit.note}
                </span>
              </motion.button>
            ))}
          </div>
        ) : null}

        {id === "contact" ? (
          <motion.div className="chapter__links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <button type="button" className="chapter__mail" onClick={copyMail}>
              rush2dipuck@gmail.com
              <span>{copied ? "copied" : "copy"}</span>
            </button>
            <a href="https://www.linkedin.com/in/dipuckjones/" target="_blank" rel="noreferrer">
              linkedin.com/in/dipuckjones
            </a>
          </motion.div>
        ) : null}

        {id === "bomb" && onScan ? (
          <motion.button type="button" className="chapter__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} onClick={onScan}>
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
