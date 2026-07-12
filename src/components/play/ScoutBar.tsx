"use client";

import { NBA_DRAFT_OVR } from "@/lib/data";
import { scoutBarProgress } from "@/lib/hydration";
import { useGameActions } from "@/hooks/useGameSimulation";

type ScoutBarProps = {
  ovr: number;
  age: number;
  seasonsPlayed: number;
};

/** Transparent draft gate — green only when fully eligible. */
export function ScoutBar({ ovr, age, seasonsPlayed }: ScoutBarProps) {
  const { tr } = useGameActions();
  const scout = scoutBarProgress(ovr, age, seasonsPlayed, NBA_DRAFT_OVR);

  return (
    <div className="mt-1.5">
      <div
        className="h-1.5 overflow-hidden rounded-full bg-white/10"
        title={tr(scout.labelKey)}
        role="progressbar"
        aria-valuenow={scout.pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={tr(scout.labelKey)}
      >
        <div
          className={`h-full rounded-full duration-500 ${
            scout.ready
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.65)]"
              : scout.status === "maturity"
                ? "bg-amber-400/90"
                : "bg-arena-accent"
          }`}
          style={{ width: `${scout.pct}%` }}
        />
      </div>
      <p
        className={`mt-1 font-sans text-[9px] leading-snug ${
          scout.ready
            ? "font-medium text-emerald-400"
            : scout.status === "maturity"
              ? "text-amber-200/80"
              : "text-white/45"
        }`}
      >
        {tr(scout.labelKey)}
      </p>
    </div>
  );
}
