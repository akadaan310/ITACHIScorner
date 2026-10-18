import { expect, test } from "@playwright/test";

test("V4 mobile navigation makes the five journeys clear", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Quick navigation", exact: true }).getByRole("link")).toHaveText(["Explore", "Learn", "Practice", "Community", "My Corner"]);
  await expect(page.getByTestId("home-primary")).toBeInViewport({ ratio: 1 });
});

test("question journey keeps visitor writing through all four steps without sending it", async ({ page }) => {
  await page.goto("/");
  const journey = page.getByTestId("question-journey");
  const marker = "private-journey-7391";
  const sent: string[] = [];
  page.on("request", request => { if ((request.postData() || "").includes(marker) || request.url().includes(marker)) sent.push(request.url()); });
  await journey.getByLabel("A question to carry with you").fill(marker);
  await journey.getByRole("button", { name: "2 Source", exact: true }).click();
  await expect(journey).toContainText(/original|source/i);
  await expect(journey).toContainText(/no.*answer|not.*attached|await.*review/i);
  await journey.getByRole("button", { name: "3 Related", exact: true }).click();
  await journey.getByRole("button", { name: "Dialogue", exact: true }).click();
  await journey.getByRole("button", { name: "4 Notes", exact: true }).click();
  await expect(journey).toContainText(marker);
  await expect(journey).toContainText("Dialogue");
  await journey.getByRole("button", { name: "1 Question", exact: true }).click();
  await expect(journey.getByLabel("A question to carry with you")).toHaveValue(marker);
  expect(sent).toEqual([]);
  await page.reload();
  await expect(journey.getByLabel("A question to carry with you")).toHaveValue("");
});

test("practice is useful private writing with reversible self checks and honest clipboard failure", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("QA clipboard denial"); } } }); });
  await page.goto("/practice");
  const workbench = page.getByTestId("practice-workbench");
  const snapshot = () => page.evaluate(() => ({ local: {...localStorage}, session: {...sessionStorage} }));
  const before = await snapshot();
  const sent: string[] = [];
  const marker = "private-practice-7391";
  page.on("request", request => { if (request.url().includes(marker) || (request.postData() || "").includes(marker)) sent.push(request.url()); });
  await workbench.getByRole("button", { name: "Clarify", exact: true }).click();
  await workbench.getByLabel("Your practice draft").fill(marker);
  await workbench.getByRole("button", { name: "Review my words", exact: true }).click();
  await expect(workbench).toContainText(marker);
  await workbench.getByLabel("I have represented the question fairly").check();
  await expect(workbench.getByLabel("I have represented the question fairly")).toBeChecked();
  await workbench.getByRole("button", { name: "Copy my practice", exact: true }).click();
  await expect(workbench.getByRole("status")).toContainText("Couldn't copy");
  await expect(workbench).toContainText(marker);
  await workbench.getByRole("button", { name: "Edit my words", exact: true }).click();
  await expect(workbench.getByLabel("Your practice draft")).toHaveValue(marker);
  await workbench.getByRole("button", { name: "Clear practice", exact: true }).click();
  await expect(workbench.getByLabel("Your practice draft")).toHaveValue("");
  await expect(workbench.getByLabel("I have represented the question fairly")).not.toBeChecked();
  expect(await snapshot()).toEqual(before);
  expect(sent).toEqual([]);
});

test("approved source preview labels remain readable on their ivory surface", async ({ page }) => {
  await page.goto("/");
  // A visibly labelled QA fixture exercises the populated style without creating
  // an invented published question or changing the actual empty backend.
  const colors = await page.locator(".source-preview").evaluate(element => {
    const label = document.createElement("p");
    label.className = "status-label";
    label.dataset.testid = "qa-reviewed-label";
    label.textContent = "QA contrast fixture · not published content";
    element.append(label);
    return { text: getComputedStyle(label).color, background: getComputedStyle(element.closest(".source-chapter")!).backgroundColor };
  });
  function luminance(color: string) {
    const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => { const c = value / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
    return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
  }
  const a = luminance(colors.text), b = luminance(colors.background);
  expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(4.5);
});
