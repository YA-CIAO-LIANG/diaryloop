import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireMember } from "@/auth/guard";
import { Button } from "@/components/Button";
import { signOut } from "../auth/actions";
import { DeleteAccountForm } from "./DeleteAccountForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("title") };
}

export default async function AccountPage() {
  const member = await requireMember("/account");
  const t = await getTranslations("account");
  return (
    <main className="mx-auto flex max-w-reading flex-col gap-10 px-4 py-16 sm:px-6">
      <section>
        <h1 className="font-diary text-h1">{t("title")}</h1>
        <p className="mt-3 text-supporting text-ink-muted">{t("signedInAs")}</p>
        <p className="break-all">{member.email}</p>
        <form action={signOut} className="mt-4">
          <Button type="submit">{t("signOut")}</Button>
        </form>
      </section>
      <section className="border-t border-line pt-8">
        <h2 className="font-diary text-h2">{t("delete.title")}</h2>
        <p className="mt-2 mb-4 text-ink-muted">{t("delete.lead")}</p>
        <DeleteAccountForm />
      </section>
    </main>
  );
}
