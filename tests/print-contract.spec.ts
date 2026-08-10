import { expect, test } from '@playwright/test';

test.beforeEach(({ isMobile }) => {
  test.skip(isMobile === true, 'חוזה ההדפסה device-independent ונבדק בפרויקט הדסקטופ');
});

test('הדפסה נפתחת רק אחרי בחירת צבע או שחור־לבן', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/misparim/');
  await page.evaluate(() => {
    const w = window as Window & { __printCalls?: number };
    w.__printCalls = 0;
    window.print = () => { w.__printCalls = (w.__printCalls ?? 0) + 1; };
  });

  const printAction = page.locator('[data-action="print"]');
  await expect(printAction).toBeVisible();
  await printAction.click();
  await expect(page.locator('[data-print-dialog]')).toHaveAttribute('open', '');
  expect(await page.evaluate(() => (window as Window & { __printCalls?: number }).__printCalls ?? 0)).toBe(0);

  await page.locator('[data-print-mode-choice="color"]').click();
  await expect.poll(() => page.evaluate(() => (window as Window & { __printCalls?: number }).__printCalls ?? 0)).toBe(1);
  await expect(page.locator('html')).toHaveAttribute('data-print-mode', 'color');
});

test('מצב שחור־לבן מפעיל stylesheet ייעודי לפני ההדפסה', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/misparim/');
  await page.evaluate(() => { window.print = () => {}; });
  await page.locator('[data-action="print"]').click();
  await page.locator('[data-print-mode-choice="bw"]').click();
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('html')).toHaveAttribute('data-print-mode', 'bw');
  const filter = await page.locator('body').evaluate((body) => getComputedStyle(body).filter);
  expect(filter).toContain('grayscale');
});

test('במדיית הדפסה הניווט, הפעולות וה-iframe אינם מודפסים', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/misparim/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('[data-resource-actions]')).toBeHidden();
  await expect(page.locator('iframe')).toBeHidden();
});
