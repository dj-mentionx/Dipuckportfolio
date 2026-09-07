"use client";

import { motion } from "framer-motion";

type SlateProps = {
  onClap: () => void;
};

export function Slate({ onClap }: SlateProps) {
  return (
    <motion.button
      type="button"
      className="slate"
      onClick={onClap}
      initial={{ rotate: -8, y: 40, opacity: 0 }}
      animate={{ rotate: -2, y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <div className="slate-stick">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="slate-body">
        <p className="slate-kicker">PRODUCTION</p>
        <h1>RUSHES</h1>
        <dl>
          <div>
            <dt>Scene</dt>
            <dd>01</dd>
          </div>
          <div>
            <dt>Take</dt>
            <dd>13</dd>
          </div>
          <div>
            <dt>Loc</dt>
            <dd>Berlin</dd>
          </div>
        </dl>
        <p className="slate-name">Dipuck Jones</p>
        <p className="slate-hint">Clap to roll · then scrub the print</p>
      </div>
    </motion.button>
  );
}
