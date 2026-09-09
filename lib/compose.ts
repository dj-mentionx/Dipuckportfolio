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

export { CHAPTERS, TICKER } from "./site";
