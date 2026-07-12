import { SobreContent } from "@/components/landing/StaticPages";
import { parseLocaleParam } from "@/lib/i18n";

export default async function SobrePage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const sp = await searchParams;
  return <SobreContent locale={parseLocaleParam(sp.locale)} />;
}
