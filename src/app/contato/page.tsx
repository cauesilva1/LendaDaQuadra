import { ContactPage } from "@/components/landing/ContactPage";
import { parseLocaleParam } from "@/lib/i18n";

export default async function ContatoPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const sp = await searchParams;
  return <ContactPage locale={parseLocaleParam(sp.locale)} />;
}
