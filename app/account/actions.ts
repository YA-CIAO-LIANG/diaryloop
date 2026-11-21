"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/auth/server";
import { getSignedInUser, TEST_USER_COOKIE } from "@/auth/session";
import { getAccountDeleter } from "@/auth/store";
import { dataMode } from "@/lib/runtime";

export type DeleteState = { error?: "confirm" | "failed" };

/**
 * Deletes the account and everything in it (D13): diaries, photos,
 * chats, letters, notes. Needs the confirmation checkbox. Signs out and
 * goes home with ?deleted=1.
 */
export async function deleteAccount(
  _: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  const user = await getSignedInUser();
  if (!user) redirect("/signin?next=/account");
  if (formData.get("confirm") !== "yes") return { error: "confirm" };
  const deleter = getAccountDeleter();
  if (!deleter) return { error: "failed" };
  try {
    await deleter.deleteAccount(user.id);
  } catch {
    return { error: "failed" };
  }
  if (dataMode() === "memory") (await cookies()).delete(TEST_USER_COOKIE);
  else await (await getServerSupabase())?.auth.signOut();
  redirect("/?deleted=1");
}
