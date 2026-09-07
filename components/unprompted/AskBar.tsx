"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { GHOST_QUERIES } from "@/lib/scenes";

type AskBarProps = {
  disabled?: boolean;
  compact?: boolean;
  placeholder?: string;
  onEnergy: (value: number) => void;
  onAsk: (query: string) => void;
};

export function AskBar({ disabled, compact, placeholder, onEnergy, onAsk }: AskBarProps) {
  const [value, setValue] = useState("");
  const [ghost, setGhost] = useState("");
  const [ghostIndex, setGhostIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const userTyped = useRef(false);

  useEffect(() => {
    if (userTyped.current || value) return;
    const full = GHOST_QUERIES[ghostIndex % GHOST_QUERIES.length];
    let i = 0;
    let waiting = false;
    const id = window.setInterval(() => {
      if (userTyped.current) {
        window.clearInterval(id);
        return;
      }
      if (waiting) return;
      i += 1;
      setGhost(full.slice(0, i));
      if (i >= full.length) {
        waiting = true;
        window.setTimeout(() => {
          i = 0;
          setGhost("");
          setGhostIndex((n) => n + 1);
          waiting = false;
        }, 1600);
      }
    }, 42);
    return () => window.clearInterval(id);
  }, [ghostIndex, value]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const next = (value.trim() || ghost).trim();
    if (next.length < 2) return;
    userTyped.current = true;
    onEnergy(1);
    onAsk(next);
    setValue("");
    setGhost("");
  }

  return (
    <form
      onSubmit={submit}
      className={`relative z-20 mx-auto w-full ${compact ? "max-w-3xl" : "max-w-4xl"}`}
    >
      <label className="block font-mono text-[10px] tracking-[0.28em] text-white/40">
        {placeholder || "ASK THE FIELD"}
      </label>
      <div className="mt-3 flex items-end gap-4 border-b border-white/25 pb-3">
        <input
          ref={inputRef}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            userTyped.current = true;
            setValue(event.target.value);
            onEnergy(Math.min(1, event.target.value.length / 28));
          }}
          onFocus={() => onEnergy(0.45)}
          spellCheck={false}
          autoComplete="off"
          className={`w-full bg-transparent font-display text-white outline-none placeholder:text-white/35 ${
            compact ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl"
          }`}
          placeholder={value ? "" : ghost || "Type a question"}
        />
        <button
          type="submit"
          disabled={disabled}
          className="shrink-0 pb-1 font-mono text-[11px] tracking-[0.22em] text-white/70 disabled:opacity-40"
        >
          ENTER
        </button>
      </div>
    </form>
  );
}
