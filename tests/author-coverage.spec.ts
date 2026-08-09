import { expect, test } from '@playwright/test';
import { authorAssignments, authorById } from '../src/data/authors';
import { canonicalReaderItems } from '../src/data/canonical-content';
import {
  ATTRIBUTION_PENDING,
  ATTRIBUTION_PENDING_CEILING,
} from '../src/data/attribution';

/**
 * שער הייחוס (הוראת יניב, 09/08/2026):
 * **לכל משאב ציבורי בחטיבת הביניים חייב להיות ייחוס יוצר מאומת.**
 * ייחוס שאינו ידוע נשמר ב-quarantine ואינו נכנס לקטלוג הציבורי.
 *
 * החוזה זהה בכל מכשיר; בדיקת נתונים אחת בדסקטופ מספיקה.
 */
test.skip(({ isMobile }) => isMobile === true, 'attribution contract is device-independent');

/** כל משאב ציבורי, פעם אחת, בלי כפילות שכבה */
const publicResources = (() => {
  const seen = new Map<string, { id: string; title: string; grade: string }>();
  for (const { grade, item } of canonicalReaderItems) {
    if (!seen.has(item.id)) seen.set(item.id, { id: item.id, title: item.title, grade: grade.slug });
  }
  return [...seen.values()];
})();

test('אין משאב ציבורי אנונימי: לכל משאב פומבי יש ייחוס מאומת', () => {
  expect(publicResources.length, 'יש קטלוג ציבורי אמיתי לבדיקה').toBeGreaterThan(100);

  const anonymous = publicResources
    .filter((resource) => (authorAssignments[resource.id] ?? []).length === 0)
    .map((resource) => `${resource.id} (${resource.grade}) — ${resource.title}`);

  expect(
    anonymous,
    `משאבים ציבוריים בלי ייחוס מאומת:\n${anonymous.join('\n')}`
  ).toEqual([]);
});

test('כל ייחוס ציבורי מצביע על ישות קיימת', () => {
  for (const resource of publicResources) {
    for (const authorId of authorAssignments[resource.id] ?? []) {
      const author = authorById(authorId);
      expect(author, `${resource.id}: הישות ${authorId} קיימת במקור האמת`).toBeTruthy();
      expect(['person', 'organization']).toContain(author!.kind);
    }
  }
});

test('רשימת ההמתנה היא quarantine אמיתי ומצטמצמת בלבד', () => {
  expect(
    ATTRIBUTION_PENDING.length,
    'רשימת ההמתנה גדלה — משאב חדש חייב להגיע עם ייחוס מאומת או להישאר מחוץ לפרסום'
  ).toBeLessThanOrEqual(ATTRIBUTION_PENDING_CEILING);

  expect(new Set(ATTRIBUTION_PENDING).size, 'אין כפילות ברשימת ההמתנה').toBe(ATTRIBUTION_PENDING.length);

  const alreadyAttributed = ATTRIBUTION_PENDING.filter(
    (id) => (authorAssignments[id] ?? []).length > 0
  );
  expect(
    alreadyAttributed,
    `משאבים שכבר מיוחסים ונשארו ברשימת ההמתנה: ${alreadyAttributed.join(', ')}`
  ).toEqual([]);

  const publicIds = new Set(publicResources.map((resource) => resource.id));
  const leaked = ATTRIBUTION_PENDING.filter((id) => publicIds.has(id));
  expect(
    leaked,
    `משאבים ממתינים דלפו לקטלוג הציבורי: ${leaked.join(', ')}`
  ).toEqual([]);
});

test('משרד החינוך וגופים מפרסמים אינם מקבלים עמוד מחבר אישי', () => {
  for (const id of ['ministry-of-education', 'rama', 'haifa-teachers-center', 'maor-literate-math', 'jerusalem-district-math']) {
    const org = authorById(id);
    expect(org, `${id} קיים`).toBeTruthy();
    expect(org!.kind, `${id} הוא ארגון`).toBe('organization');
    expect(org!.pageEligible, `${id} אינו מקבל עמוד מחבר אישי`).toBe(false);
  }
});
