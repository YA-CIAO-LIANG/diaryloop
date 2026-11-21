import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StyleguideDemo } from "./StyleguideDemo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("styleguide");
  return { title: t("title") };
}

const SWATCHES = [
  "ground",
  "surface",
  "band",
  "ink",
  "ink-muted",
  "accent",
  "accent-ink",
  "primary",
  "line",
  "success",
  "error",
  "mark",
  "pal",
] as const;

/** Every token and component, light and dark side by side. */
export default async function StyleguidePage() {
  const t = await getTranslations("styleguide");
  return (
    <main className="mx-auto max-w-content px-4 py-12 sm:px-6">
      <h1 className="font-diary text-h1">{t("title")}</h1>
      <p className="mt-2 text-ink-muted">{t("intro")}</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {(["light", "dark"] as const).map((scheme) => (
          <section
            key={scheme}
            data-theme={scheme}
            aria-label={t(scheme)}
            className="flex flex-col gap-6 rounded-base bg-ground p-4 text-ink sm:p-6"
          >
            <h2 className="font-diary text-h2">{t(scheme)}</h2>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {SWATCHES.map((name) => (
                <li key={name} className="text-metadata">
                  <span
                    aria-hidden="true"
                    className="block h-10 rounded-base border border-line"
                    style={{ background: `var(--dl-${name})` }}
                  />
                  {name}
                </li>
              ))}
            </ul>
            <div>
              <p className="font-diary text-h3">{t("typeDiary")}</p>
              <p lang="en" className="mt-2 font-diary text-diary">
                {t("sampleDiary")}
              </p>
              <p className="mt-2">{t("sampleBody")}</p>
              <p className="mt-1 text-supporting text-ink-muted">
                {t("sampleSupporting")}
              </p>
            </div>
            <StyleguideDemo />
          </section>
        ))}
      </div>
    </main>
  );
}
