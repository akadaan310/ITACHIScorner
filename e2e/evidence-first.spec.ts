import { expect, test } from "@playwright/test";

test("public navigation offers five clear destinations", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  await expect(nav.getByRole("link")).toHaveText(["Explore", "Learn", "Practice", "Community", "My Corner"]);
});

test("Explore cannot publish invented content when the source backend is unconfigured", async ({ page }) => {
  const response = await page.goto("/explore");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/question|explore/i);
  await expect(page.locator("main")).toContainText(/source|review|approved/i);
  await expect(page.locator("main")).not.toContainText(/SAMPLE|Questions on oneness|Signs in the sky/);
});

test("practice offers private writing while creator-derived teaching awaits review", async ({ page }) => {
  const response = await page.goto("/practice");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main")).toContainText(/practice/i);
  await expect(page.locator("main")).toContainText(/approval|review|pending/i);
  await expect(page.locator("main")).not.toContainText(/Sami|Dana|Yusuf|Maya|START A PATH|difficulty/);
});

test("empty search returns no invented sources or conversations", async ({ page }) => {
  await page.goto("/explore");
  await page.getByLabel("Search questions and conversations").fill("no-published-source-evidence-7391");
  await page.getByRole("button", { name: "Search questions", exact: true }).click();
  await expect(page.locator("main")).toContainText(/prepared|awaiting|no.*reviewed|no.*published|unavailable/i);
  await expect(page.locator("main a[href*='youtube.com/watch'],main a[href*='youtu.be/']")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/Questions on oneness|Signs in the sky|Open vs\. loaded questions/);
});
