import { SITE_PRINTS, type SitePrint } from "./site";

export type RackKind = SitePrint["kind"];
export type RackFilter = "all" | "seats" | "signals";

export type RackPrint = SitePrint & {
  yaw: number;
  pitch: number;
  index: number;
};

function place(items: SitePrint[]): RackPrint[] {
  const n = items.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return items.map((item, index) => {
    const y = 1 - (index / Math.max(1, n - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index + 0.35;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    return {
      ...item,
      index,
      yaw: (Math.atan2(x, z) * 180) / Math.PI,
      pitch: (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI,
    };
  });
}

export const RACK_PRINTS = place(SITE_PRINTS);
export const RACK_RINGS = {
  meridians: [0, 30, 60, 90, 120, 150],
  parallels: [-55, -28, 0, 28, 55],
};
export const RACK_FILL = Array.from({ length: 24 }, (_, index) => {
  const y = 1 - ((index + 0.5) / 24) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = Math.PI * (3 - Math.sqrt(5)) * index + 2.4;
  return {
    id: `fill-${index}`,
    yaw: (Math.atan2(Math.cos(theta) * radius, Math.sin(theta) * radius) * 180) / Math.PI,
    pitch: (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI,
  };
});

export const RACK_CELLS = Array.from({ length: 20 }, (_, index) => {
  const y = 1 - (index / 19) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = Math.PI * (3 - Math.sqrt(5)) * index + 1.1;
  return {
    id: `cell-${index}`,
    index,
    yaw: (Math.atan2(Math.cos(theta) * radius, Math.sin(theta) * radius) * 180) / Math.PI,
    pitch: (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI,
  };
});

export function matchesFilter(print: RackPrint, filter: RackFilter) {
  if (filter === "all") return true;
  if (filter === "signals") return print.kind === "signal";
  return print.kind !== "signal";
}
