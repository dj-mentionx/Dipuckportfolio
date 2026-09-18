"use client";

import Image from "next/image";

type BrandMarkProps = {
  variant?: "hero" | "nav" | "panel";
  className?: string;
  priority?: boolean;
};

export function BrandMark({ variant = "hero", className, priority = false }: BrandMarkProps) {
  return (
    <div className={`brand brand--${variant}${className ? ` ${className}` : ""}`} aria-label="Dipuck Jones">
      <Image
        className="brand__metal"
        src="/brand/dipuck-jones-metallic.png"
        alt="Dipuck Jones"
        width={1600}
        height={900}
        priority={priority}
        sizes={variant === "hero" ? "min(92vw, 920px)" : variant === "panel" ? "280px" : "160px"}
      />
      <span className="brand__gleam" aria-hidden />
      <span className="brand__glow" aria-hidden />
    </div>
  );
}

/** Scalable metallic wordmark when an image lockup is too heavy. */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <p className={`brand-word${className ? ` ${className}` : ""}`} aria-label="Dipuck Jones">
      <span className="brand-word__dipuck">DIPUCK</span>
      <span className="brand-word__jones">JONES</span>
    </p>
  );
}
