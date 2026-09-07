import { djb2 } from "./hash";
import type { ModelId, ScanResult } from "./types";

export type ModelAnswer = {
  model: ModelId;
  text: string;
};

const SYSTEM =
  "Answer in 90-140 words. Be specific. If you do not have evidence, say so. Do not invent employers, metrics, or quotes.";

async function readJson(res: Response): Promise<unknown> {
  return res.json().catch(() => ({}));
}

export async function queryOpenAI(query: string): Promise<ModelAnswer> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY missing");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 280,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: query },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = (await readJson(res)) as {
    choices?: { message?: { content?: string } }[];
  };
  return { model: "gpt", text: data.choices?.[0]?.message?.content?.trim() || "" };
}

export async function queryGemini(query: string): Promise<ModelAnswer> {
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("GOOGLE_AI_API_KEY missing");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM}\n\n${query}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 280 },
      }),
    },
  );

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = (await readJson(res)) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() || "";
  return { model: "gemini", text };
}

export async function queryClaude(query: string): Promise<ModelAnswer> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-latest",
      max_tokens: 280,
      temperature: 0.3,
      system: SYSTEM,
      messages: [{ role: "user", content: query }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const data = (await readJson(res)) as {
    content?: { type?: string; text?: string }[];
  };
  const text = data.content?.find((block) => block.type === "text")?.text?.trim() || "";
  return { model: "claude", text };
}

export async function queryPerplexity(query: string): Promise<ModelAnswer> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) throw new Error("PERPLEXITY_API_KEY missing");

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "sonar",
      temperature: 0.2,
      max_tokens: 280,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: query },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Perplexity ${res.status}`);
  const data = (await readJson(res)) as {
    choices?: { message?: { content?: string } }[];
  };
  return { model: "perplexity", text: data.choices?.[0]?.message?.content?.trim() || "" };
}

export async function queryAllModels(query: string): Promise<ModelAnswer[]> {
  const jobs: Promise<ModelAnswer | null>[] = [
    queryOpenAI(query).catch(() => null),
    queryGemini(query).catch(() => null),
    queryClaude(query).catch(() => null),
    queryPerplexity(query).catch(() => null),
  ];
  const settled = await Promise.all(jobs);
  return settled.filter((row): row is ModelAnswer => Boolean(row?.text));
}

export async function queryFirstAvailable(query: string): Promise<ModelAnswer> {
  const order: Array<() => Promise<ModelAnswer>> = [
    () => queryOpenAI(query),
    () => queryClaude(query),
    () => queryGemini(query),
    () => queryPerplexity(query),
  ];

  let lastError: unknown = null;
  for (const run of order) {
    try {
      const result = await run();
      if (result.text) return result;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("No model available");
}

export function demoScan(name: string): ScanResult {
  const cleaned = name.trim();
  const hash = djb2(cleaned.toLowerCase());
  const mentioned =
    /dipuck|madrasmarketers|mentionx/i.test(cleaned) || hash % 100 > 78;
  const score = mentioned ? 62 + (hash % 31) : 14 + (hash % 48);

  const excerpt = mentioned
    ? `${cleaned} appears in a minority of unprompted answers — usually when the query is specific (role, city, or product motion) rather than a generic “best of” list. The mention is thin: operator credits, not a default recommendation.`
    : `No stable mention of ${cleaned} across a short unprompted pull. Models answer the category without naming the subject. That is the normal state for most B2B brands until query-level presence is built on purpose.`;

  return {
    name: cleaned,
    score,
    mentioned,
    excerpt,
    model: "demo",
    live: false,
    fetchedAt: new Date().toISOString(),
  };
}

export function scoreFromAnswer(name: string, text: string, model: ModelId): ScanResult {
  const mentioned = text.toLowerCase().includes(name.trim().toLowerCase());
  const lengthBonus = Math.min(20, Math.round(text.length / 40));
  const score = Math.min(99, (mentioned ? 54 : 16) + lengthBonus + (djb2(text) % 17));

  return {
    name: name.trim(),
    score,
    mentioned,
    excerpt: text.slice(0, 420),
    model,
    live: true,
    fetchedAt: new Date().toISOString(),
  };
}

export function hasAnyModelKey(): boolean {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GOOGLE_AI_API_KEY ||
      process.env.PERPLEXITY_API_KEY,
  );
}
