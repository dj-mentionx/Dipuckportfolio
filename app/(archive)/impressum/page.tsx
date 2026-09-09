import type { Metadata } from "next";
import { PERSON } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal notice placeholder for dipuckjones.com.",
};

export default function ImpressumPage() {
  return (
    <article className="page legal">
      <header className="page-hero">
        <p className="kicker">LEGAL / IMPRESSUM</p>
        <h1>Impressum</h1>
      </header>
      <div className="page__block">
        <p>This is a placeholder legal notice for a Berlin-based personal site.</p>
        <p>
          {PERSON.name}
          <br />
          {PERSON.city}, {PERSON.country}
          <br />
          {PERSON.email}
        </p>
        <p>A complete Impressum with postal address will replace this placeholder before paid advertising is run on the site.</p>
      </div>
    </article>
  );
}
