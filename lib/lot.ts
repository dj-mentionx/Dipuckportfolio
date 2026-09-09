import { EXPERIENCE_SEATS } from "./experience";

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

const RING = EXPERIENCE_SEATS.map((seat, index) => {
  const angle = (index / EXPERIENCE_SEATS.length) * Math.PI * 2 - Math.PI / 2;
  const radius = 3.55;
  return {
    id: seat.id,
    label: seat.short,
    kicker: "",
    x: Number((Math.cos(angle) * radius).toFixed(2)),
    y: Number((Math.sin(angle) * radius).toFixed(2)),
    w: seat.featured ? 1.9 : 1.45,
    d: seat.featured ? 1.7 : 1.35,
    h: seat.featured ? 5 : 2.3 + (index % 4) * 0.5,
    kind: (seat.kind === "product" ? "product" : "work") as "product" | "work",
    chapter: (seat.kind === "product" ? "bomb" : "work") as "bomb" | "work",
    exhibit: seat.id,
  };
});

export const LOT_PLOTS: LotPlot[] = [
  { id: "hq", label: "DIPUCK", kicker: "", x: 0, y: 0, w: 2.1, d: 2.1, h: 3.7, kind: "hq", chapter: "about" },
  ...RING,
  { id: "write", label: "WRITE", kicker: "", x: 0.1, y: -5.1, w: 1.3, d: 1.3, h: 1.9, kind: "write", chapter: "contact" },
  { id: "shed-a", label: "", kicker: "", x: -1.4, y: 5.1, w: 1, d: 1, h: 1.1, kind: "filler" },
  { id: "shed-b", label: "", kicker: "", x: 5.1, y: 1.4, w: 0.9, d: 0.9, h: 0.9, kind: "filler" },
  { id: "shed-c", label: "", kicker: "", x: -5.1, y: 1.6, w: 0.8, d: 1.1, h: 1.3, kind: "filler" },
  { id: "shed-d", label: "", kicker: "", x: 4.9, y: -2.4, w: 0.85, d: 0.85, h: 1.1, kind: "filler" },
  { id: "shed-e", label: "", kicker: "", x: -4.8, y: -2.2, w: 0.9, d: 0.7, h: 0.8, kind: "filler" },
];

export const LOT_LAMPS = [
  { x: -1.6, y: -1.6 },
  { x: 1.8, y: -1.8 },
  { x: -1.8, y: 1.8 },
  { x: 2.2, y: 1.6 },
  { x: -4.0, y: -0.4 },
  { x: 4.2, y: 0.2 },
];
