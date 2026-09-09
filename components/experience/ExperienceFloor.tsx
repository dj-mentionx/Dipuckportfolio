"use client";

import type { CSSProperties } from "react";
import { EXPERIENCE_SEATS } from "@/lib/experience";

type ExperienceFloorProps = {
  opened: string[];
  quiet?: boolean;
  onOpen: (id: string) => void;
};

export function ExperienceFloor({ opened, quiet = false, onOpen }: ExperienceFloorProps) {
  return (
    <div className={`xp${quiet ? " is-quiet" : ""}`}>
      <div className="xp__rail">
        <p>
          EXPERIENCE
          <strong>11 SEATS</strong>
        </p>
        <span>Chennai → Berlin</span>
        <em>Click a block. Open the work.</em>
      </div>

      <div className="xp__wall">
        {EXPERIENCE_SEATS.map((seat, index) => (
          <button
            key={seat.id}
            type="button"
            className={`xp__block${seat.featured ? " is-feature" : ""}${opened.includes(seat.id) ? " is-read" : ""}`}
            style={{ "--i": index } as CSSProperties}
            onClick={() => onOpen(seat.id)}
          >
            <i>{seat.index}</i>
            <b>{seat.short}</b>
            <small>{seat.role}</small>
            <em>{seat.dates}</em>
            <span>{seat.line}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
