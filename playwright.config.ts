import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3200);
// Use the container's pre-installed Chromium when present (no browser download).
const executablePath = process.env.PW_CHROMIUM ?? (process.env.PLAYWRIGHT_BROWSERS_PATH ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" : undefined);

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: executablePath ? { executablePath } : {},
    trace: "off",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } }, testIgnore: /screenshots|mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"], browserName: "chromium" }, testMatch: /mobile\.spec/ },
    { name: "screens", use: { ...devices["Desktop Chrome"] }, testMatch: /screenshots\.spec/ },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
