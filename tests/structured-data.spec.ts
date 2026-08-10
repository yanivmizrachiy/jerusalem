import { expect, test } from '@playwright/test';

test('every page emits valid WebSite structured data with the canonical site URL', async ({ page }) => {
  await page.goto('/');

  const node = page.locator('script[type="application/ld+json"]');
  await expect(node).toHaveCount(1);

  const raw = await node.textContent();
  expect(raw).toBeTruthy();
  const data = JSON.parse(raw!);

  expect(data).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'מתמטיקה מחוז ירושלים',
    url: 'https://jerusalem-virid.vercel.app/',
    inLanguage: 'he-IL',
  });
  expect(typeof data.description).toBe('string');
  expect(data.description.trim().length).toBeGreaterThan(20);
});
