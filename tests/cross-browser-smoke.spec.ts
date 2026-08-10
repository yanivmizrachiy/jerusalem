import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/chativat-beynayim/',
  '/chativat-beynayim/reader/z/misparim/',
] as const;

test('מסלולים קריטיים נטענים ב-RTL ללא גלילה אופקית', async ({ page }) => {
  await page.route(
    (url) => url.hostname !== '127.0.0.1' && url.hostname !== 'localhost',
    (route) => route.abort(),
  );

  for (const route of ROUTES) {
    const response = await page.goto(route);
    expect(response?.status(), `${route}: status`).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('main#main')).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${route}: אין גלילה אופקית`).toBeLessThanOrEqual(1);
  }
});
