import { expect, test } from "@playwright/test";

test("hero invites a question with no more than two competing actions", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section[aria-labelledby='hero-title']");
  const primary = hero.getByRole("link", { name: "Explore a question", exact: true });
  await expect(primary).toHaveAttribute("href", "/explore");
  await expect(primary).toHaveAttribute("data-testid", "home-primary");
  expect(await hero.locator("a,button").count()).toBeLessThanOrEqual(2);
  await expect(hero).not.toContainText(/Watch live|\bLive\b|Afterglow|Constellation/i);
});

test("homepage offers distinct contextual journeys throughout its story", async ({ page }) => {
  await page.goto("/");
  const main = page.locator("main");
  for (const [label, href] of [
    ["Explore a question", "/explore"],
    ["Learn at your pace", "/learn"],
    ["Practise with your own words", "/practice"],
    ["Make room for each other", "/community"],
    ["Visit My Corner", "/me"],
  ] as const) await expect(main.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  await expect(main.locator("a[href='/about']")).toHaveCount(1);
  await expect(main.locator(":scope > section")).toHaveCount(7);
  await expect(main.getByTestId("question-journey")).toBeVisible();
  await expect(main.getByRole("search")).toBeVisible();
  await expect(page.locator("#question-desk").getByRole("heading", { name: "Your question. Your own words.", exact: true })).toBeVisible();
});

test("visitor can review, edit, copy and clear only their own draft", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#question-desk");
  const desk = page.locator("#question-desk");
  const question = desk.getByRole("textbox", { name: "Your question", exact: true });
  const reflection = desk.getByRole("textbox", { name: "Your reflection", exact: true });
  await expect(question).toHaveValue("");
  await expect(reflection).toHaveValue("");
  await expect(question).toHaveAttribute("spellcheck", "false");
  await expect(reflection).toHaveAttribute("spellcheck", "false");
  for (const name of ["Review draft", "Copy draft", "Clear draft"]) await expect(desk.getByRole("button", { name, exact: true })).toBeDisabled();
  await question.fill("How can I make more time to listen?");
  await reflection.fill("My own thought: pause before I respond.");
  await desk.getByRole("button", { name: "Review draft", exact: true }).click();
  await expect(desk.getByRole("button", { name: "Edit draft", exact: true })).toBeVisible();
  await expect(desk.locator("[aria-label='Your draft']")).toBeFocused();
  await desk.getByRole("button", { name: "Copy draft", exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain("How can I make more time to listen?");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("My own thought: pause before I respond.");
  await desk.getByRole("button", { name: "Edit draft", exact: true }).click();
  await expect(question).toBeFocused();
  await expect(question).toHaveValue("How can I make more time to listen?");
  await question.fill("How can I listen patiently?");
  await desk.getByRole("button", { name: "Review draft", exact: true }).click();
  await desk.getByRole("button", { name: "Clear draft", exact: true }).click();
  await expect(question).toHaveValue("");
  await expect(reflection).toHaveValue("");
  await expect(question).toBeFocused();
});

test("draft never uses browser storage, sends visitor text or produces a server answer", async ({ page }) => {
  await page.goto("/#question-desk");
  const snapshot = () => page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
  const before = await snapshot();
  const requests: string[] = [];
  const marker = "visitor-private-draft-7391";
  page.on("request", request => {
    if (request.url().includes(marker) || (request.postData() || "").includes(marker) || !["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      requests.push(`${request.method()} ${request.url()}`);
    }
  });
  const desk = page.locator("#question-desk");
  await desk.getByRole("textbox", { name: "Your question", exact: true }).fill(marker);
  await desk.getByRole("textbox", { name: "Your reflection", exact: true }).fill("These are my words, held only in this tab.");
  await desk.getByRole("button", { name: "Review draft", exact: true }).click();
  await expect(desk).toContainText(/your.*words|your.*draft|own.*words/i);
  await expect(desk).toContainText(/not.*saved|refresh|leave.*page|this.*tab/i);
  await expect(desk).not.toContainText(/Itachi says|mentor.*answer|generated answer|AI answer/i);
  expect(await snapshot()).toEqual(before);
  expect(requests).toEqual([]);
  await page.reload();
  await expect(desk.getByRole("textbox", { name: "Your question", exact: true })).toHaveValue("");
  await expect(desk.getByRole("textbox", { name: "Your reflection", exact: true })).toHaveValue("");
  expect(await snapshot()).toEqual(before);
});

test("clipboard denial preserves the visitor draft and explains manual copying", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Clipboard denied for QA"); } } });
  });
  await page.goto("/#question-desk");
  const desk = page.locator("#question-desk");
  const question = desk.getByRole("textbox", { name: "Your question", exact: true });
  await question.fill("My own words remain available if copying fails.");
  await desk.getByRole("button", { name: "Copy draft", exact: true }).click();
  await expect(desk.getByRole("status")).toHaveText("Couldn't copy your draft. Your words are still here; select and copy them manually.");
  await expect(question).toHaveValue("My own words remain available if copying fails.");
  await expect(desk.getByRole("button", { name: "Copy draft", exact: true })).toBeEnabled();
});

