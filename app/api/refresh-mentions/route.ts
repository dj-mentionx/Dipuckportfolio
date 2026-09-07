import { QUERIES } from "@/lib/models";
import { queryAllModels } from "@/lib/llm";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return Response.json({ ok: false, error: "Supabase is not configured" }, { status: 503 });
  }

  const inserted: Array<{ query: string; model: string }> = [];

  for (const query of QUERIES) {
    const results = await queryAllModels(query);
    if (!results.length) continue;

    const rows = results.map((result) => ({
      query,
      model: result.model,
      response: result.text.slice(0, 1200),
      mentions_dipuck: result.text.toLowerCase().includes("dipuck"),
      score_delta: result.text.toLowerCase().includes("dipuck") ? 16 : 5,
    }));

    const { error } = await supabase.from("mentions").insert(rows);
    if (error) {
      return Response.json({ ok: false, error: error.message, inserted }, { status: 500 });
    }
    inserted.push(...rows.map((row) => ({ query: row.query, model: row.model })));
  }

  return Response.json({ ok: true, inserted: inserted.length });
}
