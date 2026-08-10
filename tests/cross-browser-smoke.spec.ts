import { expect, test } from '@playwright/test';

/**
 * שער דפדפנים מרכזיים חסכוני (RULES 19.2, 21.16–21.17; Issue #68 P1).
 *
 * ‏Chromium (desktop/mobile) מריץ את סוללת הקבלה המלאה. Firefox ו-WebKit
 * מריצים רק את הקובץ הזה — חוזה מצומצם ודטרמיניסטי שמוכיח parity על
 * מנועי רינדור שונים בלי להכפיל את זמן ה-CI פי כמה. אין כאן בדיקת
 * הטמעות חיצוניות (Canva/Drive/YouTube): אלה תלויות רשת/צד-שלישי וכבר
 * מכוסות ב-Chromium; חוזרות כאן היו מוסיפות flakiness בלי ערך נוסף.
 */

const pages = [
  { path: '/', title: 'מחוז ירושלים' },
  { path: '/shearim/', title: null },
  { path: '/chativat-beynayim/', title: null },
  { path: '/chativat-beynayim/kita-z/', title: null },
  { path: '/luach/', title: null },
];

for (const { path, title } of pages) {
  test(`עמוד תקין בדפדפן הנוכחי: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response?.ok(), `${path} מחזיר תגובה תקינה`).toBeTruthy();

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'he');
    if (title) await expect(page).toHaveTitle(new RegExp(title));

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `אין גלילה אופקית ב-${path}`).toBeLessThanOrEqual(1);

    expect(errors, `אין שגיאות JavaScript לא-תפוסות ב-${path}`).toEqual([]);
  });
}

test('ניווט ראשי לחיץ ומוביל ליעד אמיתי בדפדפן הנוכחי', async ({ page }) => {
  await page.goto('/');
  // הקישור הראשון הוא "ראשי" (href="/"), אותו עמוד שכבר עליו — ולכן אינו
  // מוכיח דבר. הקישור השני הוא יעד אמיתי ושונה; מאמתים נתיב מדויק, לא
  // רגקס רופף שמתאים כמעט לכל כתובת.
  const nav = page.locator('nav[aria-label="ניווט ראשי"] .nav-list a[href]').nth(1);
  await expect(nav).toBeVisible();
  const href = await nav.getAttribute('href');
  expect(href).toBeTruthy();
  expect(href).not.toBe('/');
  await nav.click();
  await page.waitForURL((url) => url.pathname === href);
  expect(new URL(page.url()).pathname).toBe(href);
});

test('RTL אמיתי: כיוון הטקסט המחושב הוא rtl בעמוד הראשי', async ({ page }) => {
  await page.goto('/');
  const computedDir = await page.evaluate(() => getComputedStyle(document.documentElement).direction);
  expect(computedDir).toBe('rtl');
});
