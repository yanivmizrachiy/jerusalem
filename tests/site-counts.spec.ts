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

test('the home rail shows the canonical count alongside the real running notices (7.20)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.rail-live-count')).toContainText(middleSchoolResourceCountText);
  // הריצה הרציפה מלמטה למעלה חזרה בהוראת יניב (10/08/2026): מסילה אחת + עותק
  // כפול נסתר ללולאה חלקה. התוכן נגזר מ-hodaot.ts הקנוני — אין רשימת דמו.
  await expect(page.locator('.rail-track')).toHaveCount(1);
  await expect(page.locator('.rail-dup')).toHaveCount(1);
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

    const renderedLabels = await page.locator('.topic-n').allTextContents();
    expect(renderedLabels, `${grade.slug}: topic count rows match canonical visible chapters`).toHaveLength(expected.length);
    expect(
      renderedLabels.filter((label) => label.includes('משימות')),
      `${grade.slug}: no generic task wording survives in topic counters`
    ).toEqual([]);

    for (const { id, label } of expected) {
      await expect(page.locator(`#${id} .topic-n`), `${grade.slug}/${id}: canonical semantic count`).toHaveText(label);
    }
  }
});
