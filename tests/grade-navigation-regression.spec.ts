import { test, expect } from '@playwright/test';

test.describe('תיקוני ניווט בעמודי השכבות', () => {
  test('עוגן מקומי נשאר בעמוד המבוא ורק עוגן של פרק עובר לחומרים', async ({ page }) => {
    await page.goto('/chativat-beynayim/kita-z/#hamchashot', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(250);

    let current = new URL(page.url());
    expect(current.pathname).toBe('/chativat-beynayim/kita-z/');
    expect(current.hash).toBe('#hamchashot');

    await page.goto('/chativat-beynayim/kita-z/#tichnun', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(
      (url) => url.pathname === '/chativat-beynayim/kita-z/chomarim/' && url.hash === '#tichnun'
    );

    current = new URL(page.url());
    expect(current.pathname).toBe('/chativat-beynayim/kita-z/chomarim/');
    expect(current.hash).toBe('#tichnun');
  });

  test('בעמוד כללי אין קישור חזרה לעצמו', async ({ page }) => {
    await page.goto('/chativat-beynayim/klali/');

    await expect(page.locator('.grade-nav [data-to-intro]')).toHaveCount(0);
    await expect(page.locator('.grade-nav a[href="/chativat-beynayim/"]')).toHaveCount(1);
  });

  test('במשאב כללי פירורי הלחם אינם מכפילים את אותו מסלול', async ({ page }) => {
    await page.goto('/chativat-beynayim/reader/klali/noschaot-z/');

    await expect(page.locator('.crumbs a[href="/chativat-beynayim/klali/"]')).toHaveCount(1);
  });
});
