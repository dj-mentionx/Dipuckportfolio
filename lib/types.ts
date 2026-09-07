export type ModelId = "gpt" | "gemini" | "claude" | "perplexity";

export type Mention = {
  id: string;
  query: string;
  model: ModelId;
  response: string;
  mentionsDipuck: boolean;
  scoreDelta: number;
  fetchedAt: string;
};

export type ScanResult = {
  name: string;
  score: number;
  mentioned: boolean;
  excerpt: string;
  model: ModelId | "demo";
  live: boolean;
  fetchedAt: string;
};
