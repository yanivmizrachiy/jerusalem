import { expect, test } from '@playwright/test';
import { canonicalGrades } from '../src/data/canonical-content';
import { middleSchoolResourceCount, middleSchoolResourceCountText, middleSchoolResourceIds } from '../src/data/site-counts';
import { isPublishableMaterial } from '../src/data/publishing';
import { resourceCountLabel } from '../src/data/resource-labels';

test('site-wide middle-school count is deduplicated and derived', () => {
  const expected = new Set(
    canonicalGrades.flatMap((grade) =>
      grade.chapters.flatMap((chapter) =>
        chapter.items.filter(isPublishableMaterial).map((item) => item.id)
      )
    )
  );

  expect(middleSchoolResourceIds.size).toBe(expected.size);
  expect(middleSchoolResourceCount).toBe(expected.size);
  expect(middleSchoolResourceCount).toBeGreaterThan(0);
  expect(middleSchoolResourceCountText).toBe(`${expected.size} קבצים, קישורים ומסמכים באתר`);
});

test('the home rail shows the canonical count instead of a running demo-news list', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.rail-live-count')).toContainText(middleSchoolResourceCountText);
  await expect(page.locator('.rail-track')).toHaveCount(0);
  await expect(page.locator('.rail-dup')).toHaveCount(0);
});

test('grade topic counters match canonical public content and never fall back to generic "משימות"', async ({ page }) => {
  for (const grade of canonicalGrades) {
    const expected = grade.chapters
      .filter((chapter) => chapter.materials !== false)
      .map((chapter) => {
        const items = chapter.items.filter(isPublishableMaterial);
        return { id: chapter.id, items, label: resourceCountLabel(items) };
      })
      .filter(({ items }) => items.length > 0);

    await page.goto(`/chativat-beynayim/kita-${grade.slug}/chomarim/`);
    await expect(page.locator('.topic-n')).not.toContainText('משימות');

    for (const { id, label } of expected) {
      await expect(page.locator(`#${id} .topic-n`), `${grade.slug}/${id}: canonical semantic count`).toHaveText(label);
    }
  }
});
