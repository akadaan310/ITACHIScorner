import { expect, test } from "@playwright/test";
import { canonicalRoutes, expectTruthfulPage } from "./helpers";

test.describe("truthful public routes", () => {
  for (const route of canonicalRoutes) {
    test(`${route} renders without browser errors or demo content`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(String(error)));
      page.on("console", message => message.type() === "error" && errors.push(message.text()));
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expectTruthfulPage(page);
      await expect(page.locator("body")).toContainText(/independent|unaffiliated|not.*endorsed/i);
      expect(errors).toEqual([]);
    });
  }

  test("unknown routes return a useful 404", async ({ page }) => {
    expect((await page.goto("/does-not-exist"))?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("main").getByRole("link").first()).toBeVisible();
  });

  test("every internal public link resolves", async ({ page, request }) => {
    const hrefs = new Set<string>();
    for (const route of ["/", "/explore", "/learn", "/community", "/about", "/me/settings"]) {
      await page.goto(route);
      for (const href of await page.locator("a[href^='/']").evaluateAll(links => links.map(link => link.getAttribute("href")!))) {
        hrefs.add(href.split("#")[0] || "/");
      }
    }
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
  });

  test("the supplied public channel hub retains new-tab protections", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("link", { name: /Visit the public link hub/i })).toHaveAttribute("href", "https://linktr.ee/dawahxdialogues");
    const channels = page.locator("main a[href^='https://']");
    expect(await channels.count()).toBeGreaterThanOrEqual(1);
    for (const link of await channels.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).not.toHaveAttribute("href", /example|sample|pending/i);
    }
  });
});

const legacyRoutes: [string, string][] = [
  ["/discover", "/explore"], ["/watch", "/explore"], ["/atlas", "/explore"],
  ["/dojo", "/practice"], ["/dojo/path", "/practice"], ["/dojo/result", "/practice"],
  ["/afterglow", "/session-notes"], ["/afterglow/before", "/session-notes"],
  ["/afterglow/live", "/session-notes"], ["/afterglow/vault", "/session-notes"], ["/afterglow/gallery", "/session-notes"],
  ["/afterglow/episodes/sample-episode-01", "/session-notes"], ["/afterglow/episodes/sample-episode-02", "/session-notes"],
  ["/events", "/about"], ["/reverts", "/learn"], ["/reverts/ask/q-silly", "/community"], ["/stories", "/community"],
  ["/library/preview?page=4", "/library"], ["/membership", "/support"], ["/onboarding", "/join"],
  ["/me/constellation", "/me"], ["/me/quests", "/me"], ["/me/afterglow", "/me"],
];

for (const [from, to] of legacyRoutes) {
  test(`legacy ${from} leads to truthful ${to}`, async ({ page }) => {
    expect((await page.goto(from))?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(to);
    await expectTruthfulPage(page);
  });
}
