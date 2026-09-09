import Link from "next/link";

export function FinalCta() {
  return (
    <section className="finale">
      <p className="kicker">08 / NEXT SYSTEM</p>
      <h2>The next growth system could be yours.</h2>
      <p className="lede">
        Whether you are scaling a SaaS company, fixing acquisition efficiency, building AI discovery visibility or
        shaping a stronger GTM engine, start with the signal.
      </p>
      <div className="hero__actions">
        <Link href="/contact" className="btn" data-cursor="start-brief">
          WORK WITH DIPUCK
        </Link>
        <a href="https://mentionx.ai" className="btn btn--ghost" data-cursor="enter-now" target="_blank" rel="noreferrer">
          EXPLORE MENTIONX
        </a>
      </div>
    </section>
  );
}
