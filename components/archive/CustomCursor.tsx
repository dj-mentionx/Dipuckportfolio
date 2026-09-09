"use client";

import { useEffect, useState } from "react";
import { CURSOR_LABEL, CursorContext, type CursorMode } from "./useCursor";

export function CustomCursor({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<CursorMode>("default");
  const [pos, setPos] = useState({ x: -80, y: -80 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (event: PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
      const target = (event.target as HTMLElement | null)?.closest("[data-cursor]");
      const next = (target?.getAttribute("data-cursor") as CursorMode | null) ?? "default";
      setMode(next);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <CursorContext.Provider value={{ mode, setMode }}>
      {children}
      {enabled ? (
        <div className="cursor" aria-hidden style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}>
          <span className={`cursor__ring${mode !== "default" ? " is-hot" : ""}`} />
          <span className="cursor__dot" />
          {CURSOR_LABEL[mode] ? <span className="cursor__label">{CURSOR_LABEL[mode]}</span> : null}
        </div>
      ) : null}
    </CursorContext.Provider>
  );
}
