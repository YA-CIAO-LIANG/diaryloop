import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { SECURITY_HEADERS } from "./lib/security/csp";

// Connects next-intl to the request config in ./i18n/request.ts.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // No "X-Powered-By: Next.js": it only tells attackers what to try.
  poweredByHeader: false,
  outputFileTracingExcludes: {
    "*": [
      "node_modules/sharp/**",
      "node_modules/@img/**",
      "node_modules/typescript/**",
      "node_modules/@playwright/**",
      "node_modules/playwright*/**",
      "node_modules/vitest/**",
      "node_modules/@vitest/**",
      "tests/**",
      "e2e/**",
      "evals/**",
      "scripts/**",
      "supabase/**",
      "docs/**",
      "package-lock.json",
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: [...SECURITY_HEADERS] }];
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default withNextIntl(nextConfig);
