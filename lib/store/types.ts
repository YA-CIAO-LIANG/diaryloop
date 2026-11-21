/**
 * The account data the app reads and writes, behind one interface
 * (docs/decisions.md D11): Supabase in production (auth/supabase-store.ts,
 * every call as the signed-in user under row level security), and an
 * in-memory stand-in for tests (lib/store/memory.ts). Pages and actions
 * use `getStore()` from auth/store.ts, never a client directly.
 */
export type Plan = "free" | "paid";

export type Profile = {
  userId: string;
  /** "YYYY-MM"; null until the welcome step is done. */
  birthMonth: string | null;
  /** When a parent or guardian agreed (teens only, D12). */
  guardianConsentAt: string | null;
  plan: Plan;
  createdAt: string;
};

export type ProfilePatch = Partial<
  Pick<Profile, "birthMonth" | "guardianConsentAt">
>;

export interface Store {
  getProfile(userId: string): Promise<Profile | null>;
  /** Creates the profile if it doesn't exist yet. */
  saveProfile(userId: string, patch: ProfilePatch): Promise<void>;
}

/** Deleting everything an account has: rows, files, and the login. */
export interface AccountDeleter {
  deleteAccount(userId: string): Promise<void>;
}
