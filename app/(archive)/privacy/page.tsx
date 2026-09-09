import type { Metadata } from "next";
import { PERSON } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy placeholder for dipuckjones.com.",
};

export default function PrivacyPage() {
  return (
    <article className="page legal">
      <header className="page-hero">
        <p className="kicker">LEGAL / PRIVACY</p>
        <h1>Privacy policy</h1>
      </header>
      <div className="page__block">
        <p>
          This page is a placeholder for a full privacy policy. The site currently stores a local cookie-preference
          flag in the browser and does not run third-party analytics until that layer is connected.
        </p>
        <p>
          Contact requests submitted through the form are processed only to reply to the brief. Do not send special
          category personal data.
        </p>
        <p>
          Controller: {PERSON.name}, {PERSON.city}, {PERSON.country}. Email: {PERSON.email}.
        </p>
      </div>
    </article>
  );
}
