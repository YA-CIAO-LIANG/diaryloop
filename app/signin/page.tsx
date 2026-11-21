import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { getSignedInUser } from "@/auth/session";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { parseSignInResult, safeNextPath } from "@/lib/auth/redirect";
import { dataMode } from "@/lib/runtime";
import { signInWithGoogle } from "../auth/actions";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("signin");
  return { title: t("title") };
}

export default async function SignInPage({
  searchParams,
}: PageProps<"/signin">) {
  const params = await searchParams;
  const next = safeNextPath(
    typeof params.next === "string" ? params.next : "/",
  );
  if (await getSignedInUser()) redirect(next);
  const t = await getTranslations("signin");
  const result = parseSignInResult(
    typeof params.signin === "string" ? params.signin : null,
  );
  const available = dataMode() !== "none";
  return (
    <main className="mx-auto max-w-reading px-4 py-16 sm:px-6">
      <h1 className="font-diary text-h1">{t("title")}</h1>
      <p className="mt-3 text-ink-muted">{t("lead")}</p>
      {result && (
        <p
          role={result === "cancelled" ? "status" : "alert"}
          className={`mt-4 ${result === "cancelled" ? "text-ink-muted" : "text-error"}`}
        >
          {t(`result.${result}`)}
        </p>
      )}
      <Card className="mt-8">
        {available ? (
          <form action={signInWithGoogle}>
            <input type="hidden" name="next" value={next} />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              {t("google")}
            </Button>
          </form>
        ) : (
          <p className="text-ink-muted">{t("unavailable")}</p>
        )}
        <ul className="mt-6 flex list-disc flex-col gap-1 pl-5 text-supporting text-ink-muted">
          <li>{t("promise.private")}</li>
          <li>{t("promise.training")}</li>
          <li>{t("promise.delete")}</li>
        </ul>
      </Card>
    </main>
  );
}
