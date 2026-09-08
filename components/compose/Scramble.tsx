"use client";

import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%";

type ScrambleProps = {
  text: string;
  delay?: number;
  className?: string;
};

export function Scramble({ text, delay = 0, className }: ScrambleProps) {
  const [out, setOut] = useState(text.replace(/[^\s]/g, "·"));

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => {
        frame += 1;
        const locked = Math.floor(frame / 1.65);
        setOut(
          text
            .split("")
            .map((ch, index) => {
              if (ch === " ") return " ";
              if (index < locked) return ch;
              return GLYPHS[(index * 7 + frame * 3) % GLYPHS.length];
            })
            .join(""),
        );
        if (locked >= text.length) {
          window.clearInterval(timer);
          setOut(text);
        }
      }, 26);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [text, delay]);

  return <span className={className}>{out}</span>;
}
