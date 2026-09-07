"use client";

import { VerdictCard } from "./VerdictCard";
import type { Mention } from "@/lib/types";

const SCATTER = [
  { rotate: -1.6, shift: "0%" },
  { rotate: 2.1, shift: "12%" },
  { rotate: -0.8, shift: "-2%" },
  { rotate: 1.4, shift: "18%" },
  { rotate: -2.0, shift: "6%" },
  { rotate: 0.7, shift: "14%" },
];

type VerdictFieldProps = {
  mentions: Mention[];
  onReveal: (id: string) => void;
};

export function VerdictField({ mentions, onReveal }: VerdictFieldProps) {
  return (
    <section className="py-14">
      <p className="font-mono text-[10px] text-ink-muted">Cached verdicts</p>
      <div className="mt-8 flex flex-col gap-10 md:gap-14">
        {mentions.map((mention, index) => {
          const scatter = SCATTER[index % SCATTER.length];
          return (
            <div key={mention.id} className="flex justify-start md:justify-center">
              <VerdictCard
                mention={mention}
                rotate={scatter.rotate}
                shift={scatter.shift}
                onReveal={onReveal}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
