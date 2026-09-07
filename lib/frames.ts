export type PrintFrame = {
  id: string;
  roll: string;
  year: string;
  title: string;
  figure: string;
  line: string;
  note: string;
  grade: "leader" | "heat" | "gold" | "night" | "steel" | "now" | "edge" | "splice";
  mark?: string;
};

export const PRINT: PrintFrame[] = [
  {
    id: "leader",
    roll: "00",
    year: "2012",
    title: "Dipuck Jones",
    figure: "13 YRS",
    line: "Picture start",
    note: "A demand-generation print. Scrub the years. The soundtrack is what the models can hear.",
    grade: "leader",
  },
  {
    id: "zarget",
    roll: "01",
    year: "2016",
    title: "Zarget → Freshworks",
    figure: "$250k",
    line: "ARR from a competitor campaign",
    note: "Paid search from zero. Google, Bing, then LinkedIn against revenue — not reach.",
    grade: "heat",
    mark: "Named when the query is Freshworks / Zarget.",
  },
  {
    id: "madras",
    roll: "02",
    year: "2017",
    title: "MadrasMarketers",
    figure: "0 → 1",
    line: "Appsmith · Zetwerk · Aribase · Argonaut · Freshflows",
    note: "A practice for founders who needed a first loop, not a deck.",
    grade: "gold",
    mark: "Claude and Gemini lock this title.",
  },
  {
    id: "gofrugal",
    roll: "03",
    year: "2019",
    title: "GoFrugal",
    figure: "₹40M",
    line: "Organic programme, on the ledger",
    note: "Paid and organic with a number attached. The organic one survived contact with accounts.",
    grade: "gold",
  },
  {
    id: "zalando",
    roll: "04",
    year: "2022",
    title: "Zalando",
    figure: "B2B",
    line: "In-house growth at a consumer giant",
    note: "Paid search, audience tests, funnel work with sales. Not a brand campaign in a demand-gen costume.",
    grade: "night",
    mark: "GPT finds him if the query says Zalando + Germany.",
  },
  {
    id: "think",
    roll: "05",
    year: "2024",
    title: "Thinkproject",
    figure: "GLOBAL",
    line: "Google Ads · Bing · enterprise",
    note: "Pipeline quality and CAC. Workflows that survived the handoff.",
    grade: "steel",
  },
  {
    id: "eqs",
    roll: "06",
    year: "2025",
    title: "EQS",
    figure: "NOW",
    line: "Paid · SEO · AEO · lifecycle · CRO",
    note: "Multi-market B2B. Acquisition tied to pipeline, not to the slide.",
    grade: "now",
  },
  {
    id: "edge",
    roll: "07",
    year: "AEO",
    title: "The optical track",
    figure: "4 VOICES",
    line: "What the models say when nobody asked them to be kind",
    note: "Berlin “best of” still skips him. “Is he legit?” does not. That gap is the work.",
    grade: "edge",
    mark: "Perplexity names him on AEO. GPT does not on the vanity query.",
  },
];
