"use client";

import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/compose/Portrait";
import { LOT_LAMPS, LOT_LIMIT, LOT_PATHS, LOT_PLOTS, type LotPlot } from "@/lib/lot";
import { LOT_SCRAPS, type ShiftState } from "@/lib/shift";

type LotProps = {
  onEnter: (chapter: "about" | "work" | "bomb" | "contact", exhibit?: string) => void;
  onScrap: (id: string) => void;
  shift: ShiftState;
  quiet?: boolean;
  arrive?: string;
};

const CELL = 54;
const SPEED = 3.35;

function collide(x: number, y: number) {
  let nx = x;
  let ny = y;
  const r = 0.28;
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
    x: Math.max(-LOT_LIMIT, Math.min(LOT_LIMIT, nx)),
    y: Math.max(-LOT_LIMIT, Math.min(LOT_LIMIT, ny)),
  };
}

function nearestPlot(x: number, y: number) {
  let best: LotPlot | null = null;
  let bestDist = 99;
  for (const plot of LOT_PLOTS) {
    const dist = Math.hypot(x - plot.x, y - plot.y);
    const reach = Math.max(plot.w, plot.d) * 0.55 + 0.7;
    if (dist < reach && dist < bestDist) {
      best = plot;
      bestDist = dist;
    }
  }
  return best;
}

export function Lot({ onEnter, onScrap, shift, quiet = false, arrive }: LotProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const isoRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const cam = useRef({ yaw: -38, zoom: 0.72, x: 0, y: 28 });
  const drag = useRef({ on: false, pan: false, lx: 0, ly: 0, moved: 0 });
  const space = useRef(false);
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const pos = useRef({ x: 0, y: 1.15 });
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
  const [hot, setHot] = useState<string | null>(arrive || null);
  const [near, setNear] = useState<LotPlot | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const develop = Math.min(1, shift.visited.length / LOT_PLOTS.length);

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
    if (!arrive) return;
    const plot = LOT_PLOTS.find((item) => item.id === arrive);
    if (!plot) return;
    pos.current = { x: plot.x, y: plot.y + Math.min(1.2, plot.d) };
    dest.current = null;
    setHot(plot.id);
    paint();
    paintWalker();
  }, [arrive]);

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
        if (plot) {
          event.preventDefault();
          setHot(plot.id);
          onEnterRef.current(plot.chapter, plot.exhibit);
        }
      }
    };

    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest(".lot__chrome, .lot__guide, .lot__dock, .lot__sheet, .lot__toast, .lot__prompt, .lot__scrap, .lot__hero")) return;
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
      if ((event.target as HTMLElement).closest(".lot__plot, .lot__scrap, .lot__hero")) return;
      const cell = screenToCell(event.clientX, event.clientY);
      if (!cell) return;
      dest.current = collide(cell.x, cell.y);
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cam.current.zoom = Math.min(1.45, Math.max(0.46, cam.current.zoom - event.deltaY * 0.0012));
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
        cam.current.y += (-sy * cam.current.zoom + 28 - cam.current.y) * 0.08;
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
    setHot(plot.id);
    onEnter(plot.chapter, plot.exhibit);
  }

  return (
    <div
      ref={wrapRef}
      className={`lot lot--street ${quiet ? "is-quiet" : ""}`}
      style={{ ["--develop" as string]: String(develop) }}
    >
      <div ref={rigRef} className="lot__rig">
        <div ref={isoRef} className="lot__iso">
          <div className="lot__ground" aria-hidden />
          <div className="lot__halo" aria-hidden />
          <div className="lot__plaza" aria-hidden />
          <div className="lot__ring" aria-hidden />
          {LOT_PATHS.map((path) => (
            <span
              key={`${path.x}-${path.y}`}
              className="lot__spoke"
              style={{
                width: path.length * CELL,
                transform: `translate3d(${path.x * CELL}px, ${path.y * CELL}px, 0) translate(-50%, -50%) rotate(${path.angle}deg)`,
              }}
            />
          ))}
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
                  setToast(scrap.label);
                }}
                aria-label={`Pick up ${scrap.label}`}
              >
                <span className="lot__scrap-dot" />
                <span className="lot__scrap-label">{scrap.label}</span>
              </button>
            ),
          )}
          <button
            type="button"
            className="lot__hero"
            onClick={() => onEnter("about")}
            aria-label="Open About"
          >
            <span className="lot__hero-glow" aria-hidden />
            <Portrait className="lot__hero-print" />
          </button>
          {LOT_PLOTS.map((plot, index) => {
            const width = plot.w * CELL;
            const depth = plot.d * CELL;
            const height = plot.h * CELL;
            const shot = shift.visited.includes(plot.id);
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
                  ["--float-delay" as string]: `${index * 0.22}s`,
                }}
                onMouseEnter={() => setHot(plot.id)}
                onClick={() => pick(plot)}
                aria-label={`Open ${plot.label}`}
              >
                <span className="lot__face lot__face--south" />
                <span className="lot__face lot__face--east" />
                <span className="lot__face lot__face--north" />
                <span className="lot__face lot__face--west" />
                <span className="lot__face lot__face--top" />
                <span className="lot__tag">
                  <small>{plot.dates}</small>
                  {plot.label}
                  <em>{plot.kicker}</em>
                </span>
              </button>
            );
          })}
          <div ref={walkerRef} className="lot__walker" aria-hidden>
            <span className="lot__walker-shadow" />
            <span className="lot__walker-body" />
            <span className="lot__walker-head" />
          </div>
        </div>
      </div>

      <p className="lot__walk">Experience · WASD · click a company</p>

      {near && !quiet ? (
        <p className="lot__prompt">
          E · <strong>{near.label}</strong>
        </p>
      ) : null}

      {toast ? <p className="lot__toast">{toast}</p> : null}

      <nav className="lot__dock" aria-label="Companies">
        {LOT_PLOTS.map((plot) => (
          <button
            key={plot.id}
            type="button"
            className={`${hot === plot.id ? "is-on" : ""} ${shift.visited.includes(plot.id) ? "is-shot" : ""}`}
            onClick={() => {
              setHot(plot.id);
              onEnter(plot.chapter, plot.exhibit);
            }}
          >
            {plot.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
