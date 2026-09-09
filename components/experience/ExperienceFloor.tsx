"use client";

import { useEffect, useRef, useState } from "react";
import { EXPERIENCE_ORBIT, EXPERIENCE_RINGS, type OrbitSeat } from "@/lib/experience";

type ExperienceFloorProps = {
  opened: string[];
  quiet?: boolean;
  onOpen: (id: string) => void;
  onStreet: () => void;
};

export function ExperienceFloor({ opened, quiet = false, onOpen, onStreet }: ExperienceFloorProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const home = EXPERIENCE_ORBIT[0];
  const ang = useRef({ yaw: home ? -home.yaw : 0, pitch: 8, vy: 0.02, vp: 0 });
  const drag = useRef({ on: false, lx: 0, ly: 0, moved: 0 });
  const look = useRef<{ yaw: number; pitch: number } | null>(null);
  const quietRef = useRef(quiet);
  quietRef.current = quiet;
  const [hot, setHot] = useState(home?.id ?? "mentionx");
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
    if (reducedRef.current) ang.current.vy = 0;
    paint();

    const onDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest(".xp__chrome, .xp__strip, .xp__hint")) return;
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
      ang.current.vy = dx * 0.16;
      ang.current.vp = -dy * 0.1;
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
      if (quietRef.current || document.hidden) return;
      if (look.current) {
        ang.current.yaw += (look.current.yaw - ang.current.yaw) * 0.08;
        ang.current.pitch += (look.current.pitch - ang.current.pitch) * 0.08;
        if (Math.abs(look.current.yaw - ang.current.yaw) < 0.2) look.current = null;
        paint();
        return;
      }
      if (drag.current.on || reducedRef.current) return;
      const idle = Math.abs(ang.current.vy) < 0.02 && Math.abs(ang.current.vp) < 0.02;
      ang.current.yaw += idle ? 0.018 : ang.current.vy;
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

  function face(seat: OrbitSeat) {
    look.current = { yaw: -seat.yaw, pitch: Math.max(-22, Math.min(22, -seat.pitch * 0.35)) };
    setHot(seat.id);
  }

  function pick(seat: OrbitSeat) {
    if (drag.current.moved > 12) return;
    face(seat);
    onOpen(seat.id);
  }

  const current = EXPERIENCE_ORBIT.find((seat) => seat.id === hot) ?? EXPERIENCE_ORBIT[0];

  return (
    <div ref={wrapRef} className={`xp xp--sphere${quiet ? " is-quiet" : ""}`}>
      <div className="xp__stage">
        <div ref={rigRef} className="xp__rig">
          <div className="xp__core" aria-hidden />
          {EXPERIENCE_RINGS.meridians.map((deg) => (
            <i key={`m-${deg}`} className="xp__ring xp__ring--meridian" style={{ transform: `rotateY(${deg}deg)` }} />
          ))}
          {EXPERIENCE_RINGS.parallels.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <i
                key={`p-${deg}`}
                className="xp__ring xp__ring--parallel"
                style={{
                  transform: `translateY(calc(var(--xp-r) * ${Math.sin(rad)})) rotateX(90deg) scale(${Math.cos(rad)})`,
                }}
              />
            );
          })}
          {EXPERIENCE_ORBIT.map((seat) => (
            <button
              key={seat.id}
              type="button"
              data-yaw={seat.yaw}
              data-pitch={seat.pitch}
              className={`xp__card${seat.featured ? " is-feature" : ""}${hot === seat.id ? " is-hot" : ""}${opened.includes(seat.id) ? " is-read" : ""}`}
              style={{ transform: `rotateY(${seat.yaw}deg) rotateX(${seat.pitch}deg) translateZ(var(--xp-r))` }}
              onMouseEnter={() => setHot(seat.id)}
              onFocus={() => setHot(seat.id)}
              onClick={() => pick(seat)}
              aria-label={`Open ${seat.short}`}
            >
              <span className="xp__recto">
                <em>{seat.index}</em>
                <b>{seat.short}</b>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="xp__chrome">
        <p className="xp__now">{current.short}</p>
        <button type="button" className="xp__enter" onClick={onStreet}>
          Enter the street
        </button>
      </div>

      <p className="xp__hint">Drag</p>

      <nav className="xp__strip" aria-label="Seats">
        {EXPERIENCE_ORBIT.map((seat) => (
          <button
            key={seat.id}
            type="button"
            className={`${hot === seat.id ? "is-on" : ""} ${opened.includes(seat.id) ? "is-read" : ""}`}
            onClick={() => {
              face(seat);
              onOpen(seat.id);
            }}
          >
            {seat.short}
          </button>
        ))}
      </nav>
    </div>
  );
}
