"use client";

import { memo, useEffect } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { DraftTutorial } from "@/components/play/DraftTutorial";
import { ATTRS } from "@/lib/data";
import { springPremium } from "@/lib/motion";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";
import type { AttrKey } from "@/types/game";

/** Compact attribute labels — Fenomeno-style grid */
const SHORT: Record<AttrKey, string> = {
  shot: "ARR",
  fin: "FIN",
  drb: "DRB",
  pass: "PAS",
  def: "DEF",
  reb: "REB",
  ath: "ATL",
  clu: "INS",
};

function DraftPanelInner() {
  const { state } = useGameState();
  const { takeAttr, rerollLegend, clearJustFilled, tr } = useGameActions();
  const legend = state.draftPool[state.draftIndex];
  const filled = Object.keys(state.maxStats).length;
  const isClassic = state.player?.mode === "classic";

  useEffect(() => {
    if (!state.justFilledAttr) return;
    const t = setTimeout(clearJustFilled, 500);
    return () => clearTimeout(t);
  }, [state.justFilledAttr, clearJustFilled]);

  if (!legend) return null;

  return (
    <div className="mx-auto w-full max-w-2xl px-2">
      <DraftTutorial />
      <p className="mb-1.5 text-center font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
        {tr("draft.slots")} · {filled}/8
      </p>

      <div className="relative w-full rounded-xl border border-white/10 bg-arena-panel/90 p-3 sm:p-5">
        <p className="font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-white/40">
          {tr("draft.current")}
        </p>
        <h2 className="mt-0.5 font-display text-3xl uppercase leading-none tracking-wide text-white sm:text-5xl md:text-6xl">
          {legend.name}
        </h2>
        <p className="mt-1 font-sans text-[11px] text-white/35 sm:text-xs">
          T{legend.tier} · {legend.nick} ·{" "}
          {tr("draft.remaining", { n: 8 - filled })}
        </p>

        <motion.div
          className="mt-3 grid grid-cols-4 gap-1.5 sm:mt-4 sm:gap-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springPremium}
        >
          {ATTRS.map((a) => {
            const taken = state.maxStats[a.k] !== undefined;
            const highlight = state.justFilledAttr === a.k;
            return (
              <motion.button
                key={a.k}
                type="button"
                disabled={taken}
                onClick={() => takeAttr(a.k)}
                whileHover={taken ? undefined : { scale: 1.02 }}
                whileTap={taken ? undefined : { scale: 0.98 }}
                transition={springPremium}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border px-1 py-2 disabled:cursor-not-allowed disabled:opacity-30 sm:py-3.5 ${
                  highlight
                    ? "border-arena-accent bg-arena-accent/15"
                    : "border-white/10 bg-arena-bg/60 hover:enabled:border-arena-accent hover:enabled:bg-arena-accent/10"
                }`}
              >
                <span className="font-sans text-[9px] font-medium uppercase tracking-wider text-white/45 sm:text-[10px]">
                  {SHORT[a.k]}
                </span>
                <span className="mt-0.5 font-display text-xl leading-none text-white sm:mt-1 sm:text-3xl">
                  {isClassic ? legend.stats[a.k] : "?"}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {!isClassic && (
          <p className="mt-2 text-center font-sans text-[11px] italic text-white/35 sm:mt-3 sm:text-xs">
            {tr("draft.puristHint")}
          </p>
        )}

        {isClassic && (
          <div className="mt-2.5 flex justify-start sm:mt-4">
            <button
              type="button"
              disabled={state.rerollUsed}
              onClick={rerollLegend}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-wider text-white/50 hover:enabled:border-white/25 hover:enabled:text-white/80 disabled:cursor-not-allowed disabled:opacity-30 sm:px-3 sm:py-1.5 sm:text-[11px]"
            >
              <Shuffle className="h-3 w-3" />
              {state.rerollUsed ? tr("draft.rerollUsed") : tr("draft.reroll")}
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 flex w-full flex-wrap justify-center gap-1 sm:mt-3 sm:gap-1.5">
        {ATTRS.map((a) => {
          const val = state.maxStats[a.k];
          if (val === undefined) return null;
          return (
            <motion.span
              key={a.k}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springPremium}
              className="rounded border border-white/10 bg-arena-panel px-1.5 py-0.5 font-sans text-[9px] text-white/50 sm:px-2 sm:py-1 sm:text-[10px]"
            >
              <span className="text-white/35">{SHORT[a.k]}</span>{" "}
              <span className="font-medium text-arena-accent">{val}</span>
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

export const DraftPanel = memo(DraftPanelInner);
