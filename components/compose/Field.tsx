"use client";

import { useEffect, useRef } from "react";
import { NODES, type FieldNode } from "@/lib/compose";

type Body = FieldNode & { x: number; y: number; vx: number; vy: number };

type Pulse = { x: number; y: number; r: number; a: number };

type FieldProps = {
  highlight?: string;
  onPick: (id: string) => void;
};

export function Field({ highlight, onPick }: FieldProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const bodies = useRef<Body[]>([]);
  const labels = useRef<Map<string, HTMLButtonElement>>(new Map());
  const pulses = useRef<Pulse[]>([]);
  const trail = useRef<{ x: number; y: number }[]>([]);
  const sparks = useRef(
    Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.04 + Math.random() * 0.08,
    })),
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    bodies.current = NODES.map((node, i) => {
      const a = (i / NODES.length) * Math.PI * 2;
      const radius = 0.18 + (i % 5) * 0.035;
      return {
        ...node,
        x: w / 2 + Math.cos(a) * w * radius,
        y: h / 2 + Math.sin(a) * h * radius,
        vx: Math.cos(a + 1.2) * 0.55,
        vy: Math.sin(a + 1.2) * 0.55,
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
      mouse.current.x = (event.clientX - box.left) / box.width;
      mouse.current.y = (event.clientY - box.top) / box.height;
    };
    const onDown = (event: PointerEvent) => {
      const box = wrap.getBoundingClientRect();
      pulses.current.push({
        x: event.clientX - box.left,
        y: event.clientY - box.top,
        r: 12,
        a: 1,
      });
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onDown);

    const tick = (time: number) => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const mx = mouse.current.x * w;
      const my = mouse.current.y * h;
      const list = bodies.current;
      const t = time / 1000;

      if (!reduced) {
        for (let i = 0; i < list.length; i += 1) {
          const a = list[i];
          const dx = mx - a.x;
          const dy = my - a.y;
          const dist = Math.max(36, Math.hypot(dx, dy));
          const hot = Boolean(highlight && a.chapter === highlight);
          const pull = hot ? 0.0011 : 0.00038;
          a.vx += (dx / dist) * pull * 110;
          a.vy += (dy / dist) * pull * 110;
          a.vx += (w / 2 - a.x) * 0.00009;
          a.vy += (h / 2 - a.y) * 0.00009;
          a.vx += Math.cos(t * 0.7 + i) * 0.015;
          a.vy += Math.sin(t * 0.55 + i) * 0.015;
          for (let j = i + 1; j < list.length; j += 1) {
            const b = list[j];
            const rx = a.x - b.x;
            const ry = a.y - b.y;
            const d2 = Math.max(48, rx * rx + ry * ry);
            const force = 320 / d2;
            a.vx += rx * force * 0.018;
            a.vy += ry * force * 0.018;
            b.vx -= rx * force * 0.018;
            b.vy -= ry * force * 0.018;
          }
          a.vx *= 0.935;
          a.vy *= 0.935;
          a.x += a.vx;
          a.y += a.vy;
          a.x = Math.max(48, Math.min(w - 48, a.x));
          a.y = Math.max(64, Math.min(h - 88, a.y));
        }
      }

      ctx.clearRect(0, 0, w, h);

      for (const spark of sparks.current) {
        spark.y -= spark.v * 0.35;
        if (spark.y < 0) spark.y = 1;
        ctx.fillStyle = "rgba(200, 245, 66, 0.18)";
        ctx.fillRect(spark.x * w, spark.y * h, 1.5, 1.5);
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < list.length; i += 1) {
        for (let j = i + 1; j < list.length; j += 1) {
          const d = Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y);
          if (d < 180) {
            ctx.globalAlpha = (1 - d / 180) * 0.55;
            ctx.strokeStyle = "#c8f542";
            ctx.beginPath();
            ctx.moveTo(list[i].x, list[i].y);
            const cx = (list[i].x + list[j].x) / 2 + Math.sin(t + i) * 12;
            const cy = (list[i].y + list[j].y) / 2 + Math.cos(t + j) * 12;
            ctx.quadraticCurveTo(cx, cy, list[j].x, list[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      trail.current.push({ x: mx, y: my });
      if (trail.current.length > 18) trail.current.shift();
      if (trail.current.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(200, 245, 66, 0.45)";
        ctx.lineWidth = 2;
        trail.current.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      ctx.save();
      ctx.translate(mx, my);
      ctx.strokeStyle = "rgba(200, 245, 66, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, 46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.setLineDash([3, 7]);
      ctx.arc(0, 0, 62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.rotate(t * 1.4);
      ctx.fillStyle = "#c8f542";
      for (let i = 0; i < 12; i += 1) {
        ctx.rotate(Math.PI / 6);
        ctx.fillRect(50, -1, i % 3 === 0 ? 12 : 7, 2);
      }
      ctx.restore();
      ctx.beginPath();
      ctx.fillStyle = "#c8f542";
      ctx.arc(mx, my, 2.6, 0, Math.PI * 2);
      ctx.fill();

      pulses.current = pulses.current.filter((pulse) => pulse.a > 0.05);
      for (const pulse of pulses.current) {
        pulse.r += 7;
        pulse.a *= 0.92;
        ctx.strokeStyle = `rgba(200, 245, 66, ${pulse.a})`;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const body of list) {
        const el = labels.current.get(body.id);
        if (!el) continue;
        const speed = Math.hypot(body.vx, body.vy);
        const stretch = 1 + Math.min(0.42, speed * 0.07);
        const skew = Math.max(-18, Math.min(18, -body.vx * 1.6));
        el.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) translate(-50%, -50%) skewX(${skew}deg) scale(${stretch}, ${1 / stretch})`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onDown);
    };
  }, [highlight]);

  return (
    <div ref={wrapRef} className="field">
      <canvas ref={canvasRef} className="field__canvas" />
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
      <p className="field__hint">Drag the field · click a fragment · keys 1–4</p>
    </div>
  );
}
