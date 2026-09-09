"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SKILL_CHIPS, SKILLS, type Skill, type SkillChip } from "@/lib/skills";

type ExperienceFloorProps = {
  quiet?: boolean;
  onStreet: () => void;
};

type PlacedChip = SkillChip & { yaw: number; pitch: number; radius: number };

function place(chip: SkillChip): PlacedChip {
  const radius = Math.hypot(chip.x, chip.y, chip.z) || 1;
  return {
    ...chip,
    radius,
    yaw: (Math.atan2(chip.x, chip.z) * 180) / Math.PI,
    pitch: (-Math.asin(chip.y / radius) * 180) / Math.PI,
  };
}

export function ExperienceFloor({ quiet = false, onStreet }: ExperienceFloorProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const chips = useMemo(() => SKILL_CHIPS.map(place), []);
  const featured = useMemo(() => chips.filter((chip) => chip.featured), [chips]);
  const ang = useRef({ yaw: 18, pitch: 12, vy: 0.085, vp: 0 });
  const drag = useRef({ on: false, lx: 0, ly: 0, moved: 0 });
  const look = useRef<{ yaw: number; pitch: number } | null>(null);
  const quietRef = useRef(quiet);
  quietRef.current = quiet;
  const [hot, setHot] = useState(SKILLS[0].id);
  const reducedRef = useRef(false);

  function paint() {
    const rig = rigRef.current;
    if (!rig) return;
    const { yaw, pitch } = ang.current;
    rig.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
    rig.style.setProperty("--yaw", `${yaw}deg`);
    rig.style.setProperty("--pitch", `${pitch}deg`);
    rig.querySelectorAll<HTMLElement>("[data-yaw]").forEach((node) => {
      const py = Number(node.dataset.yaw);
      const pp = Number(node.dataset.pitch);
      const face = Math.max(
        0,
        Math.cos(((yaw + py) * Math.PI) / 180) * Math.cos(((pitch + pp) * Math.PI) / 180),
      );
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
      ang.current.yaw += dx * 0.42;
      ang.current.pitch = Math.max(-42, Math.min(42, ang.current.pitch - dy * 0.3));
      ang.current.vy = dx * 0.18;
      ang.current.vp = -dy * 0.1;
      paint();
    };
    const onUp = () => {
      drag.current.on = false;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      look.current = null;
      ang.current.yaw += event.deltaX * 0.1;
      ang.current.pitch = Math.max(-42, Math.min(42, ang.current.pitch - event.deltaY * 0.05));
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
      const idle = Math.abs(ang.current.vy) < 0.03 && Math.abs(ang.current.vp) < 0.03;
      ang.current.yaw += idle ? 0.055 : ang.current.vy;
      ang.current.pitch = Math.max(-42, Math.min(42, ang.current.pitch + ang.current.vp));
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

  function face(chip: PlacedChip) {
    look.current = { yaw: -chip.yaw, pitch: Math.max(-22, Math.min(22, -chip.pitch * 0.4)) };
    setHot(chip.skillId);
  }

  function pick(chip: PlacedChip) {
    if (drag.current.moved > 12) return;
    face(chip);
  }

  const current: Skill = SKILLS.find((skill) => skill.id === hot) ?? SKILLS[0];

  return (
    <div ref={wrapRef} className={`xp xp--sphere xp--skills${quiet ? " is-quiet" : ""}`}>
      <div className="xp__stage">
        <div ref={rigRef} className="xp__rig">
          <div className="xp__core" aria-hidden />
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <i key={`m-${deg}`} className="xp__ring xp__ring--meridian" style={{ transform: `rotateY(${deg}deg)` }} />
          ))}
          {[-48, -24, 0, 24, 48].map((deg) => {
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
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              data-yaw={chip.yaw}
              data-pitch={chip.pitch}
              className={`xp__chip${chip.featured ? " is-feature" : " is-echo"}${hot === chip.skillId ? " is-hot" : ""}`}
              style={{
                transform: `rotateY(${chip.yaw}deg) rotateX(${chip.pitch}deg) translateZ(calc(var(--xp-r) * ${chip.radius}))`,
              }}
              onMouseEnter={() => setHot(chip.skillId)}
              onFocus={() => setHot(chip.skillId)}
              onClick={() => pick(chip)}
              aria-label={chip.name}
            >
              <span className="xp__chip-face">{chip.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="xp__chrome">
        <p className="xp__now">
          <small>Skills</small>
          {current.name}
        </p>
        <p className="xp__line">{current.blurb}</p>
        <button type="button" className="xp__enter" onClick={onStreet}>
          Enter the street
        </button>
      </div>

      <p className="xp__hint">Drag · spin</p>

      <nav className="xp__strip" aria-label="Skills">
        {featured.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={hot === chip.skillId ? "is-on" : ""}
            onClick={() => face(chip)}
          >
            {chip.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
