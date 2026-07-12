"use client";

import { memo } from "react";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

function StandingsColumnInner() {
  const { state } = useGameState();
  const { tr } = useGameActions();
  const rows = state.career?.standings ?? [];

  return (
    <aside className="rounded-xl border border-white/10 bg-arena-panel p-2.5">
      <p className="mb-1.5 font-display text-[10px] uppercase tracking-widest text-arena-accent">
        {tr("dash.standings")}
      </p>
      <div className="mb-1 grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-1.5 px-1 text-[9px] uppercase tracking-wider text-white/35">
        <span>#</span>
        <span />
        <span>{tr("dash.w")}</span>
        <span>{tr("dash.l")}</span>
        <span>{tr("dash.pts")}</span>
      </div>
      <ul className="space-y-0">
        {rows.map((row, i) => (
          <li
            key={row.clubId}
            className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-x-1.5 rounded px-1 py-0.5 text-xs ${
              row.isPlayer
                ? "border border-arena-accent/50 bg-arena-accent/10 text-arena-accent"
                : "text-white/75"
            }`}
          >
            <span className="w-4 text-white/35">{i + 1}</span>
            <span className="truncate font-medium">{row.short}</span>
            <span className="tabular-nums">{row.wins}</span>
            <span className="tabular-nums text-white/45">{row.losses}</span>
            <span className="tabular-nums">{row.pts}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export const StandingsColumn = memo(StandingsColumnInner);
