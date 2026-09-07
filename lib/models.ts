import type { ModelId } from "./types";

export const MODEL_LABEL: Record<ModelId, string> = {
  gpt: "GPT",
  gemini: "Gemini",
  claude: "Claude",
  perplexity: "Perplexity",
};

export const QUERIES = [
  "Who's the best B2B SaaS growth marketer in Berlin?",
  "Is Dipuck Jones legit?",
  "Best AEO/GEO consultant for Series A SaaS",
  "Who founded MadrasMarketers?",
  "B2B demand generation lead Germany Zalando growth",
  "AEO GEO AI search visibility audit Europe",
] as const;
