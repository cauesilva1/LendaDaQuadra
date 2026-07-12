"use client";

import { Button } from "@/components/ui/Button";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

/** World Cup / Olympics invitation — then playable games with visible bracket. */
export function NationalCallupPanel() {
  const { state } = useGameState();
  const { resolveNationalCallup, tr } = useGameActions();
  const call = state.pendingNational;
  if (!call) return null;

  const roleKey =
    call.role === "star"
      ? "national.role.star"
      : call.role === "rotation"
        ? "national.role.rotation"
        : "national.role.fringe";

  const steps =
    call.role === "star"
      ? ["national.bracket.group", "national.bracket.semi", "national.bracket.final"]
      : call.role === "rotation"
        ? ["national.bracket.group", "national.bracket.final"]
        : ["national.bracket.final"];

  return (
    <div className="w-full text-center">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-arena-accent">
        {tr("national.eyebrow")}
      </p>
      <h3 className="mt-2 font-display text-2xl uppercase text-white sm:text-3xl">
        {tr(call.titleKey, { year: call.year })}
      </h3>
      <p className="mt-2 font-sans text-sm text-white/55">
        {tr(call.bodyKey, { year: call.year })}
      </p>
      <div className="mt-3 rounded-xl border border-white/10 bg-arena-bg/50 px-3 py-2">
        <p className="font-display text-sm uppercase text-arena-accent">
          {tr(roleKey)}
        </p>
        <p className="mt-1 font-sans text-[11px] text-white/50">
          {tr("national.minutesExpected", {
            n: call.expectedMinutes ?? 8,
          })}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-arena-accent/30 bg-arena-panel/80 px-3 py-3">
        <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-white/40">
          {tr("national.bracketTitle")}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
          {steps.map((key, i) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="rounded-lg border border-white/15 bg-arena-bg/70 px-2.5 py-1.5 font-display text-[11px] uppercase text-white">
                {tr(key)}
              </span>
              {i < steps.length - 1 && (
                <span className="font-display text-arena-accent">→</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-2 font-sans text-[10px] text-white/40">
          {tr("national.bracketHint")}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <Button
          className="w-full justify-center"
          onClick={() => resolveNationalCallup("accept")}
        >
          {tr("national.accept")}
        </Button>
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => resolveNationalCallup("decline")}
        >
          {tr("national.decline")}
        </Button>
      </div>
    </div>
  );
}
