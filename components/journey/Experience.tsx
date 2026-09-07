"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Projector } from "./Projector";
import { World } from "./World";
import type { RoomId } from "@/lib/rooms";

const MAX = 2400;

export function Experience() {
  const [x, setX] = useState(0);
  const [room, setRoom] = useState<RoomId | null>(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, scroll: 0 });

  const progress = x / MAX;
  const chapter = progress < 0.28 ? "FOREST" : progress < 0.62 ? "VILLAGE" : "CITY";

  const move = useCallback((delta: number) => {
    setX((value) => Math.max(0, Math.min(MAX, value + delta)));
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (room) return;
      event.preventDefault();
      move(event.deltaY + event.deltaX);
    };
    const onKey = (event: KeyboardEvent) => {
      if (room) return;
      if (event.key === "ArrowRight" || event.key === " ") move(90);
      if (event.key === "ArrowLeft") move(-90);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [move, room]);

  const sky = skyFor(progress);

  return (
    <div
      className="picture"
      style={{
        ["--sky-a" as string]: sky.a,
        ["--sky-b" as string]: sky.b,
      }}
      onPointerDown={(event) => {
        if (room) return;
        dragging.current = true;
        start.current = { x: event.clientX, scroll: x };
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging.current || room) return;
        setX(Math.max(0, Math.min(MAX, start.current.scroll - (event.clientX - start.current.x) * 1.35)));
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <div className="letterbox top" />
      <div className="letterbox bottom" />
      <div className="grain" />

      <header className="picture-hud">
        <p>DIPUCK JONES</p>
        <p>{chapter}</p>
      </header>

      <World progress={progress} onOpen={setRoom} />

      {progress < 0.18 ? (
        <div className="open-titles">
          <p>A picture in three movements</p>
          <h1>From the trees to the city</h1>
          <p className="hint">Scroll or drag sideways</p>
        </div>
      ) : null}

      <div className="reel">
        <span className={progress < 0.28 ? "on" : ""}>Forest</span>
        <i />
        <span className={progress >= 0.28 && progress < 0.62 ? "on" : ""}>Village</span>
        <i />
        <span className={progress >= 0.62 ? "on" : ""}>City</span>
      </div>

      <AnimatePresence>{room ? <Projector roomId={room} onClose={() => setRoom(null)} /> : null}</AnimatePresence>
    </div>
  );
}

function skyFor(progress: number) {
  if (progress < 0.35) return { a: "#07140f", b: "#10261c" };
  if (progress < 0.65) return { a: "#1a120e", b: "#3b2416" };
  return { a: "#070b14", b: "#151d30" };
}
