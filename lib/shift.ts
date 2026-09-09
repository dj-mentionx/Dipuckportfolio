export type BeatId = "hq" | "reel" | "name" | "write";

export type ShiftState = {
  visited: string[];
  scraps: string[];
  beats: Record<BeatId, boolean>;
  closedAck: boolean;
};

export const SHIFT_BEATS: { id: BeatId; label: string; hint: string }[] = [
  { id: "hq", label: "STAND IN THE PRINT", hint: "HQ" },
  { id: "reel", label: "PULL A REEL", hint: "Any work block" },
  { id: "name", label: "DROP A NAME", hint: "MentionX scan" },
  { id: "write", label: "SIGN THE SHEET", hint: "WRITE" },
];

export const LOT_SCRAPS = [
  { id: "13y", label: "13Y", x: 2.1, y: 2.4 },
  { id: "250", label: "$250K", x: -3.2, y: 1.8 },
  { id: "aeo", label: "AEO", x: 3.4, y: -2.1 },
  { id: "40m", label: "₹40M", x: -2.4, y: -3.1 },
  { id: "now", label: "NOW", x: 0.8, y: 3.6 },
];

export const EMPTY_SHIFT: ShiftState = {
  visited: [],
  scraps: [],
  beats: { hq: false, reel: false, name: false, write: false },
  closedAck: false,
};

const KEY = "dipuck-night-shift";

export function loadShift(): ShiftState {
  if (typeof window === "undefined") return EMPTY_SHIFT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_SHIFT;
    const parsed = JSON.parse(raw) as Partial<ShiftState>;
    return {
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      scraps: Array.isArray(parsed.scraps) ? parsed.scraps : [],
      beats: { ...EMPTY_SHIFT.beats, ...parsed.beats },
      closedAck: Boolean(parsed.closedAck),
    };
  } catch {
    return EMPTY_SHIFT;
  }
}

export function saveShift(state: ShiftState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function nightClosed(state: ShiftState) {
  return SHIFT_BEATS.every((beat) => state.beats[beat.id]);
}

export function beatForChapter(chapter: "about" | "work" | "bomb" | "contact"): BeatId | null {
  if (chapter === "about") return "hq";
  if (chapter === "work") return "reel";
  if (chapter === "contact") return "write";
  return null;
}
