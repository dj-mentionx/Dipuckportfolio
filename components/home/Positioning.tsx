import Link from "next/link";

export function Positioning() {
  return (
    <section className="position">
      <div className="section-head">
        <p className="kicker">07 / PERSONAL POSITIONING</p>
        <h2>
          Not a channel specialist.
          <br />
          A systems thinker with hands-on depth.
        </h2>
      </div>
      <div className="position__copy">
        <p>
          I grew up in Chennai, built my career across SaaS, enterprise and high-growth teams, and now work from
          Berlin at the intersection of performance marketing and AI discovery.
        </p>
        <p>
          I care less about activity metrics and more about the commercial system behind them: how buyers discover a
          brand, where demand leaks, what sales teams can act on, and how growth becomes repeatable.
        </p>
        <p>
          I can operate at strategy level, but I am equally comfortable getting into campaign architecture, reporting
          logic, landing-page decisions, conversion tracking, search demand and automation workflows.
        </p>
        <Link href="/about" className="btn btn--ghost" data-cursor="open-signal">
          MORE ABOUT DIPUCK
        </Link>
      </div>
    </section>
  );
}
