import { PrivacyContent } from "@/components/landing/StaticPages";
import { parseLocaleParam } from "@/lib/i18n";

export default async function PrivacidadePage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const sp = await searchParams;
  return <PrivacyContent locale={parseLocaleParam(sp.locale)} />;
}
