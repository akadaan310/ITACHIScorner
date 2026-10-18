import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const PORT = Number(process.env.E2E_PORT ?? 3200);
// Honor an explicit binary, discover the host browser, or use Playwright's install.
const executablePath = process.env.PW_CHROMIUM || ["/usr/bin/chromium", "/usr/bin/chromium-browser"].find(existsSync);

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 2,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: executablePath ? { executablePath } : {},
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } }, testIgnore: /screenshots|mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium" }, testMatch: /mobile\.spec/ },
    { name: "screens", use: { ...devices["Desktop Chrome"] }, testMatch: /screenshots\.spec/ },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: process.env.E2E_REUSE_SERVER === "1",
    timeout: 120_000,
  },
});
