"use client";

import { useState } from "react";
import { SYSTEM_NODES } from "@/lib/archive";

export function SystemMap() {
  const [active, setActive] = useState<(typeof SYSTEM_NODES)[number]["id"]>("demand");
  const node = SYSTEM_NODES.find((item) => item.id === active) ?? SYSTEM_NODES[0];

  return (
    <section id="what-i-do" className="system-map">
      <div className="section-head">
        <p className="kicker">02 / WHAT I ACTUALLY DO</p>
        <h2>A commercial system, not a stack of channels.</h2>
      </div>
      <div className="system-map__stage">
        <svg className="system-map__lines" viewBox="0 0 1200 220" aria-hidden>
          <path d="M80 110 C 220 20, 380 200, 520 110 S 820 20, 1120 110" />
          <path d="M80 110 C 260 200, 460 10, 680 120 S 980 210, 1120 110" />
        </svg>
        <ol>
          {SYSTEM_NODES.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={item.id === active ? "is-on" : undefined}
                data-cursor="inspect"
                onMouseEnter={() => setActive(item.id)}
                onFocus={() => setActive(item.id)}
                onClick={() => setActive(item.id)}
              >
                <em>0{index + 1}</em>
                {item.name}
              </button>
            </li>
          ))}
        </ol>
        <aside>
          <p className="kicker">{node.name}</p>
          <p>{node.copy}</p>
        </aside>
      </div>
    </section>
  );
}
