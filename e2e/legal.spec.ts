import { expect, test } from "@playwright/test";

test("the privacy policy covers diaries, AI, training, and deletion @mobile", async ({
  page,
}) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "隱私權政策",
  );
  const text = await page.getByRole("main").innerText();
  for (const phrase of ["加密", "Azure OpenAI", "訓練", "刪除帳號", "13 歲"]) {
    expect(text, phrase).toContain(phrase);
  }
});

test("the terms give crisis resources", async ({ page }) => {
  await page.goto("/terms");
  const text = await page.getByRole("main").innerText();
  expect(text).toContain("1925");
  expect(text).toContain("988");
});

test("the footer links to both legal pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "隱私權政策" }).first().click();
  await expect(page).toHaveURL("/privacy");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "服務條款" })
    .click();
  await expect(page).toHaveURL("/terms");
});

test("English legal pages", async ({ page, context }) => {
  await context.addCookies([
    { name: "dl-locale", value: "en", url: "http://localhost:3300" },
  ]);
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Privacy Policy",
  );
});
