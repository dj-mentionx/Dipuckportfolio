export type Exhibit = {
  id: string;
  letter: string;
  org: string;
  role: string;
  dates: string;
  figure: string;
  figureLabel: string;
  note: string;
};

export const EXHIBITS: Exhibit[] = [
  {
    id: "eqs",
    letter: "A",
    org: "EQS",
    role: "Senior Performance Marketing Manager",
    dates: "June 2025 — present",
    figure: "Full funnel",
    figureLabel: "paid · SEO · AEO · lifecycle · CRO",
    note: "Owns multi-market B2B growth. Connects acquisition to pipeline quality, funnel conversion, and revenue — HubSpot and Salesforce as the system of record, not the slide.",
  },
  {
    id: "thinkproject",
    letter: "B",
    org: "Thinkproject",
    role: "Growth Marketing Lead",
    dates: "September 2024 — May 2025",
    figure: "Global ads",
    figureLabel: "Google Ads · Bing · enterprise markets",
    note: "Scaled paid demand with the constraint that mattered: pipeline quality and CAC, not click volume. Built acquisition workflows that survived the sales handoff.",
  },
  {
    id: "zalando",
    letter: "C",
    org: "Zalando",
    role: "Growth Marketing Manager",
    dates: "June 2022 — August 2024",
    figure: "B2B growth",
    figureLabel: "paid search · audience tests · funnel",
    note: "In-house B2B at a consumer giant. Messaging, relevance, and revenue support with sales and comms — not a brand campaign wearing a demand-gen badge.",
  },
  {
    id: "madras",
    letter: "D",
    org: "MadrasMarketers",
    role: "Founder, growth consultant (0→1)",
    dates: "March 2017 — January 2022",
    figure: "5 named",
    figureLabel: "Appsmith · Zetwerk · Aribase · Argonaut · Freshflows",
    note: "Built acquisition from scratch with founders: positioning, first channels, first loops. The work was getting a company from traction to a system.",
  },
  {
    id: "zarget",
    letter: "E",
    org: "Zarget, acquired by Freshworks",
    role: "Head of Digital Marketing",
    dates: "June 2016 — August 2017",
    figure: "$250k ARR",
    figureLabel: "competitor campaign, measured on revenue",
    note: "Stood up paid search from zero across Google and Bing, then LinkedIn and Facebook against ROI — not vanity reach.",
  },
  {
    id: "gofrugal",
    letter: "F",
    org: "GoFrugal",
    role: "Growth Hacker",
    dates: "November 2019 — June 2022",
    figure: "INR 40M",
    figureLabel: "from the online organic programme",
    note: "Led paid and organic with a revenue target attached. The organic number is the one that survived contact with a ledger.",
  },
];
