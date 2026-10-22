import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3100" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "phone", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 } } },
  ],
  webServer: [
    {
      command: "node tests/e2e/mock-github.mjs",
      port: 4010,
      reuseExistingServer: false,
    },
    {
      command: "pnpm build && pnpm start -p 3100",
      url: "http://localhost:3100",
      env: { GITHUB_API_URL: "http://localhost:4010", PORTFOLIO_CONTENT_DIR: "tests/fixtures/content" },
      timeout: 240_000,
      reuseExistingServer: false,
    },
  ],
});
