"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  COACH_STYLES,
  DRIP_OPTIONS,
  SIGNATURES,
  suggestNickname,
} from "@/lib/careerFlavor";
import { useGameActions, useGameState } from "@/hooks/useGameSimulation";
import type { CoachStyle, DripStyle, SignatureMove } from "@/types/game";

/** Post-draft identity: nickname, signature, drip, path. */
export function IdentityPanel() {
  const { state } = useGameState();
  const { confirmIdentity, tr } = useGameActions();
  const player = state.player;
  const [nickname, setNickname] = useState(() =>
    player
      ? suggestNickname(player.name, player.countryId)
      : "Prospect",
  );
  const [signature, setSignature] = useState<SignatureMove>("stepback");
  const [drip, setDrip] = useState<DripStyle>("classic");
  const [coach, setCoach] = useState<CoachStyle>("halfcourt");
  const [preferNcaa, setPreferNcaa] = useState(
    player?.countryId === "us",
  );

  if (!player) return null;

  return (
    <div className="w-full max-w-md text-center">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-arena-accent">
        {tr("identity.eyebrow")}
      </p>
      <h3 className="mt-2 font-display text-2xl uppercase text-white">
        {tr("identity.title")}
      </h3>
      <p className="mt-1 font-sans text-sm text-white/50">
        {tr("identity.lead")}
      </p>

      <label className="mt-4 block text-left">
        <span className="font-sans text-[10px] uppercase text-white/40">
          {tr("identity.nickname")}
        </span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/15 bg-arena-bg px-3 py-2 text-center text-white outline-none focus:border-arena-accent"
        />
      </label>

      <p className="mt-4 font-sans text-[10px] uppercase text-white/40">
        {tr("identity.signature")}
      </p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {SIGNATURES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSignature(s.id)}
            className={`rounded-lg border px-2 py-2 font-display text-xs uppercase ${
              signature === s.id
                ? "border-arena-accent bg-arena-accent/15 text-arena-accent"
                : "border-white/15 text-white/70"
            }`}
          >
            {tr(s.labelKey)}
          </button>
        ))}
      </div>

      <p className="mt-4 font-sans text-[10px] uppercase text-white/40">
        {tr("identity.drip")}
      </p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {DRIP_OPTIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDrip(d.id)}
            className={`rounded-lg border px-2 py-2 font-display text-xs uppercase ${
              drip === d.id
                ? "border-arena-accent bg-arena-accent/15 text-arena-accent"
                : "border-white/15 text-white/70"
            }`}
          >
            {tr(d.labelKey)}
          </button>
        ))}
      </div>

      <p className="mt-4 font-sans text-[10px] uppercase text-white/40">
        {tr("identity.coach")}
      </p>
      <div className="mt-1 grid gap-1.5">
        {COACH_STYLES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCoach(c.id)}
            className={`rounded-lg border px-2 py-2 font-display text-xs uppercase ${
              coach === c.id
                ? "border-arena-accent bg-arena-accent/15 text-arena-accent"
                : "border-white/15 text-white/70"
            }`}
          >
            {tr(c.labelKey)}
          </button>
        ))}
      </div>

      <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 text-left font-sans text-xs text-white/60">
        <input
          type="checkbox"
          checked={preferNcaa}
          onChange={(e) => setPreferNcaa(e.target.checked)}
        />
        {tr("identity.ncaa")}
      </label>

      <Button
        className="mt-5 w-full justify-center"
        onClick={() =>
          confirmIdentity({
            nickname: nickname.trim() || suggestNickname(player.name, player.countryId),
            signature,
            drip,
            coachStyle: coach,
            preferNcaa,
          })
        }
      >
        {tr("identity.cta")}
      </Button>
    </div>
  );
}
