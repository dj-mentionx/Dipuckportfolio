export const PERSON = {
  name: "Dipuck Jones",
  givenName: "Dipuck",
  familyName: "Jones",
  jobTitle: "Growth and performance marketing leader",
  city: "Berlin",
  country: "Germany",
  origin: "Chennai",
  email: "rush2dipuck@gmail.com",
  linkedin: "https://www.linkedin.com/in/dipuckjones/",
  linkedinLabel: "linkedin.com/in/dipuckjones",
  mentionx: "https://mentionx.ai",
  mentionxLabel: "MentionX.ai",
  years: 13,
  status: "STATUS: BUILDING THE NEXT SYSTEM",
  statusShort: "CURRENTLY BUILDING / MENTIONX.AI",
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dipuckjones.com";

export const POSITIONING = {
  title: "DIPUCK JONES // SIGNAL ARCHIVE",
  kicker: "DIPUCK JONES / BERLIN / GROWTH SYSTEMS",
  headline: "I find the signal inside broken growth systems.\nThen I build what makes them move.",
  support:
    "Paid acquisition. SEO. AI discovery. Conversion. Automation.\nOne connected commercial system.",
  argument:
    "Dipuck Jones finds the signal inside broken growth systems, then builds what makes them move.",
  description:
    "Berlin-based growth and performance marketing leader with 13+ years across B2B SaaS, enterprise software, ecommerce, paid acquisition, SEO, AI discovery, conversion, automation, attribution and GTM strategy.",
} as const;

export const NAV = [
  { href: "/", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/mentionx", label: "MentionX" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/mentionx", label: "MentionX" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
  { href: PERSON.linkedin, label: "LinkedIn", external: true },
  { href: PERSON.mentionx, label: "MentionX.ai", external: true },
  { href: "/impressum", label: "Impressum" },
  { href: "/privacy", label: "Privacy" },
] as const;
