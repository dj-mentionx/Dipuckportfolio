export type Article = {
  slug: string;
  number: string;
  category: string;
  readTime: string;
  title: string;
  description: string;
  pattern: "grid" | "pulse" | "split" | "leak" | "volume" | "brand" | "mention" | "fail";
  sections: { heading?: string; paragraphs: string[] }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "ai-visibility-is-not-seo",
    number: "01",
    category: "AI Discovery",
    readTime: "8 min",
    title: "AI Visibility Is Not SEO With a New Name",
    description: "Rankings measure a crawlable index. AI answers measure whether a model includes you in a conversation you never see.",
    pattern: "split",
    sections: [
      {
        paragraphs: [
          "SEO still matters. Pages still need to be findable, fast, internally linked and written for a real question. None of that disappeared because ChatGPT exists.",
          "What changed is the layer after the index. A buyer can now ask a model for a recommendation and never visit page two of Google. If your brand is absent from that answer, Search Console will not explain the loss.",
        ],
      },
      {
        heading: "Different evidence",
        paragraphs: [
          "A ranking report tells you where a URL sits for a query. An AI answer tells you whether a brand is named, how it is framed, which competitors replace it, and which domains the model treats as proof.",
          "Those are not the same artefacts. Treating AI visibility as “SEO with extra keywords” produces the wrong work: more blog posts, more exact-match headings, more claims that a team published something the model never used.",
        ],
      },
      {
        heading: "What teams should actually measure",
        paragraphs: [
          "Presence in relevant buyer prompts. Substitution by competitors. The sources cited when a category is explained. The narratives that appear when a product type is recommended.",
          "That measurement will not be as stable as a rank tracker. Answers move. Engines differ. Prompts matter. The point is not to freeze a number. The point is to see a pattern often enough to choose an action.",
        ],
      },
      {
        heading: "AEO and GEO sit beside SEO",
        paragraphs: [
          "Answer engine optimisation and generative engine optimisation are not replacements for technical SEO. They are a second scoreboard for a second discovery surface.",
          "If you already have demand capture, content systems and authority, you are not starting from zero. You are extending the same commercial question: are we present where the buyer is deciding?",
        ],
      },
    ],
  },
  {
    slug: "invisible-in-ai-answers",
    number: "02",
    category: "AI Discovery",
    readTime: "7 min",
    title: "Why Brands Are Invisible in AI Answers",
    description: "Most brands are not losing a ranking. They were never in the conversation the model was asked to finish.",
    pattern: "pulse",
    sections: [
      {
        paragraphs: [
          "Invisibility in AI answers rarely feels like a traffic cliff. It feels like nothing. No alert. No lost-rank ticket. A competitor simply becomes the default name in a category conversation.",
          "That happens for ordinary reasons. The website explains features and not buyer jobs. The category page is written for internal product language. Comparison content does not exist. The sources models already trust never mention the brand.",
        ],
      },
      {
        heading: "The model is completing a story",
        paragraphs: [
          "When someone asks which compliance platform European companies should use, the model is not retrieving your homepage. It is assembling a plausible answer from patterns it has seen: category language, analyst-style framing, vendor names that appear together, and domains that look like evidence.",
          "If your brand is not part of those patterns, you are not “down three positions.” You are outside the story.",
        ],
      },
      {
        heading: "What usually needs to change",
        paragraphs: [
          "Clearer commercial language on the pages that define the product. Proof that a serious buyer would recognise. Mentions in the kinds of sources answers already cite. Fewer generic thought-leadership pages that never name the decision being made.",
          "None of this guarantees an answer. It makes inclusion possible. Measurement then tells you whether the work is landing in the conversations that matter.",
        ],
      },
    ],
  },
  {
    slug: "paid-seo-crm-separate-teams",
    number: "03",
    category: "Systems",
    readTime: "8 min",
    title: "The Real Cost of Treating Paid, SEO and CRM as Separate Teams",
    description: "Disconnected channels do not just waste budget. They teach the company the wrong lesson about what is working.",
    pattern: "fail",
    sections: [
      {
        paragraphs: [
          "The expensive version of this problem is not a turf war. It is a reporting system that cannot tell a true story.",
          "Paid media optimises to a form fill. SEO reports sessions. CRM reports opportunities that arrived through “other.” Each team is locally rational. The commercial system is blind.",
        ],
      },
      {
        heading: "What gets lost",
        paragraphs: [
          "Brand versus non-brand paid search gets mixed into “Google is expensive.” SEO gets credited for demand that paid already created. Sales rejects leads that marketing was never asked to qualify. Lifecycle never sees the promise the ad made.",
          "The company then buys more of the channel that looks cheapest on its own dashboard.",
        ],
      },
      {
        heading: "The cheaper fix is a shared scoreboard",
        paragraphs: [
          "One definition of demand. One view of brand and non-brand. One path from click to meeting to revenue that sales will actually use. Content and landing pages that keep the same commercial sentence from ad to CRM.",
          "That is not a re-org. It is an operating decision: the system is the product, and the channels are inputs.",
        ],
      },
    ],
  },
  {
    slug: "diagnose-rising-cac",
    number: "04",
    category: "Paid Acquisition",
    readTime: "7 min",
    title: "A Better Way to Diagnose Rising CAC",
    description: "Rising CAC is a symptom. The leak is usually earlier than the bid.",
    pattern: "leak",
    sections: [
      {
        paragraphs: [
          "When CAC rises, the default meeting is about spend. Increase budget to hold volume. Cut budget to hold efficiency. Neither move is a diagnosis.",
          "CAC is an output. It moves when audience quality, intent, message, conversion or sales acceptance moves. Treat it as a channel problem and you will bid on a leak.",
        ],
      },
      {
        heading: "A sequence that holds",
        paragraphs: [
          "Start with who is entering the system. Then whether the query or audience matches a buyer you can sell. Then whether the creative and landing page keep the same promise. Then whether the form and follow-up waste the click. Then whether sales would accept the meeting. Then whether CRM feedback ever returns to targeting.",
          "Most teams skip to creative or bid. The leak is often two steps later, in qualification or in a page that was built for a different offer.",
        ],
      },
      {
        heading: "What “fix” looks like",
        paragraphs: [
          "Sometimes the fix is tighter intent. Sometimes it is a landing page that stops changing the story. Sometimes it is speed-to-lead. Sometimes it is the courage to stop buying a segment sales will never take.",
          "Higher spend is not the default solution. First find the system leak.",
        ],
      },
    ],
  },
  {
    slug: "measure-beyond-lead-volume",
    number: "05",
    category: "B2B SaaS",
    readTime: "7 min",
    title: "What B2B SaaS Teams Should Measure Beyond Lead Volume",
    description: "Lead volume is easy to celebrate and easy to game. Pipeline quality is harder and more useful.",
    pattern: "volume",
    sections: [
      {
        paragraphs: [
          "Lead volume is a convenient number because it appears early. It is a dangerous number because it can rise while the business gets weaker.",
          "In B2B SaaS, the useful questions sit later: accepted opportunities, meeting quality, stage conversion, and whether a channel still looks good after sales has touched it.",
        ],
      },
      {
        heading: "A tighter scoreboard",
        paragraphs: [
          "Separate brand and non-brand demand. Track the time from form to first human response. Measure sales acceptance, not only MQL count. Watch which messages produce meetings that resemble the ICP.",
          "If reporting cannot show those things, the team will keep buying volume because volume is the only story the dashboard can tell.",
        ],
      },
      {
        heading: "What this changes in the work",
        paragraphs: [
          "Campaigns get built around commercial intent instead of form-fill rate. Content gets written for the buyer’s actual decision, not the product’s internal taxonomy. CRM stops being a graveyard of “other.”",
          "The point is not to ignore top-of-funnel. It is to refuse a growth story that ends at the form.",
        ],
      },
    ],
  },
  {
    slug: "brand-ai-systems-understand",
    number: "06",
    category: "AEO / GEO",
    readTime: "8 min",
    title: "How to Build a Brand That AI Systems Can Understand",
    description: "Models cannot recommend a company they cannot place. Clarity is not a brand exercise. It is machine-readable commercial language.",
    pattern: "brand",
    sections: [
      {
        paragraphs: [
          "A lot of websites are clear to the people who built them and vague to everyone else. Humans compensate. Models do not.",
          "If a page cannot say who the product is for, what job it does, who it is not for, and why a serious buyer would choose it, an answer engine has little to hold.",
        ],
      },
      {
        heading: "Write the decision, not the slogan",
        paragraphs: [
          "Category language should match how buyers ask. Proof should be specific enough to be used as evidence. Comparison pages should name the real alternatives. About and product pages should agree with each other.",
          "This is close to good SEO and good product marketing. The difference is the audience now includes systems that compress your site into a few sentences.",
        ],
      },
      {
        heading: "Authority is still a source problem",
        paragraphs: [
          "Models lean on domains that already look like references. If those sources never mention you, a perfect homepage may still be invisible.",
          "That does not mean inventing mentions. It means doing the slower work: being present in the places a careful answer would cite, and making the website worthy of that citation.",
        ],
      },
    ],
  },
  {
    slug: "mentioned-vs-recommended",
    number: "07",
    category: "AI Discovery",
    readTime: "6 min",
    title: "The Difference Between Being Mentioned and Being Recommended",
    description: "A name in an answer is not a win. The win is being the brand a buyer is told to shortlist.",
    pattern: "mention",
    sections: [
      {
        paragraphs: [
          "Mention and recommendation are easy to confuse because both look like “we showed up.” They are not the same commercial event.",
          "A mention can be historical, incidental, or buried in a list. A recommendation is the model telling a buyer who to trust, who to trial, or who to shortlist.",
        ],
      },
      {
        heading: "Why the distinction matters",
        paragraphs: [
          "Teams that only count mentions will celebrate noise. Teams that watch substitution will see when a competitor takes the decision.",
          "The useful report is closer to: in this prompt family, are we named, how are we framed, and who is preferred when a choice is required?",
        ],
      },
      {
        heading: "What to do with the gap",
        paragraphs: [
          "If you are mentioned and not recommended, the narrative is usually incomplete: weak proof, unclear ICP, or a category story someone else owns.",
          "If you are absent entirely, start with presence. If you are present and losing, start with the story the model is using instead of yours.",
        ],
      },
    ],
  },
  {
    slug: "growth-systems-fail-before-campaigns",
    number: "08",
    category: "GTM",
    readTime: "7 min",
    title: "Why Growth Systems Fail Before Campaigns Do",
    description: "Campaigns inherit the system they sit in. A sharp ad cannot rescue an unclear offer, a broken handoff, or a scoreboard nobody trusts.",
    pattern: "grid",
    sections: [
      {
        paragraphs: [
          "When growth stalls, the first instinct is to launch. New campaign. New creative. New landing page. New tool. Activity returns. The system does not.",
          "Most failures I see are older than the campaign: demand was never defined, reporting cannot be trusted, sales will not accept the lead, or the website changes the story after the click.",
        ],
      },
      {
        heading: "Campaigns are downstream",
        paragraphs: [
          "Paid media will faithfully buy the audience you give it. SEO will faithfully attract the questions your pages answer. Automation will faithfully send the follow-up you designed. None of those systems can invent a commercial idea that was never made clear.",
          "That is why channel specialists hit a ceiling. The work that moves the company is usually the connection between channels.",
        ],
      },
      {
        heading: "Start with the leak",
        paragraphs: [
          "Choose the signal you are actually seeing. Rising CAC. Weak pipeline. Flat search. Invisible AI answers. Untrusted reporting. Then inspect the path, not the tactic.",
          "The next campaign will be better when the system can tell you why the last one worked.",
        ],
      },
    ],
  },
];

export function articleBySlug(slug: string) {
  return ARTICLES.find((item) => item.slug === slug);
}
