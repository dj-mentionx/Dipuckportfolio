"use client";

import { FormEvent, useState } from "react";
import { shareText } from "@/lib/format";
import type { ScanResult } from "@/lib/types";

type SpliceProps = {
  result: ScanResult | null;
  pending: boolean;
  error: string;
  onSplice: (name: string) => void;
};

export function Splice({ result, pending, error, onSplice }: SpliceProps) {
  const [name, setName] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) return;
    onSplice(name.trim());
  }

  return (
    <section className="splice">
      <p className="bay-kicker">Leader · your frame</p>
      <h2>Splice a name onto the print.</h2>
      <form onSubmit={submit} className="splice-form">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="A brand, a founder"
          maxLength={64}
          minLength={2}
          required
        />
        <button type="submit" disabled={pending}>
          {pending ? "Exposing…" : "Expose"}
        </button>
      </form>
      {error ? <p className="splice-error">{error}</p> : null}

      {result ? (
        <article className="splice-frame">
          <header>
            <span>TAKE {result.score}</span>
            <span>{result.mentioned ? "IN SYNC" : "WILD SOUND"}</span>
          </header>
          <p className="cell-figure">{result.mentioned ? "HIT" : "MISS"}</p>
          <h3>{result.name}</h3>
          <p className="cell-line">{result.excerpt}</p>
          <p className="china">scanned via dipuckjones.com</p>
          <div className="splice-actions">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(shareText(result.name, result.score, result.mentioned))}
            >
              Copy frame
            </button>
            <a
              href={`/api/og?name=${encodeURIComponent(result.name)}&score=${result.score}&mentioned=${result.mentioned ? "1" : "0"}`}
            >
              Open still
            </a>
          </div>
        </article>
      ) : null}
    </section>
  );
}
