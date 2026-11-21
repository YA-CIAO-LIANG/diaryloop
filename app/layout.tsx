import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { AccountLink } from "@/components/AccountLink";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { clientMessages } from "@/lib/i18n/client-messages";
import { themeInitScript } from "@/lib/theme";
import { fontVariables } from "./fonts";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1814" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: { default: t("title"), template: `%s · ${t("siteName")}` },
    description: t("description"),
    applicationName: t("siteName"),
    // Private by default; the public pages opt back in themselves.
    robots: { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, messages, t, nonce] = await Promise.all([
    getLocale(),
    getMessages(),
    getTranslations("common"),
    headers().then((h) => h.get("x-nonce") ?? undefined),
  ]);
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script nonce={nonce}>{themeInitScript}</script>
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only rounded-base bg-surface px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider messages={clientMessages(messages)}>
          <SiteHeader>
            <AccountLink />
          </SiteHeader>
          <div id="main" className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
