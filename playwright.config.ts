import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3300);

/**
 * End-to-end tests (e2e/) against the production build: run `npm run
 * build:e2e` first, then `npm run test:e2e`. The server uses the
 * in-memory store with test sign-in (D11) and the fake AI providers,
 * with every API key blanked, so no test can reach Supabase or a paid API.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "zh-TW",
    timezoneId: "Asia/Taipei",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "iphone",
      use: { ...devices["iPhone 15"], browserName: "chromium" },
      grep: /@mobile/,
    },
    { name: "android", use: { ...devices["Pixel 7"] }, grep: /@mobile/ },
  ],
  webServer: [
    {
      command: `npx next start --port ${PORT}`,
      port: PORT,
      env: {
        // The in-memory store and test sign-in (D11); never on Vercel.
        DATA_STORE: "memory",
        SUPABASE_SERVICE_ROLE_KEY: "",
        AI_PROVIDERS: "fake",
        AZURE_SPEECH_KEY: "",
        AZURE_OPENAI_API_KEY: "",
      },
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
