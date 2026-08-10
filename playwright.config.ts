import { defineConfig, devices } from '@playwright/test';

/**
 * סוללת הקבלה (RULES §19, 21.16–21.17): דפדפן אמיתי, דסקטופ ומובייל,
 * מול build הפקה אמיתי שמוגש ישירות מפלט אדפטר Vercel.
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
    command: `npx serve .vercel/output/static -l ${port} --no-clipboard`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // מטריצת הרספונסיביות (19.32) רצה בפרויקט הדסקטופ עם viewports משתנים
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /responsive/ },
    /**
     * דפדפנים מרכזיים (19.2, 21.16–21.17): Chromium מריץ את הסוללה המלאה
     * למעלה; Firefox ו-WebKit מוגבלים ל-cross-browser-smoke.spec.ts בלבד
     * כדי שהמטריצה המלאה לא תוכפל פי שלוש בכל PR. הרחבת הכיסוי לקבצים
     * נוספים תעבור דרך אותו קובץ smoke, לא דרך פתיחת כל הסוללה.
     */
    { name: 'firefox-smoke', use: { ...devices['Desktop Firefox'] }, testMatch: /cross-browser-smoke/ },
    { name: 'webkit-smoke', use: { ...devices['Desktop Safari'] }, testMatch: /cross-browser-smoke/ },
  ],
});