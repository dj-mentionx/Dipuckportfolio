"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lot } from "@/components/lot/Lot";
import type { ChapterId } from "@/lib/compose";
import {
  beatForChapter,
  EMPTY_SHIFT,
  loadShift,
  nightClosed,
  saveShift,
  type BeatId,
  type ShiftState,
} from "@/lib/shift";
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
  const [shift, setShift] = useState<ShiftState>(EMPTY_SHIFT);
  const [stamp, setStamp] = useState(false);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const clock = useClock();
  const chapter = isChapter(mode) ? mode : null;
  const highlight = chapter ?? (mode === "scan" ? "bomb" : undefined);

  useEffect(() => {
    setShift(loadShift());
  }, []);

  function patchShift(next: (prev: ShiftState) => ShiftState) {
    setShift((prev) => {
      const updated = next(prev);
      if (!nightClosed(prev) && nightClosed(updated) && !updated.closedAck) setStamp(true);
      saveShift(updated);
      return updated;
    });
  }

  function markBeat(id: BeatId) {
    patchShift((prev) => ({ ...prev, beats: { ...prev.beats, [id]: true } }));
  }

  function markVisit(plotId?: string, chapterId?: ChapterId) {
    patchShift((prev) => {
      const visited = plotId && !prev.visited.includes(plotId) ? [...prev.visited, plotId] : prev.visited;
      const beat = chapterId ? beatForChapter(chapterId) : null;
      return {
        ...prev,
        visited,
        beats: beat ? { ...prev.beats, [beat]: true } : prev.beats,
      };
    });
  }

  function go(next: Mode) {
    if (next === "lot" || next === "field") setSurface(next);
    if (next === "about") markVisit("hq", "about");
    if (next === "work") markVisit(undefined, "work");
    if (next === "bomb") markVisit("mx");
    if (next === "contact") markVisit("write", "contact");
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
      const plotId =
        nextExhibit === "zarget"
          ? "fresh"
          : nextExhibit === "thinkproject"
            ? "think"
            : id === "about"
              ? "hq"
              : id === "bomb"
                ? "mx"
                : id === "contact"
                  ? "write"
                  : nextExhibit;
      markVisit(plotId, id);
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
              shift={shift}
              onEnter={(id, nextExhibit) => onPick(id, nextExhibit)}
              onClassic={() => go("field")}
              onScrap={(id) =>
                patchShift((prev) => (prev.scraps.includes(id) ? prev : { ...prev, scraps: [...prev.scraps, id] }))
              }
              onReset={() => {
                saveShift(EMPTY_SHIFT);
                setShift(EMPTY_SHIFT);
                setStamp(false);
              }}
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
            {onLot ? (nightClosed(shift) ? "NIGHT" : "FRAMES") : "BERLIN"}
            <strong>{onLot ? (nightClosed(shift) ? "CLOSED" : `${shift.visited.length}/9`) : "AVAILABLE"}</strong>
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
        {stamp && onLot && mode === "lot" ? (
          <motion.div
            className="shift__stamp"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <p>NIGHT CLOSED</p>
            <strong>THE PRINT IS READY</strong>
            <span>13 years on the contact sheet. Available.</span>
            <button
              type="button"
              className="lot__ui"
              onClick={() => {
                setStamp(false);
                patchShift((prev) => ({ ...prev, closedAck: true }));
              }}
            >
              Keep walking
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {chapter ? (
          <Chapter
            key={`${chapter}-${exhibit || "none"}`}
            id={chapter}
            exhibit={exhibit}
            onClose={() => go(surface)}
            backLabel={onLot ? "Back to the lot" : "Back to lockup"}
            onScan={chapter === "bomb" ? () => go("scan") : undefined}
            onSigned={chapter === "contact" ? () => markBeat("write") : undefined}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {mode === "scan" ? (
          <Scan
            onClose={() => go(surface)}
            backLabel={onLot ? "Back to the lot" : "Back to lockup"}
            onLock={() => markBeat("name")}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
