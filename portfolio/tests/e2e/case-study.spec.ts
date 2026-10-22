import { expect, test } from "@playwright/test";

test("featured card opens modal with its own URL, Escape returns home", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Read case study: PyLex" }).click();
  await expect(page).toHaveURL(/\/work\/pylex$/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/$/);
});

test("direct visit renders full page; private study 404s", async ({ page }) => {
  await page.goto("/work/pylex");
  await expect(page.getByRole("heading", { level: 1, name: "PyLex" })).toBeVisible();
  const res = await page.goto("/work/klaro");
  expect(res?.status()).toBe(404);
});
