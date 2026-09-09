import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT, PERSON } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Open a growth brief",
  description: CONTACT.support,
};

export default function ContactPage() {
  return (
    <article className="page">
      <header className="page-hero">
        <p className="kicker">{CONTACT.title}</p>
        <h1>{CONTACT.headline}</h1>
        <p className="lede">{CONTACT.support}</p>
      </header>
      <ContactForm />
      <aside className="brief__aside">
        <p>Berlin, Germany</p>
        <a href={PERSON.linkedin} target="_blank" rel="noreferrer">
          {PERSON.linkedinLabel}
        </a>
        <a href={PERSON.mentionx} target="_blank" rel="noreferrer">
          {PERSON.mentionxLabel}
        </a>
        <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
      </aside>
    </article>
  );
}
