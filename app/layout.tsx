import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { clientMessages } from "@/lib/i18n/client-messages";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: { default: t("title"), template: `%s · ${t("siteName")}` },
    description: t("description"),
    applicationName: t("siteName"),
    // Nothing here is for search engines except the public pages, which
    // opt back in themselves.
    robots: { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={clientMessages(messages)}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
