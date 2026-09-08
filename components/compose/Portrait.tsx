"use client";

import Image from "next/image";

type PortraitProps = {
  className?: string;
  alt?: string;
};

export function Portrait({ className, alt = "Dipuck Jones" }: PortraitProps) {
  return (
    <div className={`portrait ${className ?? ""}`}>
      <Image src="/portraits/dipuck.jpg" alt={alt} width={720} height={720} priority />
    </div>
  );
}
