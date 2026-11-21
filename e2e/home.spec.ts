import { expect, test } from "@playwright/test";

test("home page shows the invitation to write @mobile", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("security headers are sent", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(response.headers()["x-frame-options"]).toBe("DENY");
});
