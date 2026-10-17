import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publicRoutes as pages } from "./helpers";

test.describe("accessibility", () => {
  for (const p of pages) {
    test(`axe: no serious or critical violations on ${p}`, async ({ page }) => {
      await page.goto(p);
      // Let entrance animations settle so contrast is measured on the final frame.
      await page.evaluate(() =>
        Promise.all(document.getAnimations().filter((a) => a.timeline === document.timeline && a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => null))),
      );
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("graceful fallbacks", () => {
  test("home and atlas render meaningfully without JavaScript", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Where truth/i);
    await expect(page.getByRole("img", { name: /Itachi in her signature/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Enter the Corner/ })).toBeVisible();
    await page.goto("/atlas");
    await expect(page.getByRole("heading", { name: "Star list" })).toBeVisible();
    await ctx.close();
  });

  test("prefers-reduced-motion stops decorative animation", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    const duration = await page.locator(".marquee").first().evaluate((el) => getComputedStyle(el).animationDuration);
    expect(parseFloat(duration)).toBeLessThan(0.01);
    await ctx.close();
  });

  test("Arabic is right-to-left with tashkil preserved", async ({ page }) => {
    await page.goto("/studio");
    const ar = page.locator("blockquote[lang=ar]").first();
    await expect(ar).toHaveAttribute("dir", "rtl");
    await expect(ar).toContainText("قُلْ هُوَ اللَّهُ أَحَدٌ");
    const font = await ar.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(font).toContain("Amiri");
  });
});
