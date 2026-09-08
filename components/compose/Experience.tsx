"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Boot } from "./Boot";
import { Chapter } from "./Chapter";
import { Field } from "./Field";
import { Scan } from "./Scan";
import { Ticker } from "./Ticker";
import type { ChapterId } from "@/lib/compose";

type Mode = "boot" | "field" | ChapterId | "scan";

const CHAPTER_MODES: ChapterId[] = ["about", "work", "bomb", "contact"];

function isChapter(mode: Mode): mode is ChapterId {
  return CHAPTER_MODES.includes(mode as ChapterId);
}

function useClock() {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString().slice(11, 19));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function Experience() {
  const [mode, setMode] = useState<Mode>("boot");
  const clock = useClock();
  const chapter = isChapter(mode) ? mode : null;
  const highlight = chapter ?? (mode === "scan" ? "bomb" : undefined);

  useEffect(() => {
    if (mode === "boot") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMode("field");
      if (event.key === "1") setMode("about");
      if (event.key === "2") setMode("work");
      if (event.key === "3") setMode("bomb");
      if (event.key === "4") setMode("contact");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  function onPick(id: string) {
    if (id === "about" || id === "work" || id === "bomb" || id === "contact") {
      setMode(id);
    }
  }

  return (
    <div className="compose">
      <div className="compose__grid" aria-hidden />
      <div className="compose__grain" aria-hidden />
      <div className="compose__scanlines" aria-hidden />

      {mode !== "boot" ? (
        <>
          <Field highlight={highlight} onPick={onPick} />
          <nav className="compose__nav" aria-label="Chapters">
            <button type="button" className={mode === "about" ? "is-on" : ""} onClick={() => setMode("about")}>
              About
            </button>
            <button type="button" className={mode === "work" ? "is-on" : ""} onClick={() => setMode("work")}>
              Work
            </button>
            <button type="button" className={mode === "bomb" || mode === "scan" ? "is-on" : ""} onClick={() => setMode("bomb")}>
              MentionX
            </button>
            <button type="button" className={mode === "contact" ? "is-on" : ""} onClick={() => setMode("contact")}>
              Contact
            </button>
          </nav>
          <div className="compose__hud compose__hud--tl">
            COMPOSE
            <strong>LIVE</strong>
          </div>
          <div className="compose__hud compose__hud--tr">
            UTC
            <strong>{clock}</strong>
          </div>
          <div className="compose__hud compose__hud--bl">
            DIPUCK JONES
            <strong>GROWTH / AEO</strong>
          </div>
          <div className="compose__hud compose__hud--br">
            BERLIN
            <strong>AVAILABLE</strong>
          </div>
          <Ticker />
        </>
      ) : null}

      <AnimatePresence>{mode === "boot" ? <Boot onDone={() => setMode("field")} /> : null}</AnimatePresence>
      <AnimatePresence>
        {chapter ? (
          <Chapter
            id={chapter}
            onClose={() => setMode("field")}
            onScan={chapter === "bomb" ? () => setMode("scan") : undefined}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>{mode === "scan" ? <Scan onClose={() => setMode("field")} /> : null}</AnimatePresence>
    </div>
  );
}
