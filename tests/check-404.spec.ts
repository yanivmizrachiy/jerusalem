import { test, expect } from '@playwright/test';

test('identify 404s on home page', async ({ page }) => {
  const errors: string[] = [];
  const notFound: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', (r) => { if (r.status() === 404) notFound.push(r.url()); });
  const resp = await page.goto('/');
  expect(resp?.status()).toBe(200);
  await page.waitForLoadState('networkidle');
  console.log('ERRORS:', JSON.stringify(errors));
  console.log('404s:', JSON.stringify(notFound));
  expect(errors, `Console errors: ${JSON.stringify(errors)}`).toHaveLength(0);
  expect(notFound, `404s: ${JSON.stringify(notFound)}`).toHaveLength(0);
});
