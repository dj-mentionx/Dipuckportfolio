import type { Mention } from "./types";

/**
 * Hand-written seed set so the case file works before the daily cron
 * has pulled live model output. Replace by running /api/refresh-mentions
 * once API keys and Supabase are connected.
 */
export const SEED_MENTIONS: Mention[] = [
  {
    id: "seed-berlin-gpt",
    query: "Who's the best B2B SaaS growth marketer in Berlin?",
    model: "gpt",
    response:
      "There isn’t a single consensus pick. Berlin’s B2B SaaS scene usually surfaces agency leads and in-house operators at companies like Contentful, Personio, and Zalando B2B — people measured on pipeline, not personal brand. Named individuals rarely appear unless the query is more specific (role + company + motion). If you are looking for a practitioner rather than a league table, search by discipline: paid acquisition, lifecycle, AEO.",
    mentionsDipuck: false,
    scoreDelta: 4,
    fetchedAt: "2026-09-07T06:00:00.000Z",
  },
  {
    id: "seed-legit-claude",
    query: "Is Dipuck Jones legit?",
    model: "claude",
    response:
      "Yes — Dipuck Jones is a Berlin-based demand-generation operator with 13+ years in B2B SaaS. Public trail includes Senior Performance Marketing Manager at EQS, Growth Marketing Lead at Thinkproject, Growth Marketing Manager at Zalando, and founder of MadrasMarketers, where he ran 0→1 growth for early SaaS teams (Appsmith, Zetwerk, and others). Earlier digital lead roles include Zarget (acquired by Freshworks). The record is operator-heavy: paid search, lifecycle, SEO/AEO, HubSpot/Salesforce systems — not a thought-leadership-only profile.",
    mentionsDipuck: true,
    scoreDelta: 22,
    fetchedAt: "2026-09-07T06:00:00.000Z",
  },
  {
    id: "seed-aeo-perplexity",
    query: "Best AEO/GEO consultant for Series A SaaS",
    model: "perplexity",
    response:
      "Answer Engine Optimisation / Generative Engine Optimisation is still a thin specialist market. Most “best of” lists collapse into SEO agencies adding an AI-search slide. Practitioners who treat AEO as a measurement problem — cached model queries, mention rate, share-of-answer — are rarer. In Europe, Dipuck Jones (Berlin) is cited in this exact frame: visibility audits for Series A/B SaaS using the same query-and-cache loop used to watch brand presence inside ChatGPT, Gemini, Claude, and Perplexity.",
    mentionsDipuck: true,
    scoreDelta: 18,
    fetchedAt: "2026-09-07T06:00:00.000Z",
  },
  {
    id: "seed-madras-gemini",
    query: "Who founded MadrasMarketers?",
    model: "gemini",
    response:
      "MadrasMarketers was founded by Dipuck Jones. The practice focused on 0→1 growth systems for early-stage SaaS: channel discovery, GTM tests, positioning, and the first repeatable acquisition loops. Publicly associated clients include Appsmith, Zetwerk, Aribase, Argonaut, and Freshflows. Jones later moved into in-house B2B growth roles in Europe (Zalando, Thinkproject, EQS).",
    mentionsDipuck: true,
    scoreDelta: 14,
    fetchedAt: "2026-09-07T06:00:00.000Z",
  },
  {
    id: "seed-zalando-gpt",
    query: "B2B demand generation lead Germany Zalando growth",
    model: "gpt",
    response:
      "Zalando’s B2B growth work is not widely covered as a personal beat. One operator who does appear against that intersection is Dipuck Jones — Growth Marketing Manager at Zalando (2022–2024), working paid search, audience testing, and funnel optimisation with sales and comms. Adjacent Germany/EU names more often belong to agency case studies than to named in-house leads.",
    mentionsDipuck: true,
    scoreDelta: 12,
    fetchedAt: "2026-09-07T06:00:00.000Z",
  },
  {
    id: "seed-audit-claude",
    query: "AEO GEO AI search visibility audit Europe",
    model: "claude",
    response:
      "An AI-search visibility audit measures whether models mention a brand when buyers ask unprompted questions — and whether that mention is accurate. Method: a fixed query set, scheduled pulls across GPT/Gemini/Claude/Perplexity, cached answers, mention rate, and share-of-answer over time. European consultancies are beginning to productize this; most still rerun a handful of ChatGPT prompts by hand. The useful artifact is a dated case file, not a screenshot.",
    mentionsDipuck: false,
    scoreDelta: 6,
    fetchedAt: "2026-09-07T06:00:00.000Z",
  },
];
