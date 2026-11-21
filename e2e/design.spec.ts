import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/", "/styleguide", "/privacy", "/terms", "/signin"]) {
  test(`${path} has no WCAG 2.1 AA violations @mobile`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
}

test("the dark theme choice survives a reload", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("group", { name: "外觀" })
    .getByText("深色", { exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("switching to English changes the page language", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("group", { name: "介面語言" })
    .getByText("EN", { exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "How was your day?",
  );
});

test("no horizontal scroll at 320px @mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of ["/", "/styleguide", "/privacy", "/terms", "/signin"]) {
    await page.goto(path);
    const wide = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(wide, path).toBe(false);
  }
});
