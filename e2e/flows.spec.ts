import { expect, test } from "@playwright/test";

test("Learn publishes no curriculum before evidence and creator approval", async ({ page }) => {
  await page.goto("/learn");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main")).toContainText(/learn/i);
  await expect(page.locator("main")).toContainText(/evidence|source|review/i);
  await expect(page.locator("main")).toContainText(/approval|pending|ready/i);
  await expect(page.locator("main").getByRole("button", { name: /start.*lesson|complete|enrol/i })).toHaveCount(0);
});

test("unconfigured Community never claims to submit or publish a question", async ({ page }) => {
  await page.goto("/community");
  await expect(page.locator("main")).toContainText(/moderat/i);
  await expect(page.locator("main")).toContainText(/unavailable|not.*available|not.*open|not.*ready|not.*connected|pending/i);
  await expect(page.locator("main button[type=submit]:enabled")).toHaveCount(0);
});

test("missing auth configuration disables sign-in honestly", async ({ page }) => {
  await page.goto("/join");
  await expect(page.locator("main")).toContainText("Sign-in is not available yet.");
  await expect(page.locator("main button[type=submit]:enabled")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/demo profile|load demo|local profile|nickname|credits|\bXP\b/);
});

test("unconnected account and privacy controls expose no fabricated personal data", async ({ page }) => {
  for (const route of ["/me", "/me/settings", "/me/journal"]) {
    await page.goto(route);
    if (route === "/me/journal") await expect(page.getByRole("heading", { level: 1 })).toContainText(/private notes/i);
    await expect(page.locator("main")).toContainText(/not connected|not available|sign.in|connect/i);
    await expect(page.locator("main")).not.toContainText(/Scout|Champion|credits|\bXP\b|Nightjar|Level \d/);
    await expect(page.locator("main button[type=submit]:enabled")).toHaveCount(0);
  }
});

test("browser-controlled demo data cannot unlock the creator workspace", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const forged = JSON.stringify({ state: { profile: { nickname: "Attacker", role: "admin", isCreator: true }, creatorPreview: true }, version: 0 });
    for (const key of ["itachis-corner-demo-v1", "ic-demo-v2"]) localStorage.setItem(key, forged);
    localStorage.setItem("creator-preview", "true");
    localStorage.setItem("role", "admin");
  });
  for (const route of ["/studio", "/studio/creator"]) {
    await page.goto(route);
    await expect(page.locator("main")).toContainText(/Creator access is unavailable|Staff access required|sign.in/i);
    await expect(page.locator("main").getByRole("button", { name: /preview|unlock|publish|approve|load demo|enable/i })).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/editorial queue|approved claims|Attacker/);
  }
});

test("private editorial access is absent from the public footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer a[href^='/studio']")).toHaveCount(0);
  await expect(page.locator("footer")).not.toContainText(/Load demo|preview creator|Studio/i);
});
