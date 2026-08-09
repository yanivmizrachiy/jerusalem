import { expect, test } from '@playwright/test';
import { choveret } from '../src/data/choveret';
import { sourceMaterialResources } from '../src/data/source-materials';

/** דטרמיניסטי לחלוטין; אין ערך להריץ שוב בפרויקט המובייל. */
test.skip(({ isMobile }) => isMobile === true, 'חוזי נתונים זהים בכל device');

// מזהים קיימים כמו TRI-007 / MZ-27 חוקיים; האיסור הוא על תווים ששוברים route.
const ROUTE_SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9-]*$/;
const SAFE_PROTOCOLS = new Set(['https:', 'http:']);

function assertLocation(value: string, label: string) {
  expect(value.length, `${label}: כתובת לא ריקה`).toBeGreaterThan(0);
  expect(value.trim(), `${label}: בלי whitespace חיצוני`).toBe(value);

  if (value.startsWith('/')) {
    expect(value.startsWith('//'), `${label}: אין protocol-relative URL`).toBe(false);
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label}: URL לא תקין: ${value}`);
  }

  expect(SAFE_PROTOCOLS.has(parsed.protocol), `${label}: רק http/https`).toBe(true);
  expect(parsed.username, `${label}: אין credentials ב-URL`).toBe('');
  expect(parsed.password, `${label}: אין credentials ב-URL`).toBe('');
}

function assertUnique(values: readonly string[], label: string) {
  expect(new Set(values).size, `${label}: ללא כפילויות`).toBe(values.length);
}

test('קטלוג חטיבת הביניים: מזהים וכתובות בטוחים ל-route ולדפדפן', () => {
  for (const grade of choveret) {
    expect(ROUTE_SAFE_ID.test(grade.slug), `grade slug: ${grade.slug}`).toBe(true);
    assertUnique(grade.chapters.map((chapter) => chapter.id), `${grade.slug}: chapter ids`);

    for (const chapter of grade.chapters) {
      expect(ROUTE_SAFE_ID.test(chapter.id), `chapter id: ${grade.slug}/${chapter.id}`).toBe(true);
      assertUnique(chapter.items.map((item) => item.id), `${grade.slug}/${chapter.id}: item ids`);

      for (const item of chapter.items) {
        expect(ROUTE_SAFE_ID.test(item.id), `item id: ${grade.slug}/${chapter.id}/${item.id}`).toBe(true);
        expect(item.title.trim().length, `${item.id}: title`).toBeGreaterThan(0);
        assertLocation(item.url, `${item.id}.url`);
        if (item.embed) assertLocation(item.embed, `${item.id}.embed`);
        if (item.download) assertLocation(item.download, `${item.id}.download`);
        if (item.pageHref) assertLocation(item.pageHref, `${item.id}.pageHref`);
        if (item.needsReview) {
          expect(item.reviewReason?.trim().length ?? 0, `${item.id}: needsReview מחייב reviewReason`).toBeGreaterThan(0);
        }
      }
    }
  }
});

test('קטלוג המקור: provenance ו-metadata אינם ריקים או כפולים', () => {
  assertUnique(sourceMaterialResources.map((resource) => resource.id), 'source resource ids');

  for (const resource of sourceMaterialResources) {
    expect(ROUTE_SAFE_ID.test(resource.id), `source id: ${resource.id}`).toBe(true);
    expect(resource.title.trim().length, `${resource.id}: title`).toBeGreaterThan(0);
    expect(resource.note.trim().length, `${resource.id}: note`).toBeGreaterThan(0);
    expect(resource.source.trim().length, `${resource.id}: source`).toBeGreaterThan(0);
    expect(resource.sourceRecordIds.length, `${resource.id}: sourceRecordIds`).toBeGreaterThan(0);
    expect(resource.evidence.length, `${resource.id}: evidence`).toBeGreaterThan(0);

    assertUnique(resource.grades, `${resource.id}: grades`);
    assertUnique(resource.domains, `${resource.id}: domains`);
    assertUnique(resource.sourceTopicIds, `${resource.id}: sourceTopicIds`);
    assertUnique(resource.collections, `${resource.id}: collections`);
    assertUnique(resource.sourceRecordIds, `${resource.id}: sourceRecordIds`);

    assertLocation(resource.url, `${resource.id}.url`);
    if (resource.embed) assertLocation(resource.embed, `${resource.id}.embed`);
    if (resource.download) assertLocation(resource.download, `${resource.id}.download`);

    if (resource.needsReview) {
      expect(resource.reviewReason?.trim().length ?? 0, `${resource.id}: needsReview מחייב reviewReason`).toBeGreaterThan(0);
    }
  }
});
