import { expect, test } from '@playwright/test';
import { canonicalGrades } from '../src/data/canonical-content';
import { middleSchoolResourceCount, middleSchoolResourceIds } from '../src/data/site-counts';
import { isPublishableMaterial } from '../src/data/publishing';

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
});
