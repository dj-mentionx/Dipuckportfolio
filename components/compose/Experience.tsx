"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExperienceFloor } from "@/components/experience/ExperienceFloor";
import { SeatPanel } from "@/components/experience/SeatPanel";
import type { ChapterId } from "@/lib/compose";
import { seatById } from "@/lib/experience";
import {
  beatForChapter,
  EMPTY_SHIFT,
  loadShift,
  saveShift,
  type BeatId,
  type ShiftState,
} from "@/lib/shift";
import { Boot } from "./Boot";
import { Chapter } from "./Chapter";
import { Scan } from "./Scan";

const Lot = dynamic(() => import("@/components/lot/Lot").then((mod) => mod.Lot), { ssr: false });
const Rack = dynamic(() => import("@/components/rack/Rack").then((mod) => mod.Rack), { ssr: false });
const Field = dynamic(() => import("./Field").then((mod) => mod.Field), { ssr: false });

type Surface = "sphere" | "street" | "rack" | "field";
type Mode = "boot" | Surface | ChapterId | "scan" | "seat";

const CHAPTER_MODES: ChapterId[] = ["about", "work", "bomb", "contact"];

function isChapter(mode: Mode): mode is ChapterId {
  return CHAPTER_MODES.includes(mode as ChapterId);
}

export function Experience() {
  const [mode, setMode] = useState<Mode>("boot");
  const [surface, setSurface] = useState<Surface>("sphere");
  const [exhibit, setExhibit] = useState<string | undefined>();
  const [seatId, setSeatId] = useState<string | undefined>();
  const [arrive, setArrive] = useState<string | undefined>();
  const [flash, setFlash] = useState(0);
  const [shift, setShift] = useState<ShiftState>(EMPTY_SHIFT);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const chapter = isChapter(mode) ? mode : null;
  const highlight = chapter ?? (mode === "scan" ? "bomb" : undefined);
  const seat = seatId ? seatById(seatId) : undefined;
  const overlay = Boolean(chapter) || mode === "scan" || mode === "seat";

  useEffect(() => {
    setShift(loadShift());
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("lockup-root");
    return () => document.documentElement.classList.remove("lockup-root");
  }, []);

  function patchShift(next: (prev: ShiftState) => ShiftState) {
    setShift((prev) => {
      const updated = next(prev);
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
    if (next === "sphere" || next === "street" || next === "field" || next === "rack") setSurface(next);
    if (next === "about") markVisit("hq", "about");
    if (next === "work") markVisit(undefined, "work");
    if (next === "bomb") markVisit("mentionx");
    if (next === "contact") markVisit("write", "contact");
    if (next !== modeRef.current && modeRef.current !== "boot") setFlash((n) => n + 1);
    setMode(next);
  }
  const goRef = useRef(go);
  goRef.current = go;

  function openSeat(id: string) {
    setSeatId(id);
    markVisit(id, "work");
    if (modeRef.current !== "boot") setFlash((n) => n + 1);
    setMode("seat");
  }

  function enterStreet(id?: string) {
    setArrive(id);
    go("street");
  }

  useEffect(() => {
    if (mode === "boot") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") goRef.current(surface);
      if (event.key === "1") goRef.current("about");
      if (event.key === "2") goRef.current("street");
      if (event.key === "3") goRef.current("bomb");
      if (event.key === "4") goRef.current("contact");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, surface]);

  function onPick(id: string, nextExhibit?: string) {
    if (id === "work" && nextExhibit) {
      openSeat(nextExhibit);
      return;
    }
    if (id === "work") {
      go("street");
      return;
    }
    if (id === "about" || id === "bomb" || id === "contact") {
      setExhibit(nextExhibit);
      const plotId = id === "about" ? "hq" : id === "bomb" ? "mentionx" : "write";
      markVisit(plotId, id);
      go(id);
    }
  }

  const showWorld = mode !== "boot";
  const onSphere = surface === "sphere";
  const onStreet = surface === "street";
  const onRack = surface === "rack";
  const backLabel = onStreet ? "Back to the street" : onSphere ? "Back to the sphere" : onRack ? "Back to the rack" : "Back";

  return (
    <div className={`compose${overlay ? " is-held" : ""}`}>
      <div className="compose__grid" aria-hidden />
      <div className="compose__grain" aria-hidden />
      <div className="compose__scanlines" aria-hidden />

      {showWorld ? (
        <>
          {onSphere ? (
            <ExperienceFloor
              quiet={overlay}
              onStreet={() => enterStreet()}
            />
          ) : null}
          {onStreet ? (
            <Lot
              quiet={overlay}
              shift={shift}
              arrive={arrive}
              onEnter={(id, nextExhibit) => onPick(id, nextExhibit)}
              onScrap={(id) =>
                patchShift((prev) => (prev.scraps.includes(id) ? prev : { ...prev, scraps: [...prev.scraps, id] }))
              }
            />
          ) : null}
          {onRack ? (
            <Rack
              quiet={overlay}
              visited={shift.visited}
              onEnter={(id, nextExhibit) => onPick(id, nextExhibit)}
              onLot={() => go("street")}
              onClassic={() => go("field")}
            />
          ) : null}
          {surface === "field" ? <Field highlight={highlight} onPick={onPick} /> : null}
          <nav className="compose__nav" aria-label="Worlds">
            <button type="button" className={onSphere && mode === "sphere" ? "is-on" : ""} onClick={() => go("sphere")}>
              Sphere
            </button>
            <button type="button" className={onStreet && mode === "street" ? "is-on" : ""} onClick={() => go("street")}>
              Street
            </button>
            <button type="button" className={mode === "about" ? "is-on" : ""} onClick={() => go("about")}>
              About
            </button>
            <button type="button" className={mode === "bomb" || mode === "scan" ? "is-on" : ""} onClick={() => go("bomb")}>
              MentionX
            </button>
            <button type="button" className={mode === "contact" ? "is-on" : ""} onClick={() => go("contact")}>
              Contact
            </button>
            <button type="button" className={onRack && mode === "rack" ? "is-on" : ""} onClick={() => go("rack")}>
              Rack
            </button>
            <button type="button" className={surface === "field" && mode === "field" ? "is-on" : ""} onClick={() => go("field")}>
              Lockup
            </button>
          </nav>
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

      <AnimatePresence>{mode === "boot" ? <Boot onDone={() => go("sphere")} /> : null}</AnimatePresence>
      <AnimatePresence>
        {chapter ? (
          <Chapter
            key={`${chapter}-${exhibit || "none"}`}
            id={chapter}
            exhibit={exhibit}
            onClose={() => go(surface)}
            backLabel={backLabel}
            onScan={chapter === "bomb" ? () => go("scan") : undefined}
            onSigned={chapter === "contact" ? () => markBeat("write") : undefined}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {mode === "seat" && seat ? (
          <SeatPanel
            key={seat.id}
            seat={seat}
            onClose={() => go(surface)}
            backLabel={backLabel}
            onMention={seat.kind === "product" ? () => go("bomb") : undefined}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {mode === "scan" ? (
          <Scan onClose={() => go(surface)} backLabel={backLabel} onLock={() => markBeat("name")} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
