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

  test('פירורי הלחם בעמוד משאב אינם מכפילים את אותו מסלול (5.13)', async ({ page }) => {
    await page.goto('/chativat-beynayim/reader/z/noschaot-z/');

    await expect(page.locator('.crumbs a[href="/chativat-beynayim/kita-z/"]')).toHaveCount(1);
  });
});
