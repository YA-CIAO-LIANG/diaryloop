import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSignedInUser } from "@/auth/session";
import { WelcomeForm } from "./WelcomeForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("welcome");
  return { title: t("title") };
}

/** The welcome step: birth month and, for teens, a guardian's consent. */
export default async function WelcomePage() {
  if (!(await getSignedInUser())) redirect("/signin?next=/welcome");
  const t = await getTranslations("welcome");
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => thisYear - i);
  return (
    <main className="mx-auto max-w-reading px-4 py-16 sm:px-6">
      <h1 className="font-diary text-h1">{t("title")}</h1>
      <p className="mt-3 text-ink-muted">{t("lead")}</p>
      <div className="mt-8">
        <WelcomeForm years={years} />
      </div>
    </main>
  );
}
