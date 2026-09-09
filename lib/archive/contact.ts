export const CONTACT = {
  title: "OPEN A GROWTH BRIEF",
  headline: "Start with the problem. Not the channel.",
  support: "Tell me what is not moving, where the system feels unclear or what you are trying to build.",
  success: "Signal received.\nI will review the system and get back to you.",
  collaboration: ["Hiring", "Consulting", "Advisory", "Speaking", "Other"] as const,
  budgets: [
    "Not spending yet",
    "Under €10k / month",
    "€10k–€40k / month",
    "€40k–€100k / month",
    "€100k+ / month",
    "Prefer not to say",
  ] as const,
  bottlenecks: [
    "CAC is rising",
    "Pipeline is weak",
    "Leads are not converting",
    "SEO is flat",
    "AI systems do not recommend us",
    "Reporting cannot be trusted",
    "We are still shaping GTM",
    "Something else",
  ] as const,
};

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  website: string;
  improve: string;
  bottleneck: string;
  budget: string;
  collaboration: string;
};
