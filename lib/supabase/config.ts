/**
 * Supabase settings from the environment. Without both variables
 * the site runs without accounts: only the public pages work.
 */
export type SupabaseConfig = {
  /** https://<ref>.supabase.co */
  url: string;
  /** The publishable (anon) key: public, safe in the browser. */
  publishableKey: string;
};

/**
 * The config if both values look usable, else null. The URL must be
 * https, except on this machine (127.0.0.1, localhost), where a local
 * Supabase or the end-to-end tests' stand-in runs over http.
 */
export function readSupabaseConfig(
  url: string | undefined,
  publishableKey: string | undefined,
): SupabaseConfig | null {
  const trimmedUrl = url?.trim().replace(/\/+$/, "");
  const trimmedKey = publishableKey?.trim();
  if (!trimmedUrl || !trimmedKey) return null;
  try {
    const { protocol, hostname } = new URL(trimmedUrl);
    const local = hostname === "localhost" || hostname === "127.0.0.1";
    if (protocol !== "https:" && !(protocol === "http:" && local)) {
      return null;
    }
  } catch {
    return null;
  }
  return { url: trimmedUrl, publishableKey: trimmedKey };
}

// NEXT_PUBLIC_* must be read literally so Next.js inlines them into the
// browser bundle.
export const supabaseConfig = readSupabaseConfig(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** Whether sign-in is available. */
export const accountsEnabled = supabaseConfig !== null;

/** Private bucket with diary photos: `<user id>/<photo id>.webp`. */
export const PHOTOS_BUCKET = "photos";

/** Private bucket with read-aloud audio: `<user id>/<content hash>.mp3`. */
export const AUDIO_BUCKET = "audio";
