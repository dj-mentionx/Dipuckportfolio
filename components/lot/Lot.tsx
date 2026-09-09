"use client";

import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/compose/Portrait";
import { LOT_LAMPS, LOT_PLOTS, type LotPlot } from "@/lib/lot";
import { LOT_SCRAPS, SHIFT_BEATS, type BeatId, type ShiftState } from "@/lib/shift";

type LotProps = {
  onEnter: (chapter: "about" | "work" | "bomb" | "contact", exhibit?: string) => void;
  onClassic: () => void;
  onScrap: (id: string) => void;
  onReset: () => void;
  shift: ShiftState;
  quiet?: boolean;
};

const CELL = 54;
const PLAYABLE = LOT_PLOTS.filter((plot) => plot.chapter);
const SPEED = 3.35;
const LIMIT = 5.45;

function collide(x: number, y: number) {
  let nx = x;
  let ny = y;
  const r = 0.24;
  for (const plot of LOT_PLOTS) {
    const hw = plot.w / 2 + r;
    const hd = plot.d / 2 + r;
    const dx = nx - plot.x;
    const dy = ny - plot.y;
    if (Math.abs(dx) >= hw || Math.abs(dy) >= hd) continue;
    const ox = hw - Math.abs(dx);
    const oy = hd - Math.abs(dy);
    if (ox < oy) nx = plot.x + Math.sign(dx || 1) * hw;
    else ny = plot.y + Math.sign(dy || 1) * hd;
  }
  return {
    x: Math.max(-LIMIT, Math.min(LIMIT, nx)),
    y: Math.max(-LIMIT, Math.min(LIMIT, ny)),
  };
}

function nearestPlot(x: number, y: number) {
  let best: LotPlot | null = null;
  let bestDist = 99;
  for (const plot of PLAYABLE) {
    const dist = Math.hypot(x - plot.x, y - plot.y);
    const reach = Math.max(plot.w, plot.d) * 0.55 + 0.55;
    if (dist < reach && dist < bestDist) {
      best = plot;
      bestDist = dist;
    }
  }
  return best;
}

