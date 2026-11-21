import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";

/** Brand on the left; language and theme on the right (wraps on phones). */
export async function SiteHeader({ children }: { children?: React.ReactNode }) {
  const t = await getTranslations("common");
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="tap font-diary text-h3 text-ink no-underline"
          aria-label={t("homeLink")}
        >
          DiaryLoop
        </Link>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {children}
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
