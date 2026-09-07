"use client";

import { useCallback, useState } from "react";
import { CaseFooter } from "./CaseFooter";
import { CustomCursor } from "./CustomCursor";
import { DocketHeader } from "./DocketHeader";
import { ExhibitList } from "./ExhibitList";
import { OpenFile } from "./OpenFile";
import { ScoreCounter } from "./ScoreCounter";
import { VerdictField } from "./VerdictField";
import type { Mention } from "@/lib/types";

type CaseFileProps = {
  mentions: Mention[];
  source: "supabase" | "seed";
};

export function CaseFile({ mentions, source }: CaseFileProps) {
  const [score, setScore] = useState(0);
  const [opened, setOpened] = useState<string[]>([]);

  const onReveal = useCallback((id: string, delta: number) => {
    setOpened((current) => {
      if (current.includes(id)) return current;
      setScore((value) => value + delta);
      return [...current, id];
    });
  }, []);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-field px-5 pb-20 pt-6 sm:px-8">
      <CustomCursor />
      <div className="sticky top-0 z-30 -mx-5 mb-2 flex justify-end bg-paper px-5 py-3 sm:-mx-8 sm:px-8">
        <ScoreCounter score={score} scanned={opened.length} total={mentions.length} />
      </div>
      <DocketHeader source={source} />
      <VerdictField mentions={mentions} onReveal={onReveal} />
      <ExhibitList />
      <OpenFile />
      <CaseFooter />
    </div>
  );
}
