import { expect, test } from '@playwright/test';
import { canonicalGrades, canonicalReaderItems } from '../src/data/canonical-content';
import { visibleResourceNote } from '../src/data/resource-copy';

test('Canva angle activity belongs only to Grade 7 angles and uses proven external fallback', () => {
  const placements = canonicalGrades.flatMap((grade) =>
    grade.chapters.flatMap((chapter) =>
      chapter.items
        .filter((item) => item.id === 'angle-canva-site')
        .map((item) => ({ grade: grade.slug, chapter: chapter.id, item }))
    )
  );

  expect(placements.map(({ grade, chapter }) => ({ grade, chapter }))).toEqual([
    { grade: 'z', chapter: 'z-angles' },
  ]);
  expect(placements[0].item.url).toBe('https://idanahvan.my.canva.site/angle');
  expect(placements[0].item.embed, 'Canva Site blocks framing; do not render a broken iframe').toBeUndefined();
});

test('ModEL teacher guide keeps external-open fallback and removes ceremonial copy', () => {
  const entry = canonicalReaderItems.find(({ item }) => item.id === 'moodle-guide');
  expect(entry).toBeTruthy();
  expect(entry!.item.kind).toBe('link');
  expect(entry!.item.embed, 'Google Sites blocks framing; external open is intentional').toBeUndefined();
  expect(visibleResourceNote(entry!.item)).toBe('מדריך למורה באתר המודל למתמטיקה.');
  expect(visibleResourceNote(entry!.item)).not.toContain('רשמי');
});