test("draft copy feedback stays fully above fixed phone navigation", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => {
      if (text.includes("failure case")) throw new Error("Clipboard denied for QA");
    } } });
  });
  await page.goto("/#question-desk");
  const desk = page.locator("#question-desk");
  const status = desk.getByRole("status");
  for (const [draft, feedback] of [
    ["My own draft, success case.", "Draft copied. Keep it somewhere you control."],
    ["My own draft, failure case.", "Couldn't copy your draft. Your words are still here; select and copy them manually."],
  ] as const) {
    await page.emulateMedia({ reducedMotion: draft.includes("failure case") ? "reduce" : "no-preference" });
    await desk.getByRole("textbox", { name: "Your question", exact: true }).fill(draft);
    // A visible button near the bottom should not leave its feedback behind
    // the fixed phone navigation. Avoid Playwright centering an offscreen button.
    await desk.locator(".desk-actions").evaluate(element => {
      scrollBy({ top: element.getBoundingClientRect().top - 680, behavior: "instant" });
    });
    await desk.getByRole("button", { name: "Copy draft", exact: true }).click();
    await expect(desk.getByRole("button", { name: "Copy draft", exact: true })).toBeFocused();
    await expect(status).toHaveText(feedback);
    await expect(status).toBeInViewport({ ratio: 1 });
    await expect.poll(async () => {
      const feedbackBox = await status.boundingBox();
      const navigationBox = await page.getByRole("navigation", { name: "Quick navigation", exact: true }).boundingBox();
      return feedbackBox && navigationBox ? navigationBox.y - feedbackBox.y - feedbackBox.height : -1;
    }).toBeGreaterThanOrEqual(0);
  }
});

test("Learn, Practice and Community offer distinct useful present actions", async ({ page }) => {
  for (const [route, actions] of [
    ["/learn", [["Explore a question", "/explore"], ["Open private notes", "/me/journal"], ["Put your question into words", "/practice"]]],
    ["/community", [["Review your privacy choices", "/me/settings"], ["Practise a thoughtful reply", "/practice"]]],
  ] as const) {
    await page.goto(route);
    const main = page.locator("main");
    await expect(main).toContainText(/review|approval|moderation|permission/i);
    await expect(main.locator("a[href='/#question-desk']")).toHaveCount(0);
    for (const [label, href] of actions) await expect(main.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
  await page.goto("/practice");
  const main = page.locator("main");
  await expect(main.getByTestId("practice-workbench")).toBeVisible();
  await expect(main).toContainText(/review|approval|permission/i);
  await expect(main.locator("a[href='/#question-desk']")).toHaveCount(1);
  await main.locator("a[href='/#question-desk']").click();
  await expect(page).toHaveURL(/\/#question-desk$/);
  await expect(page.locator("#question-desk").getByRole("textbox", { name: "Your question", exact: true })).toBeVisible();
});
