"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Button } from "@/components/Button";
import { deleteAccount, type DeleteState } from "./actions";

/** Delete, with an explicit confirmation step (D13). */
export function DeleteAccountForm() {
  const t = useTranslations("account.delete");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<DeleteState, FormData>(
    deleteAccount,
    {},
  );
  if (!open) {
    return (
      <Button variant="danger" onClick={() => setOpen(true)}>
        {t("start")}
      </Button>
    );
  }
  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-base border border-error p-4"
    >
      <p>{t("warning")}</p>
      <label className="flex items-start gap-3 text-supporting">
        <input
          type="checkbox"
          name="confirm"
          value="yes"
          className="mt-1 size-5 accent-(--dl-error)"
        />
        <span>{t("confirm")}</span>
      </label>
      {state.error && (
        <p role="alert" className="text-error">
          {t(`error.${state.error}`)}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="danger" disabled={pending}>
          {t("submit")}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)}>
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
