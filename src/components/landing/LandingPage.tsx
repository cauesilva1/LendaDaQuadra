"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { playHref } from "@/lib/i18n";
import { t } from "@/lib/i18n/dictionary";
import type { Locale } from "@/types/game";

const PREVIEW = [
  {
    ovr: 72,
    tier: "solid",
    className: "border-white/15 shadow-none",
  },
  {
    ovr: 86,
    tier: "allstar",
    className: "border-white/20 shadow-[0_0_16px_rgba(255,122,0,0.12)]",
  },
  {
    ovr: 94,
    tier: "goat_debate",
    className:
      "border-transparent animate-glow-pulse bg-gradient-to-b from-arena-panel to-[#1a0f0c] [box-shadow:0_0_28px_rgba(255,122,0,0.45),0_0_56px_rgba(255,59,48,0.28)]",
  },
] as const;

export function LandingPage({ locale }: { locale: Locale }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-arena-bg text-brand-text">
      {/* Arena atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,122,0,0.14)_0%,transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(255,59,48,0.1)_0%,transparent_45%),radial-gradient(ellipse_at_20%_70%,rgba(30,58,138,0.25)_0%,transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <SiteHeader locale={locale} />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-5xl flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
        <p className="animate-fade-up mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.35em] text-arena-accent sm:text-xs">
          {t(locale, "brand.eyebrow")}
        </p>

        <h1
          className="animate-fade-up mx-auto max-w-4xl font-display text-5xl leading-[0.95] tracking-wide text-white sm:text-7xl md:text-8xl"
          style={{ animationDelay: "80ms" }}
        >
          {t(locale, "hero.title1")}{" "}
          <span className="bg-gradient-to-r from-arena-accent to-arena-buzzer bg-clip-text text-transparent">
            {t(locale, "hero.title2")}
          </span>
          ?
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
          style={{ animationDelay: "160ms" }}
        >
          {t(locale, "hero.sub")}
        </p>

        <div
          className="animate-fade-up mt-12 flex flex-wrap justify-center gap-6"
          style={{ animationDelay: "240ms" }}
        >
          {PREVIEW.map((card) => (
            <div
              key={card.tier}
              className={`w-[150px] rounded-2xl border-2 bg-arena-panel/90 p-5 text-center backdrop-blur-sm sm:w-[180px] ${card.className}`}
            >
              <div
                className={`font-display text-4xl ${
                  card.ovr === 94
                    ? "bg-gradient-to-r from-arena-accent to-arena-buzzer bg-clip-text text-transparent"
                    : "text-white"
                }`}
              >
                {card.ovr}
              </div>
              <div className="mt-1 font-display text-sm uppercase text-white">
                {t(locale, `tier.${card.tier}`)}
              </div>
              <p className="mt-2 text-xs leading-snug text-white/50">
                {t(locale, `tier.${card.tier}.desc`)}
              </p>
            </div>
          ))}
        </div>

        <Link
          href={playHref(locale)}
          className="animate-fade-up mt-14 inline-flex items-center justify-center rounded-full bg-arena-accent px-10 py-4 font-display text-2xl uppercase tracking-wide text-arena-bg shadow-[0_0_28px_rgba(255,122,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-arena-buzzer hover:text-white hover:shadow-[0_0_36px_rgba(255,59,48,0.5)] active:translate-y-0"
          style={{ animationDelay: "320ms" }}
        >
          [ {t(locale, "cta.play")} ]
        </Link>

        <p className="mt-16 text-center text-xs text-white/35 sm:mt-20">
          {t(locale, "footer.note")}
        </p>
      </main>
    </div>
  );
}
