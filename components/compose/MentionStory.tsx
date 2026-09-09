"use client";

import { motion } from "framer-motion";
import { MENTIONX_STORY } from "@/lib/experience";

type MentionStoryProps = {
  onScan?: () => void;
  onClose: () => void;
  backLabel?: string;
};

const ACTS = [MENTIONX_STORY.what, MENTIONX_STORY.does, MENTIONX_STORY.why] as const;

export function MentionStory({ onScan, onClose, backLabel = "Back to experience" }: MentionStoryProps) {
  return (
    <div className="mx">
      <p className="chapter__kicker">{MENTIONX_STORY.kicker}</p>
      <h2 className="chapter__title">{MENTIONX_STORY.title}</h2>
      <p className="mx__lede">Built independently. Measured against the models buyers already ask.</p>

      <div className="mx__spine">
        {ACTS.map((act, index) => (
          <motion.article
            key={act.heading}
            className="mx__act"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.18 + index * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <em>0{index + 1}</em>
            <h3>{act.heading}</h3>
            {act.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
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
