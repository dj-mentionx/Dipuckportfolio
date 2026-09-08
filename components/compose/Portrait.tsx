"use client";

import Image from "next/image";

type PortraitProps = {
  className?: string;
  alt?: string;
  live?: boolean;
};

export function Portrait({ className, alt = "Dipuck Jones", live = false }: PortraitProps) {
  return (
    <div className={`portrait ${live ? "is-live" : "is-print"} ${className ?? ""}`}>
      <div className="portrait__plate" aria-hidden />
      <div className="portrait__print-wrap">
        <Image className="portrait__print" src="/portraits/dipuck.jpg" alt={alt} fill sizes="380px" priority />
      </div>
      <div className="portrait__ghost" aria-hidden />
      <span className="portrait__scan" aria-hidden />
    </div>
  );
}
