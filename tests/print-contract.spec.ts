import { expect, test } from '@playwright/test';
import { canonicalReaderItems } from '../src/data/canonical-content';

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

test('בהדפסה ההטמעה יורדת, המקור נשאר ולוח המידע ממלא את הדף', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/misparim/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('iframe')).toBeHidden();
  await expect(page.locator('.embed-frame')).toBeHidden();
  await expect(page.locator('.res-view')).toBeHidden();

  const actions = page.locator('[data-resource-actions]');
  await expect(actions).toBeVisible();
  await expect(actions.locator('[data-action="source"]')).toBeVisible();
  await expect(actions.locator('[data-action="download"]')).toBeHidden();
  await expect(actions.locator('[data-action="copy"]')).toBeHidden();
  await expect(actions.locator('[data-action="print"]')).toBeHidden();

  const panelBox = await page.locator('.res-panel').boundingBox();
  const splitBox = await page.locator('.res-split').boundingBox();
  expect(panelBox && splitBox, 'לוח המידע והמסגרת קיימים במדיית print').toBeTruthy();
  expect(panelBox!.width).toBeGreaterThanOrEqual(splitBox!.width - 2);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('גם כשכל שמונה הפעולות זמינות הן נשארות בשורת דסקטופ אחת', async ({ page }) => {
  const entry = canonicalReaderItems.find(({ item }) => Boolean(item.download && item.embed) && item.kind !== 'maf');
  expect(entry, 'בקטלוג חייב להישאר משאב מוטמע עם קובץ הורדה').toBeTruthy();

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async () => undefined,
    });
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: async () => undefined,
    });
  });

  await page.goto(`/chativat-beynayim/reader/${entry!.grade.slug}/${entry!.item.id}/`);
  const visibleActions = page.locator('[data-resource-actions] .orb:visible');
  await expect(visibleActions).toHaveCount(8);

  const tops = await visibleActions.evaluateAll((nodes) =>
    nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
  );
  expect(Math.max(...tops) - Math.min(...tops), 'אין שבירה לשורה שנייה').toBeLessThanOrEqual(2);
});
