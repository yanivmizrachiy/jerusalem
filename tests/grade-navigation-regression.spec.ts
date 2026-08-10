import { test, expect } from '@playwright/test';

test.describe('תיקוני ניווט בעמודי השכבות', () => {
  test('עוגן מקומי נשאר בעמוד המבוא ורק עוגן של פרק עובר לחומרים', async ({ page }) => {
    await page.goto('/chativat-beynayim/kita-z/#hamchashot', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);

    let current = new URL(page.url());
    expect(current.pathname).toBe('/chativat-beynayim/kita-z/');
    expect(current.hash).toBe('#hamchashot');

    // עוגן של פרק חומרים אמיתי — מספרים מכוונים בכיתה ז׳ — עובר לתצוגת החומרים
    await page.goto('/chativat-beynayim/kita-z/#z-directed-numbers', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(
      (url) =>
        url.pathname === '/chativat-beynayim/kita-z/chomarim/' && url.hash === '#z-directed-numbers'
    );

    current = new URL(page.url());
    expect(current.pathname).toBe('/chativat-beynayim/kita-z/chomarim/');
    expect(current.hash).toBe('#z-directed-numbers');
  });

  test('עוגן של תכנון והוראה נשאר בעמוד המבוא — התוכנית אינה נושא בחומרים', async ({ page }) => {
    // "תכנון והוראה" הוא פרק מנהלי: התוכנית והפריסה חיות ב"מה אנחנו מלמדים?"
    // ולכן #tichnun אינו מופנה לתצוגת החומרים (RULES 3.30).
    await page.goto('/chativat-beynayim/kita-z/#tichnun', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);

    const current = new URL(page.url());
    expect(current.pathname).toBe('/chativat-beynayim/kita-z/');
    expect(current.hash).toBe('#tichnun');

    // ה-fragment חייב יעד DOM אמיתי — לא רק hash שנשאר ב-URL (Issue #68, P1 false-green):
    // העוגן legacy יושב בתוך המקטע הקנוני "מה אנחנו מלמדים?" ולכן הדפדפן גולל אליו בפועל.
    const legacyAnchor = page.locator('#ma-melamdim #tichnun');
    await expect(legacyAnchor).toHaveCount(1);
    await expect(page.locator('#ma-melamdim')).toBeVisible();

    // אותו חוזה בכיתה ח׳ — פרק tichnun המנהלי מוגדר גם עבורה ב-choveret.ts
    await page.goto('/chativat-beynayim/kita-h/#tichnun', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);
    expect(new URL(page.url()).pathname).toBe('/chativat-beynayim/kita-h/');
    await expect(page.locator('#ma-melamdim #tichnun')).toHaveCount(1);
  });

  test('פירורי הלחם בעמוד משאב אינם מכפילים את אותו מסלול (5.13)', async ({ page }) => {
    // דוגמה ציבורית בעלת ייחוס מאומת; noschaot-z נשמר במקור אך אינו פומבי עד אימות יוצר.
    await page.goto('/chativat-beynayim/reader/z/tochnit-z/');

    await expect(page.locator('.crumbs a[href="/chativat-beynayim/kita-z/"]')).toHaveCount(1);
  });
});
