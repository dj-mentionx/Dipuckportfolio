"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { shareText } from "@/lib/format";
import type { ScanResult } from "@/lib/types";

type ScanProps = {
  onClose: () => void;
};

export function Scan({ onClose }: ScanProps) {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);

  const ring = useMemo(() => {
    if (!result) return 0;
    return Math.max(0, Math.min(100, result.score));
  }, [result]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
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
        setError(data.error || "No lock.");
        return;
      }
      setResult(data);
    } catch {
      setError("No lock.");
    } finally {
      setPending(false);
    }
  }

  return (
    <motion.section
      className="scan"
      initial={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0% 0 0% 0)" }}
      exit={{ opacity: 0, clipPath: "inset(50% 0 50% 0)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="scan__lockup">
        <p className="chapter__kicker">MENTIONX · LIVE PULL</p>
        {!result ? (
          <>
            <h2 className="scan__prompt">Drop a name into the field.</h2>
            <form onSubmit={onSubmit} className="scan__form">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Brand or person"
                minLength={2}
                maxLength={64}
                required
                autoFocus
              />
              <button type="submit" disabled={pending}>
                {pending ? "Locking…" : "Lock"}
              </button>
            </form>
            {pending ? <p className="scan__status">Composing the pull…</p> : null}
            {error ? <p className="scan__error">{error}</p> : null}
          </>
        ) : (
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <div className="scan__meter" aria-hidden>
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  pathLength={1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: ring / 100 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <strong>{result.score}</strong>
            </div>
            <p className="scan__status">{result.mentioned ? "IN FRAME" : "OUT OF FRAME"}</p>
            <h3 className="scan__giant">{result.name}</h3>
            <p className="scan__copy">{result.excerpt}</p>
            <button
              type="button"
              className="scan__again"
              onClick={() => navigator.clipboard.writeText(shareText(result.name, result.score, result.mentioned))}
            >
              Copy lockup
            </button>
            <button type="button" className="scan__again" onClick={() => setResult(null)}>
              Another name
            </button>
          </motion.div>
        )}
        <button type="button" className="chapter__back" onClick={onClose}>
          Back to field
        </button>
      </div>
    </motion.section>
  );
}
