"use client";

import { TICKER } from "@/lib/compose";

export function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker__track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
