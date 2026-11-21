"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/auth/server";
import { TEST_USER_COOKIE } from "@/auth/session";
import { safeNextPath, withSignInResult } from "@/lib/auth/redirect";
import { dataMode } from "@/lib/runtime";

/** This request's own origin, from the forwarded headers. */
async function origin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Starts Google sign-in; returns to `next` afterwards. */
export async function signInWithGoogle(formData: FormData) {
  const next = safeNextPath(String(formData.get("next") ?? "/"));
  if (dataMode() === "memory") {
    // Test mode (D11): a fixed free test account, no Google.
    (await cookies()).set(TEST_USER_COOKIE, "e2e-signin-button", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    redirect(next);
  }
  const supabase = await getServerSupabase();
  if (!supabase) redirect(withSignInResult(next, "failed"));
  const callback = new URL("/auth/callback", await origin());
  callback.searchParams.set("next", next);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callback.href },
  });
  if (error || !data.url) redirect(withSignInResult(next, "failed"));
  redirect(data.url);
}

export async function signOut() {
  if (dataMode() === "memory") {
    (await cookies()).delete(TEST_USER_COOKIE);
  } else {
    await (await getServerSupabase())?.auth.signOut();
  }
  redirect("/");
}
