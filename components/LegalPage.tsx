import { getTranslations } from "next-intl/server";

type Section = { title: string; body: string[] };

/**
 * A legal page from messages (`privacy` or `terms`): title, effective
 * date, a summary box, then numbered sections. Server-only text.
 */
export async function LegalPage({
  namespace,
}: {
  namespace: "privacy" | "terms";
}) {
  const t = await getTranslations(namespace);
  const sections = t.raw("sections") as Section[];
  const summary = t.raw("summary") as string[];
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return (
    <main className="mx-auto max-w-reading px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-diary text-h1">{t("title")}</h1>
      <p className="mt-2 text-supporting text-ink-muted">{t("effective")}</p>
      <section
        aria-labelledby="summary"
        className="mt-8 rounded-base border border-line bg-surface p-4 sm:p-6"
      >
        <h2 id="summary" className="font-diary text-h3">
          {t("summaryTitle")}
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
          {summary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
      <ol className="mt-10 flex flex-col gap-8">
        {sections.map((section, index) => (
          <li key={section.title}>
            <h2 className="font-diary text-h2">
              {index + 1}. {section.title}
            </h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-3">
                {paragraph}
              </p>
            ))}
          </li>
        ))}
      </ol>
      <p className="mt-10 border-t border-line pt-6 text-supporting text-ink-muted">
        {contact ? t("contactEmail", { email: contact }) : t("contactGithub")}
      </p>
    </main>
  );
}
