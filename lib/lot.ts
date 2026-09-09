import { EXPERIENCE_SEATS } from "./experience";

export type LotPlot = {
  id: string;
  label: string;
  kicker: string;
  dates: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  kind: "work" | "product";
  chapter: "work";
  exhibit: string;
};

/** How far the walker can roam from the plaza. */
export const LOT_LIMIT = 9.2;

/**
 * Companies sit on one wide ring — equal spacing, lots of air between
 * nameplates so they stay readable. No HQ block, no filler sheds.
 */
export const LOT_PLOTS: LotPlot[] = EXPERIENCE_SEATS.map((seat, index) => {
  const angle = (index / EXPERIENCE_SEATS.length) * Math.PI * 2 - Math.PI / 2;
  const radius = 7.85;
  return {
    id: seat.id,
    label: seat.short,
    kicker: seat.role,
    dates: seat.dates,
    x: Number((Math.cos(angle) * radius).toFixed(2)),
    y: Number((Math.sin(angle) * radius).toFixed(2)),
    w: 1.72,
    d: 1.48,
    h: 1.35,
    kind: seat.kind === "product" ? "product" : "work",
    chapter: "work",
    exhibit: seat.id,
  };
});

export type LotPath = { x: number; y: number; length: number; angle: number };

/** A street from the plaza curb to each company block. */
export const LOT_PATHS: LotPath[] = LOT_PLOTS.map((plot) => {
  const full = Math.hypot(plot.x, plot.y) || 1;
  const nx = plot.x / full;
  const ny = plot.y / full;
  const start = 2.35;
  const end = full - 0.95;
  const length = Math.max(1, end - start);
  const mid = (start + end) / 2;
  return {
    x: Number((nx * mid).toFixed(2)),
    y: Number((ny * mid).toFixed(2)),
    length,
    angle: (Math.atan2(plot.y, plot.x) * 180) / Math.PI,
  };
});

export const LOT_LAMPS: { x: number; y: number }[] = LOT_PLOTS.flatMap((plot) => {
  const len = Math.hypot(plot.x, plot.y) || 1;
  const nx = plot.x / len;
  const ny = plot.y / len;
  return [0.36, 0.68].map((t) => ({
    x: Number((nx * len * t + ny * 0.28).toFixed(2)),
    y: Number((ny * len * t - nx * 0.28).toFixed(2)),
  }));
});
