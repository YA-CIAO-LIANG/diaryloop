import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  return (
    <main className="mx-auto max-w-reading px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-diary text-hero">{t("title")}</h1>
      <p className="mt-4 text-body text-ink-muted">{t("lead")}</p>
    </main>
  );
}
