import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        redact: "var(--redact)",
        stamp: "var(--stamp)",
        verified: "var(--verified)",
        "ink-muted": "var(--ink-muted)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        docket: "42rem",
        field: "68rem",
      },
    },
  },
  plugins: [],
};

export default config;
