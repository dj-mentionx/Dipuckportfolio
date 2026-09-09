export type DiagnosisStep = {
  label: string;
};

export type GrowthProblem = {
  id: string;
  title: string;
  steps: DiagnosisStep[];
  conclusion: string;
};

export const GROWTH_PROBLEMS: GrowthProblem[] = [
  {
    id: "cac",
    title: "CAC is rising",
    steps: [
      { label: "Audience quality" },
      { label: "Search intent and targeting" },
      { label: "Creative and message match" },
      { label: "Landing-page conversion" },
      { label: "Lead qualification" },
      { label: "CRM and sales feedback" },
    ],
    conclusion: "Higher spend is not the default solution. First find the system leak.",
  },
  {
    id: "pipeline",
    title: "Pipeline is weak",
    steps: [
      { label: "Demand definition" },
      { label: "Channel-to-ICP fit" },
      { label: "Offer and proof on the page" },
      { label: "Lead routing speed" },
      { label: "Sales acceptance criteria" },
      { label: "Feedback into targeting" },
    ],
    conclusion: "Weak pipeline is usually a definition problem before it is a volume problem.",
  },
  {
    id: "leads",
    title: "Leads are not converting",
    steps: [
      { label: "Intent at the form" },
      { label: "Message continuity after the click" },
      { label: "Speed-to-lead and follow-up" },
      { label: "Qualification logic" },
      { label: "Meeting quality" },
      { label: "Handoff into CRM" },
    ],
    conclusion: "Conversion fails in the gaps between teams. Map the journey, then fix the leak.",
  },
  {
    id: "seo",
    title: "SEO traffic is flat",
    steps: [
      { label: "Demand the pages are actually capturing" },
      { label: "Technical crawl and index health" },
      { label: "Internal linking and page purpose" },
      { label: "Content that answers commercial questions" },
      { label: "Authority and cited sources" },
      { label: "Visibility beyond classic search" },
    ],
    conclusion: "Flat SEO is rarely a publishing-volume problem. It is usually a demand-and-structure problem.",
  },
  {
    id: "ai",
    title: "AI systems do not recommend us",
    steps: [
      { label: "Whether the brand is even in the answers" },
      { label: "Which competitors are named instead" },
      { label: "Prompts buyers actually ask" },
      { label: "Sources the models cite" },
      { label: "Narrative gaps on the website" },
      { label: "AEO and GEO actions worth doing first" },
    ],
    conclusion: "You cannot optimise a layer you cannot see. Measure the answers, then choose the work.",
  },
  {
    id: "reporting",
    title: "Reporting cannot be trusted",
    steps: [
      { label: "What the business actually needs to decide" },
      { label: "Source of truth across ads, web and CRM" },
      { label: "Brand versus non-brand logic" },
      { label: "Attribution assumptions" },
      { label: "Sales outcomes versus marketing activity" },
      { label: "A scoreboard teams will use" },
    ],
    conclusion: "Untrusted reporting creates more spend and less learning. Rebuild the scoreboard first.",
  },
];
