import { SEED_MENTIONS } from "./seed";
import { getServiceClient } from "./supabase";
import type { Mention, ModelId } from "./types";

type MentionRow = {
  id: string;
  query: string;
  model: string;
  response: string;
  mentions_dipuck: boolean;
  score_delta: number;
  fetched_at: string;
};

function rowToMention(row: MentionRow): Mention {
  return {
    id: row.id,
    query: row.query,
    model: row.model as ModelId,
    response: row.response,
    mentionsDipuck: row.mentions_dipuck,
    scoreDelta: row.score_delta,
    fetchedAt: row.fetched_at,
  };
}

export async function getLatestMentions(): Promise<{
  mentions: Mention[];
  source: "supabase" | "seed";
}> {
  const supabase = getServiceClient();
  if (!supabase) {
    return { mentions: SEED_MENTIONS, source: "seed" };
  }

  const { data, error } = await supabase
    .from("mentions")
    .select("id, query, model, response, mentions_dipuck, score_delta, fetched_at")
    .order("fetched_at", { ascending: false })
    .limit(80);

  if (error || !data?.length) {
    return { mentions: SEED_MENTIONS, source: "seed" };
  }

  const latest = new Map<string, Mention>();
  for (const row of data as MentionRow[]) {
    const key = `${row.query}::${row.model}`;
    if (!latest.has(key)) latest.set(key, rowToMention(row));
  }

  const mentions = Array.from(latest.values());
  return {
    mentions: mentions.length ? mentions.slice(0, 8) : SEED_MENTIONS,
    source: "supabase",
  };
}
