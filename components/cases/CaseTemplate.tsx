"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CaseSignal } from "@/lib/archive";
import { CaseVisual } from "./CaseVisuals";

const SECTIONS = ["Signal", "Work", "Proof", "Disciplines"] as const;

export function CaseTemplate({ signal }: { signal: CaseSignal }) {
  const [section, setSection] = useState(0);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-case-section]"));
    const onScroll = () => {
      const index = nodes.findIndex((node) => node.getBoundingClientRect().top > 120);
      setSection(index === -1 ? nodes.length - 1 : Math.max(0, index - 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <article className={`case is-${signal.slug}`} style={{ ["--case-tint" as string]: signal.tint }}>
      <div className="case__progress" aria-hidden>
        {SECTIONS.map((label, index) => (
          <span key={label} className={index <= section ? "is-on" : undefined}>
            {label}
          </span>
        ))}
      </div>

      <header className="page-hero">
        <p className="kicker">
          CASE {signal.number} / {signal.category.toUpperCase()}
        </p>
        <p className="case__name">{signal.name}</p>
        {signal.role ? <p className="case__role">{signal.role}</p> : null}
        <h1>{signal.hero}</h1>
        <Link href="/#archive" className="btn btn--ghost" data-cursor="explore-signals">
          RETURN TO THE FIELD
        </Link>
      </header>

      <CaseVisual kind={signal.visual} />

      <section data-case-section className="case__block">
        <p className="kicker">Signal detected</p>
        <p>{signal.signal}</p>
      </section>

      {signal.decision ? (
        <section className="case__block">
          <p className="kicker">The decision</p>
          <p>{signal.decision}</p>
        </section>
      ) : null}

      {signal.system?.length ? (
        <section data-case-section className="case__block">
          <p className="kicker">The system</p>
          <ol className="case__steps">
            {signal.system.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      ) : null}

      {signal.work.length ? (
        <section data-case-section className="case__block">
          <p className="kicker">The work</p>
          <ul>
            {signal.work.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {signal.reveals?.length ? (
        <section className="case__block">
          <p className="kicker">What MentionX is designed to reveal</p>
          <ul>
            {signal.reveals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {signal.founderInsight ? (
        <section className="case__block">
          <p className="kicker">Founder insight</p>
          <p>{signal.founderInsight}</p>
        </section>
      ) : null}

      <section data-case-section className="case__block">
        <p className="kicker">What it proved</p>
        <p>{signal.proved}</p>
      </section>

      <section data-case-section className="case__block">
        <p className="kicker">Disciplines</p>
        <p className="case__tags">{signal.disciplines.join(" / ")}</p>
      </section>

      {signal.cta ? (
        <a
          href={signal.cta.href}
          className="btn"
          data-cursor="enter-now"
          target={signal.cta.external ? "_blank" : undefined}
          rel={signal.cta.external ? "noreferrer" : undefined}
        >
          {signal.cta.label}
        </a>
      ) : (
        <Link href="/contact" className="btn" data-cursor="start-brief">
          OPEN A GROWTH BRIEF
        </Link>
      )}
    </article>
  );
}
