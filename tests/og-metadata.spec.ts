import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => isMobile === true, 'Open Graph metadata is device-independent');

test('Open Graph image is absolute, same-origin and matches the real logo dimensions', async ({ page }) => {
  const logo = await readFile(new URL('../public/logo.png', import.meta.url));
  expect(logo.subarray(1, 4).toString('ascii')).toBe('PNG');
  const width = logo.readUInt32BE(16);
  const height = logo.readUInt32BE(20);

  await page.goto('/');

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  const ogAlt = await page.locator('meta[property="og:image:alt"]').getAttribute('content');
  const ogWidth = await page.locator('meta[property="og:image:width"]').getAttribute('content');
  const ogHeight = await page.locator('meta[property="og:image:height"]').getAttribute('content');

  expect(canonical).toBeTruthy();
  expect(ogImage).toBeTruthy();

  const canonicalUrl = new URL(canonical!);
  const imageUrl = new URL(ogImage!);
  expect(imageUrl.origin).toBe(canonicalUrl.origin);
  expect(imageUrl.pathname).toBe('/logo.png');
  expect(ogAlt?.trim().length ?? 0).toBeGreaterThan(0);
  expect(Number(ogWidth)).toBe(width);
  expect(Number(ogHeight)).toBe(height);
});
