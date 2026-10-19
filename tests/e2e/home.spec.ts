import { expect, test } from "@playwright/test";

test("sections in order and projects from GitHub", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Joseph Orias" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Email me" }).first()).toHaveAttribute("href", "mailto:oriasmjc@gmail.com");
  await expect(page.locator("#work")).toContainText("ecoUsapan");
  await expect(page.locator("#work")).not.toContainText("klaro");
  await expect(page.locator("#work")).not.toContainText("old-archived");
});

test("no horizontal scroll", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("reduced motion: content visible immediately", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  const opacity = await page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe("1");
});

test("keyboard focus is visible", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).not.toBe("none");
});
