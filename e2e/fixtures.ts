import type { Page } from "@playwright/test";

let counter = 0;

/**
 * Signs in as a fresh test account (memory mode, D11). Each call gets its
 * own id, so parallel tests never share data. `kind` picks the plan or
 * role: ids starting "e2e-paid" are paid, "e2e-admin" admins.
 */
export async function signIn(
  page: Page,
  kind: "free" | "paid" | "admin" = "free",
  next = "/",
): Promise<string> {
  const id = `e2e-${kind}-${process.pid}-${Date.now() % 1e6}-${counter++}`;
  await page.goto(
    `/api/test/sign-in?user=${id}&next=${encodeURIComponent(next)}`,
  );
  return id;
}

/** Signs in and finishes the welcome step as an adult. */
export async function signInAsMember(
  page: Page,
  kind: "free" | "paid" | "admin" = "free",
): Promise<string> {
  const id = await signIn(page, kind, "/welcome");
  await completeWelcome(page, "1995", "6");
  return id;
}

export async function completeWelcome(
  page: Page,
  year: string,
  month: string,
  guardian = false,
) {
  await page.getByRole("combobox", { name: /年|Year/ }).selectOption(year);
  await page.getByRole("combobox", { name: /月|Month/ }).selectOption(month);
  if (guardian) await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "開始" }).click();
}
