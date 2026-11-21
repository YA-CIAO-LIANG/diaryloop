import { NextResponse, type NextRequest } from "next/server";
import {
  isLocale,
  LOCALE_OVERRIDE_HEADER,
  LOCALE_PARAM,
} from "@/lib/i18n/config";
import { contentSecurityPolicy, createNonce } from "@/lib/security/csp";

/**
 * Every page request: a fresh CSP nonce, passed to the page in the
 * request headers (Next.js reads it from the CSP header and adds it to its
 * scripts) and sent with the response.
 */
export async function proxy(request: NextRequest) {
  const nonce = createNonce();
  const policy = contentSecurityPolicy({
    nonce,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    development: process.env.NODE_ENV === "development",
  });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", policy);
  const hl = request.nextUrl.searchParams.get(LOCALE_PARAM);
  if (isLocale(hl)) requestHeaders.set(LOCALE_OVERRIDE_HEADER, hl);
  else requestHeaders.delete(LOCALE_OVERRIDE_HEADER);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", policy);
  return response;
}

export const config = {
  // Pages only: skip build assets, images, and files with an extension.
  matcher: ["/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)"],
};
