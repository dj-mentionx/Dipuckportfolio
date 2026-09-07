import { CaseFile } from "@/components/CaseFile";
import { getLatestMentions } from "@/lib/mentions";

export const revalidate = 3600;

export default async function HomePage() {
  const { mentions, source } = await getLatestMentions();
  return <CaseFile mentions={mentions} source={source} />;
}
