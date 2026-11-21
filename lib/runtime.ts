/**
 * Where account data lives (docs/decisions.md D11):
 * - "supabase": the real thing (production, and development with keys);
 * - "memory": an in-process stand-in for end-to-end tests and offline
 *   development (`DATA_STORE=memory`), with a test-only sign-in;
 * - "none": neither, so only the public pages work.
 * Memory is refused on Vercel's production deployment whatever the
 * environment says, so test sign-in can never exist on the live site.
 */
export type DataMode = "supabase" | "memory" | "none";

export function dataMode(
  env: Record<string, string | undefined> = process.env,
  hasSupabase: boolean = Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ),
): DataMode {
  if (env.DATA_STORE === "memory" && env.VERCEL_ENV !== "production") {
    return "memory";
  }
  return hasSupabase ? "supabase" : "none";
}
