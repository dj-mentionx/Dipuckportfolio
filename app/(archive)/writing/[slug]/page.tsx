import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, PERSON, SITE_URL, articleBySlug } from "@/lib/archive";

export function generateStaticParams() {
  return ARTICLES.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articleBySlug(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} / Signal notes`,
    description: article.description,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articleBySlug(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: { "@type": "Person", name: PERSON.name, url: SITE_URL },
    publisher: { "@type": "Person", name: PERSON.name },
    mainEntityOfPage: `${SITE_URL}/writing/${article.slug}`,
  };

  return (
    <article className="page article">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="page-hero">
        <p className="kicker">
          {article.category.toUpperCase()} · {article.readTime.toUpperCase()}
        </p>
        <h1>{article.title}</h1>
        <p className="lede">{article.description}</p>
      </header>
      {article.sections.map((section, index) => (
        <section key={section.heading ?? index} className="page__block">
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <Link href="/writing" className="btn btn--ghost" data-cursor="open-signal">
        ALL SIGNAL NOTES
      </Link>
    </article>
  );
}
