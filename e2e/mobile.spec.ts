import { expect, test } from "@playwright/test";
import { heightFor, widths } from "./helpers";

for (const width of widths) {
  test(`home primary action fits the first fold and public routes fit ${width}px`, async ({ page }) => {
    const height = heightFor(width);
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const primary = page.locator("main").getByRole("link", { name: /Explore questions/i });
    await expect(primary).toBeVisible();
    const box = await primary.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(height);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    for (const route of ["/", "/explore", "/learn", "/practice", "/community", "/join", "/me/settings"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), route).toBeLessThanOrEqual(0);
    }
  });
}

test("phone menu supports touch, escape, focus return and all five destinations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const opener = page.getByRole("button", { name: /Open menu/i }).first();
  await opener.click();
  const drawer = page.getByRole("dialog", { name: /menu/i });
  await expect(drawer).toBeVisible();
  for (const label of ["Home", "Explore", "Learn", "Practice", "Community"]) await expect(drawer.getByRole("link", { name: label, exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(opener).toBeFocused();
  await opener.click();
  await drawer.getByRole("link", { name: "Explore", exact: true }).click();
  await expect(page).toHaveURL(/\/explore$/);
  await expect(drawer).toBeHidden();
});
