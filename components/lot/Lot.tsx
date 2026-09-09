"use client";

import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/compose/Portrait";
import { LOT_LAMPS, LOT_PLOTS, type LotPlot } from "@/lib/lot";

type LotProps = {
  onEnter: (chapter: "about" | "work" | "bomb" | "contact", exhibit?: string) => void;
  onClassic: () => void;
  quiet?: boolean;
};

const CELL = 54;

export function Lot({ onEnter, onClassic, quiet = false }: LotProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const isoRef = useRef<HTMLDivElement>(null);
  const cam = useRef({ yaw: -38, zoom: 0.92, x: 0, y: 36 });
  const drag = useRef({ on: false, pan: false, lx: 0, ly: 0, moved: 0 });
  const space = useRef(false);
  const [hot, setHot] = useState<string | null>("hq");
  const [hint, setHint] = useState(true);

  function paint() {
    const { yaw, zoom, x, y } = cam.current;
    if (rigRef.current) rigRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
    if (isoRef.current) {
      isoRef.current.style.transform = `rotateX(58deg) rotateZ(${yaw}deg)`;
      isoRef.current.style.setProperty("--yaw", `${yaw}deg`);
    }
  }

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    paint();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      if ((event.target as HTMLElement).closest("input, textarea, [contenteditable]")) return;
      space.current = event.type === "keydown";
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest(".lot__chrome, .lot__guide, .lot__dock")) return;
      wrap.setPointerCapture(event.pointerId);
      drag.current = {
        on: true,
        pan: space.current || event.button === 1,
        lx: event.clientX,
        ly: event.clientY,
        moved: 0,
      };
    };
    const onMove = (event: PointerEvent) => {
      if (!drag.current.on) return;
      const dx = event.clientX - drag.current.lx;
      const dy = event.clientY - drag.current.ly;
      drag.current.moved += Math.abs(dx) + Math.abs(dy);
      drag.current.lx = event.clientX;
      drag.current.ly = event.clientY;
      if (drag.current.pan) {
        cam.current.x += dx;
        cam.current.y += dy;
      } else if (!reduced) {
        cam.current.yaw += dx * 0.32;
      }
      paint();
    };
    const onUp = () => {
      drag.current.on = false;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cam.current.zoom = Math.min(1.6, Math.max(0.52, cam.current.zoom - event.deltaY * 0.0012));
      paint();
    };

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("wheel", onWheel);
    };
  }, []);

  function pick(plot: LotPlot) {
    if (drag.current.moved > 14) return;
    if (!plot.chapter) return;
    setHot(plot.id);
    onEnter(plot.chapter, plot.exhibit);
  }

    return (
    <div ref={wrapRef} className={`lot ${quiet ? "is-quiet" : ""}`}>
      <div ref={rigRef} className="lot__rig">
        <div ref={isoRef} className="lot__iso">
          <div className="lot__ground" aria-hidden />
          <div className="lot__plaza" aria-hidden />
          <div className="lot__road lot__road--h" aria-hidden />
          <div className="lot__road lot__road--v" aria-hidden />
          {LOT_LAMPS.map((lamp) => (
            <span
              key={`${lamp.x}-${lamp.y}`}
              className="lot__lamp"
              style={{ transform: `translate3d(${lamp.x * CELL}px, ${lamp.y * CELL}px, 0)` }}
            />
          ))}
          {LOT_PLOTS.map((plot) => {
            const width = plot.w * CELL;
            const depth = plot.d * CELL;
            const height = plot.h * CELL;
            return (
              <button
                key={plot.id}
                type="button"
                className={`lot__plot kind-${plot.kind} ${hot === plot.id ? "is-hot" : ""}`}
                style={{
                  width,
                  height: depth,
                  transform: `translate3d(${plot.x * CELL - width / 2}px, ${plot.y * CELL - depth / 2}px, 0)`,
                  ["--bh" as string]: `${height}px`,
                  ["--bw" as string]: `${width}px`,
                  ["--bd" as string]: `${depth}px`,
                }}
                onMouseEnter={() => setHot(plot.id)}
                onClick={() => pick(plot)}
                aria-label={plot.label ? `Enter ${plot.label}` : "Block"}
                disabled={plot.kind === "filler"}
              >
                <span className="lot__face lot__face--south" />
                <span className="lot__face lot__face--east" />
                <span className="lot__face lot__face--north" />
                <span className="lot__face lot__face--west" />
                <span className="lot__face lot__face--top">
                  {plot.kind === "hq" ? <Portrait className="lot__print" /> : null}
                </span>
                {plot.label ? (
                  <span className="lot__tag">
                    <small>{plot.kicker}</small>
                    {plot.label}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lot__chrome">
        <p className="lot__brand">
          THE LOT
          <strong>BERLIN AFTER HOURS</strong>
        </p>
        <div className="lot__controls">
          <span>Drag · orbit</span>
          <span>Space + drag · pan</span>
          <span>Wheel · zoom</span>
          <span>Click a building</span>
        </div>
        <button type="button" className="lot__ui lot__classic" onClick={onClassic}>
          Classic lockup
        </button>
      </div>

      {hint ? (
        <aside className="lot__guide">
          <Portrait className="lot__guide-face" />
          <div>
            <p className="lot__guide-kicker">DIPUCK · ON THE LOT</p>
            <p>Every seat is a building. The print is HQ. Click in.</p>
            <div className="lot__guide-row">
              <button
                type="button"
                className="lot__ui"
                onClick={() => {
                  setHint(false);
                  onEnter("about");
                }}
              >
                Visit HQ
              </button>
              <button type="button" className="lot__ui lot__ui--ghost" onClick={() => setHint(false)}>
                I&apos;ll walk
              </button>
            </div>
          </div>
          <button type="button" className="lot__guide-x" onClick={() => setHint(false)} aria-label="Dismiss">
            ×
          </button>
        </aside>
      ) : null}

      <nav className="lot__dock" aria-label="Districts">
        {LOT_PLOTS.filter((p) => p.chapter).map((plot) => (
          <button
            key={plot.id}
            type="button"
            className={hot === plot.id ? "is-on" : ""}
            onClick={() => {
              setHot(plot.id);
              if (plot.chapter) onEnter(plot.chapter, plot.exhibit);
            }}
          >
            {plot.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
