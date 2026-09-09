export type RackKind = "hq" | "work" | "product" | "write" | "signal";
export type RackFilter = "all" | "seats" | "signals";

export type RackPrint = {
  id: string;
  label: string;
  kicker: string;
  kind: RackKind;
  chapter: "about" | "work" | "bomb" | "contact";
  exhibit?: string;
  figure?: string;
  yaw: number;
  pitch: number;
};

const RAW: Omit<RackPrint, "yaw" | "pitch">[] = [
  { id: "13y", label: "13Y", kicker: "IN SEAT", kind: "signal", chapter: "about", figure: "13" },
  { id: "eqs", label: "EQS", kicker: "FULL FUNNEL", kind: "work", chapter: "work", exhibit: "eqs", figure: "01" },
  { id: "aeo", label: "AEO", kicker: "MODELS FIRST", kind: "signal", chapter: "bomb" },
  { id: "zalando", label: "ZALANDO", kicker: "B2B GROWTH", kind: "work", chapter: "work", exhibit: "zalando", figure: "03" },
  { id: "250", label: "$250K", kicker: "FRESHWORKS", kind: "signal", chapter: "work", exhibit: "zarget" },
  { id: "think", label: "THINKPROJECT", kicker: "GLOBAL ADS", kind: "work", chapter: "work", exhibit: "thinkproject", figure: "02" },
  { id: "geo", label: "GEO", kicker: "ANSWER ENGINE", kind: "signal", chapter: "bomb" },
  { id: "madras", label: "MADRAS", kicker: "0 → 1", kind: "work", chapter: "work", exhibit: "madras", figure: "04" },
  { id: "hq", label: "DIPUCK", kicker: "HQ / PRINT", kind: "hq", chapter: "about", figure: "DJ" },
  { id: "fresh", label: "FRESHWORKS", kicker: "$250K ARR", kind: "work", chapter: "work", exhibit: "zarget", figure: "05" },
  { id: "berlin", label: "BERLIN", kicker: "AFTER HOURS", kind: "signal", chapter: "about" },
  { id: "gofrugal", label: "GOFRUGAL", kicker: "₹40M", kind: "work", chapter: "work", exhibit: "gofrugal", figure: "06" },
  { id: "40m", label: "₹40M", kicker: "ORGANIC", kind: "signal", chapter: "work", exhibit: "gofrugal" },
  { id: "mx", label: "MENTIONX", kicker: "AEO / GEO", kind: "product", chapter: "bomb", figure: "MX" },
  { id: "now", label: "NOW", kicker: "AVAILABLE", kind: "signal", chapter: "contact" },
  { id: "write", label: "WRITE", kicker: "SAME DAY", kind: "write", chapter: "contact" },
  { id: "paid", label: "PAID", kicker: "TO PIPELINE", kind: "signal", chapter: "work" },
  { id: "gtm", label: "GTM", kicker: "THE ENGINE", kind: "signal", chapter: "about" },
];

function place(items: Omit<RackPrint, "yaw" | "pitch">[]): RackPrint[] {
  const n = items.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  return items.map((item, index) => {
    const y = 1 - (index / Math.max(1, n - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    return {
      ...item,
      yaw: (Math.atan2(x, z) * 180) / Math.PI,
      pitch: (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI,
    };
  });
}

export const RACK_PRINTS = place(RAW);

export function matchesFilter(print: RackPrint, filter: RackFilter) {
  if (filter === "all") return true;
  if (filter === "signals") return print.kind === "signal";
  return print.kind !== "signal";
}
