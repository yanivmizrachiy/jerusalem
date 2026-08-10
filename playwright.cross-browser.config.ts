import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PW_PORT ?? 4322);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  testMatch: /cross-browser-smoke\.spec\.ts/,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  timeout: 45_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node scripts/serve-vercel-output.mjs --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    { name: 'firefox-smoke', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-smoke', use: { ...devices['Desktop Safari'] } },
  ],
});
