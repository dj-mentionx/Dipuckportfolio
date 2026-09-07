"use client";

import { useCallback, useState } from "react";
import { FilmStrip } from "./FilmStrip";
import { Slate } from "./Slate";
import { Splice } from "./Splice";
import { PRINT } from "@/lib/frames";
import type { ScanResult } from "@/lib/types";

export function Experience() {
  const [rolling, setRolling] = useState(false);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const frame = PRINT[index] ?? PRINT[0];

  const onIndex = useCallback((next: number) => {
    setIndex(next);
  }, []);

  async function onSplice(name: string) {
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/check-mention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as ScanResult & { error?: string };
      if (!res.ok) {
        setError(data.error || "The gate jammed.");
        return;
      }
      setResult(data);
    } catch {
      setError("The gate jammed.");
    } finally {
      setPending(false);
    }
  }

  if (!rolling) {
    return (
      <div className="bay bay-slate">
        <Slate onClap={() => setRolling(true)} />
      </div>
    );
  }

  return (
    <div className="bay">
      <header className="bay-hud">
        <p>RUSHES · 35MM</p>
        <p>
          {frame.year} · ROLL {frame.roll}
        </p>
      </header>

      <div className="gate" aria-hidden />

      <FilmStrip frames={PRINT} index={index} onIndex={onIndex} />

      <aside className="bay-notes">
        <p className="bay-kicker">Sync notes</p>
        <h2>{frame.title}</h2>
        <p>{frame.note}</p>
        <div className="bay-nav">
          <button type="button" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setIndex(Math.min(PRINT.length - 1, index + 1))}
            disabled={index === PRINT.length - 1}
          >
            Next →
          </button>
        </div>
      </aside>

      <Splice result={result} pending={pending} error={error} onSplice={onSplice} />

      <footer className="bay-end">
        <p>Dipuck Jones · Berlin · rush2dipuck@gmail.com</p>
        <a href="https://www.linkedin.com/in/dipuckjones/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </footer>
    </div>
  );
}
