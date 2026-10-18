import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

// Deliberately delay font responses to expose shifts from fallback typography.
// Synthetic delay and a local production server; this is a regression check,
// not a claim about hosted Core Web Vitals.
const phase = process.env.CAPTURE_PHASE || "after";
if (!["before", "after"].includes(phase)) throw new Error("CAPTURE_PHASE must be before or after");
const directory = `docs/screenshots/recovery/${phase}`;
const baseURL = process.env.CAPTURE_BASE_URL || "http://127.0.0.1:3600";
const executablePath = process.env.PW_CHROMIUM || ["/usr/bin/chromium", "/usr/bin/chromium-browser"].find(existsSync);
const browser = await chromium.launch({ executablePath });
const samples = [];
try {
  for (const width of [360, 390, 768, 1280, 1440]) {
    const height = width < 768 ? 844 : width < 1280 ? 1024 : 900;
    for (const route of ["/", "/explore"]) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
      const page = await context.newPage();
      const session = await context.newCDPSession(page);
      await session.send("Network.enable");
      await session.send("Network.setCacheDisabled", { cacheDisabled: true });
      let delayedFontRequests = 0;
      await page.route("**/*woff2*", async request => {
        delayedFontRequests++;
        await new Promise(resolve => setTimeout(resolve, 800));
        await request.continue();
      });
      await page.addInitScript(() => {
        window.__recoveryFont = { cls: 0, shifts: [] };
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__recoveryFont.cls += entry.value;
              window.__recoveryFont.shifts.push({ value: entry.value, time: entry.startTime });
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
      });
      const response = await page.goto(baseURL + route);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const measured = await page.evaluate(() => {
        const primary = document.querySelector('[data-testid="home-primary"]')?.getBoundingClientRect();
        return { ...window.__recoveryFont, fontsReady: document.fonts.status === "loaded", horizontalOverflow: document.documentElement.scrollWidth - innerWidth, primaryWithinFirstFold: primary ? primary.y >= 0 && primary.bottom <= innerHeight : null };
      });
      samples.push({ route, width, height, status: response?.status(), fontDelayMs: 800, delayedFontRequests, ...measured });
      await context.close();
    }
  }
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/slow-font-validation.json`, JSON.stringify({ phase, capturedAt: new Date().toISOString(), browser: await browser.version(), methodology: "Fresh contexts with disabled network cache, 800ms delay on each woff2 request, two animation frames after document.fonts.ready; all five required widths on Home and Explore. Layout shift excludes recent user input. Local regression check only.", threshold: 0.1, samples }, null, 2) + "\n");
  console.log(`${samples.length} slow-font samples saved; maximum CLS ${Math.max(...samples.map(sample => sample.cls)).toFixed(6)}`);
  if (samples.some(sample => sample.cls >= 0.1 || sample.horizontalOverflow > 0 || sample.primaryWithinFirstFold === false)) process.exitCode = 1;
} finally {
  await browser.close();
}
