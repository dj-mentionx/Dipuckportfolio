import type { Metadata } from "next";
import Link from "next/link";
import { ABOUT, PERSON } from "@/lib/archive";

export const metadata: Metadata = {
  title: "About / The operator behind the system",
  description: ABOUT.hero,
};

export default function AboutPage() {
  return (
    <article className="page">
      <header className="page-hero">
        <p className="kicker">{ABOUT.title}</p>
        <h1>{ABOUT.hero}</h1>
      </header>

      <section className="page__block">
        <h2>{ABOUT.pointOfView.title}</h2>
        {ABOUT.pointOfView.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="page__block">
        <h2>{ABOUT.background.title}</h2>
        {ABOUT.background.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="page__block">
        <h2>The difference</h2>
        <ol className="about__statements">
          {ABOUT.difference.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="page__block">
        <h2>What I am building</h2>
        {ABOUT.building.map((item) => (
          <div key={item.id} id={item.id} className="about__build">
            <h3>{item.name}</h3>
            <p>{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="page__block">
        <h2>Ways to work together</h2>
        {ABOUT.ways.map((item) => (
          <div key={item.name} className="about__build">
            <h3>{item.name}</h3>
            <p>{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="page__block">
        <h2>Personal detail</h2>
        <ul className="about__personal">
          {ABOUT.personal.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href="/contact" className="btn" data-cursor="start-brief">
          OPEN A GROWTH BRIEF
        </Link>
        <p className="page__meta">
          {PERSON.city} · {PERSON.email}
        </p>
      </section>
    </article>
  );
}
