"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CHAPTERS, type ChapterId } from "@/lib/compose";
import { EXHIBITS } from "@/lib/exhibits";
import { SITE } from "@/lib/site";
import { CountUp } from "./CountUp";
import { MentionStory } from "./MentionStory";
import { Portrait } from "./Portrait";
import { Scramble } from "./Scramble";
import { WriteDesk } from "./WriteDesk";

type ChapterProps = {
  id: ChapterId;
  exhibit?: string;
  onClose: () => void;
  onScan?: () => void;
  backLabel?: string;
  onSigned?: () => void;
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

export function Chapter({ id, exhibit, onClose, onScan, backLabel = "Back to experience", onSigned }: ChapterProps) {
  const data = CHAPTERS[id];
  const [open, setOpen] = useState<string | null>(exhibit || EXHIBITS[0]?.id || null);

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
        {id === "bomb" ? null : (
          <>
            <p className="chapter__ghost" aria-hidden>
              {id === "about" ? <CountUp to={SITE.person.years} /> : data.figure}
            </p>
            <p className="chapter__kicker">{data.kicker}</p>
          </>
        )}
        {id === "about" ? (
          <motion.div
            className="chapter__face"
            initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onPointerMove={(event) => {
              const box = event.currentTarget.getBoundingClientRect();
              const fx = (event.clientX - box.left) / box.width;
              const fy = (event.clientY - box.top) / box.height;
              event.currentTarget.style.setProperty("--lx", `${fx * 100}%`);
              event.currentTarget.style.setProperty("--ly", `${fy * 100}%`);
              event.currentTarget.style.setProperty("--ex", "1");
              event.currentTarget.style.setProperty("--ox", String((fx - 0.5) * 14));
              event.currentTarget.style.setProperty("--oy", String((fy - 0.5) * 8));
            }}
          >
            <Portrait live />
          </motion.div>
        ) : null}
        {id === "bomb" ? null : <KineticTitle text={data.title} />}
        {id === "bomb" ? (
          <MentionStory onScan={onScan} onClose={onClose} backLabel={backLabel} />
        ) : id === "contact" ? null : (
          data.lines.map((line, index) => (
            <p key={line} className="chapter__copy">
              <Scramble text={line} delay={420 + index * 160} />
            </p>
          ))
        )}

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

        {id === "contact" ? <WriteDesk onSigned={onSigned} /> : null}

        {id === "bomb" ? null : (
          <button type="button" className="chapter__back" onClick={onClose}>
            {backLabel}
          </button>
        )}
      </motion.div>
    </motion.section>
  );
}
