import { DocsContent } from "@/components/landing/StaticPages";
import { parseLocaleParam } from "@/lib/i18n";

export default async function DocsPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const sp = await searchParams;
  return <DocsContent locale={parseLocaleParam(sp.locale)} />;
}
