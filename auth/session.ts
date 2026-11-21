import { cookies } from "next/headers";
import { cache } from "react";
import { isAdminEmail } from "@/lib/admin";
import { memoryUserEmail } from "@/lib/store/memory";
import { dataMode } from "@/lib/runtime";
import { getServerSupabase } from "./server";

/** The cookie that names the test account (memory mode only, D11). */
export const TEST_USER_COOKIE = "dl-test-user";

export type SignedInUser = {
  id: string;
  email: string;
  role: "user" | "admin";
};

/**
 * The signed-in user, or null. With Supabase, from the verified session
 * token (getClaims checks the signature, unlike getSession). In memory
 * mode, from the test cookie. Once per request.
 */
export const getSignedInUser = cache(async (): Promise<SignedInUser | null> => {
  const mode = dataMode();
  if (mode === "memory") {
    const id = (await cookies()).get(TEST_USER_COOKIE)?.value ?? "";
    const email = memoryUserEmail(id);
    if (!email) return null;
    return { id, email, role: id.startsWith("e2e-admin") ? "admin" : "user" };
  }
  const supabase = await getServerSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;
  const email = typeof claims.email === "string" ? claims.email : "";
  return {
    id: claims.sub,
    email,
    role: isAdminEmail(email) ? "admin" : "user",
  };
});
