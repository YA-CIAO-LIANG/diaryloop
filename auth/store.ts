import { createMemoryStore } from "@/lib/store/memory";
import type { AccountDeleter, Store } from "@/lib/store/types";
import { dataMode } from "@/lib/runtime";
import { getAdminSupabase } from "./admin";
import { getServerSupabase } from "./server";
import { createSupabaseDeleter, createSupabaseStore } from "./supabase-store";

/** The store for this request (D11), or null without accounts. */
export async function getStore(): Promise<Store | null> {
  if (dataMode() === "memory") return createMemoryStore();
  const supabase = await getServerSupabase();
  return supabase ? createSupabaseStore(supabase) : null;
}

/** Deletes whole accounts; needs the secret key with Supabase. */
export function getAccountDeleter(): AccountDeleter | null {
  if (dataMode() === "memory") return createMemoryStore();
  const admin = getAdminSupabase();
  return admin ? createSupabaseDeleter(admin) : null;
}
