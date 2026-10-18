import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { canonicalRoutes, settle } from "./helpers";

for (const route of canonicalRoutes) {
  test(`axe: no serious or critical accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    await settle(page);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations.filter(v => v.impact === "serious" || v.impact === "critical")
      .map(v => `${v.id}: ${v.nodes.map(node => node.target.join(" ")).join(", ")}`)).toEqual([]);
  });
}

test("public story and legacy navigation work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("main").getByRole("link", { name: /Explore questions/i }).click();
  await expect(page).toHaveURL(/\/explore$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main")).toContainText(/source|review|approved/i);
  await page.goto("/dojo/path");
  await expect(page).toHaveURL(/\/practice$/);
  await expect(page.locator("main")).toContainText(/approval|review|pending/i);
  await context.close();
});

test("reduced motion prevents continuously animated decoration", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await settle(page);
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running" && a.effect?.getTiming().iterations === Infinity).length)).toBe(0);
  await context.close();
});

test("unapproved sacred text is absent from public learning surfaces", async ({ page }) => {
  for (const route of ["/learn", "/practice", "/library", "/studio"]) {
    await page.goto(route);
    await expect(page.locator("main blockquote[lang=ar]")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("قُلْ هُوَ اللَّهُ أَحَدٌ");
  }
});
