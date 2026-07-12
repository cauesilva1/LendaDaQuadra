import { BugReportPage } from "@/components/landing/BugReportPage";
import { parseLocaleParam } from "@/lib/i18n";

export default async function BugPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const sp = await searchParams;
  return <BugReportPage locale={parseLocaleParam(sp.locale)} />;
}
