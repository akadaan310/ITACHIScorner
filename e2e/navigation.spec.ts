import { expect, test } from "@playwright/test";
import { publicRoutes } from "./helpers";

test.describe("navigation & routes", () => {
  for (const route of publicRoutes) {
    test(`renders ${route} without errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.getByText("Independent concept — unaffiliated and not yet endorsed.").first()).toBeAttached();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }

  test("unknown routes show the 404 sky", async ({ page }) => {
    const res = await page.goto("/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /No stars here/i })).toBeVisible();
  });

  test("every internal link on key pages resolves", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const route of ["/", "/discover", "/afterglow", "/atlas", "/me/settings"]) {
      await page.goto(route);
      const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!));
      for (const h of hrefs) seen.add(h.split("#")[0]!);
    }
    for (const h of seen) {
      const res = await request.get(h);
      expect(res.status(), h).toBe(200);
    }
  });

  test("header uses the v1 brand names", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const name of ["Arsenal", "Afterglow", "Simulator", "Atlas", "Reverts HQ", "Shahadahs", "Library"]) await expect(nav.getByRole("link", { name })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Where truth/i);
    await expect(page.getByRole("img", { name: /Itachi in her signature/ })).toBeVisible();
  });

  test("watch-live exits point to official channels in a new tab", async ({ page }) => {
    await page.goto("/events");
    const links = page.locator("a[href*='tiktok.com'], a[href*='youtube.com']");
    expect(await links.count()).toBeGreaterThan(2);
    for (const l of await links.all()) {
      await expect(l).toHaveAttribute("target", "_blank");
      await expect(l).toHaveAttribute("rel", /noopener/);
    }
  });
});
