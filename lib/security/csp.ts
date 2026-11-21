/**
 * The Content Security Policy: what a page may load and run. Scripts need
 * this request's nonce (Next.js adds it to its own; the theme script gets
 * it from the layout). Diaries are private, so nothing third-party is
 * allowed: no analytics, no ads, no embeds (docs/decisions.md D4).
 */
export function contentSecurityPolicy({
  nonce,
  supabaseUrl,
  development = false,
}: {
  nonce: string;
  supabaseUrl: string | null;
  development?: boolean;
}): string {
  const supabase = supabaseUrl ? new URL(supabaseUrl).origin : null;
  const supabaseSocket = supabase?.replace(/^http/, "ws") ?? null;
  const directives: Record<string, (string | null)[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // React's dev tools evaluate code; never in production.
      development ? "'unsafe-eval'" : null,
    ],
    // Inline style attributes (custom properties for animations).
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", supabase],
    "font-src": ["'self'", "data:"],
    "media-src": ["'self'", "blob:", supabase],
    "connect-src": ["'self'", supabase, supabaseSocket],
    "frame-src": ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'", supabase],
    "frame-ancestors": ["'none'"],
  };
  const policy = Object.entries(directives)
    .map(([name, values]) =>
      [name, ...values.filter((v): v is string => v !== null)].join(" "),
    )
    .join("; ");
  // Upgrading http to https would break a local http Supabase (E2E).
  const local = development || supabase?.startsWith("http:");
  return local ? policy : `${policy}; upgrade-insecure-requests`;
}

/** A fresh nonce per request: 128 random bits, base64. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * Headers every response gets: HTTPS only, no MIME sniffing, no framing,
 * no referrer leaving the site (diary URLs say nothing, but still), and
 * no powerful features except notifications the page asks for itself.
 */
export const SECURITY_HEADERS: readonly { key: string; value: string }[] = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];
