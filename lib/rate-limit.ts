import { getServiceClient } from "./supabase";

export const DAILY_LIMIT = 20;

const memory = new Map<string, { count: number; day: string }>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function startOfUtcDay(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}

export async function consumeShareSlot(ipHash: string): Promise<{ ok: true } | { ok: false; retry: "tomorrow" }> {
  const supabase = getServiceClient();

  if (supabase) {
    const { count, error } = await supabase
      .from("share_requests")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("requested_at", startOfUtcDay());

    if (error) {
      return consumeMemory(ipHash);
    }
    if ((count ?? 0) >= DAILY_LIMIT) {
      return { ok: false, retry: "tomorrow" };
    }

    const { error: insertError } = await supabase.from("share_requests").insert({
      ip_hash: ipHash,
    });
    if (insertError) return consumeMemory(ipHash);
    return { ok: true };
  }

  return consumeMemory(ipHash);
}

function consumeMemory(ipHash: string): { ok: true } | { ok: false; retry: "tomorrow" } {
  const day = todayKey();
  const current = memory.get(ipHash);
  if (!current || current.day !== day) {
    memory.set(ipHash, { count: 1, day });
    return { ok: true };
  }
  if (current.count >= DAILY_LIMIT) {
    return { ok: false, retry: "tomorrow" };
  }
  current.count += 1;
  return { ok: true };
}
