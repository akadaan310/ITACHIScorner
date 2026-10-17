import { expect, test } from "@playwright/test";
import { credits, freshStart, joinAs } from "./helpers";

const correct = ["Near the end", "aṣ-Ṣamad", "Āl ʿImrān 3:190", "There shall be no compulsion", "in a way that is best", "What led you to see it that way?"];

test.describe("member flows", () => {
  test("signup creates a demo profile with a star card that persists", async ({ page }) => {
    await joinAs(page, "Nightjar");
    await page.getByTestId("go-profile").click();
    await expect(page).toHaveURL(/\/me$/);
    await expect(page.getByRole("img", { name: /Star Card for Nightjar/ })).toBeVisible();
    await expect(page.getByTestId("level-name")).toHaveText("Initiate");
    await page.reload();
    await expect(page.getByRole("img", { name: /Star Card for Nightjar/ })).toBeVisible();
    expect(await credits(page)).toBe(20);
  });

  test("onboarding validates the nickname", async ({ page }) => {
    await freshStart(page, "/onboarding");
    await page.getByTestId("ob-next").click();
    await expect(page.locator("#ob-error")).toContainText("between 2 and 20");
  });

  test("in-app check-in awards credits once and starts the Corner streak", async ({ page }) => {
    await joinAs(page);
    await page.goto("/afterglow/live");
    await page.getByTestId("app-check-in").click();
    await expect(page.getByTestId("app-check-in")).toHaveText(/Checked in/);
    await page.getByTestId("self-report").click();
    expect(await credits(page)).toBe(20 + 15 + 5);
    await page.goto("/me/afterglow");
    await expect(page.getByTestId("attendance")).toContainText("In-app check-in");
    await expect(page.getByTestId("attendance")).toContainText("Self-reported");
    const streaks = page.getByTestId("streaks");
    await expect(streaks).toContainText("Corner streak");
    await expect(streaks).toContainText("Not connected");
  });

  test("First-30 trivia: scoring, XP, no farming, practice and reset", async ({ page }) => {
    await joinAs(page);
    await page.goto("/afterglow/live");
    await page.getByTestId("start-trivia").click();
    for (const label of correct) {
      await page.getByText(label, { exact: false }).first().click();
      await page.getByTestId("submit-answer").click();
      await expect(page.getByRole("status").filter({ hasText: "Correct" })).toBeVisible();
      await page.getByTestId("next-question").click();
    }
    await expect(page.getByTestId("trivia-score")).toHaveText("6/6");
    await expect(page.getByTestId("trivia-xp")).toContainText("+70");
    expect(await credits(page)).toBe(20 + 70);

    // Retry is practice-only and never awards credits.
    await page.goto("/afterglow/live");
    await page.getByRole("button", { name: "Practice again (no XP)" }).click();
    for (let i = 0; i < 6; i++) {
      await page.locator("[data-testid=trivia-question] input[type=radio]").first().check();
      await page.getByTestId("submit-answer").click();
      await page.getByTestId("next-question").click();
    }
    await expect(page.getByTestId("trivia-xp")).toContainText("never award");
    expect(await credits(page)).toBe(90);

    // Reset the demo attempt.
    await page.goto("/afterglow/live");
    await page.getByTestId("reset-trivia").click();
    await expect(page.getByTestId("trivia-intro")).toBeVisible();
  });

  test("trivia closes after the First-30 window and locks late answers", async ({ page }) => {
    await freshStart(page, "/afterglow/live");
    await page.getByTestId("jump-closed").click();
    await expect(page.getByText("The First-30 window has closed.")).toBeVisible();
    await expect(page.getByTestId("start-trivia")).toHaveCount(0);

    await page.clock.install();
    await page.reload();
    await page.getByRole("button", { name: "Practice mode (no XP)" }).click();
    await page.locator("[data-testid=trivia-question] input[type=radio]").first().check();
    await page.clock.fastForward(21_000);
    await expect(page.getByText("Time's up — this one isn't counted.")).toBeVisible();
    await expect(page.locator("[data-testid=trivia-question] input[type=radio]").first()).toBeDisabled();
  });

  test("Simulator path completes with checkpoint, credits and journal note", async ({ page }) => {
    await joinAs(page);
    await page.goto("/dojo/path");
    await page.getByTestId("dojo-next").click(); // setup
    await page.getByText("which details come to mind first").click();
    await page.getByLabel(/Why this one/).fill("It uses their own words.");
    await page.getByTestId("dojo-submit").click();
    await page.getByTestId("dojo-next").click();
    await page.getByRole("button", { name: /Kindness is the only part/ }).click();
    await page.getByTestId("dojo-next").click();
    const selects = page.locator("select");
    await selects.nth(0).selectOption({ label: "Al-Ikhlāṣ 112 — “Say, He is Allah, One.”" });
    await selects.nth(1).selectOption({ label: "Āl ʿImrān 3:190 — the heavens, the earth, night and day as signs." });
    await selects.nth(2).selectOption({ label: "Al-Baqarah 2:256 — no compulsion in religion." });
    await page.getByTestId("dojo-submit").click();
    await page.getByTestId("dojo-next").click();
    await page.getByText("do you mean names").click();
    await page.getByTestId("dojo-submit").click();
    await page.getByTestId("dojo-next").click();
    await page.getByLabel(/what did Sami actually care about/i).fill("That faith makes people kinder.");
    await page.getByTestId("dojo-finish").click();
    await expect(page.getByText("Path complete ✦")).toBeVisible();
    await page.getByTestId("dojo-result-link").click();
    await expect(page.getByText("4/4")).toBeVisible();
    await page.goto("/me/journal");
    await expect(page.getByTestId("journal-list")).toContainText("That faith makes people kinder.");
    await page.goto("/me/quests");
    await expect(page.getByTestId("quest-q-dojo")).toContainText("Complete");
  });

  test("reset demo erases everything", async ({ page }) => {
    await joinAs(page);
    await page.goto("/me/settings");
    await page.getByTestId("reset-demo").click();
    await page.getByTestId("confirm-reset").click();
    await page.goto("/me");
    await expect(page.getByTestId("signed-out")).toBeVisible();
  });

  test("demo profile can be loaded when signed out", async ({ page }) => {
    await freshStart(page, "/me");
    await page.getByTestId("load-demo").click();
    await expect(page.getByTestId("return-ritual")).toBeVisible();
    await expect(page.getByText(/Demo profile/)).toBeVisible();
  });
});

