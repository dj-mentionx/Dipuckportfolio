"use client";

import { useEffect, useRef } from "react";
import { NODES, type FieldNode } from "@/lib/compose";
import { Portrait } from "./Portrait";

type Body = FieldNode & { x: number; y: number; vx: number; vy: number };

type Pulse = { x: number; y: number; r: number; a: number };
type Burst = { x: number; y: number; vx: number; vy: number; a: number };
type Burn = { id: string; label: string; x: number; y: number; a: number; rot: number; el: HTMLSpanElement };

type FieldProps = {
  highlight?: string;
  onPick: (id: string) => void;
};

export function Field({ highlight, onPick }: FieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLButtonElement>(null);
  const burnsRef = useRef<HTMLDivElement>(null);
  const exposure = useRef(0.05);
  const armed = useRef(false);
  const burns = useRef<Burn[]>([]);
  const lastBurn = useRef<Map<string, number>>(new Map());
  const mouse = useRef({ x: 0.12, y: 0.16, vx: 0, vy: 0 });
  const bodies = useRef<Body[]>([]);
  const labels = useRef<Map<string, HTMLButtonElement>>(new Map());
  const pulses = useRef<Pulse[]>([]);
  const bursts = useRef<Burst[]>([]);
  const trail = useRef<{ x: number; y: number }[]>([]);
  const sparks = useRef(
    Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.03 + Math.random() * 0.1,
      p: Math.random() * Math.PI * 2,
    })),
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    bodies.current = NODES.map((node, i) => {
      const a = (i / NODES.length) * Math.PI * 2;
      const radius = 0.18 + (i % 5) * 0.045;
      const slice = i % 5 === 0;
      const chin = i === 4;
      return {
        ...node,
        x: chin ? w / 2 - 36 : slice ? w / 2 + (i % 2 ? -160 : 160) : w / 2 + Math.cos(a) * w * radius,
        y: chin ? h * 0.48 + 72 : slice ? h * 0.48 + ((i / 5) % 2 ? 40 : -30) : h / 2 + Math.sin(a) * h * radius,
        vx: chin ? 2.6 : slice ? (i % 2 ? 3.2 : -3.2) : Math.cos(a + 1.2) * 1.2,
        vy: chin ? -0.15 : slice ? 0.35 : Math.sin(a + 1.2) * 1.2,
      };
    });
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = wrap.clientWidth * dpr;
      canvas.height = wrap.clientHeight * dpr;
      canvas.style.width = `${wrap.clientWidth}px`;
      canvas.style.height = `${wrap.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (event: PointerEvent) => {
      const box = wrap.getBoundingClientRect();
      const nx = (event.clientX - box.left) / box.width;
      const ny = (event.clientY - box.top) / box.height;
      armed.current = true;
      mouse.current.vx = nx - mouse.current.x;
      mouse.current.vy = ny - mouse.current.y;
      mouse.current.x = nx;
      mouse.current.y = ny;
    };
    const onDown = (event: PointerEvent) => {
      const box = wrap.getBoundingClientRect();
      const px = event.clientX - box.left;
      const py = event.clientY - box.top;
      pulses.current.push({ x: px, y: py, r: 10, a: 1 });
      pulses.current.push({ x: px, y: py, r: 4, a: 1 });
      for (let i = 0; i < 16; i += 1) {
        const a = (i / 16) * Math.PI * 2;
        bursts.current.push({
          x: px,
          y: py,
          vx: Math.cos(a) * (4 + Math.random() * 6),
          vy: Math.sin(a) * (4 + Math.random() * 6),
          a: 1,
        });
      }
      for (const body of bodies.current) {
        const dx = body.x - px;
        const dy = body.y - py;
        const dist = Math.max(28, Math.hypot(dx, dy));
        const mag = 2200 / dist;
        body.vx += (dx / dist) * mag * 0.09;
        body.vy += (dy / dist) * mag * 0.09;
      }
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onDown);

    const tick = (time: number) => {
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const mx = mouse.current.x * w;
      const my = mouse.current.y * h;
      const mvx = mouse.current.vx * w;
      const mvy = mouse.current.vy * h;
      const list = bodies.current;
      const t = time / 1000;

      if (!reduced) {
        for (let i = 0; i < list.length; i += 1) {
          const a = list[i];
          const dx = mx - a.x;
          const dy = my - a.y;
          const dist = Math.max(28, Math.hypot(dx, dy));
          const hot = Boolean(highlight && a.chapter === highlight);
          const pull = hot ? 0.00135 : 0.00042;
          a.vx += (dx / dist) * pull * 120;
          a.vy += (dy / dist) * pull * 120;
          if (dist < 150) {
            a.vx += mvx * 0.12;
            a.vy += mvy * 0.12;
          }
          a.vx += (w / 2 - a.x) * 0.00011;
          a.vy += (h / 2 - a.y) * 0.00011;
          const cdx = a.x - w / 2;
          const cdy = a.y - h * 0.48;
          const cd = Math.max(24, Math.hypot(cdx, cdy));
          const printR = Math.min(w * 0.17, 160);
          if (cd < printR * 0.34) {
            a.vx += (cdx / cd) * 0.22;
            a.vy += (cdy / cd) * 0.22;
          }
          a.vx += Math.cos(t * 0.85 + i) * 0.03;
          a.vy += Math.sin(t * 0.7 + i * 0.9) * 0.03;
          for (let j = i + 1; j < list.length; j += 1) {
            const b = list[j];
            const rx = a.x - b.x;
            const ry = a.y - b.y;
            const d2 = Math.max(64, rx * rx + ry * ry);
            const force = 380 / d2;
            a.vx += rx * force * 0.02;
            a.vy += ry * force * 0.02;
            b.vx -= rx * force * 0.02;
            b.vy -= ry * force * 0.02;
          }
          a.vx *= 0.91;
          a.vy *= 0.91;
          a.x += a.vx;
          a.y += a.vy;
          a.x = Math.max(56, Math.min(w - 56, a.x));
          a.y = Math.max(72, Math.min(h - 96, a.y));
        }
      }

      ctx.clearRect(0, 0, w, h);

      for (const spark of sparks.current) {
        const n = Math.sin(spark.x * 8 + t * 0.7 + spark.p) + Math.cos(spark.y * 7 - t * 0.5);
        spark.x += Math.cos(n * Math.PI) * 0.0018 + (mouse.current.x - spark.x) * 0.006;
        spark.y += Math.sin(n * Math.PI) * 0.0018 - spark.v * 0.002;
        if (spark.y < 0) spark.y = 1;
        if (spark.y > 1) spark.y = 0;
        if (spark.x < 0) spark.x = 1;
        if (spark.x > 1) spark.x = 0;
        ctx.fillStyle = "rgba(225, 6, 0, 0.22)";
        ctx.fillRect(spark.x * w, spark.y * h, 1.6, 1.6);
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < list.length; i += 1) {
        for (let j = i + 1; j < list.length; j += 1) {
          const d = Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y);
          if (d < 200) {
            ctx.globalAlpha = (1 - d / 200) * 0.5;
            ctx.strokeStyle = "#e10600";
            ctx.beginPath();
            ctx.moveTo(list[i].x, list[i].y);
            const cx = (list[i].x + list[j].x) / 2 + Math.sin(t + i) * 16;
            const cy = (list[i].y + list[j].y) / 2 + Math.cos(t + j) * 16;
            ctx.quadraticCurveTo(cx, cy, list[j].x, list[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      const ranked = [...list].sort((a, b) => Math.hypot(a.x - mx, a.y - my) - Math.hypot(b.x - mx, b.y - my));
      for (const node of ranked.slice(0, 3)) {
        const d = Math.hypot(node.x - mx, node.y - my);
        ctx.strokeStyle = `rgba(225, 6, 0, ${Math.max(0.15, 1 - d / 420)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      }
      ctx.lineWidth = 1;

      trail.current.push({ x: mx, y: my });
      if (trail.current.length > 22) trail.current.shift();
      if (trail.current.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(225, 6, 0, 0.5)";
        ctx.lineWidth = 2.4;
        trail.current.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      const speed = Math.min(1.8, Math.hypot(mvx, mvy) / 18);
      ctx.save();
      ctx.translate(mx, my);
      ctx.strokeStyle = "rgba(225, 6, 0, 0.9)";
      ctx.beginPath();
      ctx.arc(0, 0, 42 + speed * 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.setLineDash([4, 8]);
      ctx.arc(0, 0, 68 + speed * 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.rotate(t * 1.8);
      ctx.fillStyle = "#e10600";
      for (let i = 0; i < 16; i += 1) {
        ctx.rotate(Math.PI / 8);
        ctx.fillRect(54 + speed * 8, -1, i % 4 === 0 ? 14 : 7, 2);
      }
      ctx.restore();
      ctx.beginPath();
      ctx.fillStyle = "#e10600";
      ctx.arc(mx, my, 2.8, 0, Math.PI * 2);
      ctx.fill();

      pulses.current = pulses.current.filter((pulse) => pulse.a > 0.05);
      for (const pulse of pulses.current) {
        pulse.r += 9;
        pulse.a *= 0.9;
        ctx.strokeStyle = `rgba(225, 6, 0, ${pulse.a})`;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      bursts.current = bursts.current.filter((bit) => bit.a > 0.05);
      for (const bit of bursts.current) {
        bit.x += bit.vx;
        bit.y += bit.vy;
        bit.vx *= 0.94;
        bit.vy *= 0.94;
        bit.a *= 0.9;
        ctx.fillStyle = `rgba(225, 6, 0, ${bit.a})`;
        ctx.fillRect(bit.x, bit.y, 3, 3);
      }

      if (ghostRef.current) {
        const gx = (0.5 - mouse.current.x) * 70;
        const gy = (0.5 - mouse.current.y) * 40;
        ghostRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      }

      const face = faceRef.current;
      if (face) {
        const box = face.getBoundingClientRect();
        const wrapBox = wrap.getBoundingClientRect();
        const fx = (mx - (box.left - wrapBox.left)) / Math.max(1, box.width);
        const fy = (my - (box.top - wrapBox.top)) / Math.max(1, box.height);
        const onFace = armed.current && Math.hypot(fx - 0.5, fy - 0.5) < 0.56;
        exposure.current = Math.min(1, Math.max(0.05, exposure.current + (onFace ? 0.07 : -0.045)));
        face.style.setProperty("--lx", `${fx * 100}%`);
        face.style.setProperty("--ly", `${fy * 100}%`);
        face.style.setProperty("--ex", String(exposure.current));
        face.style.setProperty("--ox", String((fx - 0.5) * 18));
        face.style.setProperty("--oy", String((fy - 0.5) * 10));

        const faceCx = box.left - wrapBox.left + box.width / 2;
        const faceCy = box.top - wrapBox.top + box.height / 2;
        const faceR = box.width / 2;
        const beam = Math.hypot(mx - faceCx, my - faceCy);
        if (beam > 2 && beam < 620) {
          const fromC = Math.atan2(my - faceCy, mx - faceCx);
          const offset = Math.acos(Math.min(0.999, faceR / beam));
          const t1x = faceCx + Math.cos(fromC + offset) * faceR;
          const t1y = faceCy + Math.sin(fromC + offset) * faceR;
          const t2x = faceCx + Math.cos(fromC - offset) * faceR;
          const t2y = faceCy + Math.sin(fromC - offset) * faceR;
          ctx.save();
          const lamp = (0.2 + exposure.current * 0.22) * (1 - beam / 560);
          const beamGrad = ctx.createLinearGradient(mx, my, faceCx, faceCy);
          beamGrad.addColorStop(0, `rgba(225, 6, 0, ${Math.min(0.55, lamp + 0.18)})`);
          beamGrad.addColorStop(1, `rgba(225, 6, 0, ${lamp * 0.35})`);
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(mx, my);
          ctx.lineTo(t1x, t1y);
          ctx.arc(faceCx, faceCy, faceR, fromC + offset, fromC - offset, true);
          ctx.lineTo(t2x, t2y);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.fillStyle = `rgba(225, 6, 0, ${0.16 + exposure.current * 0.28})`;
          ctx.arc(faceCx, faceCy, faceR * (0.5 + exposure.current * 0.28), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.beginPath();
          ctx.fillStyle = "#e10600";
          ctx.arc(mx, my, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        const tray = burnsRef.current;
        if (tray) {
          for (const body of list) {
            const dx = body.x - faceCx;
            const dy = body.y - faceCy;
            const onPrint = Math.hypot(dx, dy) < faceR * 0.94;
            if (!onPrint) continue;
            body.vx *= 0.88;
            body.vy *= 0.88;
            const prev = lastBurn.current.get(body.id) ?? 0;
            if (time - prev < 640 || burns.current.length >= 12) continue;
            lastBurn.current.set(body.id, time);
            const stamp = document.createElement("span");
            stamp.className = "field__burn";
            stamp.textContent = body.label;
            tray.appendChild(stamp);
            burns.current.push({
              id: body.id,
              label: body.label,
              x: 0.5 + dx / box.width,
              y: 0.5 + dy / box.height,
              a: 0.92,
              rot: (body.vx + body.vy) * 4,
              el: stamp,
            });
          }
          burns.current = burns.current.filter((burn) => {
            burn.a *= 0.997;
            if (burn.a < 0.12) {
              burn.el.remove();
              return false;
            }
            burn.el.style.left = `${burn.x * 100}%`;
            burn.el.style.top = `${burn.y * 100}%`;
            burn.el.style.setProperty("--a", String(burn.a * (0.72 + exposure.current * 0.28)));
            burn.el.style.setProperty("--r", `${burn.rot}deg`);
            return true;
          });
        }

        for (const body of list) {
          const el = labels.current.get(body.id);
          if (!el) continue;
          const dist = Math.hypot(body.x - mx, body.y - my);
          const onPrint = Math.hypot(body.x - faceCx, body.y - faceCy) < faceR * 0.9;
          const speedN = Math.hypot(body.vx, body.vy);
          const stretch = 1 + Math.min(0.55, speedN * 0.08);
          const zoom = 1 + Math.max(0, 1 - dist / 260) * 0.42;
          const skew = Math.max(-22, Math.min(22, -body.vx * 1.8));
          const aberr = Math.min(10, speedN * 1.1);
          el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) translate(-50%, -50%) skewX(${skew}deg) scale(${stretch * zoom}, ${(1 / stretch) * zoom})`;
          el.style.textShadow = `${-aberr}px 0 0 rgba(225, 6, 0, 0.7), ${aberr}px 0 0 rgba(255, 255, 255, 0.28), 0 0 22px rgba(5,5,7,0.85)`;
          const behind = body.y < faceCy + faceR * 0.1;
          if (onPrint && behind) {
            el.style.zIndex = "3";
            el.style.opacity = "1";
          } else if (onPrint) {
            el.style.zIndex = "6";
            el.style.opacity = "0.22";
          } else {
            el.style.zIndex = behind ? "3" : "5";
            el.style.opacity = "1";
          }
        }
      } else {
        const faceMid = h * 0.48;
        for (const body of list) {
          const el = labels.current.get(body.id);
          if (!el) continue;
          const dist = Math.hypot(body.x - mx, body.y - my);
          const speedN = Math.hypot(body.vx, body.vy);
          const stretch = 1 + Math.min(0.55, speedN * 0.08);
          const zoom = 1 + Math.max(0, 1 - dist / 260) * 0.42;
          const skew = Math.max(-22, Math.min(22, -body.vx * 1.8));
          const aberr = Math.min(10, speedN * 1.1);
          el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) translate(-50%, -50%) skewX(${skew}deg) scale(${stretch * zoom}, ${(1 / stretch) * zoom})`;
          el.style.textShadow = `${-aberr}px 0 0 rgba(225, 6, 0, 0.7), ${aberr}px 0 0 rgba(255, 255, 255, 0.28), 0 0 22px rgba(5,5,7,0.85)`;
          el.style.zIndex = body.y < faceMid - 8 ? "3" : "6";
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onDown);
      burns.current.forEach((burn) => burn.el.remove());
      burns.current = [];
    };
  }, [highlight]);

  return (
    <div ref={wrapRef} className="field">
      <div className="field__crawl" aria-hidden>
        <div className="field__crawl-track">
          DIPUCK JONES — COMPOSE — LIVE LOCKUP — DIPUCK JONES — COMPOSE — LIVE LOCKUP —
        </div>
      </div>
      <div ref={ghostRef} className="field__ghost" aria-hidden>
        DJ
      </div>
      <canvas ref={canvasRef} className="field__canvas" />
      <button ref={faceRef} type="button" className="field__face" onClick={() => onPick("about")} aria-label="Develop portrait, open About">
        <Portrait live />
        <div ref={burnsRef} className="field__burns" aria-hidden />
      </button>
      {NODES.map((node) => (
        <button
          key={node.id}
          ref={(el) => {
            if (el) labels.current.set(node.id, el);
            else labels.current.delete(node.id);
          }}
          type="button"
          className={`field__node kind-${node.kind} ${highlight && node.chapter === highlight ? "is-hot" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onPick(node.chapter || node.id);
          }}
        >
          {node.label}
        </button>
      ))}
      <p className="field__hint">Hold the light · words burn in · Rack and lot are in the nav</p>
    </div>
  );
}
