"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { COUNTRIES, POSITIONS } from "@/lib/data";
import { useGameActions } from "@/hooks/useGameSimulation";
import type { CountryId, GameMode, PositionId } from "@/types/game";

export function SetupPanel() {
  const { startDraft, tr } = useGameActions();
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState<CountryId>("br");
  const [posId, setPosId] = useState<PositionId>("SG");
  const [mode, setMode] = useState<GameMode>("classic");
  const [seed, setSeed] = useState("");

  return (
    <div className="mx-auto w-full max-w-xl space-y-8 text-center">
      <div>
        <p className="font-display text-sm uppercase tracking-widest text-brand-yellow">
          {tr("setup.how")}
        </p>
        <h2 className="mt-1 font-display text-4xl uppercase text-white">
          {tr("cta.startDraft")}
        </h2>
      </div>

      <label className="block cursor-text space-y-2 text-left">
        <span className="font-display text-xs uppercase tracking-wider text-white/50">
          {tr("setup.name")}
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={tr("setup.namePlaceholder")}
          className="w-full cursor-text rounded-lg border border-white/15 bg-arena-panel px-4 py-3 text-center text-white outline-none placeholder:text-white/30 focus:border-brand-yellow"
        />
      </label>

      <div>
        <p className="mb-2 font-display text-xs uppercase tracking-wider text-white/50">
          {tr("setup.country")}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {COUNTRIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCountryId(c.id)}
              className={
                countryId === c.id
                  ? "cursor-pointer rounded-md bg-brand-yellow px-3 py-3 font-sans text-xs font-medium uppercase text-black"
                  : "cursor-pointer rounded-md border border-white/15 px-3 py-3 font-sans text-xs font-medium uppercase text-white/70 hover:border-white/30"
              }
            >
              {c.flag} {tr(c.nameKey)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-display text-xs uppercase tracking-wider text-white/50">
          {tr("setup.position")}
        </p>
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2 sm:grid-cols-5">
          {POSITIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPosId(p.id)}
              className={
                posId === p.id
                  ? "cursor-pointer rounded-md bg-brand-yellow px-2 py-3 font-display text-xs uppercase text-black"
                  : "cursor-pointer rounded-md border border-white/15 px-2 py-3 font-display text-xs uppercase text-white/70 hover:border-white/30"
              }
            >
              <div>{p.id}</div>
              <div className="mt-0.5 text-[9px] opacity-70">{tr(p.nameKey)}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-display text-xs uppercase tracking-wider text-white/50">
          {tr("setup.mode")}
        </p>
        <div className="mx-auto grid max-w-lg gap-2 sm:grid-cols-2">
          {(["classic", "purist"] as GameMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`cursor-pointer rounded-2xl border p-4 text-center transition hover:border-white/25 ${
                mode === m
                  ? "border-brand-yellow/70 bg-brand-yellow/10"
                  : "border-white/10 bg-arena-panel"
              }`}
            >
              <div className="font-display text-lg uppercase text-white">
                {tr(`setup.mode.${m}`)}
              </div>
              <p className="mt-1 text-xs text-white/55">
                {tr(`setup.mode.${m}Desc`)}
              </p>
            </button>
          ))}
        </div>
      </div>

      <label className="block cursor-text space-y-2 text-left">
        <span className="font-display text-xs uppercase tracking-wider text-white/50">
          {tr("setup.seed")}
        </span>
        <input
          value={seed}
          onChange={(e) => setSeed(e.target.value.toUpperCase())}
          placeholder={tr("setup.seedPlaceholder")}
          className="w-full cursor-text rounded-lg border border-white/15 bg-arena-panel px-4 py-3 text-center font-mono text-sm text-white outline-none placeholder:text-white/30 focus:border-brand-yellow"
        />
      </label>

      <div className="flex justify-center">
        <Button
          onClick={() =>
            startDraft({ name, countryId, posId, mode, seed: seed || undefined })
          }
        >
          {tr("cta.startDraft")}
        </Button>
      </div>
    </div>
  );
}
