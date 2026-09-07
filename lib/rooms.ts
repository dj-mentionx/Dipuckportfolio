export type Slide = {
  kicker: string;
  title: string;
  body: string;
  figure?: string;
};

export type RoomId = "about" | "exp" | "bomb" | "contact";

export type Room = {
  id: RoomId;
  door: string;
  house: string;
  slides: Slide[];
};

export const ROOMS: Room[] = [
  {
    id: "about",
    door: "ABOUT",
    house: "The cottage",
    slides: [
      {
        kicker: "Subject",
        title: "Dipuck Jones",
        body: "Demand-generation operator. Thirteen years. Berlin. He builds full-funnel engines that connect spend to MQLs, pipeline, ARR — for humans and for the models that now answer first.",
      },
      {
        kicker: "Motion",
        title: "Paid. Lifecycle. AEO.",
        body: "Google Ads, Bing, LinkedIn, HubSpot, Salesforce, SEO, GEO. The work is not a channel. It is a system that survives the sales handoff.",
      },
      {
        kicker: "Status",
        title: "Available immediately",
        body: "Senior growth and performance marketing. B2B SaaS. Looking for a Director of Growth or GTM seat — or a Series A that needs its name to exist inside ChatGPT.",
      },
    ],
  },
  {
    id: "exp",
    door: "EXP",
    house: "The archive",
    slides: [
      {
        kicker: "Now",
        title: "EQS",
        figure: "Full funnel",
        body: "Senior Performance Marketing Manager. Multi-market B2B: paid, SEO, AEO, lifecycle, CRO. Acquisition tied to pipeline quality.",
      },
      {
        kicker: "2024",
        title: "Thinkproject",
        figure: "Global ads",
        body: "Growth Marketing Lead. Google and Bing across enterprise markets. CAC and revenue, not click volume.",
      },
      {
        kicker: "2022",
        title: "Zalando",
        figure: "B2B growth",
        body: "Growth Marketing Manager. Paid search, audience tests, funnel work with sales and comms.",
      },
      {
        kicker: "2017",
        title: "MadrasMarketers",
        figure: "0 → 1",
        body: "Founder. Appsmith, Zetwerk, Aribase, Argonaut, Freshflows. First channels. First loops.",
      },
      {
        kicker: "2016 · 2019",
        title: "Zarget / GoFrugal",
        figure: "$250k · ₹40M",
        body: "Zarget (acquired by Freshworks): competitor campaign to $250k ARR. GoFrugal: INR 40M from the organic programme.",
      },
    ],
  },
  {
    id: "bomb",
    door: "BOMB",
    house: "MentionX",
    slides: [
      {
        kicker: "The drop",
        title: "MentionX",
        body: "An AEO / GEO agent. It asks the models the questions buyers already type — then keeps the answers as a dated file. Visibility is not a vibe. It is a mention rate.",
      },
      {
        kicker: "How it runs",
        title: "Cache. Don’t perform.",
        body: "Scheduled pulls across GPT, Gemini, Claude, Perplexity. Supabase as the ledger. One live query only when someone opens their own file. Same architecture as a growth system: measure, then spend.",
      },
      {
        kicker: "Why it exists",
        title: "You are not in the answer.",
        body: "Most Series A brands are invisible to the models. MentionX shows the gap, then builds the pages, the entities, the proof the models can cite.",
      },
    ],
  },
  {
    id: "contact",
    door: "CONTACT",
    house: "The desk",
    slides: [
      {
        kicker: "Berlin",
        title: "Write.",
        body: "rush2dipuck@gmail.com — the shortest path. LinkedIn if you want the long read: linkedin.com/in/dipuckjones.",
      },
      {
        kicker: "Now",
        title: "Available immediately",
        body: "Growth seats. AEO retainers. A MentionX audit for a brand that should already be named.",
      },
    ],
  },
];
