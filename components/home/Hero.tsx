"use client";

import Link from "next/link";
import { useRef } from "react";
import { POSITIONING } from "@/lib/archive";

export function Hero() {
  const pulse = useRef<HTMLSpanElement>(null);

  function move(event: React.PointerEvent<HTMLElement>) {
    if (!pulse.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    pulse.current.style.setProperty("--px", `${x}%`);
    pulse.current.style.setProperty("--py", `${y}%`);
  }

  return (
    <section className="hero" onPointerMove={move}>
      <div className="hero__grid" aria-hidden />
      <span ref={pulse} className="hero__pulse" aria-hidden />
      <div className="hero__traces" aria-hidden />
      <p className="kicker">{POSITIONING.kicker}</p>
      <h1>
        I find the signal inside broken growth systems.
        <br />
        Then I build what makes them move.
      </h1>
      <p className="hero__support">
        Paid acquisition. SEO. AI discovery. Conversion. Automation.
        <br />
        One connected commercial system.
      </p>
      <div className="hero__actions">
        <Link href="/#archive" className="btn" data-cursor="explore-signals">
          ENTER THE SIGNAL ARCHIVE
        </Link>
        <Link href="/work" className="btn btn--ghost" data-cursor="open-signal">
          VIEW SELECTED WORK
        </Link>
      </div>
      <a href="#what-i-do" className="hero__scroll">
        FOLLOW THE SIGNAL ↓
      </a>
    </section>
  );
}
