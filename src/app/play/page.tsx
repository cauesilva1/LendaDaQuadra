import { PlayApp } from "@/components/play/PlayApp";
import { parseLocaleParam } from "@/lib/i18n";

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string | string[] }>;
}) {
  const params = await searchParams;
  const locale = parseLocaleParam(params.locale);
  return <PlayApp locale={locale} />;
}
