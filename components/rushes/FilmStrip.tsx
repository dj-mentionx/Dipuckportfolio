"use client";

import { useEffect, useRef } from "react";
import type { PrintFrame } from "@/lib/frames";

type FilmStripProps = {
  frames: PrintFrame[];
  index: number;
  onIndex: (index: number) => void;
};

export function FilmStrip({ frames, index, onIndex }: FilmStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.querySelector<HTMLElement>(`[data-frame="${index}"]`);
    if (!child || dragging.current) return;
    child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const sync = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      el.querySelectorAll<HTMLElement>("[data-frame]").forEach((node) => {
        const center = node.offsetLeft + node.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < best) {
          best = dist;
          nearest = Number(node.dataset.frame);
        }
      });
      onIndex(nearest);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        el.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    };

    el.addEventListener("scroll", sync, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", sync);
      el.removeEventListener("wheel", onWheel);
    };
  }, [onIndex]);

  return (
    <div
      ref={scrollerRef}
      className="film-scroller"
      onPointerDown={(event) => {
        dragging.current = true;
        startX.current = event.clientX;
        startScroll.current = scrollerRef.current?.scrollLeft ?? 0;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging.current || !scrollerRef.current) return;
        scrollerRef.current.scrollLeft = startScroll.current - (event.clientX - startX.current);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <div className="film-track">
        {frames.map((frame, i) => (
          <article
            key={frame.id}
            data-frame={i}
            className={`cell grade-${frame.grade} ${i === index ? "is-gate" : ""}`}
            onClick={() => onIndex(i)}
          >
            <div className="sprocket sprocket-top" aria-hidden>
              {Array.from({ length: 10 }).map((_, n) => (
                <i key={n} />
              ))}
            </div>
            <div className="cell-body">
              <header>
                <span>ROLL {frame.roll}</span>
                <span>{frame.year}</span>
              </header>
              <p className="cell-figure">{frame.figure}</p>
              <h2>{frame.title}</h2>
              <p className="cell-line">{frame.line}</p>
              {frame.mark ? <p className="china">{frame.mark}</p> : null}
            </div>
            <div className="sprocket sprocket-bottom" aria-hidden>
              {Array.from({ length: 10 }).map((_, n) => (
                <i key={n} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
