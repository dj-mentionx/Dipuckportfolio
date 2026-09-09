/**
 * THE COPY.
 *
 * Paste real words here. Everything on the rack, the lot, the chapters,
 * and the ticker reads from this file. Do not invent numbers you cannot defend.
 *
 * Send in chat (or edit below) whenever you have:
 * - About: 3–5 lines in your voice
 * - Each seat: role, dates, one figure, one sentence that is true
 * - MentionX: what it is, what a visitor should do
 * - Write: what you want, what a sharp brief looks like
 * - Extra prints: any labels you want on the sphere (skills, years, markets)
 */

export type Exhibit = {
  id: string;
  letter: string;
  org: string;
  role: string;
  dates: string;
  figure: string;
  figureLabel: string;
  note: string;
  line: string;
};

export type SitePrint = {
  id: string;
  label: string;
  kicker: string;
  kind: "hq" | "work" | "product" | "write" | "signal";
  chapter: "about" | "work" | "bomb" | "contact";
  exhibit?: string;
  figure?: string;
  line: string;
  verso: string;
};

export const SITE = {
  person: {
    name: "Dipuck Jones",
    role: "Growth / AEO",
    city: "Berlin",
    email: "rush2dipuck@gmail.com",
    linkedin: "https://www.linkedin.com/in/dipuckjones/",
    linkedinLabel: "linkedin.com/in/dipuckjones",
    years: 13,
    available: "Available immediately.",
  },
  about: {
    kicker: "ABOUT",
    title: "DIPUCK JONES",
    lines: [
      "Demand generation. Berlin.",
      "Available now.",
    ],
  },
  record: {
    kicker: "WORK",
    title: "THE RECORD",
    lines: [
      "Eleven seats. One through-line: acquisition that survives the sales handoff.",
      "Numbers that hit a ledger, not a slide.",
    ],
  },
  product: {
    kicker: "MENTIONX",
    title: "MENTIONX",
    lines: [
      "An agent that asks the models the questions buyers already type.",
      "Cached pulls. Mention rate. A dated file — not a vibe.",
      "Drop a name into the field. Watch whether it exists.",
    ],
  },
  write: {
    kicker: "WRITE",
    title: "WRITE",
    lines: [
      "Berlin. Write if the brief is sharp.",
    ],
  },
  seats: [
    {
      id: "eqs",
      letter: "A",
      org: "EQS",
      role: "Senior Performance Marketing Manager",
      dates: "June 2025 — present",
      figure: "Full funnel",
      figureLabel: "paid · SEO · AEO · lifecycle · CRO",
      note: "Owns multi-market B2B growth. Connects acquisition to pipeline quality, funnel conversion, and revenue — HubSpot and Salesforce as the system of record, not the slide.",
      line: "Paid to pipeline. One owner.",
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
      line: "Pipeline quality. Not click volume.",
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
      line: "B2B inside a consumer giant.",
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
      line: "0→1 with founders in the room.",
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
      line: "$250k ARR. Revenue, not reach.",
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
      line: "₹40M organic. On a ledger.",
    },
  ] satisfies Exhibit[],
  ticker: [
    "13 YEARS B2B SAAS",
    "EQS FULL FUNNEL",
    "THINKPROJECT GLOBAL ADS",
    "ZALANDO B2B GROWTH",
    "MADRASMARKETERS 0→1",
    "ZARGET → FRESHWORKS $250K",
    "KISSFLOW GOOGLE ADS",
    "SULEKHA INTERNATIONAL",
    "O3M PREMIER PARTNER",
    "CSS CORP AD OPS",
    "GOFRUGAL ₹40M ORGANIC",
    "MENTIONX AEO / GEO",
    "BERLIN · AVAILABLE NOW",
  ],
} as const;

const SEAT_FIGURE: Record<string, string> = {
  eqs: "01",
  thinkproject: "02",
  zalando: "03",
  madras: "04",
  zarget: "05",
  gofrugal: "06",
};

const SEAT_PRINT_ID: Record<string, string> = {
  eqs: "eqs",
  thinkproject: "think",
  zalando: "zalando",
  madras: "madras",
  zarget: "fresh",
  gofrugal: "gofrugal",
};

export const EXHIBITS: Exhibit[] = SITE.seats.map((seat) => ({ ...seat }));

export const CHAPTERS = {
  about: { kicker: SITE.about.kicker, title: SITE.about.title, figure: String(SITE.person.years), lines: [...SITE.about.lines] },
  work: { kicker: SITE.record.kicker, title: SITE.record.title, figure: "06", lines: [...SITE.record.lines] },
  bomb: { kicker: SITE.product.kicker, title: SITE.product.title, figure: "AI", lines: [...SITE.product.lines] },
  contact: { kicker: SITE.write.kicker, title: SITE.write.title, figure: "NOW", lines: [...SITE.write.lines] },
};

export const TICKER = [...SITE.ticker];

