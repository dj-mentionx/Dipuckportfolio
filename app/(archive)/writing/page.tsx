import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Writing / Signal notes",
  description: "Notes on growth systems, AI discovery, SEO, paid acquisition and GTM.",
};

export default function WritingPage() {
  return (
    <article className="page">
      <header className="page-hero">
        <p className="kicker">WRITING / SIGNAL NOTES</p>
        <h1>Short and practical notes on growth systems.</h1>
        <p className="lede">
          AI discovery, SEO, paid acquisition, GTM and what changes when buyers change how they search.
        </p>
      </header>
      <div className="notes">
        {ARTICLES.map((article) => (
          <Link key={article.slug} href={`/writing/${article.slug}`} className={`note is-${article.pattern}`} data-cursor="open-signal">
            <span className="note__pattern" aria-hidden />
            <em>
              {article.category} · {article.readTime}
            </em>
            <strong>{article.title}</strong>
            <p>{article.description}</p>
            <small>READ NOTE</small>
          </Link>
        ))}
      </div>
    </article>
  );
}
