import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getSignedInUser } from "@/auth/session";
import { dataMode } from "@/lib/runtime";

/** Header: "Sign in" when signed out, "Account" when signed in. */
export async function AccountLink() {
  if (dataMode() === "none") return null;
  const [t, user] = await Promise.all([
    getTranslations("account"),
    getSignedInUser(),
  ]);
  const className =
    "tap text-supporting text-ink-muted underline-offset-4 hover:text-ink hover:underline";
  return user ? (
    <Link href="/account" className={className}>
      {t("link")}
    </Link>
  ) : (
    <Link href="/signin" className={className}>
      {t("signIn")}
    </Link>
  );
}
