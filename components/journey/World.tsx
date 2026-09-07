"use client";

import type { ReactNode } from "react";
import type { RoomId } from "@/lib/rooms";

type WorldProps = {
  progress: number;
  onOpen: (room: RoomId) => void;
};

const DOORS: { id: RoomId; label: string; house: string }[] = [
  { id: "about", label: "ABOUT", house: "The cottage" },
  { id: "exp", label: "EXP", house: "The archive" },
  { id: "bomb", label: "BOMB", house: "MentionX" },
  { id: "contact", label: "CONTACT", house: "The desk" },
];

export function World({ progress, onOpen }: WorldProps) {
  const inCity = progress > 0.68;
  const shift = progress * 200;

  return (
    <div className="world-layers">
      <div className="plate-track" style={{ transform: `translate3d(-${shift}vw, 0, 0)` }}>
        <Plate src="/art/plate-forest.png" alt="Moonlit forest path" />
        <Plate src="/art/plate-village.png" alt="Lantern village at blue hour" />
        <Plate src="/art/plate-city.png" alt="Night city of cinema houses">
          <div className={`marquee-row ${inCity ? "is-lit" : ""}`}>
            {DOORS.map((door) => (
              <button key={door.id} type="button" disabled={!inCity} onClick={() => onOpen(door.id)}>
                <b>{door.label}</b>
                <span>{door.house}</span>
              </button>
            ))}
          </div>
        </Plate>
      </div>
    </div>
  );
}

function Plate({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children?: ReactNode;
}) {
  return (
    <section className="plate">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} draggable={false} />
      {children}
    </section>
  );
}
