import { expect, test } from '@playwright/test';
import { canonicalGrades } from '../src/data/canonical-content';

test('Canva angle activity belongs only to Grade 7 angles', () => {
  const placements = canonicalGrades.flatMap((grade) =>
    grade.chapters.flatMap((chapter) =>
      chapter.items
        .filter((item) => item.id === 'angle-canva-site')
        .map(() => ({ grade: grade.slug, chapter: chapter.id }))
    )
  );

  expect(placements).toEqual([{ grade: 'z', chapter: 'z-angles' }]);
});
