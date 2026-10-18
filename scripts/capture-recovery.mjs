import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Capture a locally served production build. Keep the earlier evidence-first
// review immutable; every recovery run has an explicit, separate phase.
const phase = process.env.CAPTURE_PHASE || "after";
if (!["before", "after"].includes(phase)) throw new Error("CAPTURE_PHASE must be before or after");
const directory = `docs/screenshots/recovery/${phase}`;
if (existsSync(join(directory, "manifest.json")) && process.env.CAPTURE_REPLACE !== "1") {
  throw new Error(`Capture already exists at ${directory}; explicitly set CAPTURE_REPLACE=1 to replace this recovery phase`);
}
const baseURL = process.env.CAPTURE_BASE_URL || "http://127.0.0.1:3600";
const executablePath = process.env.PW_CHROMIUM || ["/usr/bin/chromium", "/usr/bin/chromium-browser"].find(existsSync);
const widths = [360, 390, 768, 1280, 1440];
const pages = [
  ["home", "/"], ["explore", "/explore"], ["learn", "/learn"], ["practice", "/practice"],
  ["community", "/community"], ["session-notes", "/session-notes"], ["library", "/library"],
  ["support", "/support"], ["join", "/join"], ["my-corner", "/me"], ["private-notes", "/me/journal"],
  ["settings", "/me/settings"], ["about", "/about"], ["creator-denied", "/studio/creator"],
];
const files = [];
const browser = await chromium.launch({ executablePath });
await mkdir(directory, { recursive: true });
try {
  for (const width of widths) {
    const height = width < 768 ? 844 : width < 1280 ? 1024 : 900;
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const records = [];
    const capture = async (name, fullPage = false) => {
      const file = `${name}-${width}.jpg`;
      await page.screenshot({ path: join(directory, file), fullPage, type: "jpeg", quality: 80, animations: "disabled" });
      files.push(file);
    };
    const settle = async () => {
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => Promise.all(document.getAnimations()
        .filter(animation => animation.timeline === document.timeline && animation.effect?.getTiming().iterations !== Infinity)
        .map(animation => animation.finished.catch(() => null))));
    };
    for (const [name, route] of pages) {
      const response = await page.goto(baseURL + route);
      await settle();
      await capture(`${name}-fold`);
      if (name === "home") await capture("home", true);
      const audit = await page.evaluate(() => {
        const visible = element => !!element.getClientRects().length && !element.closest('[aria-hidden="true"]') && getComputedStyle(element).visibility !== "hidden";
        const norm = value => (value || "").replace(/\s+/g, " ").trim();
        const rect = element => {
          const box = element.getBoundingClientRect();
          return { x: Math.round(box.x), y: Math.round(box.y + scrollY), width: Math.round(box.width), height: Math.round(box.height) };
        };
        const actions = [...document.querySelectorAll("a,button,summary,input[type=submit],[role=button]")].filter(visible).map(element => {
          const kind = element.tagName === "A" ? "navigation" : element.matches("input[type=submit],button[type=submit]") || (element.tagName === "BUTTON" && element.closest("form") && element.getAttribute("type") !== "button") ? "form-submission" : "interaction";
          return { tag: element.tagName.toLowerCase(), kind, label: norm(element.getAttribute("aria-label") || element.innerText || element.value), href: element.getAttribute("href"), main: !!element.closest("main"), primary: element.classList.contains("btn-primary"), disabled: element.hasAttribute("disabled"), region: element.closest("nav")?.getAttribute("aria-label") || (element.closest("footer") ? "footer" : element.closest("main") ? "main" : "global"), ...rect(element) };
        });
        const summarize = subset => {
          const groups = new Map();
          for (const action of subset) {
            const key = action.href || `[${action.kind}] ${action.label}`;
            groups.set(key, [...(groups.get(key) || []), action.label]);
          }
          return { visibleCount: subset.length, uniqueCount: groups.size, repeatedInstanceCount: subset.length - groups.size, repeatedActions: [...groups].filter(([, labels]) => labels.length > 1).map(([destination, labels]) => ({ destination, count: labels.length, labels })) };
        };
        const main = actions.filter(action => action.main && action.label);
        return { viewport: { width: innerWidth, height: innerHeight }, pageHeight: document.documentElement.scrollHeight, horizontalOverflow: document.documentElement.scrollWidth - innerWidth, actions, actionSummary: { main: summarize(main), navigation: summarize(main.filter(action => action.kind === "navigation")), forms: summarize(main.filter(action => action.kind === "form-submission")), interactions: summarize(main.filter(action => action.kind === "interaction")), siteNavigation: summarize(actions.filter(action => !action.main)) }, foldMap: [...document.querySelectorAll("main h1,main h2,main h3")].filter(visible).map(element => ({ text: norm(element.innerText), fold: Math.floor((element.getBoundingClientRect().top + scrollY) / innerHeight) + 1, ...rect(element) })), sections: [...document.querySelectorAll("main section")].filter(visible).map(element => ({ label: element.getAttribute("aria-labelledby") || norm(element.querySelector("h1,h2,h3")?.textContent), ...rect(element) })) };
      });
      records.push({ name, route, status: response?.status(), ...audit });
      if (name === "home") {
        for (const [index, section] of audit.sections.entries()) {
          if (index === 0) continue;
          await page.evaluate(y => scrollTo(0, Math.max(0, y - 92)), section.y);
          await capture(`home-transition-${String(index).padStart(2, "0")}`);
        }
      }
    }
    if (width < 1024) {
      await page.goto(baseURL + "/");
      await settle();
      await page.getByRole("button", { name: /Open menu/i }).first().click();
      await capture("navigation-open");
      await page.keyboard.press("Escape");
      await page.getByRole("dialog", { name: /menu/i }).waitFor({ state: "hidden" });
    }
    if (phase === "after" && [390, 1280].includes(width)) {
      await page.goto(baseURL + "/#question-desk");
      await settle();
      const desk = page.locator("#question-desk");
      await desk.getByRole("textbox", { name: "Your question", exact: true }).fill("QA visitor draft: How can I make more time to listen?");
      await desk.getByRole("textbox", { name: "Your reflection", exact: true }).fill("QA visitor reflection: Pause before I respond.");
      for (const state of ["editing", "reviewed", "cleared"]) {
        if (state === "reviewed") await desk.getByRole("button", { name: "Review draft", exact: true }).click();
        if (state === "cleared") await desk.getByRole("button", { name: "Clear draft", exact: true }).click();
        const file = `question-desk-${state}-${width}.jpg`;
        await desk.screenshot({ path: join(directory, file), type: "jpeg", quality: 80, animations: "disabled" });
        files.push(file);
      }
    }
    const auditFile = `rendered-audit-${width}.json`;
    await writeFile(join(directory, auditFile), JSON.stringify({ capturedAt: new Date().toISOString(), records }, null, 2) + "\n");
    files.push(auditFile);
    console.log(`Captured ${width}px: ${records.length} routes, full home, story transitions${width < 1024 ? ", menu" : ""}`);
    await context.close();
  }
  const sourceHashes = {};
  for (const file of ["package-lock.json", "src/app/page.tsx", "src/app/globals.css", "src/components/hero.tsx", "src/components/question-desk.tsx", "src/components/shell.tsx", "scripts/capture-recovery.mjs"]) {
    if (existsSync(file)) sourceHashes[file] = createHash("sha256").update(await readFile(file)).digest("hex");
  }
  const productionBuildId = existsSync(".next/BUILD_ID") ? (await readFile(".next/BUILD_ID", "utf8")).trim() : null;
  for (const file of ["review-copy-failure-360-reduce.png", "review-arrow-360-reduce.png", "font-fallback-loaded-contact.jpg"]) {
    if (phase === "after" && existsSync(join(directory, file))) files.push(file);
  }
  const manifest = { phase, capturedAt: new Date().toISOString(), baseURL, sourceCommit: process.env.CAPTURE_COMMIT || null, productionBuildId, sourceHashes, browser: await browser.version(), widths, routes: pages, methodology: "Fresh local production rendering. One browser context per width; fonts and finite document animations settled; 1x device scale. Route first folds, full homepage, each home section transition and open mobile menus. Visible action instances, unique targets, repeated instances, navigation, form submissions and transient interactions counted separately. Disabled controls counted visibly and individually marked. After-phase draft state captures use explicitly labeled, generic QA visitor input; these are tool checks, never creator or corpus content.", files: [] };
  for (const file of files) manifest.files.push({ file, sha256: createHash("sha256").update(await readFile(join(directory, file))).digest("hex") });
  await writeFile(join(directory, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Saved ${files.length} artifacts in ${directory}`);
} finally {
  await browser.close();
}
