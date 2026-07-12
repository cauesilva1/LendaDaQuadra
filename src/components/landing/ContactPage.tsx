"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { InfoShell } from "@/components/landing/InfoShell";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL, getContact } from "@/lib/i18n/sitePages";
import type { Locale } from "@/types/game";

export function ContactPage({ locale }: { locale: Locale }) {
  const c = getContact(locale);
  const [bugText, setBugText] = useState("");

  const openMail = (subject: string, body: string) => {
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <InfoShell locale={locale} title={c.title}>
      <p className="font-sans text-base leading-relaxed text-white/65">
        {c.intro}
      </p>

      <div className="rounded-2xl border border-white/10 bg-arena-panel/60 px-5 py-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-white/40">
          {c.emailLabel}
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.mailSubjectContact)}`}
          className="mt-1 inline-block font-display text-2xl text-arena-accent hover:text-arena-buzzer"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <div
        id="bug"
        className="scroll-mt-24 rounded-2xl border border-arena-buzzer/35 bg-gradient-to-b from-[#1a0c0c] to-arena-panel px-5 py-5 shadow-[0_0_28px_rgba(255,59,48,0.12)]"
      >
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-arena-buzzer" />
          <h2 className="font-display text-2xl uppercase tracking-wide text-white">
            {c.bugTitle}
          </h2>
        </div>
        <p className="mt-2 font-sans text-sm leading-relaxed text-white/55">
          {c.bugBody}
        </p>
        <textarea
          value={bugText}
          onChange={(e) => setBugText(e.target.value)}
          placeholder={c.bugPlaceholder}
          rows={5}
          className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-sans text-sm text-white placeholder:text-white/30 focus:border-arena-accent focus:outline-none"
        />
        <Button
          className="mt-3 w-full justify-center sm:w-auto"
          onClick={() =>
            openMail(
              c.mailSubjectBug,
              bugText.trim() || c.bugPlaceholder,
            )
          }
        >
          <Bug className="h-4 w-4" />
          {c.bugCta}
        </Button>
      </div>
    </InfoShell>
  );
}
