import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl">{t("title")}</h1>
      <p className="mt-4">{t("lead")}</p>
    </main>
  );
}
