import { expect, test } from '@playwright/test';
import { resourceDisplayLabel } from '../src/data/resource-labels';
import { canonicalReaderItems } from '../src/data/canonical-content';

test.skip(({ isMobile }) => isMobile === true, 'detail metadata contract is device-independent');

test('resource detail badge uses pedagogical taxonomy rather than technical storage kind', async ({ page }) => {
  const sample = canonicalReaderItems.find(({ item }) => item.resourceType === 'game' && item.delivery === 'printable');
  expect(sample).toBeTruthy();

  await page.goto(`/chativat-beynayim/reader/${sample!.grade.slug}/${sample!.item.id}/`);
  await expect(page.locator('.res-kind')).toHaveText(resourceDisplayLabel(sample!.item));
  await expect(page.locator('.res-kind')).not.toHaveText(/^(PDF|Drive|מסמך|קובץ)$/i);
});

test('resource pager uses RTL-native resource wording and never says file', async ({ page }) => {
  const sample = canonicalReaderItems.find(({ grade, item }) => grade.slug === 'z' && item.id === 'src-game-z-2240924d847e');
  expect(sample).toBeTruthy();

  await page.goto(`/chativat-beynayim/reader/z/${sample!.item.id}/`);
  const tags = page.locator('.res-pager .pager-tag');
  const text = (await tags.allTextContents()).join(' ');
  expect(text).not.toContain('הקובץ');
  expect(text).toMatch(/המשאב (הקודם|הבא)/);
});
