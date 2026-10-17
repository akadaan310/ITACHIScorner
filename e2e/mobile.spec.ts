import { expect, test } from "@playwright/test";

test.describe("mobile (Pixel 7)", () => {
  test("bottom tab bar uses Pocket Warrior tabs and the drawer opens", async ({ page }) => {
    await page.goto("/");
    const tabs = page.getByRole("navigation", { name: "Quick navigation" });
    for (const t of ["Home", "Search", "Live", "Sim"]) await expect(tabs.getByRole("link", { name: t })).toBeVisible();
    const box = await tabs.getByRole("link", { name: "Live" }).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    await tabs.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Site menu" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: /Reverts HQ/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("no horizontal overflow on key pages", async ({ page }) => {
    for (const p of ["/", "/watch", "/atlas", "/afterglow/live", "/reverts", "/library/preview", "/me/settings"]) {
      await page.goto(p);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), p).toBeLessThanOrEqual(0);
    }
  });
});
