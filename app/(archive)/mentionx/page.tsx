import type { Metadata } from "next";
import Link from "next/link";
import { MENTIONX_PAGE } from "@/lib/archive";
import { RadarVisual } from "@/components/cases/CaseVisuals";

export const metadata: Metadata = {
  title: "MentionX / The AI discovery case signal",
  description: MENTIONX_PAGE.headline.replace("\n", " "),
};

export default function MentionXPage() {
  return (
    <article className="page mentionx-page">
      <header className="page-hero">
        <p className="kicker">{MENTIONX_PAGE.title}</p>
        <h1>
          Your next customer may not search Google.
          <br />
          They may ask an AI system who to trust.
        </h1>
      </header>

      {MENTIONX_PAGE.intro.map((paragraph) => (
        <p key={paragraph} className="lede">
          {paragraph}
        </p>
      ))}

      <section className="page__block">
        <h2>A buyer may ask</h2>
        <ul className="mentionx-page__questions">
          {MENTIONX_PAGE.questions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <RadarVisual />

      <section className="page__block">
        <h2>Founder reasoning</h2>
        {MENTIONX_PAGE.founder.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="page__block">
        <h2>Product flow</h2>
        <ol className="case__steps">
          {MENTIONX_PAGE.flow.map((step) => (
            <li key={step.from}>
              {step.from} → {step.to}
            </li>
          ))}
        </ol>
      </section>

      <section className="page__block">
        <h2>What the platform measures</h2>
        <ul className="now-mx__metrics">
          {MENTIONX_PAGE.measures.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="now-mx__note">{MENTIONX_PAGE.accuracy}</p>
      </section>

      <section className="page__block">
        <h2>Why this matters for marketing teams</h2>
        {MENTIONX_PAGE.whyTeams.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="page__block">
        <h2>Why AI visibility is different from traditional SEO</h2>
        {MENTIONX_PAGE.vsSeo.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <div className="hero__actions">
        <a href="https://mentionx.ai" className="btn" data-cursor="enter-now" target="_blank" rel="noreferrer">
          EXPLORE MENTIONX.AI
        </a>
        <Link href="/work/mentionx" className="btn btn--ghost" data-cursor="open-signal">
          OPEN THE FOUNDER CASE
        </Link>
      </div>
    </article>
  );
}
