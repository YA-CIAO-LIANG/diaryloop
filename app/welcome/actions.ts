"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/auth/server";
import { getSignedInUser, TEST_USER_COOKIE } from "@/auth/session";
import { getAccountDeleter, getStore } from "@/auth/store";
import { ageGroup, parseBirthMonth } from "@/lib/age";
import { dataMode } from "@/lib/runtime";

export type WelcomeState = {
  error?: "birthMonth" | "consent" | "failed";
  /** What was sent, shown again after an error (forms reset on submit). */
  year?: string;
  month?: string;
};

/**
 * Saves the birth month (D12). Under 13: the account and everything in
 * it are deleted at once and the user is signed out. 13–17: a parent or
 * guardian must have agreed (the checkbox). 18+: saved.
 */
export async function saveWelcome(
  _: WelcomeState,
  formData: FormData,
): Promise<WelcomeState> {
  const user = await getSignedInUser();
  if (!user) redirect("/signin?next=/welcome");
  const today = new Date();
  const sent = {
    year: String(formData.get("year") ?? ""),
    month: String(formData.get("month") ?? ""),
  };
  const birthMonth = parseBirthMonth(
    `${formData.get("year")}-${String(formData.get("month")).padStart(2, "0")}`,
    today,
  );
  if (!birthMonth) return { error: "birthMonth", ...sent };
  const group = ageGroup(birthMonth, today);
  if (group === "child") {
    await getAccountDeleter()?.deleteAccount(user.id);
    if (dataMode() === "memory") (await cookies()).delete(TEST_USER_COOKIE);
    else await (await getServerSupabase())?.auth.signOut();
    redirect("/welcome/too-young");
  }
  if (group === "teen" && formData.get("guardian") !== "yes") {
    return { error: "consent", ...sent };
  }
  try {
    await (
      await getStore()
    )?.saveProfile(user.id, {
      birthMonth,
      guardianConsentAt: group === "teen" ? today.toISOString() : null,
    });
  } catch {
    return { error: "failed", ...sent };
  }
  redirect("/");
}