export const SITE_PRINTS: SitePrint[] = [
  {
    id: "hq",
    label: SITE.person.name.split(" ")[0].toUpperCase(),
    kicker: "HQ / PRINT",
    kind: "hq",
    chapter: "about",
    figure: "DJ",
    line: SITE.about.lines[0],
    verso: `${SITE.person.city} · ${SITE.person.years}Y`,
  },
  ...SITE.seats.map((seat) => ({
    id: SEAT_PRINT_ID[seat.id] ?? seat.id,
    label: seat.id === "zarget" ? "FRESHWORKS" : seat.id === "madras" ? "MADRAS" : seat.org.split(",")[0].toUpperCase(),
    kicker: seat.figure.toUpperCase(),
    kind: "work" as const,
    chapter: "work" as const,
    exhibit: seat.id,
    figure: SEAT_FIGURE[seat.id],
    line: seat.line,
    verso: `${seat.dates}\n${seat.role}`,
  })),
  {
    id: "mx",
    label: "MENTIONX",
    kicker: "AEO / GEO",
    kind: "product",
    chapter: "bomb",
    figure: "MX",
    line: SITE.product.lines[0],
    verso: SITE.product.lines[1],
  },
  {
    id: "write",
    label: "WRITE",
    kicker: "AVAILABLE",
    kind: "write",
    chapter: "contact",
    figure: "NOW",
    line: SITE.write.lines[0],
    verso: SITE.person.email,
  },
  { id: "13y", label: "13Y", kicker: "IN SEAT", kind: "signal", chapter: "about", figure: "13", line: "Thirteen years. Still in the work.", verso: "B2B SaaS growth" },
  { id: "250", label: "$250K", kicker: "FRESHWORKS", kind: "signal", chapter: "work", exhibit: "zarget", figure: "$", line: "ARR that survived the acquire.", verso: "Zarget → Freshworks" },
  { id: "40m", label: "₹40M", kicker: "ORGANIC", kind: "signal", chapter: "work", exhibit: "gofrugal", figure: "₹", line: "Organic with a revenue target.", verso: "GoFrugal ledger" },
  { id: "aeo", label: "AEO", kicker: "MODELS FIRST", kind: "signal", chapter: "bomb", figure: "AE", line: "Show up where the model answers.", verso: "MentionX" },
  { id: "geo", label: "GEO", kicker: "ANSWER ENGINE", kind: "signal", chapter: "bomb", figure: "GE", line: "Generative engine optimization.", verso: "MentionX" },
  { id: "paid", label: "PAID", kicker: "TO PIPELINE", kind: "signal", chapter: "work", figure: "PD", line: "Spend that can explain itself.", verso: "Google · Bing · LinkedIn" },
  { id: "life", label: "LIFECYCLE", kicker: "AFTER THE CLICK", kind: "signal", chapter: "work", exhibit: "eqs", figure: "LC", line: "The funnel does not end at the form.", verso: "EQS" },
  { id: "cro", label: "CRO", kicker: "THE PAGE", kind: "signal", chapter: "work", exhibit: "eqs", figure: "CR", line: "Conversion as a system, not a tweak.", verso: "EQS" },
  { id: "gtm", label: "GTM", kicker: "THE ENGINE", kind: "signal", chapter: "about", figure: "GT", line: "Go-to-market that sales can run.", verso: SITE.person.city },
  { id: "hub", label: "HUBSPOT", kicker: "SYSTEM OF RECORD", kind: "signal", chapter: "work", exhibit: "eqs", figure: "HS", line: "CRM is the scoreboard.", verso: "HubSpot · Salesforce" },
  { id: "berlin", label: "BERLIN", kicker: "AFTER HOURS", kind: "signal", chapter: "about", figure: "BE", line: "Based here. Available now.", verso: SITE.person.available },
  { id: "now", label: "NOW", kicker: "WRITE", kind: "signal", chapter: "contact", figure: "NO", line: SITE.person.available, verso: SITE.person.email },
  { id: "zero", label: "0→1", kicker: "MADRAS", kind: "signal", chapter: "work", exhibit: "madras", figure: "01", line: "First channel. First loop.", verso: "Appsmith · Zetwerk · Freshflows" },
  { id: "pipe", label: "PIPELINE", kicker: "THE LEDGER", kind: "signal", chapter: "work", figure: "PL", line: "If it does not hit the ledger, it did not happen.", verso: "Salesforce" },
  { id: "y16", label: "’16", kicker: "ZARGET", kind: "signal", chapter: "work", exhibit: "zarget", figure: "16", line: "Paid search from zero.", verso: "2016" },
  { id: "y19", label: "’19", kicker: "GOFRUGAL", kind: "signal", chapter: "work", exhibit: "gofrugal", figure: "19", line: "Paid and organic, same target.", verso: "2019" },
  { id: "y22", label: "’22", kicker: "ZALANDO", kind: "signal", chapter: "work", exhibit: "zalando", figure: "22", line: "In-house B2B at scale.", verso: "2022" },
  { id: "y24", label: "’24", kicker: "THINKPROJECT", kind: "signal", chapter: "work", exhibit: "thinkproject", figure: "24", line: "Global ads. Enterprise CAC.", verso: "2024" },
  { id: "y25", label: "’25", kicker: "EQS", kind: "signal", chapter: "work", exhibit: "eqs", figure: "25", line: "Full funnel. Present tense.", verso: "2025" },
  { id: "sales", label: "SALESFORCE", kicker: "THE RECORD", kind: "signal", chapter: "work", exhibit: "eqs", figure: "SF", line: "The system of record, not the slide.", verso: "EQS" },
];
