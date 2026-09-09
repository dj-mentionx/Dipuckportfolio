"use client";

import { useEffect, useState } from "react";

const KEY = "dj-cookie-consent";

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  function choose(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* private mode */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <aside className="consent" role="dialog" aria-label="Cookie consent">
      <p>
        Analytics are not live yet. This placeholder stores a local preference so a future measurement layer can
        respect it.
      </p>
      <div className="consent__row">
        <button type="button" onClick={() => choose("declined")}>
          Decline
        </button>
        <button type="button" className="is-solid" onClick={() => choose("accepted")}>
          Accept
        </button>
      </div>
    </aside>
  );
}
