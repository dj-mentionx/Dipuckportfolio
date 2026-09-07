import { getLatestMentions } from "@/lib/mentions";

export const revalidate = 3600;

export async function GET() {
  const payload = await getLatestMentions();
  return Response.json(payload);
}
