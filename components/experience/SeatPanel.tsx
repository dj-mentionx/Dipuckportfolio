"use client";

import { motion } from "framer-motion";
import type { ExperienceSeat } from "@/lib/experience";

type SeatPanelProps = {
  seat: ExperienceSeat;
  onClose: () => void;
  onMention?: () => void;
  backLabel?: string;
};

export function SeatPanel({ seat, onClose, onMention, backLabel = "Back to experience" }: SeatPanelProps) {
  return (
    <motion.section className="seat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
      <motion.div
        className="seat__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.article
        className="seat__sheet"
        initial={{ y: 28, clipPath: "inset(12% 0 0 0)" }}
        animate={{ y: 0, clipPath: "inset(0% 0 0 0)" }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="seat__kicker">
          {seat.index} / {seat.place}
        </p>
        <h2>{seat.short}</h2>
        <p className="seat__role">
          {seat.role}
          <span>{seat.dates}</span>
        </p>
        <p className="seat__line">{seat.line}</p>
        <p className="seat__note">{seat.note}</p>

        <ol className="seat__did">
          {seat.did.map((item, index) => (
            <motion.li
              key={item}
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.16 + index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <em>{String(index + 1).padStart(2, "0")}</em>
              {item}
            </motion.li>
          ))}
        </ol>

        <ul className="seat__ch">
          {seat.channels.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="seat__row">
          {seat.kind === "product" && onMention ? (
            <button type="button" className="chapter__cta" onClick={onMention}>
              Open the build
            </button>
          ) : null}
          <button type="button" className="chapter__back" onClick={onClose}>
            {backLabel}
          </button>
        </div>
      </motion.article>
    </motion.section>
  );
}
