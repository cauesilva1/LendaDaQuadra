"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";
import { springPremium } from "@/lib/motion";
import { formatMoney } from "@/lib/utils";
import type { ImpactToast } from "@/types/game";

function toastClass(tone: ImpactToast["tone"]): string {
  if (tone === "good") {
    return "border-emerald-400/60 bg-emerald-500/15 text-emerald-300";
  }
  if (tone === "warn") {
    return "border-amber-400/60 bg-amber-500/15 text-amber-200";
  }
  return "border-red-400/70 bg-red-500/20 text-red-300 animate-pulse";
}

/** Fixed corner toasts — does not push page layout. */
export function ImpactToastStrip() {
  const { state } = useGameState();
  const { clearEffectToasts, tr } = useGameActions();
  const toasts = state.effectToasts;

  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(clearEffectToasts, 3200);
    return () => clearTimeout(timer);
  }, [toasts, clearEffectToasts]);

  return (
    <div className="pointer-events-none fixed right-3 top-16 z-50 flex w-[min(100%-1.5rem,18rem)] flex-col gap-1.5 sm:right-4 sm:top-14">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          let label = tr(toast.labelKey, toast.vars);
          if (toast.labelKey === "impact.wallet" && toast.vars?.n !== undefined) {
            const n = Number(toast.vars.n);
            const signed = formatMoney(Math.abs(n), "USD");
            label = tr("impact.wallet", {
              n: n < 0 ? `−${signed}` : `+${signed}`,
            });
          }
          if (toast.labelKey === "impact.salary" && toast.vars?.n !== undefined) {
            label = tr("impact.salary", {
              n: formatMoney(Number(toast.vars.n), "USD"),
            });
          }
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={springPremium}
              className={`rounded-md border px-3 py-1.5 text-center font-sans text-[11px] font-semibold uppercase tracking-wide shadow-lg backdrop-blur-sm ${toastClass(toast.tone)}`}
            >
              {label}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
