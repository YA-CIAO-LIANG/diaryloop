import { expect, test } from "@playwright/test";
import { completeWelcome, signIn, signInAsMember } from "./fixtures";

test("signed out, the account page asks to sign in", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/signin\?next=%2Faccount/);
  await expect(
    page.getByRole("button", { name: "使用 Google 登入" }),
  ).toBeVisible();
});

test("the sign-in button signs in (test mode) and returns", async ({
  page,
}) => {
  await page.goto("/signin?next=/account");
  await page.getByRole("button", { name: "使用 Google 登入" }).click();
  // A new account goes through the welcome step first.
  await expect(page).toHaveURL(/\/welcome/);
});

test("an adult finishes the welcome step and sees the account @mobile", async ({
  page,
}) => {
  await signInAsMember(page);
  await expect(page).toHaveURL("/");
  await page.goto("/account");
  await expect(page.getByText(/@example\.com/)).toBeVisible();
});

test("a teen needs a guardian's consent", async ({ page }) => {
  await signIn(page, "free", "/welcome");
  const teenYear = String(new Date().getFullYear() - 15);
  await completeWelcome(page, teenYear, "1");
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "家長或監護人",
  );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "開始" }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/account");
  await expect(
    page.getByRole("heading", { name: "帳號", exact: true }),
  ).toBeVisible();
});

test("under 13: the account is deleted at once", async ({ page }) => {
  const id = await signIn(page, "free", "/welcome");
  const childYear = String(new Date().getFullYear() - 10);
  await completeWelcome(page, childYear, "1");
  await expect(page).toHaveURL("/welcome/too-young");
  // Signed out: the account page asks to sign in again.
  await page.goto("/account");
  await expect(page).toHaveURL(/\/signin/);
  // Signing in with the same id starts over: nothing was kept.
  await page.goto(`/api/test/sign-in?user=${id}&next=/account`);
  await expect(page).toHaveURL(/\/welcome/);
});

test("deleting the account needs confirmation and removes everything", async ({
  page,
}) => {
  const id = await signInAsMember(page);
  await page.goto("/account");
  await page.getByRole("button", { name: "刪除帳號…" }).click();
  await page.getByRole("button", { name: "永久刪除我的帳號" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "請先勾選",
  );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "永久刪除我的帳號" }).click();
  await expect(page).toHaveURL("/?deleted=1");
  await page.goto(`/api/test/sign-in?user=${id}&next=/account`);
  await expect(page).toHaveURL(/\/welcome/);
});

test("test sign-in ignores ids that aren't test accounts", async ({ page }) => {
  await page.goto("/api/test/sign-in?user=someone-real&next=/account");
  await expect(page).toHaveURL(/\/signin/);
});
