import Link from "next/link";
import { ARTEFACTS, PROOF_STRIP_IDS } from "@/lib/archive";

export function SelectedProof() {
  const strips = ARTEFACTS.filter((item) => PROOF_STRIP_IDS.includes(item.id as (typeof PROOF_STRIP_IDS)[number]));

  return (
    <section className="proof">
      <div className="section-head">
        <p className="kicker">06 / SELECTED PROOF</p>
        <h2>
          Different companies. Same principle.
          <br />
          Make the commercial system clearer.
        </h2>
      </div>
      <div className="proof__list">
        {strips.map((item) => (
          <Link key={item.id} href={item.href} className="proof__strip" data-cursor="open-signal">
            <em>{item.number}</em>
            <div>
              <strong>{item.name}</strong>
              <span>{item.category}</span>
            </div>
            <p>{item.impact}</p>
          </Link>
        ))}
      </div>
      <Link href="/work" className="btn" data-cursor="open-signal">
        OPEN ALL CASE SIGNALS
      </Link>
    </section>
  );
}
