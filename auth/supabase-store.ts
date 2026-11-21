import type { Supabase } from "@/lib/supabase/client";
import type { AccountDeleter, Profile, Store } from "@/lib/store/types";
import { AUDIO_BUCKET, PHOTOS_BUCKET } from "@/lib/supabase/config";

/** The store backed by Supabase, as the signed-in user (RLS applies). */
export function createSupabaseStore(supabase: Supabase): Store {
  return {
    async getProfile(userId) {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, birth_month, guardian_consent_at, plan, created_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw new Error(`profiles: ${error.code}`);
      if (!data) return null;
      return {
        userId: data.user_id,
        birthMonth: data.birth_month,
        guardianConsentAt: data.guardian_consent_at,
        plan: data.plan === "paid" ? "paid" : "free",
        createdAt: data.created_at,
      } satisfies Profile;
    },
    async saveProfile(userId, patch) {
      const row = {
        user_id: userId,
        ...(patch.birthMonth !== undefined && {
          birth_month: patch.birthMonth,
        }),
        ...(patch.guardianConsentAt !== undefined && {
          guardian_consent_at: patch.guardianConsentAt,
        }),
      };
      const { data: existing } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();
      const { error } = existing
        ? await supabase
            .from("profiles")
            .update({ ...row, updated_at: new Date().toISOString() })
            .eq("user_id", userId)
        : await supabase.from("profiles").insert(row);
      if (error) throw new Error(`profiles: ${error.code}`);
    },
  };
}

/** Every file under `<bucket>/<userId>/`, removed page by page. */
async function removeFolder(admin: Supabase, bucket: string, userId: string) {
  for (;;) {
    const { data, error } = await admin.storage
      .from(bucket)
      .list(userId, { limit: 100 });
    if (error) throw new Error(`storage list: ${error.message}`);
    if (!data?.length) return;
    const { error: removeError } = await admin.storage
      .from(bucket)
      .remove(data.map((file) => `${userId}/${file.name}`));
    if (removeError) throw new Error(`storage remove: ${removeError.message}`);
  }
}

/**
 * Deleting an account (D13): files first (Storage isn't covered by the
 * database's cascades), then the login, which cascades to every table.
 */
export function createSupabaseDeleter(admin: Supabase): AccountDeleter {
  return {
    async deleteAccount(userId) {
      for (const bucket of [PHOTOS_BUCKET, AUDIO_BUCKET]) {
        await removeFolder(admin, bucket, userId);
      }
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) throw new Error(`delete user: ${error.message}`);
    },
  };
}
