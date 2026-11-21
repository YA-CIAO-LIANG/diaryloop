import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { LOCALE_COOKIE, LOCALE_OVERRIDE_HEADER } from "@/lib/i18n/config";
import { detectLocale } from "@/lib/i18n/detect-locale";

// Loaded by the next-intl plugin (next.config.ts) for every request.
export default getRequestConfig(async () => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const locale = detectLocale({
    // Set by proxy.ts from `?hl=`; it strips any sent by the browser.
    override: headerStore.get(LOCALE_OVERRIDE_HEADER),
    cookie: cookieStore.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
  return {
    locale,
    timeZone: "Asia/Taipei",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
