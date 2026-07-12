"use client";

import { Button } from "@/components/ui/Button";
import { ClipButton } from "@/components/play/events/FeaturePanels";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";
import type { FullDefCall, FullOffCall } from "@/types/game";

const OFF: { id: FullOffCall; key: string }[] = [
  { id: "pnr", key: "full.call.pnr" },
  { id: "iso", key: "full.call.iso" },
  { id: "post", key: "full.call.post" },
  { id: "three", key: "full.call.three" },
  { id: "drive", key: "full.call.drive" },
  { id: "kick", key: "full.call.kick" },
];

const DEF: { id: FullDefCall; key: string }[] = [
  { id: "press", key: "full.call.press" },
  { id: "pack", key: "full.call.pack" },
  { id: "switch", key: "full.call.switch" },
  { id: "help", key: "full.call.help" },
  { id: "foul", key: "full.call.foul" },
];

/** Full 4-quarter game — command plays beyond the 3 crunch options. */
export function FullGamePanel() {
  const { state } = useGameState();
  const {
    resolveFullOff,
    resolveFullDef,
    nextFullQuarter,
    finishFullGame,
    tr,
  } = useGameActions();
  const g = state.fullGame;
  if (!g) return null;

  const onOff = g.possession === "offense";

  return (
    <div className="flex w-full flex-col items-center text-center">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-arena-accent">
        {tr("full.eyebrow")} · {g.quarter <= 2 ? "Q1-2" : `Q${g.quarter}`}
        {g.lastNote === "halftime" ? ` · ${tr("full.halftime")}` : ""}
      </p>
      <h3 className="mt-1 font-display text-xl uppercase text-white sm:text-2xl">
        {tr(g.finals.titleKey)}
      </h3>
      <p className="mt-1 font-sans text-[11px] text-white/45">
        {g.finals.opponentName.startsWith("key.")
          ? tr(g.finals.opponentName)
          : g.finals.opponentName}
        {" · "}
        {tr("full.minutes", { n: g.expectedMinutes })}
      </p>

      <p className="mt-2 font-sans text-[11px] text-white/45">
        {tr("full.paceHint")}
      </p>
      {state.career?.signature && (
        <p className="mt-1 font-sans text-[10px] text-arena-accent/80">
          {tr("full.sigHint", {
            move: tr(`sig.${state.career.signature}`),
          })}
        </p>
      )}

      <div className="mt-3 flex items-center gap-4">
        <p className="font-display text-4xl tabular-nums text-white sm:text-5xl">
          {g.playerScore}
          <span className="text-white/25"> – </span>
          <span className="text-arena-buzzer">{g.opponentScore}</span>
        </p>
        <div className="rounded-lg border border-white/15 bg-arena-bg/80 px-2.5 py-1">
          <p className="font-display text-lg tabular-nums text-white/80">
            {Math.floor(g.clock / 60)}:
            {String(Math.floor(g.clock % 60)).padStart(2, "0")}
          </p>
          <p className="font-sans text-[9px] uppercase tracking-wider text-white/35">
            {tr("full.possLeft", { n: g.possessionsLeft })}
          </p>
        </div>
      </div>

      {g.phase === "playing" && (
        <>
          <p
            className={`mt-3 font-display text-lg uppercase ${
              onOff ? "text-arena-accent" : "text-arena-buzzer"
            }`}
          >
            {onOff ? tr("full.offense") : tr("full.defense")}
          </p>
          <div className="mt-2 grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
            {(onOff ? OFF : DEF).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  onOff
                    ? resolveFullOff(c.id as FullOffCall)
                    : resolveFullDef(c.id as FullDefCall)
                }
                className="cursor-pointer rounded-xl border border-white/15 bg-arena-bg/70 px-2 py-3 font-display text-sm uppercase text-white hover:border-arena-accent hover:bg-arena-accent/10"
              >
                {tr(c.key)}
              </button>
            ))}
          </div>
        </>
      )}

      {g.phase === "quarter_break" && (
        <div className="mt-4 w-full max-w-sm">
          <p className="font-display text-xl uppercase text-white">
            {tr("full.quarterEnd", { n: g.quarter })}
          </p>
          <Button className="mt-3 w-full justify-center" onClick={nextFullQuarter}>
            {g.quarter >= 4 ? tr("full.toOt") : tr("full.nextQuarter")}
          </Button>
        </div>
      )}

      {g.phase === "result" && (
        <div className="mt-4 w-full max-w-sm">
          <p className="font-display text-2xl uppercase text-arena-accent">
            {g.winsGame ? tr("full.win") : tr("full.lose")}
          </p>
          <Button className="mt-3 w-full justify-center" onClick={finishFullGame}>
            {tr("full.continue")}
          </Button>
          <div className="mt-2 flex justify-center">
            <ClipButton />
          </div>
        </div>
      )}

      {g.log[0] && (
        <p className="mt-3 font-sans text-[11px] text-white/40">
          {tr(g.log[0].message)}
        </p>
      )}
    </div>
  );
}
