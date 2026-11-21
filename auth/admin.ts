import { createClient } from "@supabase/supabase-js";
import type { Supabase } from "@/lib/supabase/client";
import { supabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

/**
 * A Supabase client with the secret key: bypasses row level security, so
 * it's used on the server only, and only for what users can't do
 * themselves (deleting the account, setting the plan, statistics). It is
 * never used to read diary content (docs/decisions.md D13).
 * SUPABASE_SERVICE_ROLE_KEY is never NEXT_PUBLIC_. Null when unset.
 */
export function getAdminSupabase(): Supabase | null {
  const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseConfig || !secretKey) return null;
  return createClient<Database>(supabaseConfig.url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
