import { clampName } from "@/lib/format";
import { clientIp, hashIp } from "@/lib/hash";
import { demoScan, hasAnyModelKey, queryFirstAvailable, scoreFromAnswer } from "@/lib/llm";
import { consumeShareSlot } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Send a name." }, { status: 400 });
  }

  const raw = typeof body === "object" && body && "name" in body ? String((body as { name: unknown }).name) : "";
  const name = clampName(raw);
  if (name.length < 2) {
    return Response.json({ error: "Use a real name or brand — at least two characters." }, { status: 400 });
  }

  const ipHash = await hashIp(clientIp(req));
  const slot = await consumeShareSlot(ipHash);
  if (!slot.ok) {
    return Response.json(
      { error: "This desk is closed for the day. Try again tomorrow.", retry: "tomorrow" },
      { status: 429 },
    );
  }

  const query = `When someone asks an AI model about B2B SaaS growth, AEO, or demand generation, does "${name}" get mentioned? Answer as a short visibility verdict.`;

  if (!hasAnyModelKey()) {
    return Response.json(demoScan(name));
  }

  try {
    const answer = await queryFirstAvailable(query);
    return Response.json(scoreFromAnswer(name, answer.text, answer.model));
  } catch {
    return Response.json(demoScan(name));
  }
}
