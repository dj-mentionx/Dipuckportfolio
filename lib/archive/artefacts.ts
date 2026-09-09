export type ArtefactRegion = "chennai" | "berlin" | "europe" | "global";

export type Artefact = {
  id: string;
  number: string;
  name: string;
  category: string;
  impact: string;
  href: string;
  region: ArtefactRegion;
  cursor: "open-signal" | "enter-now" | "inspect";
};

export const ARTEFACTS: Artefact[] = [
  {
    id: "eqs",
    number: "01",
    name: "EQS GROUP",
    category: "B2B SaaS / Growth Systems",
    impact: "Performance, SEO, AI visibility and measurement",
    href: "/work/eqs-group",
    region: "berlin",
    cursor: "open-signal",
  },
  {
    id: "thinkproject",
    number: "02",
    name: "THINKPROJECT",
    category: "Enterprise SaaS / Construction Technology",
    impact: "Precision demand for complex enterprise products",
    href: "/work/thinkproject",
    region: "europe",
    cursor: "open-signal",
  },
  {
    id: "zalando",
    number: "03",
    name: "ZALANDO",
    category: "Ecommerce / Growth at Scale",
    impact: "Experimentation where the smallest decisions compound",
    href: "/work/zalando",
    region: "global",
    cursor: "open-signal",
  },
  {
    id: "gofrugal",
    number: "04",
    name: "GOFRUGAL",
    category: "SaaS / Retail Technology",
    impact: "Discovery, message and adoption around real software",
    href: "/work/gofrugal",
    region: "global",
    cursor: "open-signal",
  },
  {
    id: "freshworks",
    number: "05",
    name: "FRESHWORKS",
    category: "SaaS / Global Product Growth",
    impact: "Clearer product stories in crowded software markets",
    href: "/work/freshworks",
    region: "global",
    cursor: "open-signal",
  },
  {
    id: "mentionx",
    number: "06",
    name: "MENTIONX.AI",
    category: "Founder Project / AI Discovery",
    impact: "Making AI recommendations measurable and actionable",
    href: "/work/mentionx",
    region: "berlin",
    cursor: "enter-now",
  },
  {
    id: "dindeu",
    number: "07",
    name: "DINDEU",
    category: "Growth Partner / Systems",
    impact: "Websites, paid, SEO, AI visibility and automation",
    href: "/about#dindeu",
    region: "berlin",
    cursor: "open-signal",
  },
  {
    id: "operating-model",
    number: "08",
    name: "THE OPERATING MODEL",
    category: "Method / Diagnosis",
    impact: "Growth problems are rarely channel problems",
    href: "/#operating-model",
    region: "europe",
    cursor: "inspect",
  },
  {
    id: "writing",
    number: "09",
    name: "WRITING AND RESEARCH",
    category: "Signal Notes",
    impact: "Notes on systems, AI discovery, demand and GTM",
    href: "/writing",
    region: "global",
    cursor: "open-signal",
  },
];

export const PROOF_STRIP_IDS = ["eqs", "thinkproject", "zalando", "gofrugal", "freshworks", "mentionx"] as const;

export const REGION_WORK: Record<ArtefactRegion, string[]> = {
  berlin: ["eqs", "thinkproject", "dindeu", "mentionx"],
  europe: ["eqs", "thinkproject", "dindeu", "mentionx", "operating-model"],
  global: ["zalando", "freshworks", "gofrugal"],
  chennai: ["operating-model", "writing"],
};
