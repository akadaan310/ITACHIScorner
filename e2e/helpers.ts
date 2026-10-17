import { expect, type Page } from "@playwright/test";

export const publicRoutes = [
  "/", "/discover", "/watch", "/atlas", "/dojo", "/dojo/path", "/dojo/result", "/reverts", "/reverts/ask/q-silly", "/stories",
  "/afterglow", "/afterglow/before", "/afterglow/live", "/afterglow/episodes/sample-episode-01", "/afterglow/episodes/sample-episode-02",
  "/afterglow/vault", "/afterglow/gallery", "/events", "/library", "/library/preview", "/membership", "/about", "/faq", "/privacy", "/terms",
  "/join", "/onboarding", "/me", "/me/constellation", "/me/quests", "/me/afterglow", "/me/journal", "/me/settings", "/studio", "/studio/creator",
];

export async function freshStart(page: Page, path = "/") {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.goto(path);
}

export async function joinAs(page: Page, nickname = "Nightjar") {
  await freshStart(page, "/onboarding");
  await page.getByLabel("What should the ranks call you?").fill(nickname);
  await page.getByTestId("ob-next").click();
  await page.getByText("Curious", { exact: true }).click();
  await page.getByTestId("ob-next").click();
  await page.getByTestId("ob-next").click();
  await page.getByText("The Lantern").click();
  await page.getByTestId("ob-next").click();
  await expect(page.getByTestId("star-card-reveal")).toBeVisible();
}

export const credits = async (page: Page) => {
  await page.goto("/me");
  const t = await page.getByTestId("xp-total").innerText();
  return Number(/◆\s*(\d+)/.exec(t)![1]);
};
