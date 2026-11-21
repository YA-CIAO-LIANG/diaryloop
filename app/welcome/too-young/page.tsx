import { getTranslations } from "next-intl/server";

/** Under 13 (D12): the account was deleted; nothing was kept. */
export default async function TooYoungPage() {
  const t = await getTranslations("welcome.tooYoung");
  return (
    <main className="mx-auto max-w-reading px-4 py-16 sm:px-6">
      <h1 className="font-diary text-h1">{t("title")}</h1>
      <p className="mt-3">{t("body")}</p>
    </main>
  );
}
