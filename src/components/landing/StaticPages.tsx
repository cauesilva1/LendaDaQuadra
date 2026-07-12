import { InfoShell } from "@/components/landing/InfoShell";
import { getDocs, getPrivacy, getSobre } from "@/lib/i18n/sitePages";
import type { Locale } from "@/types/game";

export function SobreContent({ locale }: { locale: Locale }) {
  const page = getSobre(locale);
  return (
    <InfoShell locale={locale} title={page.title}>
      {page.body.map((p) => (
        <p
          key={p.slice(0, 24)}
          className="font-sans text-base leading-relaxed text-white/65"
        >
          {p}
        </p>
      ))}
    </InfoShell>
  );
}

export function DocsContent({ locale }: { locale: Locale }) {
  const page = getDocs(locale);
  return (
    <InfoShell locale={locale} title={page.title}>
      {page.sections.map((s) => (
        <section key={s.h} className="space-y-2">
          <h2 className="font-display text-2xl uppercase tracking-wide text-arena-accent">
            {s.h}
          </h2>
          {s.p.map((p) => (
            <p
              key={p.slice(0, 28)}
              className="font-sans text-base leading-relaxed text-white/65"
            >
              {p}
            </p>
          ))}
        </section>
      ))}
    </InfoShell>
  );
}

export function PrivacyContent({ locale }: { locale: Locale }) {
  const page = getPrivacy(locale);
  return (
    <InfoShell locale={locale} title={page.title}>
      {page.body.map((p) => (
        <p
          key={p.slice(0, 24)}
          className="font-sans text-base leading-relaxed text-white/65"
        >
          {p}
        </p>
      ))}
    </InfoShell>
  );
}
