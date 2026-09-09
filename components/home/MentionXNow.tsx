import Link from "next/link";
import { MENTIONX_PAGE } from "@/lib/archive";

export function MentionXNow() {
  return (
    <section className="now-mx">
      <div className="section-head">
        <p className="kicker">04 / NOW BUILDING / MENTIONX.AI</p>
        <h2>Search changed. Brands are still measuring the old internet.</h2>
        <p className="lede">
          Buyers increasingly ask ChatGPT, Gemini and AI search systems what to buy, who to trust and which tools to
          shortlist. Most brands still cannot see whether they are recommended, omitted or replaced by competitors.
        </p>
        <p className="lede">MentionX turns that invisible discovery layer into a measurable growth signal.</p>
      </div>

      <div className="now-mx__flow" aria-label="MentionX product flow">
        {MENTIONX_PAGE.flow.map((step) => (
          <div key={step.from} className="now-mx__step">
            <span>{step.from}</span>
            <em>→</em>
            <strong>{step.to}</strong>
          </div>
        ))}
      </div>

      <div className="now-mx__engines">
        {MENTIONX_PAGE.engines.map((engine) => (
          <div key={engine} className="now-mx__engine">
            <span />
            {engine}
          </div>
        ))}
      </div>

      <ul className="now-mx__metrics">
        {MENTIONX_PAGE.measures.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="now-mx__note">Conceptual labels for the measurement layer — not live product figures.</p>

      <div className="hero__actions">
        <a href="https://mentionx.ai" className="btn" data-cursor="enter-now" target="_blank" rel="noreferrer">
          EXPLORE MENTIONX.AI
        </a>
        <Link href="/work/mentionx" className="btn btn--ghost" data-cursor="open-signal">
          READ THE FOUNDER CASE SIGNAL
        </Link>
      </div>
    </section>
  );
}
