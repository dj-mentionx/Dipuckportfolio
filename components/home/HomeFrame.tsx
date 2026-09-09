"use client";

import { useEffect } from "react";

export function HomeFrame({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("is-home");
    document.body.classList.add("is-home");
    return () => {
      document.documentElement.classList.remove("is-home");
      document.body.classList.remove("is-home");
    };
  }, []);

  return <>{children}</>;
}
