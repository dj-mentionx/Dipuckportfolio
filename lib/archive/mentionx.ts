export const MENTIONX_PAGE = {
  title: "MENTIONX / THE AI DISCOVERY CASE SIGNAL",
  headline: "Your next customer may not search Google.\nThey may ask an AI system who to trust.",
  intro: [
    "AI discovery is changing how people find software, compare brands and make buying decisions.",
    "If your brand is not present in the answer, traditional rankings alone will not explain the loss.",
    "MentionX is built to help brands measure and improve this new discovery layer.",
  ],
  questions: [
    "What is the best compliance platform for European companies?",
    "Which AI visibility tools should a B2B SaaS company use?",
    "What are the best CRM automation tools for an aesthetic clinic?",
    "Which project management platforms are best for construction teams?",
  ],
  founder: [
    "I started MentionX because the discovery layer was moving faster than the measurement layer.",
    "Teams still know how to read Google Ads, Search Console and CRM reports. They do not have an equivalent view of whether ChatGPT or Gemini would name them, omit them, or recommend a competitor.",
    "The work is not to pretend AI answers can be fully controlled. They are dynamic. They vary by prompt, market, engine and time. The work is to make patterns visible so teams can decide what to do next.",
  ],
  flow: [
    { from: "Brand URL", to: "Website and market intelligence" },
    { from: "Website and market intelligence", to: "Buyer-style prompts" },
    { from: "Buyer-style prompts", to: "AI engine responses" },
    { from: "AI engine responses", to: "Brand visibility, competitors and cited sources" },
    { from: "Brand visibility, competitors and cited sources", to: "Prioritised actions" },
  ],
  engines: ["ChatGPT", "Gemini", "Future engines"],
  measures: [
    "AI Visibility",
    "Brand Mentions",
    "Competitor Presence",
    "Source Citations",
    "Narrative Gaps",
    "Recommended Actions",
  ],
  whyTeams: [
    "Marketing teams cannot improve a recommendation layer they cannot see.",
    "AI visibility work without measurement becomes another content sprint with no scoreboard.",
    "The useful question is not “did we mention AI in the blog?” It is “are we present in the buyer conversations that matter, against the competitors that matter?”",
  ],
  vsSeo: [
    "Traditional SEO measures pages, queries and rankings in an index you can crawl.",
    "AI discovery measures whether a model includes a brand inside an answer it generates.",
    "The sources that shape those answers are not the same as a ranking report. Cited domains, competitor substitution and narrative presence become the new evidence.",
    "AEO and GEO sit beside SEO. They do not replace it, and they should not be sold as a renamed ranking package.",
  ],
  accuracy:
    "AI answers are dynamic, vary by prompt, market, engine and time. MentionX is designed to make patterns visible so teams can make better decisions.",
} as const;
