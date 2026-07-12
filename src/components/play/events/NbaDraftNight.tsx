"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

export function NbaDraftNight() {
  const { state } = useGameState();
  const {
    finishNbaDraft,
    enterNbaFromDraft,
    tr,
  } = useGameActions();
  const [tick, setTick] = useState(1);

  useEffect(() => {
    if (!state.draftAnimating) return;
    const interval = setInterval(() => {
      setTick((n) => (n >= 60 ? 60 : n + 1));
    }, 40);
    const done = setTimeout(finishNbaDraft, 1800);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [state.draftAnimating, finishNbaDraft]);

  if (state.draftAnimating) {
    return (
      <div className="rounded-2xl border border-brand-yellow/40 bg-arena-panel p-8 text-center">
        <p className="font-display text-xs uppercase tracking-widest text-brand-yellow">
          {tr("nba.draftTitle")}
        </p>
        <h3 className="mt-3 font-display text-4xl uppercase text-white">
          {tr("nba.pick", { n: tick })}
        </h3>
        <div className="mx-auto mt-6 h-2 max-w-xs overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-brand-yellow transition-all"
            style={{ width: `${(tick / 60) * 100}%` }}
          />
        </div>
        <p className="mt-4 text-sm text-white/50">{tr("nba.draftSuspense")}</p>
      </div>
    );
  }

  const r = state.career?.nbaDraftResult;
  if (!r) return null;

  return (
    <div className="rounded-2xl border-2 border-brand-yellow bg-arena-panel p-8 text-center shadow-[0_0_40px_rgba(255,122,0,0.2)]">
      <p className="font-display text-xs uppercase tracking-widest text-brand-yellow">
        {tr("nba.draftTitle")}
      </p>
      <h3 className="mt-3 font-display text-5xl uppercase text-brand-yellow">
        {tr("nba.pick", { n: r.pick })}
      </h3>
      <p className="mt-3 text-lg text-white">
        {tr("nba.selectedBy", { team: r.teamName })}
      </p>
      <Button className="mt-6" onClick={enterNbaFromDraft}>
        {tr("nba.begin")}
      </Button>
    </div>
  );
}
