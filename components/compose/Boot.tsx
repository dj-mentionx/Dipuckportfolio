"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

type BootProps = {
  onDone: () => void;
};

const SLICES = ["DIPUCK JONES", "DIPUCK JONES", "DIPUCK JONES"];

export function Boot({ onDone }: BootProps) {
  const locked = useRef(false);

  function finish() {
    if (locked.current) return;
    locked.current = true;
    onDone();
  }

  return (
    <motion.div className="boot" initial={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(12px)" }} transition={{ duration: 0.55 }}>
      <motion.div
        className="boot__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
      <p className="boot__kicker">LIVE TITLE SEQUENCE · BERLIN</p>
      <div className="boot__mark">
        <motion.h1
          className="boot__word"
          aria-label="Dipuck Jones"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          DIPUCK
        </motion.h1>
        {SLICES.map((text, index) => (
          <motion.div
            key={text + index}
            className="boot__slice"
            style={{ top: `${18 + index * 22}%` }}
            initial={{ x: index % 2 === 0 ? "-46%" : "46%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.28 + index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>{text}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="boot__sub"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
      >
        Conduct the lockup. The type follows the cursor.
      </motion.p>
      <motion.button
        type="button"
        className="boot__cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35 }}
        onClick={finish}
      >
        COMPOSE
      </motion.button>
      <motion.div
        className="boot__done"
        animate={{ opacity: [0, 1] }}
        transition={{ delay: 2.45, duration: 0.08 }}
        onAnimationComplete={finish}
      />
    </motion.div>
  );
}
