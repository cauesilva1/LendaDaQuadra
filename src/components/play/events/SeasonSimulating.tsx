"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";
import { fadeFast, springPremium } from "@/lib/motion";

const BEATS = [
  "sim.beat.games",
  "sim.beat.stats",
  "sim.beat.awards",
  "sim.beat.market",
] as const;

/** Full-season skip interstitial — clear progress beats, then results. */
export function SeasonSimulating() {
  const { state } = useGameState();
  const { tr } = useGameActions();
  const club = state.career?.clubName ?? "";
  const season = state.career?.season ?? 1;
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    setBeat(0);
    const timers = BEATS.map((_, i) =>
      setTimeout(() => setBeat(i), 280 + i * 280),
    );
    return () => timers.forEach(clearTimeout);
  }, [state.centerView, season]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springPremium}
      className="w-full max-w-sm rounded-xl border border-arena-accent/40 bg-arena-panel px-6 py-8 text-center shadow-[0_0_40px_rgba(255,122,0,0.12)]"
    >
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-arena-accent">
        {tr("sim.eyebrow")}
      </p>
      <h3 className="mt-3 font-display text-3xl uppercase leading-none text-white">
        {tr("sim.title")}
      </h3>
      {club ? (
        <p className="mt-2 font-sans text-sm text-white/45">
          {club} · {tr("dash.season")} {season}
        </p>
      ) : null}

      <div className="mx-auto mt-6 h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-arena-accent"
          initial={{ width: "8%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.15, ease: "easeInOut" }}
        />
      </div>

      <div className="mt-4 min-h-[1.25rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={BEATS[Math.min(beat, BEATS.length - 1)]}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={fadeFast}
            className="font-sans text-[11px] uppercase tracking-wider text-white/50"
          >
            {tr(BEATS[Math.min(beat, BEATS.length - 1)]!)}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
