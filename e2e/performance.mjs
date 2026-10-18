import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

// Run against an otherwise idle production server; these are local lab samples,
// not Lighthouse scores or measurements of deployed Core Web Vitals.
const baseURL = process.env.PERF_BASE_URL || "http://127.0.0.1:3200";
const output = process.env.PERF_OUTPUT || "docs/screenshots/evidence-first/after/performance.json";
const phase = process.env.PERF_PHASE || "after";
const routes = phase === "before" ? ["/", "/discover", "/dojo", "/me"] : ["/", "/explore", "/practice", "/me"];
const executablePath = process.env.PW_CHROMIUM || ["/usr/bin/chromium", "/usr/bin/chromium-browser"].find(existsSync);
const browser = await chromium.launch({ executablePath });
const samples = [];
try {
  for (const width of [390, 1280]) {
    for (const route of routes) {
      for (let run = 1; run <= 3; run++) {
        const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
        const page = await context.newPage();
        const session = await context.newCDPSession(page);
        await session.send("Network.enable");
        await session.send("Network.setCacheDisabled", { cacheDisabled: true });
        let transferredBytes = 0;
        let requestCount = 0;
        session.on("Network.requestWillBeSent", () => requestCount++);
        session.on("Network.loadingFinished", event => transferredBytes += event.encodedDataLength);
        await page.addInitScript(() => {
          window.__labVitals = { lcp: null, cls: 0 };
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) window.__labVitals.lcp = entry.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__labVitals.cls += entry.value;
          }).observe({ type: "layout-shift", buffered: true });
        });
        await page.goto(baseURL + route, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const timing = await page.evaluate(() => {
          const navigation = performance.getEntriesByType("navigation")[0];
          return {
            ttfbMs: navigation.responseStart - navigation.requestStart,
            domContentLoadedMs: navigation.domContentLoadedEventEnd,
            loadMs: navigation.loadEventEnd,
            firstContentfulPaintMs: performance.getEntriesByName("first-contentful-paint")[0]?.startTime || null,
            lcpMs: window.__labVitals.lcp, cls: window.__labVitals.cls,
          };
        });
        samples.push({ route, width, run, requestCount, transferredBytes, ...timing });
        await context.close();
      }
    }
  }
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify({ phase, measuredAt: new Date().toISOString(), browser: await browser.version(), methodology: "Three fresh-context cold-cache production navigations per route/width, loopback network, no CPU/network throttling; networkidle observation. Shared cloud host. Local lab samples only; not deployed CWV or Lighthouse.", samples }, null, 2) + "\n");
  console.log(`${samples.length} local performance samples written to ${output}`);
} finally {
  await browser.close();
}
