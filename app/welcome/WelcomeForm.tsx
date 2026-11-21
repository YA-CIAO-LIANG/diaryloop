"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/Button";
import { saveWelcome, type WelcomeState } from "./actions";

const selectClassName =
  "rounded-base border border-line bg-surface px-3 py-2 text-body text-ink pointer-coarse:min-h-11";

export function WelcomeForm({ years }: { years: number[] }) {
  const t = useTranslations("welcome");
  const [state, action, pending] = useActionState<WelcomeState, FormData>(
    saveWelcome,
    {},
  );
  return (
    <form action={action} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="font-semibold">{t("birthMonth")}</legend>
        <p className="text-supporting text-ink-muted">{t("birthMonthHint")}</p>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2">
            <span className="sr-only">{t("year")}</span>
            <select
              key={`year-${state.year ?? ""}`}
              name="year"
              required
              className={selectClassName}
              defaultValue={state.year ?? ""}
            >
              <option value="" disabled>
                {t("year")}
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="sr-only">{t("month")}</span>
            <select
              key={`month-${state.month ?? ""}`}
              name="month"
              required
              className={selectClassName}
              defaultValue={state.month ?? ""}
            >
              <option value="" disabled>
                {t("month")}
              </option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>
      <label className="flex items-start gap-3 text-supporting">
        <input
          type="checkbox"
          name="guardian"
          value="yes"
          className="mt-1 size-5 accent-(--dl-primary)"
        />
        <span>{t("guardian")}</span>
      </label>
      {state.error && (
        <p role="alert" className="text-error">
          {t(`error.${state.error}`)}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {t("submit")}
      </Button>
    </form>
  );
}
