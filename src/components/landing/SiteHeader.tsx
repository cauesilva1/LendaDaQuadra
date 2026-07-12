"use client";

import Link from "next/link";
import { localePath, playHref } from "@/lib/i18n";
import { t } from "@/lib/i18n/dictionary";
import type { Locale } from "@/types/game";

export function SiteHeader({ locale }: { locale: Locale }) {
  const locales: Locale[] = ["en", "pt", "es"];
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-arena-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-5xl items-center justify-between px-4">
        <Link
          href={localePath(locale)}
          className="font-display text-2xl tracking-wide transition-opacity hover:opacity-90"
        >
          <span className="text-white">{t(locale, "brand.name")}</span>
          <span className="text-arena-accent">{t(locale, "brand.domain")}</span>
        </Link>
        <div className="flex items-center gap-2">
          {locales.map((l) => (
            <Link
              key={l}
              href={localePath(l)}
              className={`rounded px-2 py-1 font-display text-[11px] uppercase tracking-wider transition-colors ${
                l === locale
                  ? "bg-arena-accent text-arena-bg"
                  : "border border-white/10 text-white/55 hover:border-white/25 hover:text-white"
              }`}
            >
              {l}
            </Link>
          ))}
          <Link
            href={playHref(locale)}
            className="ml-2 rounded-full bg-arena-accent px-5 py-2 font-display text-sm uppercase tracking-wide text-arena-bg transition-all duration-300 hover:bg-arena-buzzer hover:text-white hover:shadow-[0_0_20px_rgba(255,59,48,0.45)]"
          >
            {t(locale, "cta.play")}
          </Link>
        </div>
      </div>
    </header>
  );
}
