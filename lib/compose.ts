export type NodeKind = "metric" | "company" | "skill" | "place" | "signal";

export type FieldNode = {
  id: string;
  label: string;
  kind: NodeKind;
  chapter?: ChapterId;
};

export type ChapterId = "about" | "work" | "bomb" | "contact";

export const NODES: FieldNode[] = [
  { id: "13", label: "13Y", kind: "metric", chapter: "about" },
  { id: "250", label: "$250k", kind: "metric", chapter: "work" },
  { id: "40m", label: "₹40M", kind: "metric", chapter: "work" },
  { id: "5", label: "0→1", kind: "metric", chapter: "work" },
  { id: "eqs", label: "EQS", kind: "company", chapter: "work" },
  { id: "zalando", label: "ZALANDO", kind: "company", chapter: "work" },
  { id: "think", label: "THINKPROJECT", kind: "company", chapter: "work" },
  { id: "madras", label: "MADRAS", kind: "company", chapter: "work" },
  { id: "fresh", label: "FRESHWORKS", kind: "company", chapter: "work" },
  { id: "gofrugal", label: "GOFRUGAL", kind: "company", chapter: "work" },
  { id: "aeo", label: "AEO", kind: "skill", chapter: "bomb" },
  { id: "geo", label: "GEO", kind: "skill", chapter: "bomb" },
  { id: "paid", label: "PAID", kind: "skill", chapter: "work" },
  { id: "life", label: "LIFECYCLE", kind: "skill", chapter: "work" },
  { id: "cro", label: "CRO", kind: "skill", chapter: "work" },
  { id: "berlin", label: "BERLIN", kind: "place", chapter: "about" },
  { id: "now", label: "NOW", kind: "signal", chapter: "contact" },
  { id: "mx", label: "MENTIONX", kind: "signal", chapter: "bomb" },
  { id: "gtm", label: "GTM", kind: "skill", chapter: "about" },
  { id: "hub", label: "HUBSPOT", kind: "skill", chapter: "work" },
];

export const TICKER = [
  "13 YEARS B2B SAAS",
  "EQS FULL FUNNEL",
  "THINKPROJECT GLOBAL ADS",
  "ZALANDO B2B GROWTH",
  "MADRASMARKETERS 0→1",
  "ZARGET → FRESHWORKS $250K",
  "GOFRUGAL ₹40M ORGANIC",
  "MENTIONX AEO / GEO",
  "BERLIN · AVAILABLE NOW",
];

export const CHAPTERS: Record<
  ChapterId,
  { kicker: string; title: string; lines: string[]; figure?: string }
> = {
  about: {
    kicker: "LOCKUP 01 / ABOUT",
    title: "DIPUCK JONES",
    figure: "13",
    lines: [
      "Demand generation. Berlin. B2B SaaS.",
      "He builds engines that connect spend to pipeline — for people, and for the models that answer first.",
      "Available immediately.",
    ],
  },
  work: {
    kicker: "LOCKUP 02 / RECORD",
    title: "THE RECORD",
    figure: "06",
    lines: [
      "Six seats. One through-line: acquisition that survives the sales handoff.",
      "Numbers that hit a ledger, not a slide.",
    ],
  },
  bomb: {
    kicker: "LOCKUP 03 / PRODUCT",
    title: "MENTIONX",
    figure: "AI",
    lines: [
      "An agent that asks the models the questions buyers already type.",
      "Cached pulls. Mention rate. A dated file — not a vibe.",
      "Drop a name into the field. Watch whether it exists.",
    ],
  },
  contact: {
    kicker: "LOCKUP 04 / WRITE",
    title: "WRITE",
    figure: "NOW",
    lines: [
      "Growth seats. AEO retainers. A MentionX audit.",
      "Berlin. Same day if the brief is sharp.",
    ],
  },
};