test.describe("privacy & identity", () => {
  test("a typed handle is labelled self-entered and can be unbound", async ({ page }) => {
    await joinAs(page);
    await page.goto("/me/settings");
    const tiktok = page.getByTestId("handle-tiktok");
    await tiktok.getByPlaceholder("@yourname").fill("@my_handle");
    await tiktok.getByRole("button", { name: "Add" }).click();
    await expect(tiktok).toContainText("@my_handle");
    await expect(tiktok.getByText("Self-entered")).toBeVisible();
    await expect(tiktok).not.toContainText("Verified");
    await page.reload();
    await expect(tiktok).toContainText("@my_handle");
    await page.getByTestId("unbind-tiktok").click();
    await expect(tiktok).not.toContainText("@my_handle");
  });

  test("leaderboard is opt-in and rankings can be muted", async ({ page }) => {
    await joinAs(page, "Saffron");
    await page.goto("/afterglow/live");
    await expect(page.getByText("Saffron (you)")).toHaveCount(0);
    await page.getByTestId("leaderboard-optin").check();
    await expect(page.getByText("Saffron (you)")).toBeVisible();
    await page.goto("/me/settings");
    await page.getByTestId("toggle-rankings").uncheck();
    await page.goto("/afterglow/live");
    await expect(page.getByText(/muted rankings/)).toBeVisible();
  });

  test("reduce-motion toggle sets the motion attribute", async ({ page }) => {
    await joinAs(page);
    await page.goto("/me/settings");
    await page.getByTestId("toggle-motion").check();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  });
});

test.describe("Night Atlas", () => {
  test("selecting stars updates the station card, counts visits and resets", async ({ page }) => {
    await freshStart(page, "/atlas");
    const card = page.getByTestId("atlas-card");
    await expect(card).toContainText("The Oneness of God");
    await page.locator("[data-node=ikhlas]").click();
    await expect(card).toContainText("Sūrat al-Ikhlāṣ");
    await page.locator("[data-node=wisdom]").focus();
    await page.keyboard.press("Enter");
    await expect(card).toContainText("Invite with Wisdom");
    await expect(page.getByText(/2\/\d+ charted/)).toBeVisible();
    const zoomLabel = page.getByText(/zoom \d\.\d×/);
    const before = await zoomLabel.innerText();
    await page.getByRole("button", { name: "Zoom in" }).click();
    await expect(zoomLabel).not.toHaveText(before);
    await page.getByTestId("atlas-reset").click();
    await expect(page.getByText(/zoom 1\.0×/)).toBeVisible();
    await card.getByTestId("enter-star").click();
    await expect(page).toHaveURL(/\/dojo/);
  });

  test("deep link selects a star", async ({ page }) => {
    await page.goto("/atlas?star=near");
    await expect(page.getByTestId("atlas-card")).toContainText("I am near");
  });

  test("list fallback lists every destination", async ({ page }) => {
    await page.goto("/atlas");
    await expect(page.getByRole("heading", { name: "Star list" })).toBeVisible();
    await expect(page.locator("#oneness").getByRole("link", { name: "Sūrat al-Ikhlāṣ", exact: true })).toBeVisible();
  });
});
