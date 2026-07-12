"use client";

import { useEffect, useState } from "react";
import { useGameActions } from "@/hooks/useGameSimulation";

const SEEN_KEY = "lenda-draft-tutorial-v1";

/** One-time tip strip on first draft — dismissible. */
export function DraftTutorial() {
  const { tr } = useGameActions();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SEEN_KEY) !== "1") setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="mb-3 w-full rounded-xl border border-arena-accent/35 bg-arena-accent/10 px-3 py-2.5 text-left">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-arena-accent">
        {tr("tutorial.eyebrow")}
      </p>
      <p className="mt-1 font-sans text-xs leading-relaxed text-white/70">
        {tr("tutorial.body")}
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(SEEN_KEY, "1");
          } catch {
            // ignore
          }
          setOpen(false);
        }}
        className="mt-2 cursor-pointer font-display text-[11px] uppercase tracking-wider text-arena-accent hover:text-white"
      >
        {tr("tutorial.ok")}
      </button>
    </div>
  );
}
