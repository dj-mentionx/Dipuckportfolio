export type LotPlot = {
  id: string;
  label: string;
  kicker: string;
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  kind: "hq" | "work" | "product" | "write" | "filler";
  chapter?: "about" | "work" | "bomb" | "contact";
  exhibit?: string;
};

export const LOT_PLOTS: LotPlot[] = [
  { id: "hq", label: "DIPUCK", kicker: "HQ / PRINT", x: 0, y: 0, w: 2.2, d: 2.2, h: 3.6, kind: "hq", chapter: "about" },
  { id: "eqs", label: "EQS", kicker: "FULL FUNNEL", x: 3.2, y: -0.4, w: 1.6, d: 1.6, h: 4.4, kind: "work", chapter: "work", exhibit: "eqs" },
  { id: "zalando", label: "ZALANDO", kicker: "B2B GROWTH", x: -3.4, y: 0.2, w: 1.8, d: 1.5, h: 3.8, kind: "work", chapter: "work", exhibit: "zalando" },
  { id: "think", label: "THINKPROJECT", kicker: "GLOBAL ADS", x: 1.8, y: 3.1, w: 2.1, d: 1.5, h: 3.2, kind: "work", chapter: "work", exhibit: "thinkproject" },
  { id: "madras", label: "MADRAS", kicker: "0 → 1", x: -2.8, y: 3.2, w: 1.5, d: 1.5, h: 2.6, kind: "work", chapter: "work", exhibit: "madras" },
  { id: "fresh", label: "FRESHWORKS", kicker: "$250K ARR", x: 3.4, y: 2.8, w: 1.6, d: 1.4, h: 2.9, kind: "work", chapter: "work", exhibit: "zarget" },
  { id: "gofrugal", label: "GOFRUGAL", kicker: "₹40M", x: -3.6, y: -2.8, w: 1.7, d: 1.4, h: 2.4, kind: "work", chapter: "work", exhibit: "gofrugal" },
  { id: "mx", label: "MENTIONX", kicker: "AEO / GEO", x: 0.2, y: -3.4, w: 1.9, d: 1.6, h: 5.1, kind: "product", chapter: "bomb" },
  { id: "write", label: "WRITE", kicker: "AVAILABLE", x: 3.6, y: -3.2, w: 1.4, d: 1.4, h: 2.1, kind: "write", chapter: "contact" },
  { id: "shed-a", label: "", kicker: "", x: -1.2, y: 4.4, w: 1, d: 1, h: 1.1, kind: "filler" },
  { id: "shed-b", label: "", kicker: "", x: 4.8, y: 1.2, w: 0.9, d: 0.9, h: 0.9, kind: "filler" },
  { id: "shed-c", label: "", kicker: "", x: -4.6, y: 1.8, w: 0.8, d: 1.1, h: 1.4, kind: "filler" },
  { id: "shed-d", label: "", kicker: "", x: 5.2, y: -2.1, w: 0.85, d: 0.85, h: 1.2, kind: "filler" },
  { id: "shed-e", label: "", kicker: "", x: -5.1, y: -0.6, w: 0.9, d: 0.7, h: 0.8, kind: "filler" },
  { id: "shed-f", label: "", kicker: "", x: 1.1, y: 5.0, w: 1.1, d: 0.7, h: 0.7, kind: "filler" },
  { id: "shed-g", label: "", kicker: "", x: -5.0, y: -3.9, w: 0.7, d: 0.9, h: 1.6, kind: "filler" },
];

export const LOT_LAMPS = [
  { x: -1.6, y: -1.6 },
  { x: 1.8, y: -1.8 },
  { x: -1.8, y: 1.8 },
  { x: 2.2, y: 1.6 },
  { x: -4.2, y: -1.1 },
  { x: 5.1, y: -1.4 },
];
