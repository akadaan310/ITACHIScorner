import { test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { heightFor, settle, widths } from "./helpers";

const directory = "docs/screenshots/evidence-first/after";
const pages: [string, string][] = [
  ["home", "/"], ["explore", "/explore"], ["learn", "/learn"], ["practice", "/practice"],
  ["community", "/community"], ["session-notes", "/session-notes"], ["library", "/library"],
  ["support", "/support"], ["join", "/join"], ["my-corner", "/me"], ["private-notes", "/me/journal"], ["settings", "/me/settings"],
  ["about", "/about"], ["creator-denied", "/studio/creator"],
];

for (const width of widths) {
  test(`capture reviewed public folds at ${width}px`, async ({ page }) => {
    await mkdir(directory, { recursive: true });
    const records = [];
    await page.setViewportSize({ width, height: heightFor(width) });
    for (const [name, route] of pages) {
      const response = await page.goto(route);
      await settle(page);
      await page.screenshot({ path: join(directory, `${name}-${width}-fold.jpg`), type: "jpeg", quality: 80, animations: "disabled" });
      if (name === "home") await page.screenshot({ path: join(directory, `home-${width}.jpg`), type: "jpeg", quality: 80, fullPage: true, animations: "disabled" });
      const audit = await page.evaluate(() => {
        const visible = (element: Element) => !!element.getClientRects().length && !element.closest('[aria-hidden="true"]') && getComputedStyle(element).visibility !== "hidden";
        const norm = (text: string | null) => (text || "").replace(/\s+/g, " ").trim();
        const rect = (element: Element) => {
          const box = element.getBoundingClientRect();
          return { x: Math.round(box.x), y: Math.round(box.y + scrollY), width: Math.round(box.width), height: Math.round(box.height) };
        };
        const actions = [...document.querySelectorAll<HTMLElement>("a,button,summary,input[type=submit],[role=button]")].filter(visible).map(element => ({
          tag: element.tagName.toLowerCase(), label: norm(element.getAttribute("aria-label") || element.innerText), href: element.getAttribute("href"),
          main: !!element.closest("main"), primary: element.classList.contains("btn-primary"), disabled: element.hasAttribute("disabled"),
          region: element.closest("nav")?.getAttribute("aria-label") || (element.closest("footer") ? "footer" : element.closest("main") ? "main" : "global"),
          ...rect(element),
        }));
        const mainActions = actions.filter(action => action.main && action.label);
        const destinations = new Map<string, string[]>();
        for (const action of mainActions) {
          const key = action.href || `[${action.tag}] ${action.label}`;
          destinations.set(key, [...(destinations.get(key) || []), action.label]);
        }
        return {
          url: location.href, viewport: { width: innerWidth, height: innerHeight }, pageHeight: document.documentElement.scrollHeight,
          horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
          actions, ctaSummary: { mainActionCount: mainActions.length, distinctDestinations: destinations.size, repeatedDestinations: [...destinations].filter(([, labels]) => labels.length > 1).map(([destination, labels]) => ({ destination, count: labels.length, labels })) },
          foldMap: [...document.querySelectorAll<HTMLElement>("main h1,main h2,main h3")].filter(visible).map(element => ({ text: norm(element.innerText), fold: Math.floor((element.getBoundingClientRect().top + scrollY) / innerHeight) + 1, ...rect(element) })),
          sections: [...document.querySelectorAll<HTMLElement>("main section")].filter(visible).map(element => ({ label: element.getAttribute("aria-labelledby") || norm(element.querySelector("h1,h2,h3")?.textContent || ""), ...rect(element) })),
        };
      });
      records.push({ name, route, status: response?.status(), ...audit });
    }
    await writeFile(join(directory, `rendered-audit-${width}.json`), JSON.stringify({ capturedAt: new Date().toISOString(), records }, null, 2) + "\n");
    if (width < 1024) {
      await page.goto("/");
      await page.getByRole("button", { name: /Open menu/i }).first().click();
      await page.screenshot({ path: join(directory, `navigation-open-${width}.jpg`), type: "jpeg", quality: 80, animations: "disabled" });
    }
  });
}
