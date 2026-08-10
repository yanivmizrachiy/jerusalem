import { defineConfig, devices } from '@playwright/test';

/**
 * סוללת הקבלה (RULES §19, 21.16–21.17): דפדפן אמיתי, דסקטופ ומובייל,
 * מול build הפקה אמיתי שנפלט מאדפטר Vercel.
 *
 * שרת הקבלה אינו `serve` גולמי: scripts/serve-vercel-output.mjs גוזר בזמן
 * הריצה redirect config מאותו פלט build, כך שגם redirects ברמת host נבדקים
 * מקומית כ-301 אמיתי במקום 404 שקרי. אין manifest ידני נוסף.
 *
 * PW_PORT מאפשר לריצת הסיום לבחור פורט פנוי ולא לבדוק בטעות שרת ישן.
 * retries=0 הוא חלק מחוזה האיכות: כשל ראשון הוא כשל, לא flaky שמותר למזג.
 */
const port = Number(process.env.PW_PORT ?? 4321);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  timeout: 45_000,
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: {
    // אין למחזר שרת קיים: שרת ישן עלול לבדוק build שאינו שייך לעץ העבודה הנוכחי.
    command: `node scripts/serve-vercel-output.mjs --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // מטריצת הרספונסיביות (19.32) רצה בפרויקט הדסקטופ עם viewports משתנים
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /responsive/ },
  ],
});