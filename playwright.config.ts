import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3300);
const MOCK_PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 54339);

/**
 * End-to-end tests (e2e/) against the production build: run `npm run
 * build:e2e` first, then `npm run test:e2e`. The build talks to a
 * stand-in Supabase (e2e/mock-supabase/) and always uses the fake AI
 * providers, with every API key blanked, so no test can reach a paid API.
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
        SUPABASE_SERVICE_ROLE_KEY: "e2e-secret-key",
        AI_PROVIDERS: "fake",
        AZURE_SPEECH_KEY: "",
        AZURE_OPENAI_API_KEY: "",
        MOCK_SUPABASE_PORT: String(MOCK_PORT),
      },
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
