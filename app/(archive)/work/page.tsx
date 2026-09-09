import type { Metadata } from "next";
import Link from "next/link";
import { CASES, WORK_DISCLAIMER } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Selected work / Case signals",
  description: "Commercial challenges, decisions, systems and lessons from selected work.",
};

export default function WorkPage() {
  return (
    <article className="page">
      <header className="page-hero">
        <p className="kicker">SELECTED WORK / CASE SIGNALS</p>
        <h1>The work below is not presented as a list of responsibilities.</h1>
        <p className="lede">
          Each case signal shows the commercial challenge, the decisions made, the systems built and the lessons
          carried forward.
        </p>
        <p className="page__disclaimer">{WORK_DISCLAIMER}</p>
      </header>
      <div className="proof__list">
        {CASES.map((item) => (
          <Link key={item.slug} href={`/work/${item.slug}`} className="proof__strip" data-cursor="open-signal">
            <em>{item.number}</em>
            <div>
              <strong>{item.name}</strong>
              <span>{item.category}</span>
            </div>
            <p>{item.hero}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
