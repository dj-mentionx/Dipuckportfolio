"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AskBar } from "./AskBar";
import { FieldCanvas } from "./FieldCanvas";
import { FourVoices } from "./FourVoices";
import { Poster } from "./Poster";
import { Sources } from "./Sources";
import { createFieldAudio, type FieldAudio } from "@/lib/audio";
import { GHOST_QUERIES, looksLikeName, resolveScene, type Scene } from "@/lib/scenes";
import type { ScanResult } from "@/lib/types";

export function Experience() {
  const [energy, setEnergy] = useState(0.12);
  const [sound, setSound] = useState(false);
  const [scene, setScene] = useState<Scene | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [self, setSelf] = useState<ScanResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [asked, setAsked] = useState(0);
  const audioRef = useRef<FieldAudio | null>(null);

  const mentionStrength = useMemo(() => {
    if (self?.mentioned) return 1;
    if (!scene) return 0;
    const hits = scene.voices.filter((v) => v.mentionsDipuck).length;
    return hits / 4;
  }, [scene, self]);

  const voiceMix = useMemo<[number, number, number, number]>(() => {
    if (!scene) return [0.12, 0.1, 0.14, 0.11];
    return scene.voices.map((voice, index) => {
      const on = focused === null || focused === index;
      return (voice.mentionsDipuck ? 0.95 : 0.55) * (on ? 1 : 0.25);
    }) as [number, number, number, number];
  }, [scene, focused]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setEnergy((value) => Math.max(0.1, value * 0.86));
    }, 140);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!sound) {
      audioRef.current?.dispose();
      audioRef.current = null;
      return;
    }
    audioRef.current = createFieldAudio();
    return () => {
      audioRef.current?.dispose();
      audioRef.current = null;
    };
  }, [sound]);

  useEffect(() => {
    audioRef.current?.setEnergy(energy);
  }, [energy]);

  useEffect(() => {
    if (mentionStrength > 0.4) audioRef.current?.mention();
  }, [scene, mentionStrength]);

  async function runSelf(name: string) {
    setPending(true);
    setError("");
    setSelf(null);
    try {
      const res = await fetch("/api/check-mention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as ScanResult & { error?: string };
      if (!res.ok) {
        setError(data.error || "The field would not open.");
        return;
      }
      setSelf(data);
      setEnergy(1);
    } catch {
      setError("The field would not open.");
    } finally {
      setPending(false);
    }
  }

  function onAsk(query: string) {
    setError("");
    setFocused(null);
    const matched = resolveScene(query);
    if (matched) {
      setScene(matched);
      setAsked((n) => n + 1);
      setEnergy(1);
      return;
    }
    if (looksLikeName(query) || /ask about|my brand|my name/i.test(query)) {
      void runSelf(query.replace(/^ask about\s+/i, ""));
      setAsked((n) => n + 1);
      return;
    }
    setScene(resolveScene("AEO GEO") ?? null);
    setAsked((n) => n + 1);
    setEnergy(0.85);
  }

  return (
    <div className="cinema">
      <FieldCanvas energy={energy} mention={mentionStrength} voices={voiceMix} />
      <div className="grain" />
      <div className="letterbox letterbox-top" />
      <div className="letterbox letterbox-bottom" />

      <header className="cinema-hud">
        <p className="font-mono text-[10px] tracking-[0.32em] text-white/45">UNPROMPTED · LIVE</p>
        <div className="flex items-center gap-4">
          <button type="button" className="hud-btn" onClick={() => setSound((v) => !v)}>
            {sound ? "SOUND ON" : "SOUND OFF"}
          </button>
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/35">
            {asked ? `${asked} ASK${asked === 1 ? "" : "S"}` : "REC"}
          </span>
        </div>
      </header>

      <main className="cinema-stage">
        {!scene && !self ? (
          <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-5 text-center">
            <p className="font-mono text-[10px] tracking-[0.36em] text-white/35">A FIELD OF UNASKED QUESTIONS</p>
            <h1 className="sr-only">Dipuck Jones</h1>
            <div className="mt-16 w-full text-left">
              <AskBar onEnergy={setEnergy} onAsk={onAsk} />
            </div>
            <ul className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-[11px] text-white/40">
              {GHOST_QUERIES.map((query) => (
                <li key={query}>
                  <button type="button" onClick={() => onAsk(query)} className="underline-offset-4 hover:text-white hover:underline">
                    {query}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 pb-28 pt-24">
            {scene ? (
              <>
                <p className="font-display text-2xl text-white/80 md:text-3xl">{scene.query}</p>
                <FourVoices scene={scene} focused={focused} onFocus={setFocused} />
              </>
            ) : null}

            {self ? <Poster result={self} /> : null}

            <div className="w-full">
              <AskBar
                compact
                disabled={pending}
                placeholder={self ? "ASK ANOTHER" : "ASK ABOUT YOURSELF — A NAME, A BRAND"}
                onEnergy={setEnergy}
                onAsk={onAsk}
              />
              {error ? <p className="mt-3 font-mono text-[12px] text-mention">{error}</p> : null}
              {pending ? <p className="mt-3 font-mono text-[11px] text-white/40">Pulling one voice…</p> : null}
            </div>

            {asked > 0 ? <Sources /> : null}

            <footer className="border-t border-white/10 pt-8 font-mono text-[12px] text-white/45">
              <p className="font-display text-2xl text-white">Dipuck Jones</p>
              <p className="mt-2">Berlin · demand generation · AEO / GEO</p>
              <p className="mt-3">
                <a className="text-white/70 underline underline-offset-4" href="mailto:rush2dipuck@gmail.com">
                  rush2dipuck@gmail.com
                </a>
                {" · "}
                <a
                  className="text-white/70 underline underline-offset-4"
                  href="https://www.linkedin.com/in/dipuckjones/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </p>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
