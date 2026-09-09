"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Portrait } from "./Portrait";

type BootProps = {
  onDone: () => void;
};

const DIPUCK = "DIPUCK".split("");
const JONES = "JONES".split("");

export function Boot({ onDone }: BootProps) {
  const locked = useRef(false);
  const [count, setCount] = useState(3);
  const [named, setNamed] = useState(false);

  function finish() {
    if (locked.current) return;
    locked.current = true;
    onDone();
  }
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setNamed(true);
    }
  }, []);

  useEffect(() => {
    if (named) return;
    if (count <= 0) {
      setNamed(true);
      return;
    }
    const id = window.setTimeout(() => setCount((n) => n - 1), 560);
    return () => window.clearTimeout(id);
  }, [count, named]);

  useEffect(() => {
    if (!named) return;
    const id = window.setTimeout(() => finishRef.current(), 2400);
    return () => window.clearTimeout(id);
  }, [named]);

  return (
    <motion.div
      className="boot"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(18px) saturate(1.8)" }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="boot__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
      <p className="boot__kicker">DARKROOM · ENLARGER ON · BERLIN</p>

      {named ? (
        <motion.div
          className="boot__face"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Portrait live />
        </motion.div>
      ) : null}

      <AnimatePresence>
        {!named ? (
          <motion.div
            key={count}
            className="boot__count-wrap"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
          <motion.p
            className="boot__count"
            initial={{ scale: 2.4, opacity: 0, skewX: -18, y: 40 }}
            animate={{ scale: 1, opacity: 1, skewX: 0, y: 0 }}
            exit={{ scale: 0.35, opacity: 0, skewX: 22, y: -80 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            0{count}
          </motion.p>
          </motion.div>
        ) : (
          <motion.div key="name" className="boot__mark">
            <h1 className="boot__lockup" aria-label="Dipuck Jones">
              <span className="boot__row">
                {DIPUCK.map((ch, i) => (
                  <motion.span
                    key={`d-${ch}-${i}`}
                    initial={{ y: "120%", rotateX: 80, opacity: 0 }}
                    animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
              <span className="boot__row boot__row--red">
                {JONES.map((ch, i) => (
                  <motion.span
                    key={`j-${ch}-${i}`}
                    initial={{ y: "-120%", rotateX: -80, opacity: 0 }}
                    animate={{ y: "0%", rotateX: 0, opacity: 1 }}
                    transition={{ delay: 0.28 + i * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
      {named ? (
        <motion.div
          className="boot__flood"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 28, opacity: [1, 1, 0] }}
          transition={{ delay: 1.45, duration: 0.8, times: [0, 0.55, 1], ease: [0.7, 0, 0.2, 1] }}
        />
      ) : null}

      <motion.p
        className="boot__sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: named ? 1 : 0 }}
      >
        The lot is live. Click a building.
      </motion.p>
      <motion.button type="button" className="boot__cta" onClick={finish} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        SKIP INTRO
      </motion.button>
    </motion.div>
  );
}
