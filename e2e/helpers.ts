import { expect, type Page } from "@playwright/test";

export const canonicalRoutes = [
  "/", "/explore", "/learn", "/practice", "/community", "/session-notes", "/library", "/support",
  "/about", "/faq", "/privacy", "/terms", "/join", "/me", "/me/journal", "/me/settings", "/studio", "/studio/creator",
];

export const retiredContent = /Live tonight|Watch live now|Night Atlas|Afterglow|Constellation|First-30|Join the Ranks|Choose your rank|Questions on oneness|Signs in the sky|Open vs\. loaded questions|A conversation on compulsion|Sami|Dana|The Lantern|star card reveal/i;
export const widths = [360, 390, 768, 1280, 1440];
export const heightFor = (width: number) => width < 768 ? 844 : width < 1280 ? 1024 : 900;

export async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(document.getAnimations()
    .filter(a => a.timeline === document.timeline && a.effect?.getTiming().iterations !== Infinity)
    .map(a => a.finished.catch(() => null))));
}

export async function expectTruthfulPage(page: Page) {
  await expect(page.locator("main h1").first()).toBeVisible();
  await expect(page.locator("body")).not.toContainText(retiredContent);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
}
