"use client";

type BrandMarkProps = {
  variant?: "hero" | "nav" | "panel";
  className?: string;
  priority?: boolean;
};

/**
 * Clean lockup that sits on the black site — no image plate.
 * DIPUCK stays the hero weight; JONES tracks wide underneath in red.
 */
export function BrandMark({ variant = "hero", className }: BrandMarkProps) {
  return (
    <p
      className={`brand brand--${variant}${className ? ` ${className}` : ""}`}
      aria-label="Dipuck Jones"
    >
      <span className="brand__dipuck" aria-hidden>
        {"DIPUCK".split("").map((ch, i) => (
          <i key={`d-${ch}-${i}`}>{ch}</i>
        ))}
      </span>
      <span className="brand__jones" aria-hidden>
        {"JONES".split("").map((ch, i) => (
          <i key={`j-${ch}-${i}`}>{ch}</i>
        ))}
      </span>
    </p>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return <BrandMark variant="panel" className={className} />;
}
