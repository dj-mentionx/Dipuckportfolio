"use client";

import { useEffect } from "react";

export default function LockupLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("lockup-root");
    return () => document.documentElement.classList.remove("lockup-root");
  }, []);

  return children;
}
