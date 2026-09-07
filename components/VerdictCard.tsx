"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatFetchedAt } from "@/lib/format";
import { MODEL_LABEL } from "@/lib/models";
import type { Mention } from "@/lib/types";

type VerdictCardProps = {
  mention: Mention;
  rotate: number;
  shift: string;
  onReveal: (id: string, delta: number) => void;
};

const BAR_WIDTHS = [92, 78, 86, 64, 88, 71, 80];

export function VerdictCard({ mention, rotate, shift, onReveal }: VerdictCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const visited = useRef(new Set<string>());
  const revealedRef = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const labelId = useId();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const markRevealed = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    onReveal(mention.id, mention.scoreDelta);
  };

  const updateMask = (clientX: number, clientY: number) => {
    const overlay = overlayRef.current;
    if (!overlay || revealedRef.current || reduced) return;
    const box = overlay.getBoundingClientRect();
    const x = ((clientX - box.left) / box.width) * 100;
    const y = ((clientY - box.top) / box.height) * 100;
    overlay.style.setProperty("--mx", `${x}%`);
    overlay.style.setProperty("--my", `${y}%`);

    const cell = `${Math.floor(x / 20)}:${Math.floor(y / 25)}`;
    visited.current.add(cell);
    if (visited.current.size >= 4) markRevealed();
  };

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      aria-labelledby={labelId}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          markRevealed();
        }
      }}
      onPointerMove={(event) => updateMask(event.clientX, event.clientY)}
      onPointerEnter={(event) => updateMask(event.clientX, event.clientY)}
      onClick={() => {
        if (window.matchMedia("(pointer: coarse)").matches || reduced) {
          markRevealed();
        }
      }}
      className="hairline w-full max-w-[34rem] bg-paper p-4 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:p-5"
      style={{ transform: `rotate(${rotate}deg) translateX(${shift})` }}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-ink-muted">
        <span>{MODEL_LABEL[mention.model]}</span>
        <span>{formatFetchedAt(mention.fetchedAt)}</span>
      </header>
      <h3 id={labelId} className="mt-3 font-serif text-xl leading-snug sm:text-[1.35rem]">
        {mention.query}
      </h3>
      <div className="relative mt-4 min-h-[8.5rem]">
        <p className="font-mono text-[12px] leading-relaxed text-ink">{mention.response}</p>
        <div
          ref={overlayRef}
          aria-hidden
          className="redacted-overlay pointer-events-none absolute inset-[-2px] flex flex-col justify-center gap-2 bg-paper px-0 py-1 transition-opacity duration-700"
          style={{ opacity: revealed ? 0 : 1 }}
        >
          {BAR_WIDTHS.map((width, index) => (
            <span
              key={index}
              className="block h-3 bg-redact"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>
      <footer className="mt-4 flex items-center justify-between font-mono text-[10px]">
        <span className={mention.mentionsDipuck ? "text-verified" : "text-ink-muted"}>
          {revealed
            ? mention.mentionsDipuck
              ? "Subject named"
              : "Subject not named"
            : "Redacted"}
        </span>
        <span className="text-ink-muted">{revealed ? `+${mention.scoreDelta}` : "held"}</span>
      </footer>
    </article>
  );
}
