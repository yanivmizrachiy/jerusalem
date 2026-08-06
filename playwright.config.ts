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
    // אדפטר Vercel אינו תומך ב-astro preview — מגישים את הפלט הסטטי ישירות
    command: 'npm run serve:dist',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // מטריצת הרספונסיביות (19.32) רצה בפרויקט הדסקטופ עם viewports משתנים
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /responsive/ },
  ],
});
