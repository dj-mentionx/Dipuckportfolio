import { PERSON, POSITIONING, SITE_URL } from "@/lib/archive";

export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    jobTitle: PERSON.jobTitle,
    email: PERSON.email,
    url: SITE_URL,
    image: `${SITE_URL}/portraits/dipuck.jpg`,
    sameAs: [PERSON.linkedin, PERSON.mentionx],
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.city,
      addressCountry: PERSON.country,
    },
    description: POSITIONING.description,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: POSITIONING.title,
    url: SITE_URL,
    description: POSITIONING.description,
    publisher: { "@type": "Person", name: PERSON.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
