import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSignedInUser } from "@/auth/session";
import { ButtonLink } from "@/components/ButtonLink";
import { Card } from "@/components/Card";

type Step = { title: string; minutes: string; body: string };
type Point = { title: string; body: string };

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const [t, user, params] = await Promise.all([
    getTranslations("home"),
    getSignedInUser(),
    searchParams,
  ]);
  const flow = t.raw("flow") as Step[];
  const why = t.raw("why") as Point[];
  const privacy = t.raw("privacy") as string[];
  return (
    <main>
      {params.deleted === "1" && (
        <p
          role="status"
          className="border-b border-line bg-band px-4 py-3 text-center text-supporting"
        >
          {t("deleted")}
        </p>
      )}
      <section className="mx-auto max-w-reading px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
        <h1 className="font-diary text-hero">{t("title")}</h1>
        <p className="mt-6 text-body text-ink-muted">{t("lead")}</p>
        <div className="mt-8 flex flex-col items-start gap-3">
          <ButtonLink
            href={user ? "/today" : "/signin?next=/today"}
            variant="primary"
            size="lg"
            arrow
          >
            {user ? t("signedInStart") : t("start")}
          </ButtonLink>
          <p className="text-supporting text-ink-muted">{t("privacyNote")}</p>
        </div>
      </section>

      <section className="border-y border-line bg-band">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
          <h2 className="font-diary text-h2">{t("flowTitle")}</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flow.map((step, index) => (
              <li key={step.title}>
                <Card className="h-full">
                  <p className="text-metadata text-accent-ink">
                    {index + 1} · {step.minutes}
                  </p>
                  <h3 className="mt-1 font-diary text-h3">{step.title}</h3>
                  <p className="mt-2 text-supporting text-ink-muted">
                    {step.body}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6">
        <h2 className="font-diary text-h2">{t("whyTitle")}</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {why.map((point) => (
            <li key={point.title}>
              <h3 className="font-diary text-h3">{point.title}</h3>
              <p className="mt-1 text-ink-muted">{point.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-reading text-supporting text-ink-muted">
          {t("scienceNote")}
        </p>
      </section>

      <section className="mx-auto max-w-content px-4 pb-4 sm:px-6">
        <div className="rounded-base bg-pal p-6 text-ink">
          <h2 className="font-diary text-h2">{t("privacyTitle")}</h2>
          <ul className="mt-4 flex list-disc flex-col gap-1 pl-5">
            {privacy.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <Link
            href="/privacy"
            className="mt-4 tap font-semibold text-pal-ink underline underline-offset-4"
          >
            {t("privacyLink")}
          </Link>
        </div>
      </section>
    </main>
  );
}
