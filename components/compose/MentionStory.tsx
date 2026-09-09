"use client";

import { motion } from "framer-motion";
import { MENTIONX_STORY } from "@/lib/experience";

type MentionStoryProps = {
  onScan?: () => void;
  onClose: () => void;
  backLabel?: string;
};

const ACTS = [
  { heading: "What", line: MENTIONX_STORY.what.lines[0] },
  { heading: "Does", line: MENTIONX_STORY.does.lines[0] },
  { heading: "Why", line: MENTIONX_STORY.why.lines[0] },
] as const;

export function MentionStory({ onScan, onClose, backLabel = "Back" }: MentionStoryProps) {
  return (
    <div className="mx">
      <h2 className="chapter__title">{MENTIONX_STORY.title}</h2>
      <div className="mx__spine">
        {ACTS.map((act, index) => (
          <motion.article
            key={act.heading}
            className="mx__act"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.14 + index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <em>0{index + 1}</em>
            <h3>{act.heading}</h3>
            <p>{act.line}</p>
          </motion.article>
        ))}
      </div>
      <div className="mx__row">
        {onScan ? (
          <button type="button" className="chapter__cta" onClick={onScan}>
            Drop a name
          </button>
        ) : null}
        <a className="chapter__back" href={MENTIONX_STORY.url} target="_blank" rel="noreferrer">
          {MENTIONX_STORY.urlLabel}
        </a>
        <button type="button" className="chapter__back" onClick={onClose}>
          {backLabel}
        </button>
      </div>
    </div>
  );
}
