"use client";

import { Button } from "@/components/ui/Button";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

export function PressFeed() {
  const { state } = useGameState();
  const { setCenterView, tr } = useGameActions();
  const items = state.career?.press ?? [];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xl uppercase text-white">
          {tr("dash.press")}
        </h3>
        <Button variant="outline" onClick={() => setCenterView("season")}>
          {tr("cta.backSeason")}
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <article
            key={item.id || `press-${item.season}-${i}`}
            className="rounded-2xl border border-white/10 bg-arena-panel p-4"
          >
            <p className="text-[10px] uppercase tracking-wider text-brand-yellow">
              {tr("dash.season")} {item.season} · {item.age} {tr("dash.age")}
            </p>
            <h4 className="mt-1 font-display text-lg uppercase leading-tight text-white">
              {item.headline}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
