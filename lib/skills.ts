export type Skill = {
  id: string
  name: string
  short: string
  blurb: string
}

export const SKILLS: Skill[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    short: "Search · Display · YouTube",
    blurb: "Paid search and media that has to justify the spend, not just the click.",
  },
  {
    id: "seo",
    name: "SEO",
    short: "Findable pages",
    blurb: "Technical and content work so the product shows up when someone is already looking.",
  },
  {
    id: "linkedin-ads",
    name: "LinkedIn Ads",
    short: "B2B demand",
    blurb: "Account and role targeting for pipelines that do not start on Instagram.",
  },
  {
    id: "aeo-geo",
    name: "AEO / GEO",
    short: "Answer engines",
    blurb: "Making a brand answerable in AI search, not only ranked in ten blue links.",
  },
  {
    id: "keyword",
    name: "Keyword optimisation",
    short: "Intent, not volume",
    blurb: "Picking the queries that match the sale, then writing and bidding to them.",
  },
  {
    id: "roi",
    name: "ROI optimisation",
    short: "Spend vs return",
    blurb: "Cutting waste and moving budget to the channels that actually close.",
  },
  {
    id: "pipeline",
    name: "Pipeline optimisation",
    short: "Lead → close",
    blurb: "Fixing the handoff between ads, CRM, and sales so volume becomes revenue.",
  },
  {
    id: "reporting",
    name: "Reporting & dashboards",
    short: "One source of truth",
    blurb: "Numbers that a founder or a board can read without a translator.",
  },
  {
    id: "agency",
    name: "Agency management",
    short: "Partners on the brief",
    blurb: "Briefing, QA, and firing the work that does not match the strategy.",
  },
  {
    id: "budget",
    name: "Budget ownership",
    short: "P&L, not a guess",
    blurb: "Holding media and agency spend when the number has to land.",
  },
]

export type SkillChip = {
  id: string
  name: string
  featured: boolean
  skillId: string
  x: number
  y: number
  z: number
}

function fibonacci(count: number, radius: number): { x: number; y: number; z: number }[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    return {
      x: Math.cos(theta) * r * radius,
      y: y * radius,
      z: Math.sin(theta) * r * radius,
    }
  })
}

/** Dense globe: 10 featured skills + echo chips so the sphere feels packed. */
export const SKILL_CHIPS: SkillChip[] = (() => {
  const featured = fibonacci(SKILLS.length, 1)
  const mid = fibonacci(18, 0.86)
  const echoes = fibonacci(36, 0.64)
  const featuredChips: SkillChip[] = SKILLS.map((skill, i) => ({
    id: skill.id,
    name: skill.name,
    featured: true,
    skillId: skill.id,
    ...featured[i],
  }))
  const echoChips: SkillChip[] = [...mid, ...echoes].map((pos, i) => {
    const skill = SKILLS[i % SKILLS.length]
    return {
      id: `echo-${i}`,
      name: skill.short,
      featured: false,
      skillId: skill.id,
      ...pos,
    }
  })
  return [...featuredChips, ...echoChips]
})()
