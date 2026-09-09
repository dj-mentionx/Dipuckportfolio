import { ARTEFACTS, type ArtefactRegion } from "./artefacts";

export type GlobeNodeId = "chennai" | "berlin" | "europe" | "global";

export type GlobeNode = {
  id: GlobeNodeId;
  name: string;
  role: string;
  story: string;
  lat: number;
  lng: number;
  related: string[];
  tint: string;
};

export const GLOBE_NODES: GlobeNode[] = [
  {
    id: "chennai",
    name: "Chennai",
    role: "Origin",
    story: "Built in Chennai. Shaped by global ambition.",
    lat: 13.08,
    lng: 80.27,
    related: ["operating-model", "writing"],
    tint: "18 10 6",
  },
  {
    id: "berlin",
    name: "Berlin",
    role: "Now",
    story: "Now building growth systems from Berlin, across SaaS, AI discovery and ambitious companies.",
    lat: 52.52,
    lng: 13.41,
    related: ["eqs", "thinkproject", "dindeu", "mentionx"],
    tint: "8 8 10",
  },
  {
    id: "europe",
    name: "Europe",
    role: "B2B SaaS and Enterprise",
    story: "Demand systems for European SaaS and enterprise software — precision over noise.",
    lat: 48.14,
    lng: 11.58,
    related: ["eqs", "thinkproject", "dindeu", "mentionx"],
    tint: "10 10 12",
  },
  {
    id: "global",
    name: "Global",
    role: "Ecommerce, Technology and AI Discovery",
    story: "Experience across technology, enterprise software, ecommerce and founder-led products.",
    lat: 1.35,
    lng: 103.82,
    related: ["zalando", "freshworks", "gofrugal"],
    tint: "12 8 8",
  },
];

export type OrbitingArtefact = {
  id: string;
  number: string;
  name: string;
  category: string;
  impact: string;
  href: string;
  region: ArtefactRegion;
  cursor: "open-signal" | "enter-now" | "inspect";
  lat: number;
  lng: number;
  altitude: number;
};

const PLACEMENTS: Record<string, { lat: number; lng: number; altitude: number }> = {
  eqs: { lat: 51.2, lng: 10.4, altitude: 1.28 },
  thinkproject: { lat: 48.8, lng: 16.2, altitude: 1.34 },
  zalando: { lat: 22.4, lng: 8.1, altitude: 1.42 },
  gofrugal: { lat: 12.9, lng: 77.6, altitude: 1.3 },
  freshworks: { lat: 8.4, lng: 99.2, altitude: 1.36 },
  mentionx: { lat: 53.8, lng: 18.6, altitude: 1.46 },
  dindeu: { lat: 50.1, lng: 8.7, altitude: 1.22 },
  "operating-model": { lat: 45.5, lng: 9.2, altitude: 1.4 },
  writing: { lat: 35.7, lng: 139.7, altitude: 1.5 },
};

export const ORBITING_ARTEFACTS: OrbitingArtefact[] = ARTEFACTS.map((artefact) => ({
  ...artefact,
  ...PLACEMENTS[artefact.id],
}));

export const ORBIT_PATHS = [
  { name: "chennai-berlin", from: "chennai", to: "berlin" },
  { name: "berlin-europe", from: "berlin", to: "europe" },
  { name: "europe-global", from: "europe", to: "global" },
  { name: "chennai-global", from: "chennai", to: "global" },
] as const;
