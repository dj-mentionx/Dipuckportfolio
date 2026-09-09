export type CaseSignal = {
  slug: string;
  number: string;
  name: string;
  category: string;
  role?: string;
  hero: string;
  signal: string;
  work: string[];
  decision?: string;
  system?: string[];
  reveals?: string[];
  founderInsight?: string;
  proved: string;
  disciplines: string[];
  visual: "align" | "blueprint" | "curve" | "network" | "collapse" | "radar";
  tint: string;
  href?: string;
  cta?: { label: string; href: string; external?: boolean };
};

export const CASES: CaseSignal[] = [
  {
    slug: "eqs-group",
    number: "01",
    name: "EQS GROUP",
    category: "B2B SaaS / Compliance and Ethics",
    role: "Senior Performance Marketing Manager",
    hero: "From fragmented channel activity to a more connected demand and visibility system.",
    signal:
      "Paid acquisition, SEO, reporting and campaign execution were operating as separate activities instead of one commercial system.",
    work: [
      "Built and optimised paid acquisition activity across Google Ads, LinkedIn and Microsoft Ads",
      "Strengthened campaign structure around commercial intent, audience relevance and landing-page alignment",
      "Developed clearer brand versus non-brand reporting logic",
      "Improved campaign visibility and reporting workflows through HubSpot and Looker Studio",
      "Contributed to SEO content planning, technical prioritisation, internal linking and AI-search visibility thinking",
      "Worked across product marketing, content, sales and marketing operations to improve commercial alignment",
    ],
    proved:
      "Growth improves faster when channel decisions, reporting and conversion paths are connected rather than treated as separate projects.",
    disciplines: [
      "Paid Search",
      "Paid Social",
      "B2B SaaS",
      "HubSpot",
      "Looker Studio",
      "SEO",
      "AI Visibility",
      "Demand Generation",
    ],
    visual: "align",
    tint: "12 8 8",
  },
  {
    slug: "thinkproject",
    number: "02",
    name: "THINKPROJECT",
    category: "Enterprise SaaS / Construction Technology",
    hero: "Enterprise demand needs precision, not more noise.",
    signal:
      "Complex enterprise products need demand generation that translates product value into relevant commercial intent.",
    work: [
      "Supported performance-led acquisition thinking in an enterprise SaaS environment",
      "Worked with high-intent audience and demand-generation strategies",
      "Focused on message relevance, channel efficiency and clearer buyer-journey alignment",
      "Applied a commercial lens to paid media and growth activity across complex markets",
    ],
    proved:
      "In enterprise SaaS, better qualification and stronger demand architecture are more valuable than superficial lead volume.",
    disciplines: ["Enterprise SaaS", "Demand Generation", "Paid Acquisition", "GTM", "Buyer Journey"],
    visual: "blueprint",
    tint: "8 9 11",
  },
  {
    slug: "zalando",
    number: "03",
    name: "ZALANDO",
    category: "Ecommerce / Growth at Scale",
    hero: "At scale, the smallest decisions compound.",
    signal:
      "Large-scale growth requires continuous experimentation across customer relevance, channel performance and commercial efficiency.",
    work: [
      "Applied performance marketing thinking in a high-velocity ecommerce environment",
      "Worked within a commercial context where customer relevance, speed and execution quality matter every day",
      "Learned how disciplined experimentation compounds when scale and complexity increase",
    ],
    proved: "Scale does not reduce the need for sharp testing. It makes the quality of testing more important.",
    disciplines: ["Ecommerce", "Performance Marketing", "Experimentation", "Growth"],
    visual: "curve",
    tint: "10 8 8",
  },
  {
    slug: "gofrugal",
    number: "04",
    name: "GOFRUGAL",
    category: "SaaS / Retail Technology",
    hero: "Strong software only grows when the market understands why it matters.",
    signal:
      "Product capability does not automatically translate into demand. Positioning, discovery, message and adoption path must work together.",
    work: [
      "Supported SaaS growth in a practical, customer-led technology environment",
      "Connected growth thinking to how real businesses discover, evaluate and adopt software",
      "Worked across commercial storytelling, digital acquisition and market relevance",
    ],
    proved: "Marketing is not decoration around product. It is part of how product reaches the market.",
    disciplines: ["SaaS", "GTM", "Demand Capture", "Commercial Strategy", "Growth"],
    visual: "network",
    tint: "9 10 8",
  },
  {
    slug: "freshworks",
    number: "05",
    name: "FRESHWORKS",
    category: "SaaS / Global Product Growth",
    hero: "Simple product stories win when markets are crowded.",
    signal:
      "When software categories become crowded, clear value communication and a frictionless buyer path matter more than louder messaging.",
    work: [
      "Developed practical understanding of SaaS growth in a global technology environment",
      "Applied commercial and user-focused thinking to digital acquisition and product marketing",
      "Strengthened an approach centred on buyer clarity and demand relevance",
    ],
    proved: "The best growth work makes a complex product feel easier to understand and easier to choose.",
    disciplines: ["SaaS", "Product Marketing", "Growth", "Demand Generation"],
    visual: "collapse",
    tint: "11 8 8",
  },
  {
    slug: "mentionx",
    number: "06",
    name: "MENTIONX.AI",
    category: "Founder Project / AI Discovery Intelligence",
    hero: "Building for the place where future demand begins.",
    signal:
      "Modern buyers increasingly ask AI systems for recommendations, comparisons and purchase guidance. Brands cannot reliably measure how they appear in those answers, which competitors replace them or which sources shape AI recommendations.",
    decision: "Build a product that makes AI discovery measurable and actionable.",
    system: [
      "A brand enters its website URL",
      "The system identifies website, product, market and competitor context",
      "Buyer-style prompts are generated around relevant commercial questions",
      "Prompts are run across supported AI engines",
      "The platform measures visibility, mentions, position, competitors and cited sources",
      "The result is translated into prioritised AEO and GEO actions",
    ],
    reveals: [
      "Whether a brand appears in relevant AI answers",
      "Which competitors are recommended instead",
      "How frequently the brand is surfaced",
      "Which source domains shape AI responses",
      "Which narratives the brand is missing",
      "Which website, content and authority actions should be prioritised",
    ],
    founderInsight:
      "AI visibility is not simply “ranking in ChatGPT.” It is whether a brand is present in the right buyer conversation, with the right narrative, against the right competitors.",
    work: [],
    proved: "Dipuck is not only reacting to the AI-discovery shift. He is building a product for it.",
    disciplines: [
      "Product Strategy",
      "AI Discovery",
      "GEO",
      "AEO",
      "SaaS GTM",
      "Market Intelligence",
      "Founder-Led Growth",
    ],
    visual: "radar",
    tint: "14 6 6",
    href: "https://mentionx.ai",
    cta: { label: "EXPLORE MENTIONX.AI", href: "https://mentionx.ai", external: true },
  },
];

export const WORK_DISCLAIMER =
  "Some work involved confidential performance data. Where exact figures cannot be shared publicly, outcomes are described accurately without publishing sensitive commercial information.";

export function caseBySlug(slug: string) {
  return CASES.find((item) => item.slug === slug);
}
