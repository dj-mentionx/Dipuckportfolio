"use client";

import { useEffect, useRef, useState } from "react";
import { Portrait } from "@/components/compose/Portrait";
import { matchesFilter, RACK_PRINTS, type RackFilter, type RackPrint } from "@/lib/rack";

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
  const ang = useRef({ yaw: home ? -home.yaw : 0, pitch: 8, vy: 0, vp: 0 });
  const drag = useRef({ on: false, lx: 0, ly: 0, moved: 0 });
  const look = useRef<{ yaw: number; pitch: number } | null>(null);
  const quietRef = useRef(quiet);
  quietRef.current = quiet;
  const [hot, setHot] = useState("hq");
  const [filter, setFilter] = useState<RackFilter>("all");
  const reducedRef = useRef(false);

  function paint() {
    if (!rigRef.current) return;
    const { yaw, pitch } = ang.current;
    rigRef.current.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
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
      ang.current.pitch = Math.max(-38, Math.min(38, ang.current.pitch - dy * 0.28));
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
      ang.current.pitch = Math.max(-38, Math.min(38, ang.current.pitch - event.deltaY * 0.04));
      paint();
    };

    let raf = 0;
    const tick = () => {
      raf = window.requestAnimationFrame(tick);
      if (quietRef.current) return;
      if (look.current) {
        ang.current.yaw += (look.current.yaw - ang.current.yaw) * 0.08;
        ang.current.pitch += (look.current.pitch - ang.current.pitch) * 0.08;
        if (Math.abs(look.current.yaw - ang.current.yaw) < 0.2) look.current = null;
        paint();
        return;
      }
      if (drag.current.on || reducedRef.current) return;
      ang.current.yaw += ang.current.vy + 0.045;
      ang.current.pitch = Math.max(-38, Math.min(38, ang.current.pitch + ang.current.vp));
      ang.current.vy *= 0.94;
      ang.current.vp *= 0.9;
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
    look.current = { yaw: -print.yaw, pitch: Math.max(-28, Math.min(28, -print.pitch * 0.35)) };
    setHot(print.id);
  }

  function pick(print: RackPrint) {
    if (drag.current.moved > 12) return;
    face(print);
    onEnter(print.chapter, print.exhibit);
  }

  const current = RACK_PRINTS.find((print) => print.id === hot) ?? RACK_PRINTS[0];
  const index = RACK_PRINTS.findIndex((print) => print.id === hot) + 1;

  return (
    <div ref={wrapRef} className={`rack ${quiet ? "is-quiet" : ""}`}>
      <div className="rack__stage">
        <div ref={rigRef} className="rack__rig">
          <div className="rack__core" aria-hidden />
          {RACK_PRINTS.map((print) => (
            <button
              key={print.id}
              type="button"
              className={`rack__print kind-${print.kind} ${hot === print.id ? "is-hot" : ""} ${visited.includes(print.id) ? "is-shot" : ""} ${matchesFilter(print, filter) ? "" : "is-dim"}`}
              style={{
                transform: `rotateY(${print.yaw}deg) rotateX(${print.pitch}deg) translateZ(var(--rack-r))`,
              }}
              onMouseEnter={() => setHot(print.id)}
              onFocus={() => setHot(print.id)}
              onClick={() => pick(print)}
              aria-label={`Open ${print.label}`}
            >
              {print.kind === "hq" ? <Portrait className="rack__face" /> : <strong>{print.figure || print.label.slice(0, 2)}</strong>}
              <span>
                <small>{print.kicker}</small>
                {print.label}
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
            Enter the lot
          </button>
          <button type="button" className="lot__ui lot__ui--ghost" onClick={onClassic}>
            Classic lockup
          </button>
        </div>
      </div>

      <p className="rack__hint">
        Drag to rotate · Click a print
      </p>

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
