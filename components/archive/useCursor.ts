"use client";

import { createContext, useContext } from "react";

export type CursorMode =
  | "default"
  | "open-signal"
  | "inspect"
  | "enter-now"
  | "start-brief"
  | "explore-signals";

export const CURSOR_LABEL: Record<CursorMode, string> = {
  default: "",
  "open-signal": "OPEN SIGNAL",
  inspect: "INSPECT",
  "enter-now": "ENTER NOW",
  "start-brief": "START BRIEF",
  "explore-signals": "EXPLORE SIGNALS",
};

export const CursorContext = createContext<{
  mode: CursorMode;
  setMode: (mode: CursorMode) => void;
}>({
  mode: "default",
  setMode: () => undefined,
});

export function useCursor() {
  return useContext(CursorContext);
}
