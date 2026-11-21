import { NextResponse, type NextRequest } from "next/server";
import { TEST_USER_COOKIE } from "@/auth/session";
import { safeNextPath } from "@/lib/auth/redirect";
import { dataMode } from "@/lib/runtime";
import { memoryUserEmail } from "@/lib/store/memory";

/**
 * Test-only sign-in (D11): exists only in memory mode, which can't be
 * turned on in Vercel production. Anywhere else it's a 404.
 */
export async function GET(request: NextRequest) {
  if (dataMode() !== "memory") {
    return new NextResponse(null, { status: 404 });
  }
  const user = request.nextUrl.searchParams.get("user") ?? "";
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const response = NextResponse.redirect(new URL(next, request.nextUrl.origin));
  if (memoryUserEmail(user)) {
    response.cookies.set(TEST_USER_COOKIE, user, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
  } else {
    response.cookies.delete(TEST_USER_COOKIE);
  }
  return response;
}
