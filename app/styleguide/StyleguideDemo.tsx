"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { DiaryTextArea, Field, TextInput } from "@/components/Field";

export function StyleguideDemo() {
  const t = useTranslations("styleguide");
  const [mood, setMood] = useState("calm");
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" arrow>
          {t("primary")}
        </Button>
        <Button>{t("secondary")}</Button>
        <Button variant="ghost">{t("ghost")}</Button>
        <Button variant="danger">{t("danger")}</Button>
        <Button disabled>{t("disabled")}</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["happy", "calm", "tired"] as const).map((id) => (
          <Chip key={id} selected={mood === id} onClick={() => setMood(id)}>
            {t(`moods.${id}`)}
          </Chip>
        ))}
      </div>
      <Field label={t("fieldLabel")} hint={t("fieldHint")}>
        {({ id, describedBy }) => (
          <TextInput id={id} aria-describedby={describedBy} />
        )}
      </Field>
      <Field label={t("diaryLabel")}>
        {({ id }) => (
          <DiaryTextArea id={id} rows={4} placeholder={t("diaryPlaceholder")} />
        )}
      </Field>
      <Card>
        <p lang="en" className="font-diary text-diary">
          I went to the <span className="marked">night market</span> with my
          friends.
        </p>
        <div className="mt-4 rounded-base bg-pal p-3 text-pal-ink">
          {t("penPal")}
        </div>
      </Card>
    </>
  );
}
