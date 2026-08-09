import { expect, test } from '@playwright/test';
import { canonicalGrades, canonicalReaderItems } from '../src/data/canonical-content';
import { visibleResourceNote } from '../src/data/resource-copy';

const placementById = (resourceId: string) =>
  canonicalGrades.flatMap((grade) =>
    grade.chapters.flatMap((chapter) =>
      chapter.items
        .filter((item) => item.id === resourceId)
        .map((item) => ({ grade: grade.slug, chapter: chapter.id, item }))
    )
  );

test('Canva angle activity is preserved only under Grade 7 angles, but stays quarantined until creator verification', () => {
  const placements = placementById('angle-canva-site');

  expect(placements.map(({ grade, chapter }) => ({ grade, chapter }))).toEqual([
    { grade: 'z', chapter: 'z-angles' },
  ]);
  expect(placements[0].item.url).toBe('https://idanahvan.my.canva.site/angle');
  expect(placements[0].item.embed, 'Canva Site blocks framing; do not render a broken iframe').toBeUndefined();
  expect(
    canonicalReaderItems.some(({ item }) => item.id === 'angle-canva-site'),
    'creator is not verified yet, so the item must not be public'
  ).toBe(false);
});

test('ModEL teacher guide preserves external fallback and cleaned copy while remaining quarantined until creator verification', () => {
  const placements = placementById('moodle-guide');
  expect(placements.length).toBeGreaterThan(0);

  const item = placements[0].item;
  expect(item.kind).toBe('link');
  expect(item.embed, 'Google Sites blocks framing; external open is intentional').toBeUndefined();
  expect(visibleResourceNote(item)).toBe('מדריך למורה באתר המודל למתמטיקה.');
  expect(visibleResourceNote(item)).not.toContain('רשמי');
  expect(
    canonicalReaderItems.some(({ item: publicItem }) => publicItem.id === 'moodle-guide'),
    'creator is not verified yet, so the item must not be public'
  ).toBe(false);
});
