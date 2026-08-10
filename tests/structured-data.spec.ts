import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => isMobile === true, 'Structured metadata is device-independent');

test('WebSite JSON-LD derives its site URL from the rendered canonical origin', async ({ page }) => {
  await page.goto('/');

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBeTruthy();

  const node = page.locator('script[type="application/ld+json"]');
  await expect(node).toHaveCount(1);
  const raw = await node.textContent();
  expect(raw).toBeTruthy();

  const data = JSON.parse(raw!) as Record<string, unknown>;
  expect(data).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'מתמטיקה מחוז ירושלים',
    inLanguage: 'he-IL',
    url: new URL('/', canonical!).href,
  });
  expect(typeof data.description).toBe('string');
  expect((data.description as string).trim().length).toBeGreaterThan(20);
});
