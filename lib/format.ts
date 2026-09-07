export function formatFetchedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export function visibilityBlocks(score: number): string {
  const filled = Math.max(0, Math.min(10, Math.round(score / 10)));
  return `${"■".repeat(filled)}${"□".repeat(10 - filled)}`;
}

export function shareText(name: string, score: number, mentioned: boolean): string {
  return [
    `AI visibility — ${name}`,
    `${visibilityBlocks(score)}  ${score}`,
    `Mentioned: ${mentioned ? "yes" : "no"}`,
    "scanned via dipuckjones.com",
  ].join("\n");
}

export function clampName(value: string): string {
  return value.replace(/\s+/g, " ").trim().slice(0, 64);
}
