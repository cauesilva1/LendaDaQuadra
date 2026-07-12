"use client";

import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { ATTRS } from "@/lib/data";
import { computeOverall, getCountry, getLeague } from "@/lib/simulation";
import { completeStats } from "@/lib/progression";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

export function RevealPanel() {
  const { state } = useGameState();
  const { beginCareer, tr } = useGameActions();
  if (!state.player) return null;

  const country = getCountry(state.player.countryId);
  const league = getLeague(country.leagueId);
  const maxStats = completeStats(state.maxStats);
  const potOvr = computeOverall(maxStats, state.player.posId);
  // Preview band only — real starter rolls on beginCareer
  const startOvr = Math.min(
    66,
    Math.max(
      55,
      Math.round(
        ATTRS.reduce((sum, a) => {
          const ceil = maxStats[a.k] ?? 70;
          return sum + (55 + ((ceil - 40) / 59) * 11);
        }, 0) / ATTRS.length,
      ),
    ),
  );

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="font-display text-xs uppercase tracking-widest text-arena-accent">
        {tr("reveal.title")}
      </p>
      <div className="mt-4 rounded-2xl border-2 border-arena-accent/70 bg-arena-panel p-5 shadow-[0_0_30px_rgba(255,122,0,0.2)]">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="font-display text-4xl text-white">
              <CountUp target={startOvr} duration={700} />
            </div>
            <p className="text-[10px] uppercase text-white/45">
              {tr("reveal.startOvr")}
            </p>
          </div>
          <div>
            <div className="font-display text-4xl text-arena-accent">
              <CountUp target={potOvr} duration={900} />
            </div>
            <p className="text-[10px] uppercase text-white/45">
              {tr("reveal.potOvr")}
            </p>
          </div>
        </div>
        <h3 className="mt-3 font-display text-2xl uppercase text-white">
          {state.player.name}
        </h3>
        <p className="mt-1 text-sm text-white/55">
          {tr("reveal.potentialHint")}
        </p>
        <p className="mt-2 text-xs text-white/45">
          {tr("reveal.leagueHint", {
            league: tr(league.nameKey),
            flag: country.flag,
          })}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-1.5 text-left">
          {ATTRS.map((a) => (
            <div
              key={a.k}
              className="rounded-md border border-white/10 px-2 py-1.5"
            >
              <div className="flex items-baseline justify-between gap-1">
                <span className="font-display text-lg text-arena-accent">
                  {maxStats[a.k]}
                </span>
                <span className="text-[9px] uppercase text-white/35">
                  {tr("reveal.ceiling")}
                </span>
              </div>
              <div className="text-[10px] uppercase text-white/45">
                {tr(a.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button className="mt-5" onClick={beginCareer}>
        {tr("cta.startCareer")}
      </Button>
    </div>
  );
}
