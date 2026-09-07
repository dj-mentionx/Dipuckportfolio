"use client";

import { FormEvent, useState } from "react";
import { shareText, visibilityBlocks } from "@/lib/format";
import type { ScanResult } from "@/lib/types";

export function OpenFile() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setCopied(false);
    setPending(true);
    setResult(null);

    try {
      const res = await fetch("/api/check-mention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as ScanResult & { error?: string };
      if (!res.ok) {
        setError(data.error || "The desk could not open that file.");
        return;
      }
      setResult(data);
    } catch {
      setError("The desk could not open that file.");
    } finally {
      setPending(false);
    }
  }

  async function copyCard() {
    if (!result) return;
    const text = shareText(result.name, result.score, result.mentioned);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setError("Copy failed — select the card text instead.");
    }
  }

  return (
    <section className="hairline-t py-16">
      <p className="font-mono text-[10px] text-ink-muted">Open your own file</p>
      <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight">
        One name. One query. One card.
      </h2>
      <p className="mt-4 max-w-xl font-serif text-[1.05rem] leading-[1.6]">
        Type a brand or a person. The desk fires a single rate-limited pull — or a dated demo
        verdict if live keys are not mounted — and stamps a shareable AI visibility card.
      </p>

      <form onSubmit={onSubmit} className="mt-8 max-w-xl">
        <label htmlFor="file-name" className="font-mono text-[11px] text-ink-muted">
          Subject
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="file-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={64}
            required
            autoComplete="off"
            placeholder="A company, a founder, a product"
            className="hairline w-full bg-paper px-3 py-3 font-serif text-lg outline-none placeholder:text-ink-muted focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ink"
          />
          <button
            type="submit"
            disabled={pending}
            className="hairline bg-ink px-5 py-3 font-mono text-[12px] text-paper disabled:opacity-50"
          >
            {pending ? "Pulling…" : "Scan"}
          </button>
        </div>
        {error ? (
          <p className="mt-3 font-mono text-[12px] text-stamp" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-3 font-mono text-[11px] text-ink-muted">Twenty scans a day, then the desk closes.</p>
        )}
      </form>

      {result ? (
        <div className="hairline mt-10 max-w-xl bg-paper p-5">
          <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted">
            <span>AI visibility card</span>
            <span className={result.mentioned ? "text-verified" : "text-ink-muted"}>
              {result.mentioned ? "Mentioned" : "Not named"}
            </span>
          </div>
          <p className="mt-4 font-serif text-3xl leading-tight">{result.name}</p>
          <p className="mt-4 font-mono text-xl text-stamp">
            {visibilityBlocks(result.score)}  {result.score}
          </p>
          <p className="mt-4 font-mono text-[12px] leading-relaxed">{result.excerpt}</p>
          <p className="mt-5 font-mono text-[10px] text-ink-muted">
            {result.live ? `Live pull · ${result.model}` : "Demo verdict · connect model keys for a live pull"} · scanned via dipuckjones.com
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyCard}
              className="hairline px-4 py-2 font-mono text-[12px]"
            >
              {copied ? "Copied" : "Copy card"}
            </button>
            <a
              href={`/api/og?name=${encodeURIComponent(result.name)}&score=${result.score}&mentioned=${result.mentioned ? "1" : "0"}`}
              className="hairline px-4 py-2 font-mono text-[12px]"
            >
              Open share image
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
