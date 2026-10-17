import { test, type Page } from "@playwright/test";
import { joinAs } from "./helpers";

/**
 * Captures the review set into docs/screenshots at 360 / 390 / 768 / 1280 / 1440.
 * Run with: npm run screenshots
 */
const widths = [360, 390, 768, 1280, 1440];
const out = (name: string, w: number) => `docs/screenshots/${name}-${w}.jpg`;
const shot = (page: Page, name: string, w: number, fullPage = false) => page.screenshot({ path: out(name, w), type: "jpeg", quality: 72, fullPage });
const settle = (page: Page) =>
  page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.timeline === document.timeline && a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => null))));

for (const w of widths) {
  test.describe(`${w}px`, () => {
    test.use({ viewport: { width: w, height: w < 768 ? 844 : w < 1280 ? 1024 : 900 }, deviceScaleFactor: 1 });

    test(`public screens @${w}`, async ({ page }) => {
      const pages: [string, string][] = [
        ["home", "/"],
        ["atlas", "/atlas?star=ikhlas"],
        ["dojo", "/dojo"],
        ["sanctuary", "/reverts"],
        ["membership", "/membership"],
        ["book-preview", "/library/preview?page=4"],
        ["afterglow", "/afterglow"],
        ["arsenal", "/watch"],
      ];
      for (const [name, path] of pages) {
        await page.goto(path);
        await settle(page);
        await shot(page, name, w, name === "home" && (w === 1440 || w === 390));
      }
      if (w < 1024) {
        await page.goto("/");
        await page.getByRole("navigation", { name: "Quick navigation" }).getByRole("button", { name: "Open menu" }).click();
        await shot(page, "menu", w);
      } else {
        await page.goto("/");
        await page.locator("summary", { hasText: "Watch live" }).click();
        await shot(page, "menu", w);
      }
    });

    test(`member & afterglow flows @${w}`, async ({ page }) => {
      await page.goto("/onboarding");
      await page.evaluate(() => localStorage.clear());
      await page.goto("/onboarding");
      await settle(page);
      await shot(page, "onboarding", w);
      await joinAs(page, "Nightjar");
      await shot(page, "star-card", w);

      await page.goto("/afterglow/live");
      await page.getByTestId("start-trivia").click();
      await page.locator("[data-testid=trivia-question] input[type=radio]").nth(2).check();
      await page.getByTestId("trivia-question").scrollIntoViewIfNeeded();
      await shot(page, "afterglow-live-challenge", w);
      for (let i = 0; i < 6; i++) {
        if (i > 0) await page.locator("[data-testid=trivia-question] input[type=radio]").nth(1).check();
        await page.getByTestId("submit-answer").click();
        await page.getByTestId("next-question").click();
      }
      await page.getByTestId("trivia-results").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1300);
      await shot(page, "afterglow-result", w);

      await page.goto("/me");
      await page.getByTestId("load-demo").click({ timeout: 1500 }).catch(() => undefined);
      await settle(page);
      await shot(page, "member-profile", w);
      await page.goto("/afterglow/episodes/sample-episode-01");
      await settle(page);
      await shot(page, "afterglow-recap", w);
    });
  });
}
