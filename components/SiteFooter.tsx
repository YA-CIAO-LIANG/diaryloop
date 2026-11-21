import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("common.footer");
  const links = [
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
  ] as const;
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-4 px-4 py-6 text-supporting text-ink-muted sm:px-6">
        <p>{t("tagline")}</p>
        <nav aria-label={t("label")} className="flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="tap underline-offset-4 hover:text-ink hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
