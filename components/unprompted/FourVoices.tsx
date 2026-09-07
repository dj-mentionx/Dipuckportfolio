"use client";

import { motion } from "framer-motion";
import { MODEL_LABEL } from "@/lib/models";
import type { Scene } from "@/lib/scenes";

const MATERIAL: Record<string, string> = {
  gpt: "voice-gpt",
  claude: "voice-claude",
  gemini: "voice-gemini",
  perplexity: "voice-perplexity",
};

function paint(text: string) {
  return text.split(/(Dipuck Jones|Dipuck)/g).map((part, index) =>
    part === "Dipuck Jones" || part === "Dipuck" ? (
      <em key={index} className="mention-lock not-italic">
        {part}
      </em>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

type FourVoicesProps = {
  scene: Scene;
  focused: number | null;
  onFocus: (index: number | null) => void;
};

export function FourVoices({ scene, focused, onFocus }: FourVoicesProps) {
  return (
    <div className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {scene.voices.map((voice, index) => {
        const dim = focused !== null && focused !== index;
        return (
          <motion.button
            key={voice.model}
            type="button"
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{
              opacity: dim ? 0.38 : 1,
              y: 0,
              filter: "blur(0px)",
              scale: focused === index ? 1.015 : 1,
            }}
            transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onFocus(focused === index ? null : index)}
            className={`voice-panel ${MATERIAL[voice.model]} text-left`}
          >
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em]">
              <span>{MODEL_LABEL[voice.model]}</span>
              <span>{voice.mentionsDipuck ? "NAMED" : "UNNAMED"}</span>
            </div>
            <p className="font-display text-[1.05rem] leading-snug text-white/90 md:text-[1.15rem]">
              {paint(voice.text)}
            </p>
          </motion.button>
        );
      })}
    </div>
  );
}
