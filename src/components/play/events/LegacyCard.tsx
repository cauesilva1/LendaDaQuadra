"use client";

import { useState } from "react";
import {
  Copy,
  Crown,
  RotateCcw,
  Star,
  Trophy,
  Medal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ATTRS } from "@/lib/data";
import { liveStats } from "@/lib/simulation";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";

function OvrChart({
  points,
}: {
  points: { age: number; ovr: number }[];
}) {
  if (points.length < 2) {
    return (
      <div className="flex h-14 items-center justify-center text-xs text-white/40">
        —
      </div>
    );
  }
  const minO = Math.min(...points.map((p) => p.ovr)) - 5;
  const maxO = Math.max(...points.map((p) => p.ovr)) + 5;
  const w = 280;
  const h = 56;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * (w - 12) + 6;
    const y = h - 6 - ((p.ovr - minO) / (maxO - minO)) * (h - 12);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full">
      <polyline
        fill="none"
        stroke="rgba(255,122,0,0.85)"
        strokeWidth="2"
        points={coords.join(" ")}
      />
      {points.map((p, i) => {
        const [x, y] = coords[i]!.split(",").map(Number);
        return <circle key={p.age} cx={x} cy={y} r="2.5" fill="#FF7A00" />;
      })}
    </svg>
  );
}

export function LegacyCard() {
  const { state, ovr, legacyTierId } = useGameState();
  const {
    restart,
    copySummary,
    tr,
  } = useGameActions();
  const [copied, setCopied] = useState(false);
  const career = state.career;
  const player = state.player;
  if (!career || !player) return null;

  const trph = career.trophies;
  const attrs = liveStats(state);

  const handleCopy = async () => {
    const ok = await copySummary();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-md flex-col items-center justify-center overflow-hidden px-1">
      <p className="shrink-0 text-center font-display text-[10px] uppercase tracking-widest text-brand-yellow">
        {tr("legacy.eyebrow")}
      </p>

      <div className="relative mt-2 w-full overflow-hidden rounded-xl border-2 border-brand-yellow/70 bg-arena-panel p-3 shadow-[0_0_28px_rgba(255,122,0,0.2)]">
        <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-brand-yellow/15 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-brand-yellow bg-brand-yellow/15">
            <div className="text-center">
              <div className="font-display text-xl leading-none text-brand-yellow">
                {ovr}
              </div>
              <div className="text-[7px] uppercase tracking-wider text-brand-yellow/70">
                {tr("legacy.ovr")}
              </div>
            </div>
          </div>
          <div className="min-w-0 text-left">
            <h2 className="truncate font-display text-xl uppercase leading-none text-white">
              {player.name}
            </h2>
            <p className="mt-0.5 text-[10px] text-white/50">
              {player.posId} · {career.seasonsPlayed}{" "}
              {tr("dash.season").toLowerCase()}s
            </p>
            <h3 className="mt-1 font-display text-sm uppercase leading-tight text-brand-yellow">
              {tr(`tier.${legacyTierId}`)}
            </h3>
          </div>
        </div>

        <div className="relative mt-3">
          <p className="mb-1 font-display text-[9px] uppercase tracking-widest text-white/45">
            {tr("legacy.attrs")}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {ATTRS.map((a) => (
              <div key={a.k}>
                <div className="mb-0.5 flex justify-between text-[9px] uppercase text-white/50">
                  <span className="truncate">{tr(a.labelKey)}</span>
                  <span className="text-brand-yellow">{attrs[a.k]}</span>
                </div>
                <ProgressBar value={attrs[a.k] ?? 0} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-3">
          <div className="grid grid-cols-3 gap-1">
            {[
              [Trophy, tr("legacy.leagueTitles"), trph.leagueTitles],
              [Medal, tr("legacy.nbaTitles"), trph.nbaTitles],
              [Trophy, tr("legacy.euroTitles"), trph.euroTitles ?? 0],
              [Crown, tr("legacy.mvps"), trph.mvps],
              [Star, tr("legacy.finals"), trph.finalsMvps],
              [Star, tr("legacy.allstars"), trph.allStars],
            ].map(([Icon, label, val], i) => {
              const I = Icon as typeof Trophy;
              return (
                <div
                  key={i}
                  className="rounded-md border border-brand-yellow/25 bg-brand-yellow/5 px-1 py-1 text-center"
                >
                  <I className="mx-auto h-3 w-3 text-brand-yellow" />
                  <div className="font-display text-sm text-white">
                    {val as number}
                  </div>
                  <div className="text-[8px] uppercase leading-tight text-white/45">
                    {label as string}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mt-2">
          <p className="mb-0.5 font-display text-[9px] uppercase tracking-widest text-white/45">
            {tr("legacy.chart")}
          </p>
          <OvrChart points={career.ovrHistory} />
        </div>
      </div>

      <div className="mt-3 flex shrink-0 flex-wrap justify-center gap-2">
        <Button variant="ghost" onClick={handleCopy}>
          <Copy className="h-3.5 w-3.5" />
          {copied ? tr("cta.copied") : tr("cta.copy")}
        </Button>
        <Button onClick={restart}>
          <RotateCcw className="h-3.5 w-3.5" />
          {tr("cta.newCareer")}
        </Button>
      </div>
    </div>
  );
}
