"use client";

import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/compose/Portrait";
import { matchesFilter, RACK_CELLS, RACK_FILL, RACK_PRINTS, RACK_RINGS, type RackFilter, type RackPrint } from "@/lib/rack";

type RackProps = {
  onEnter: (chapter: "about" | "work" | "bomb" | "contact", exhibit?: string) => void;
  onLot: () => void;
  onClassic: () => void;
  quiet?: boolean;
  visited?: string[];
};

export function Rack({ onEnter, onLot, onClassic, quiet = false, visited = [] }: RackProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const home = RACK_PRINTS.find((print) => print.id === "hq");
  const ang = useRef({ yaw: home ? -home.yaw : 0, pitch: 10, vy: 0, vp: 0 });
  const drag = useRef({ on: false, lx: 0, ly: 0, moved: 0 });
  const look = useRef<{ yaw: number; pitch: number } | null>(null);
  const quietRef = useRef(quiet);
  quietRef.current = quiet;
  const [hot, setHot] = useState("hq");
  const [filter, setFilter] = useState<RackFilter>("all");
  const reducedRef = useRef(false);

  function paint() {
    const rig = rigRef.current;
    if (!rig) return;
    const { yaw, pitch } = ang.current;
    rig.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
    rig.querySelectorAll<HTMLElement>("[data-yaw]").forEach((node) => {
      const py = Number(node.dataset.yaw);
      const pp = Number(node.dataset.pitch);
      const face = Math.max(0, Math.cos(((yaw + py) * Math.PI) / 180) * Math.cos(((pitch + pp) * Math.PI) / 180));
      node.style.setProperty("--face", face.toFixed(3));
    });
  }

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint();

    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest(".rack__chrome, .rack__strip, .rack__hint")) return;
      wrap.setPointerCapture(event.pointerId);
      look.current = null;
      drag.current = { on: true, lx: event.clientX, ly: event.clientY, moved: 0 };
    };
    const onMove = (event: PointerEvent) => {
      if (!drag.current.on) return;
      const dx = event.clientX - drag.current.lx;
      const dy = event.clientY - drag.current.ly;
      drag.current.moved += Math.abs(dx) + Math.abs(dy);
      drag.current.lx = event.clientX;
      drag.current.ly = event.clientY;
      ang.current.yaw += dx * 0.38;
      ang.current.pitch = Math.max(-42, Math.min(42, ang.current.pitch - dy * 0.28));
      ang.current.vy = dx * 0.18;
      ang.current.vp = -dy * 0.12;
      paint();
    };
    const onUp = () => {
      drag.current.on = false;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      look.current = null;
      ang.current.yaw += event.deltaX * 0.08;
      ang.current.pitch = Math.max(-42, Math.min(42, ang.current.pitch - event.deltaY * 0.04));
      paint();
    };

    let raf = 0;
    const tick = () => {
      raf = window.requestAnimationFrame(tick);
      if (quietRef.current || document.hidden) return;
      if (look.current) {
        ang.current.yaw += (look.current.yaw - ang.current.yaw) * 0.08;
        ang.current.pitch += (look.current.pitch - ang.current.pitch) * 0.08;
        if (Math.abs(look.current.yaw - ang.current.yaw) < 0.2) look.current = null;
        paint();
        return;
      }
      if (drag.current.on || reducedRef.current) return;
      const coasting = Math.abs(ang.current.vy) > 0.02 || Math.abs(ang.current.vp) > 0.02;
      if (!coasting) return;
      ang.current.yaw += ang.current.vy;
      ang.current.pitch = Math.max(-42, Math.min(42, ang.current.pitch + ang.current.vp));
      ang.current.vy *= 0.92;
      ang.current.vp *= 0.88;
      paint();
    };
    raf = window.requestAnimationFrame(tick);

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.cancelAnimationFrame(raf);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("wheel", onWheel);
    };
  }, []);

  function face(print: RackPrint) {
    look.current = { yaw: -print.yaw, pitch: Math.max(-24, Math.min(24, -print.pitch * 0.4)) };
    setHot(print.id);
  }

  function pick(print: RackPrint) {
    if (drag.current.moved > 12) return;
    face(print);
    onEnter(print.chapter, print.exhibit);
  }

  const current = RACK_PRINTS.find((print) => print.id === hot) ?? RACK_PRINTS[0];
  const index = current.index + 1;

  return (
    <div ref={wrapRef} className={`rack ${quiet ? "is-quiet" : ""}`}>
      <div className="rack__stage">
        <div ref={rigRef} className="rack__rig">
          <div className="rack__core" aria-hidden />
          {RACK_RINGS.meridians.map((deg) => (
            <i key={`m-${deg}`} className="rack__ring rack__ring--meridian" style={{ transform: `rotateY(${deg}deg)` }} />
          ))}
          {RACK_RINGS.parallels.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <i
                key={`p-${deg}`}
                className="rack__ring rack__ring--parallel"
                style={{
                  transform: `translateY(calc(var(--rack-r) * ${Math.sin(rad)})) rotateX(90deg) scale(${Math.cos(rad)})`,
                }}
              />
            );
          })}
          {RACK_FILL.map((fill) => (
            <span
              key={fill.id}
              className="rack__fill"
              style={{ transform: `rotateY(${fill.yaw}deg) rotateX(${fill.pitch}deg) translateZ(var(--rack-r))` }}
              aria-hidden
            />
          ))}
          {RACK_CELLS.map((cell) => (
            <span
              key={cell.id}
              className="rack__cell"
              style={{ transform: `rotateY(${cell.yaw}deg) rotateX(${cell.pitch}deg) translateZ(calc(var(--rack-r) * 0.62))` }}
              aria-hidden
            >
              {String(cell.index + 1).padStart(2, "0")}
            </span>
          ))}
          {RACK_PRINTS.map((print) => (
            <button
              key={print.id}
              type="button"
              data-yaw={print.yaw}
              data-pitch={print.pitch}
              className={`rack__print kind-${print.kind} ${hot === print.id ? "is-hot" : ""} ${visited.includes(print.id) ? "is-shot" : ""} ${matchesFilter(print, filter) ? "" : "is-dim"}`}
              style={{ transform: `rotateY(${print.yaw}deg) rotateX(${print.pitch}deg) translateZ(var(--rack-r))` }}
              onMouseEnter={() => setHot(print.id)}
              onFocus={() => setHot(print.id)}
              onClick={() => pick(print)}
              aria-label={`Open ${print.label}`}
            >
              <span className="rack__recto">
                <em>{String(print.index + 1).padStart(2, "0")}</em>
                {print.kind === "hq" ? <Portrait className="rack__face" /> : <strong>{print.figure || print.label.slice(0, 2)}</strong>}
                <span>
                  <small>{print.kicker}</small>
                  {print.label}
                </span>
              </span>
              <span className="rack__verso">
                <small>{print.kicker}</small>
                <b>{print.label}</b>
                {print.verso}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rack__chrome">
        <p className="rack__brand">
          THE RACK
          <strong>CONTACT SHEET</strong>
        </p>
        <p className="rack__count">
          {String(index).padStart(2, "0")} / {String(RACK_PRINTS.length).padStart(2, "0")}
        </p>
        <p className="rack__now">
          <small>{current.kicker}</small>
          {current.label}
        </p>
        <p className="rack__line">{current.line}</p>
        <div className="rack__filters" role="tablist" aria-label="Print sets">
          {(
            [
              ["all", "All"],
              ["seats", "Seats"],
              ["signals", "Signals"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className={filter === id ? "is-on" : ""} onClick={() => setFilter(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="rack__row">
          <button type="button" className="lot__ui lot__ui--ghost" onClick={onLot}>
            Enter experience
          </button>
          <button type="button" className="lot__ui lot__ui--ghost" onClick={onClassic}>
            Classic lockup
          </button>
        </div>
      </div>

      <p className="rack__hint">Drag to rotate · Click a print</p>

      <nav className="rack__strip" aria-label="Prints">
        {RACK_PRINTS.filter((print) => matchesFilter(print, filter)).map((print) => (
          <button
            key={print.id}
            type="button"
            className={`${hot === print.id ? "is-on" : ""} ${visited.includes(print.id) ? "is-shot" : ""}`}
            onClick={() => {
              face(print);
              onEnter(print.chapter, print.exhibit);
            }}
          >
            {print.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
