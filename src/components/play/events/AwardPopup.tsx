"use client";

import { Button } from "@/components/ui/Button";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

/** Goat-style award announcement — enter/exit owned by Dashboard parent shell. */
export function AwardPopup() {
  const { state, ovr } = useGameState();
  const { dismissAward, tr } = useGameActions();
  const award = state.activeAward;
  if (!award) return null;

  const border =
    award.accent === "green"
      ? "border-brand-green/50 shadow-[0_0_30px_rgba(0,168,89,0.2)]"
      : "border-brand-yellow/70 shadow-[0_0_30px_rgba(255,122,0,0.25)]";
  const glow =
    award.accent === "green" ? "bg-brand-green/20" : "bg-brand-yellow/20";
  const accentText =
    award.accent === "green" ? "text-brand-green-bright" : "text-brand-yellow";

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border-2 bg-arena-panel p-6 ${border}`}
      >
        <div
          className={`absolute -left-10 -top-10 h-32 w-32 rounded-full blur-2xl ${glow}`}
        />
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-brand-yellow/60 bg-brand-yellow/10">
          <span className="font-display text-3xl text-brand-yellow">{ovr}</span>
        </div>
        <p className="relative mt-4 font-sans text-[10px] uppercase tracking-[0.35em] text-white/40">
          {state.player?.name}
        </p>
        <h3
          className={`relative mt-2 font-display text-3xl uppercase leading-none sm:text-4xl ${accentText}`}
        >
          {tr(award.titleKey)}
        </h3>
        <p className="relative mx-auto mt-3 max-w-xs text-sm text-white/60">
          {tr(award.subtitleKey)}
        </p>
        <div className="relative mt-5 grid grid-cols-3 gap-2">
          {award.stats.map((stat) => (
            <div
              key={stat.labelKey}
              className="rounded-lg border border-white/10 px-2 py-2"
            >
              <div className="font-display text-xl text-white">{stat.value}</div>
              <div className="text-[9px] uppercase text-white/40">
                {tr(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button className="mt-6 justify-center" onClick={dismissAward}>
        {tr("award.dismiss")}
      </Button>
    </div>
  );
}
