import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseTemplate } from "@/components/cases/CaseTemplate";
import { CASES, PERSON, SITE_URL, caseBySlug } from "@/lib/archive";

export function generateStaticParams() {
  return CASES.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const signal = caseBySlug(params.slug);
  if (!signal) return {};
  return {
    title: `${signal.name} / Case signal`,
    description: signal.hero,
  };
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const signal = caseBySlug(params.slug);
  if (!signal) notFound();

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: signal.hero,
    author: { "@type": "Person", name: PERSON.name },
    publisher: { "@type": "Person", name: PERSON.name },
    mainEntityOfPage: `${SITE_URL}/work/${signal.slug}`,
    description: signal.signal,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <CaseTemplate signal={signal} />
    </>
  );
}