export function Lot({ onEnter, onClassic, onScrap, onReset, shift, quiet = false }: LotProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const isoRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const cam = useRef({ yaw: -38, zoom: 0.92, x: 0, y: 36 });
  const drag = useRef({ on: false, pan: false, lx: 0, ly: 0, moved: 0 });
  const space = useRef(false);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const pos = useRef({ x: 0.2, y: 2.15 });
  const dest = useRef<{ x: number; y: number } | null>(null);
  const quietRef = useRef(quiet);
  quietRef.current = quiet;
  const scrapsRef = useRef(shift.scraps);
  scrapsRef.current = shift.scraps;
  const grabbing = useRef(new Set<string>());
  const onScrapRef = useRef(onScrap);
  onScrapRef.current = onScrap;
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;
  const [hot, setHot] = useState<string | null>("hq");
  const [near, setNear] = useState<LotPlot | null>(null);
  const [hint, setHint] = useState(() => shift.visited.length === 0);
  const [toast, setToast] = useState<string | null>(null);
  const develop = Math.min(1, shift.visited.length / PLAYABLE.length);

  function paint() {
    const { yaw, zoom, x, y } = cam.current;
    if (rigRef.current) rigRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
    if (isoRef.current) {
      isoRef.current.style.transform = `rotateX(58deg) rotateZ(${yaw}deg)`;
      isoRef.current.style.setProperty("--yaw", `${yaw}deg`);
    }
  }

  function paintWalker() {
    const { x, y } = pos.current;
    if (walkerRef.current) {
      walkerRef.current.style.transform = `translate3d(${x * CELL}px, ${y * CELL}px, 0)`;
    }
    const goal = dest.current;
    if (markRef.current) {
      if (!goal) {
        markRef.current.style.opacity = "0";
      } else {
        markRef.current.style.opacity = "1";
        markRef.current.style.transform = `translate3d(${goal.x * CELL}px, ${goal.y * CELL}px, 0)`;
      }
    }
  }

  function screenToCell(clientX: number, clientY: number) {
    const wrap = wrapRef.current;
    if (!wrap) return null;
    const box = wrap.getBoundingClientRect();
    const { yaw, zoom, x, y } = cam.current;
    const sx = (clientX - box.left - box.width / 2 - x) / zoom;
    const sy = (clientY - box.top - box.height * 0.48 - y) / zoom;
    const gy = sy / Math.cos((58 * Math.PI) / 180);
    const th = (-yaw * Math.PI) / 180;
    const cos = Math.cos(th);
    const sin = Math.sin(th);
    return {
      x: (sx * cos - gy * sin) / CELL,
      y: (sx * sin + gy * cos) / CELL,
    };
  }

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    paint();
    paintWalker();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("input, textarea, [contenteditable]")) return;
      if (event.code === "Space") {
        space.current = event.type === "keydown";
        event.preventDefault();
        return;
      }
      if (quietRef.current) return;
      const down = event.type === "keydown";
      if (event.code === "KeyW" || event.code === "ArrowUp") keys.current.w = down;
      if (event.code === "KeyS" || event.code === "ArrowDown") keys.current.s = down;
      if (event.code === "KeyA" || event.code === "ArrowLeft") keys.current.a = down;
      if (event.code === "KeyD" || event.code === "ArrowRight") keys.current.d = down;
      if (down && (event.code === "KeyW" || event.code === "KeyA" || event.code === "KeyS" || event.code === "KeyD" || event.code.startsWith("Arrow"))) {
        dest.current = null;
        event.preventDefault();
      }
      if (down && (event.code === "KeyE" || event.code === "Enter")) {
        const plot = nearestPlot(pos.current.x, pos.current.y);
        if (plot?.chapter) {
          event.preventDefault();
          setHot(plot.id);
          setHint(false);
          onEnterRef.current(plot.chapter, plot.exhibit);
        }
      }
    };

    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest(".lot__chrome, .lot__guide, .lot__dock, .lot__sheet, .lot__toast, .lot__prompt, .lot__scrap")) return;
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
    const onUp = (event: PointerEvent) => {
      const wasDrag = drag.current.moved > 14;
      drag.current.on = false;
      if (wasDrag || quietRef.current) return;
      if ((event.target as HTMLElement).closest(".lot__plot, .lot__scrap")) return;
      const cell = screenToCell(event.clientX, event.clientY);
      if (!cell) return;
      dest.current = collide(cell.x, cell.y);
      setHint(false);
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cam.current.zoom = Math.min(1.6, Math.max(0.52, cam.current.zoom - event.deltaY * 0.0012));
      paint();
    };

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = window.requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (quietRef.current) return;
      const yaw = (cam.current.yaw * Math.PI) / 180;
      const { w, a, s, d } = keys.current;
      let mx = 0;
      let my = 0;
      if (w) {
        mx += Math.sin(yaw);
        my -= Math.cos(yaw);
      }
      if (s) {
        mx -= Math.sin(yaw);
        my += Math.cos(yaw);
      }
      if (a) {
        mx -= Math.cos(yaw);
        my -= Math.sin(yaw);
      }
      if (d) {
        mx += Math.cos(yaw);
        my += Math.sin(yaw);
      }
      if (mx || my) {
        const len = Math.hypot(mx, my) || 1;
        pos.current = collide(pos.current.x + (mx / len) * SPEED * dt, pos.current.y + (my / len) * SPEED * dt);
      } else if (dest.current) {
        const dx = dest.current.x - pos.current.x;
        const dy = dest.current.y - pos.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.08) dest.current = null;
        else {
          const step = Math.min(dist, SPEED * dt);
          pos.current = collide(pos.current.x + (dx / dist) * step, pos.current.y + (dy / dist) * step);
        }
      }
      paintWalker();
      if (!drag.current.on && (mx || my || dest.current)) {
        const th = (cam.current.yaw * Math.PI) / 180;
        const wx = pos.current.x * CELL;
        const wy = pos.current.y * CELL;
        const rx = wx * Math.cos(th) - wy * Math.sin(th);
        const ry = wx * Math.sin(th) + wy * Math.cos(th);
        const sy = ry * Math.cos((58 * Math.PI) / 180);
        cam.current.x += (-rx * cam.current.zoom - cam.current.x) * 0.08;
        cam.current.y += (-sy * cam.current.zoom + 36 - cam.current.y) * 0.08;
        paint();
      }

      const nextNear = nearestPlot(pos.current.x, pos.current.y);
      setNear((prev) => (prev?.id === nextNear?.id ? prev : nextNear));

      for (const scrap of LOT_SCRAPS) {
        if (scrapsRef.current.includes(scrap.id) || grabbing.current.has(scrap.id)) continue;
        if (Math.hypot(pos.current.x - scrap.x, pos.current.y - scrap.y) < 0.42) {
          grabbing.current.add(scrap.id);
          onScrapRef.current(scrap.id);
          setToast(`${scrap.label} · ON THE SHEET`);
        }
      }
    };
    raf = window.requestAnimationFrame(tick);

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1700);
    return () => window.clearTimeout(id);
  }, [toast]);

  function pick(plot: LotPlot) {
    if (drag.current.moved > 14) return;
    if (!plot.chapter) return;
    setHot(plot.id);
    setHint(false);
    onEnter(plot.chapter, plot.exhibit);
  }

  const closed = SHIFT_BEATS.every((beat) => shift.beats[beat.id as BeatId]);

  return (
    <div
      ref={wrapRef}
      className={`lot ${quiet ? "is-quiet" : ""} ${closed ? "is-closed" : ""}`}
      style={{ ["--develop" as string]: String(develop) }}
    >
      <div ref={rigRef} className="lot__rig">
        <div ref={isoRef} className="lot__iso">
          <div className="lot__ground" aria-hidden />
          <div className="lot__plaza" aria-hidden />
          <div className="lot__road lot__road--h" aria-hidden />
          <div className="lot__road lot__road--v" aria-hidden />
          <span ref={markRef} className="lot__mark" aria-hidden />
          {LOT_LAMPS.map((lamp) => (
            <span
              key={`${lamp.x}-${lamp.y}`}
              className="lot__lamp"
              style={{ transform: `translate3d(${lamp.x * CELL}px, ${lamp.y * CELL}px, 0)` }}
            />
          ))}
          {LOT_SCRAPS.map((scrap) =>
            shift.scraps.includes(scrap.id) ? null : (
              <button
                key={scrap.id}
                type="button"
                className="lot__scrap"
                style={{ transform: `translate3d(${scrap.x * CELL}px, ${scrap.y * CELL}px, 0)` }}
                onClick={() => {
                  grabbing.current.add(scrap.id);
                  onScrap(scrap.id);
                  setToast(`${scrap.label} · ON THE SHEET`);
                }}
                aria-label={`Pick up ${scrap.label}`}
              >
                <span className="lot__scrap-dot" />
                <span className="lot__scrap-label">{scrap.label}</span>
              </button>
            ),
          )}
          {LOT_PLOTS.map((plot) => {
            const width = plot.w * CELL;
            const depth = plot.d * CELL;
            const height = plot.h * CELL;
            const shot = !plot.chapter || shift.visited.includes(plot.id);
            return (
              <button
                key={plot.id}
                type="button"
                className={`lot__plot kind-${plot.kind} ${hot === plot.id ? "is-hot" : ""} ${near?.id === plot.id ? "is-near" : ""} ${shot ? "is-shot" : "is-latent"}`}
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
                    <small>{shot ? plot.kicker : "UNDEVELOPED"}</small>
                    {plot.label}
                  </span>
                ) : null}
              </button>
            );
          })}
          <div ref={walkerRef} className="lot__walker" aria-hidden>
            <span className="lot__walker-shadow" />
            <span className="lot__walker-body" />
            <span className="lot__walker-head">
              <Portrait />
            </span>
          </div>
        </div>
      </div>

      <div className="lot__chrome">
        <p className="lot__brand">
          THE LOT
          <strong>NIGHT SHIFT</strong>
        </p>
        <div className="lot__controls">
          <span>WASD / arrows · walk</span>
          <span>Tap ground · go there</span>
          <span>E · enter</span>
          <span>Drag · orbit</span>
        </div>
        <button type="button" className="lot__ui lot__classic" onClick={onClassic}>
          Classic lockup
        </button>
      </div>

      <aside className="lot__sheet" aria-label="Call sheet">
        <p className="lot__sheet-kicker">CALL SHEET · SHIFT 01</p>
        <ul>
          {SHIFT_BEATS.map((beat) => (
            <li key={beat.id} className={shift.beats[beat.id] ? "is-done" : ""}>
              <span />
              {beat.label}
              <small>{beat.hint}</small>
            </li>
          ))}
        </ul>
        <p className="lot__sheet-kicker">FRAMES {shift.visited.length}/{PLAYABLE.length}</p>
        <div className="lot__frames">
          {PLAYABLE.map((plot) => (
            <button
              key={plot.id}
              type="button"
              className={shift.visited.includes(plot.id) ? "is-shot" : ""}
              onClick={() => plot.chapter && onEnter(plot.chapter, plot.exhibit)}
              title={plot.label}
            >
              {plot.label.slice(0, 2)}
            </button>
          ))}
        </div>
        <p className="lot__sheet-kicker">SCRAPS {shift.scraps.length}/{LOT_SCRAPS.length}</p>
        <button type="button" className="lot__ui lot__ui--ghost" onClick={onReset}>
          New shift
        </button>
      </aside>

      {hint ? (
        <aside className="lot__guide">
          <Portrait className="lot__guide-face" />
          <div>
            <p className="lot__guide-kicker">SHIFT 01 · NIGHT WATCH</p>
            <p>Walk the lot. Buildings develop when you enter. Close the sheet.</p>
            <div className="lot__guide-row">
              <button type="button" className="lot__ui" onClick={() => setHint(false)}>
                Clock in
              </button>
              <button
                type="button"
                className="lot__ui lot__ui--ghost"
                onClick={() => {
                  setHint(false);
                  onEnter("about");
                }}
              >
                Skip to HQ
              </button>
            </div>
          </div>
          <button type="button" className="lot__guide-x" onClick={() => setHint(false)} aria-label="Dismiss">
            ×
          </button>
        </aside>
      ) : null}

      {near && !quiet ? (
        <p className="lot__prompt">
          E · ENTER <strong>{near.label}</strong>
        </p>
      ) : null}

      {toast ? <p className="lot__toast">{toast}</p> : null}

      <nav className="lot__dock" aria-label="Districts">
        {PLAYABLE.map((plot) => (
          <button
            key={plot.id}
            type="button"
            className={`${hot === plot.id ? "is-on" : ""} ${shift.visited.includes(plot.id) ? "is-shot" : ""}`}
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
