import type { Locale } from "@/types/game";
import { isLocale } from "@/lib/i18n/dictionary";

export function localePath(locale: Locale): string {
  if (locale === "pt") return "/";
  return `/${locale}`;
}

export function playHref(locale: Locale): string {
  return `/play?locale=${locale}`;
}

export function parseLocaleParam(
  value: string | string[] | undefined,
): Locale {
  const raw = Array.isArray(value) ? value[0] : value;
  return isLocale(raw) ? raw : "pt";
}
