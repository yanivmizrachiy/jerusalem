import { expect, test } from '@playwright/test';

import { mafmarContent } from '../src/data/mafmar-content.generated';
import { mafmarSections } from '../src/data/mafmar';

const EXPECTED_SHA =
  'd188ce53916ab41e22db7dfbb8d8dc05ef127c823e02a2ae4d778fa47e17087a';

test('Mafmar generated content conserves 18 pages and 58 source-link occurrences', () => {
  expect(mafmarContent.source.sha256).toBe(EXPECTED_SHA);
  expect(mafmarContent.source.pageCount).toBe(18);
  expect(mafmarContent.pages).toHaveLength(18);
  expect(mafmarContent.source.linkOccurrenceCount).toBe(58);

  let occurrenceCount = 0;
  const occurrenceIds = new Set<number>();

  for (const page of mafmarContent.pages) {
    for (const row of page.rows) {
      occurrenceCount += row.links.length;

      for (const link of row.links) {
        occurrenceIds.add(link.occurrence);
      }
    }
  }

  expect(occurrenceCount).toBe(58);
  expect(occurrenceIds.size).toBe(58);

  for (const page of mafmarContent.pages) {
    expect(page.rows.length).toBeGreaterThan(0);

    const text = page.rows.map((row) => row.text).join(' ');
    expect(text.length).toBeGreaterThan(30);

    for (const row of page.rows) {
      for (const link of row.links) {
        expect(link.href).toMatch(/^https?:\/\//);
        expect(link.confidence).toBeGreaterThanOrEqual(0.35);
      }
    }
  }
});

test('/hozer-mafmar/ is full local HTML, not a PDF viewer', async ({ page }) => {
  await page.goto('/hozer-mafmar/');

  await expect(page.locator('[data-mafmar-web]')).toHaveCount(1);
  await expect(page.locator('[data-mafmar-page]')).toHaveCount(18);
  await expect(page.locator('[data-mafmar-link]')).toHaveCount(58);

  await expect(page.locator('[data-mafmar-section-anchor]')).toHaveCount(
    mafmarSections.length
  );

  expect(mafmarSections).toHaveLength(23);

  for (const section of mafmarSections) {
    await expect(page.locator(`#${section.id}`)).toHaveCount(1);
  }

  await expect(
    page.locator(
      'iframe[src*="hozer-mafmar"], embed[src*="hozer-mafmar"], object[data*="hozer-mafmar"]'
    )
  ).toHaveCount(0);

  const pdfDownloads = page.locator(
    'a[href="/docs/hozer-mafmar-tashpaz.pdf"][download]'
  );

  expect(
    await pdfDownloads.count(),
    'ה-PDF נשמר כמקור/הורדה בלבד'
  ).toBeGreaterThanOrEqual(1);
});

test('/hodaot/ no longer embeds Mafmar PDF and preserves native presentation', async ({
  page,
}) => {
  await page.goto('/hodaot/');

  await expect(page.locator('[data-mafmar-web]')).toHaveCount(1);
  await expect(page.locator('[data-mafmar-deck]')).toHaveCount(1);

  await expect(
    page.locator(
      'iframe[src*="hozer-mafmar"], embed[src*="hozer-mafmar"], object[data*="hozer-mafmar"]'
    )
  ).toHaveCount(0);
});

test('Mafmar web has no horizontal overflow at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/hozer-mafmar/');

  const overflow = await page.evaluate(() => ({
    html: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
  }));

  expect(overflow.html).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
});
