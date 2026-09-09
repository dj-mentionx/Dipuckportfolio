"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lot } from "@/components/lot/Lot";
import type { ChapterId } from "@/lib/compose";
import { Boot } from "./Boot";
import { Chapter } from "./Chapter";
import { Field } from "./Field";
import { Scan } from "./Scan";
import { Ticker } from "./Ticker";

type Surface = "lot" | "field";
type Mode = "boot" | Surface | ChapterId | "scan";

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
  const [surface, setSurface] = useState<Surface>("lot");
  const [exhibit, setExhibit] = useState<string | undefined>();
  const [flash, setFlash] = useState(0);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const clock = useClock();
  const chapter = isChapter(mode) ? mode : null;
  const highlight = chapter ?? (mode === "scan" ? "bomb" : undefined);

  function go(next: Mode) {
    if (next === "lot" || next === "field") setSurface(next);
    if (next !== modeRef.current && modeRef.current !== "boot") setFlash((n) => n + 1);
    setMode(next);
  }
  const goRef = useRef(go);
  goRef.current = go;

  useEffect(() => {
    if (mode === "boot") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") goRef.current(surface);
      if (event.key === "1") goRef.current("about");
      if (event.key === "2") goRef.current("work");
      if (event.key === "3") goRef.current("bomb");
      if (event.key === "4") goRef.current("contact");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, surface]);

  function onPick(id: string, nextExhibit?: string) {
    if (id === "about" || id === "work" || id === "bomb" || id === "contact") {
      setExhibit(nextExhibit);
      go(id);
    }
  }

  const showWorld = mode !== "boot";
  const onLot = surface === "lot";

  return (
    <div className="compose">
      <div className="compose__grid" aria-hidden />
      <div className="compose__grain" aria-hidden />
      <div className="compose__scanlines" aria-hidden />

      {showWorld ? (
        <>
          {onLot ? (
            <Lot
              quiet={Boolean(chapter) || mode === "scan"}
              onEnter={(id, nextExhibit) => onPick(id, nextExhibit)}
              onClassic={() => go("field")}
            />
          ) : null}
          {!onLot ? <Field highlight={highlight} onPick={onPick} /> : null}
          <nav className="compose__nav" aria-label="Chapters">
            <button type="button" className={onLot && mode === "lot" ? "is-on" : ""} onClick={() => go("lot")}>
              Lot
            </button>
            <button type="button" className={mode === "about" ? "is-on" : ""} onClick={() => go("about")}>
              About
            </button>
            <button
              type="button"
              className={mode === "work" ? "is-on" : ""}
              onClick={() => {
                setExhibit(undefined);
                go("work");
              }}
            >
              Work
            </button>
            <button type="button" className={mode === "bomb" || mode === "scan" ? "is-on" : ""} onClick={() => go("bomb")}>
              MentionX
            </button>
            <button type="button" className={mode === "contact" ? "is-on" : ""} onClick={() => go("contact")}>
              Contact
            </button>
            <button type="button" className={!onLot && mode === "field" ? "is-on" : ""} onClick={() => go("field")}>
              Lockup
            </button>
          </nav>
          <div className="compose__hud compose__hud--tl">
            {onLot ? "THE LOT" : "DARKROOM"}
            <strong>{onLot ? "BERLIN" : "EXPOSE"}</strong>
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

      <AnimatePresence>
        {flash > 0 ? (
          <motion.div
            key={flash}
            className="compose__flash"
            initial={{ scaleY: 0, opacity: 1 }}
            animate={{ scaleY: [0, 1, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.38, times: [0, 0.35, 1], ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{mode === "boot" ? <Boot onDone={() => go("lot")} /> : null}</AnimatePresence>
      <AnimatePresence>
        {chapter ? (
          <Chapter
            key={`${chapter}-${exhibit || "none"}`}
            id={chapter}
            exhibit={exhibit}
            onClose={() => go(surface)}
            backLabel={onLot ? "Back to the lot" : "Back to lockup"}
            onScan={chapter === "bomb" ? () => go("scan") : undefined}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {mode === "scan" ? (
          <Scan onClose={() => go(surface)} backLabel={onLot ? "Back to the lot" : "Back to lockup"} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
