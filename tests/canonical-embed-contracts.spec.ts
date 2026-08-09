import { expect, test } from '@playwright/test';
import { canonicalGrades } from '../src/data/canonical-content';

test.skip(({ isMobile }) => isMobile === true, 'canonical embed data is device-independent');

const gradeZ = canonicalGrades.find((grade) => grade.slug === 'z')!;
const item = (chapterId: string, resourceId: string) =>
  gradeZ.chapters.find((chapter) => chapter.id === chapterId)!.items.find((resource) => resource.id === resourceId)!;

test('שלושת משאבי הליבה בכיתה ז׳ משתמשים רק במקור ההטמעה שאומת בפועל', () => {
  expect(item('z-coordinate-system', 'tzirim').embed).toBe(
    'https://yanivmizrachiy.github.io/coordinate-first-quadrant/'
  );
  expect(item('z-directed-numbers', 'misparim').embed).toBe('/api/em/misparim/');
  expect(item('z-angles', 'zaviyot').embed).toBe('/api/em/zaviyot/');
});

test('משאב Canva של הזוויות נשאר fallback חיצוני ולא iframe שבור', () => {
  const canva = item('z-angles', 'angle-canva-site');
  expect(canva.url).toBe('https://idanahvan.my.canva.site/angle');
  expect(canva.embed).toBeUndefined();
});
