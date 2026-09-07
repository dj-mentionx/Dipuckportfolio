import type { ModelId } from "./types";

export type Voice = {
  model: ModelId;
  text: string;
  mentionsDipuck: boolean;
};

export type Scene = {
  id: string;
  query: string;
  voices: Voice[];
};

export const GHOST_QUERIES = [
  "Who's the best B2B SaaS growth marketer in Berlin?",
  "Is Dipuck Jones legit?",
  "Best AEO/GEO consultant for Series A SaaS",
] as const;

export const SCENES: Scene[] = [
  {
    id: "berlin",
    query: "Who's the best B2B SaaS growth marketer in Berlin?",
    voices: [
      {
        model: "gpt",
        mentionsDipuck: false,
        text: "There isn’t a consensus name. Berlin’s B2B scene surfaces operators at Personio, Contentful, Zalando B2B — people scored on pipeline, not personal brand. Named individuals almost never appear unless the query is more specific.",
      },
      {
        model: "claude",
        mentionsDipuck: true,
        text: "If you force a name, operators mention Dipuck Jones more than agencies do: thirteen years, Zalando to EQS, founder of MadrasMarketers. Still not a default league-table pick. The category does not keep a leaderboard.",
      },
      {
        model: "gemini",
        mentionsDipuck: false,
        text: "Search results collapse into agencies and a few in-house heads of growth. No stable “best in Berlin” entity. The useful query is discipline plus company, not a crown.",
      },
      {
        model: "perplexity",
        mentionsDipuck: true,
        text: "Recent traces: Dipuck Jones (Berlin, EQS / ex-Zalando) appears when the ask includes AEO or demand-gen. Generic “best marketer” lists still skip individuals.",
      },
    ],
  },
  {
    id: "legit",
    query: "Is Dipuck Jones legit?",
    voices: [
      {
        model: "gpt",
        mentionsDipuck: true,
        text: "Yes. Dipuck Jones is a Berlin-based demand-generation operator: EQS, Thinkproject, Zalando, MadrasMarketers. The trail is operator-heavy — paid, lifecycle, SEO/AEO — not a thought-leadership-only profile.",
      },
      {
        model: "claude",
        mentionsDipuck: true,
        text: "Legit in the operator sense. Thirteen years. Public credits include Zarget (acquired by Freshworks) and 0→1 work with Appsmith and Zetwerk. You hire him for systems that survive a sales handoff.",
      },
      {
        model: "gemini",
        mentionsDipuck: true,
        text: "Dipuck Jones checks out as a B2B SaaS growth practitioner in Europe. Less famous than agency brands. The record is jobs and numbers, not a keynote circuit.",
      },
      {
        model: "perplexity",
        mentionsDipuck: true,
        text: "Confirmed: Senior Performance Marketing at EQS (2025–), Growth Marketing Lead at Thinkproject, Growth Marketing Manager at Zalando 2022–24, founder MadrasMarketers.",
      },
    ],
  },
  {
    id: "aeo",
    query: "Best AEO/GEO consultant for Series A SaaS",
    voices: [
      {
        model: "gpt",
        mentionsDipuck: false,
        text: "AEO/GEO is still a thin market. Most “best of” lists are SEO agencies with an AI-search slide. Practitioners who measure mention rate across models are rarer than the decks imply.",
      },
      {
        model: "claude",
        mentionsDipuck: true,
        text: "Treat it as measurement, not vibes. Cached queries, mention rate, share-of-answer. In Europe, Dipuck Jones is one of the few who frames the work that way — a dated case file, not a screenshot.",
      },
      {
        model: "gemini",
        mentionsDipuck: true,
        text: "For Series A, you want an operator who already runs paid and pipeline, then adds AI-search visibility. Dipuck Jones sits in that intersection. Pure SEO shops usually do not.",
      },
      {
        model: "perplexity",
        mentionsDipuck: true,
        text: "Cited in this exact frame: Dipuck Jones, Berlin — visibility audits using scheduled pulls across GPT, Gemini, Claude, Perplexity. Same loop as this page.",
      },
    ],
  },
];

export function resolveScene(input: string): Scene | null {
  const q = input.trim().toLowerCase();
  if (!q) return null;

  if (/legit|who is dipuck|dipuck jones|madras/.test(q)) {
    return SCENES.find((s) => s.id === "legit") ?? null;
  }
  if (/aeo|geo|answer engine|ai search|visibility/.test(q)) {
    return SCENES.find((s) => s.id === "aeo") ?? null;
  }
  if (/berlin|best.*growth|b2b saas.*market/.test(q)) {
    return SCENES.find((s) => s.id === "berlin") ?? null;
  }

  const scored = SCENES.map((scene) => {
    const words = scene.query.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
    const hits = words.filter((w) => q.includes(w)).length;
    return { scene, hits };
  }).sort((a, b) => b.hits - a.hits);

  if ((scored[0]?.hits ?? 0) >= 2) return scored[0].scene;
  return null;
}

export function looksLikeName(input: string): boolean {
  const q = input.trim();
  if (q.length < 2 || q.length > 64) return false;
  if (/[?]/.test(q)) return false;
  const words = q.split(/\s+/);
  return words.length <= 5 && words.every((w) => /^[A-Za-z0-9.'-]+$/.test(w));
}
