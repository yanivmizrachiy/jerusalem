import { defineConfig, devices } from '@playwright/test';

/**
 * סוללת הקבלה (RULES §19, 21.16–21.17): דפדפן אמיתי, דסקטופ ומובייל,
 * מול build הפקה אמיתי (astro preview על dist).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  reporter: [['list']],
  timeout: 45_000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
