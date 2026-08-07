import { expect, test } from '@playwright/test';
import { choveret, materialChapters, type ChoveretItem } from '../src/data/choveret';
import { sourceMaterialPlacements, sourceMaterialResources } from '../src/data/source-materials';

/**
 * חוזי נתונים דטרמיניסטיים בלבד — ללא רשת וללא תלות במכשיר.
 * המטרה היא לעצור ערכי קטלוג מסוכנים/שבורים לפני merge, גם כאשר TypeScript
 * עצמו רואה בהם `string` תקין.
 */
test.skip(({ isMobile }) => isMobile === true, 'חוזי הנתונים זהים בכל device');

const ROUTE_SAFE_ID = /^[a-z0-9][a-z0-9-]*$/;

function assertSafeLocation(value: string, label: string) {
  expect(value, `${label}: אין whitespace בקצוות`).toBe(value.trim());
  expect(value.length, `${label}: כתובת אינה ריקה`).toBeGreaterThan(0);
  expect(value, `${label}: scheme מסוכן`).not.toMatch(/^(?:javascript|data|vbscript):/i);

  if (value.startsWith('/')) {
    expect(value, `${label}: כתובת פנימית חייבת להתחיל ב-/ יחיד`).not.toMatch(/^\/\//);
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${label}: URL לא תקין — ${value}`);
  }
  expect(parsed.protocol, `${label}: קישור חיצוני חייב HTTPS`).toBe('https:');
  expect(parsed.hostname, `${label}: hostname חסר`).not.toBe('');
  expect(parsed.username, `${label}: credentials אסורים ב-URL`).toBe('');
  expect(parsed.password, `${label}: credentials אסורים ב-URL`).toBe('');
}

function assertItemLocations(item: ChoveretItem, context: string) {
  assertSafeLocation(item.url, `${context}/${item.id}.url`);
  if (item.embed) assertSafeLocation(item.embed, `${context}/${item.id}.embed`);
  if (item.download) assertSafeLocation(item.download, `${context}/${item.id}.download`);
  if (item.pageHref) assertSafeLocation(item.pageHref, `${context}/${item.id}.pageHref`);

  if (item.needsReview) {
    expect(item.reviewReason?.trim().length ?? 0, `${context}/${item.id}: needsReview מחייב reviewReason`).toBeGreaterThan(0);
  }
}

test('מזהי שכבה/פרק/פריט בטוחים לשימוש במסלולים', () => {
  for (const grade of choveret) {
    expect(grade.slug, `grade slug: ${grade.slug}`).toMatch(ROUTE_SAFE_ID);
    const chapterIds = new Set<string>();

    for (const chapter of grade.chapters) {
      expect(chapter.id, `${grade.slug}: chapter id ${chapter.id}`).toMatch(ROUTE_SAFE_ID);
      expect(chapterIds.has(chapter.id), `${grade.slug}: chapter id כפול ${chapter.id}`).toBe(false);
      chapterIds.add(chapter.id);

      const itemIds = new Set<string>();
      for (const item of chapter.items) {
        expect(item.id, `${grade.slug}/${chapter.id}: item id ${item.id}`).toMatch(ROUTE_SAFE_ID);
        expect(itemIds.has(item.id), `${grade.slug}/${chapter.id}: item id כפול ${item.id}`).toBe(false);
        itemIds.add(item.id);
      }
    }
  }
});

test('כל URL בקטלוג משתמש ב-HTTPS או במסלול פנימי בטוח', () => {
  for (const grade of choveret) {
    for (const chapter of grade.chapters) {
      for (const item of chapter.items) assertItemLocations(item, `${grade.slug}/${chapter.id}`);
      if (chapter.redirectHref) assertSafeLocation(chapter.redirectHref, `${grade.slug}/${chapter.id}.redirectHref`);
    }

    for (const page of grade.pages ?? []) {
      assertSafeLocation(page.href, `${grade.slug}.pages/${page.title}`);
    }
  }

  for (const resource of sourceMaterialResources) {
    assertSafeLocation(resource.url, `source/${resource.id}.url`);
    if (resource.embed) assertSafeLocation(resource.embed, `source/${resource.id}.embed`);
    if (resource.download) assertSafeLocation(resource.download, `source/${resource.id}.download`);
    if (resource.needsReview) {
      expect(resource.reviewReason?.trim().length ?? 0, `source/${resource.id}: needsReview מחייב reviewReason`).toBeGreaterThan(0);
    }
  }
});

test('משאבי המקור מכילים metadata מינימלי עקבי וללא מערכים כפולים', () => {
  const ids = new Set<string>();
  for (const resource of sourceMaterialResources) {
    expect(resource.id, 'source resource id').toMatch(ROUTE_SAFE_ID);
    expect(ids.has(resource.id), `source id כפול: ${resource.id}`).toBe(false);
    ids.add(resource.id);

    expect(resource.title.trim().length, `${resource.id}: title`).toBeGreaterThan(0);
    expect(resource.note.trim().length, `${resource.id}: note`).toBeGreaterThan(0);
    expect(resource.source.trim().length, `${resource.id}: source`).toBeGreaterThan(0);
    expect(resource.grades.length, `${resource.id}: grades`).toBeGreaterThan(0);
    expect(resource.domains.length, `${resource.id}: domains`).toBeGreaterThan(0);
    expect(resource.sourceRecordIds.length, `${resource.id}: sourceRecordIds`).toBeGreaterThan(0);
    expect(resource.evidence.length, `${resource.id}: evidence`).toBeGreaterThan(0);

    for (const [name, values] of Object.entries({
      grades: resource.grades,
      domains: resource.domains,
      sourceTopicIds: resource.sourceTopicIds,
      collections: resource.collections,
      sourceRecordIds: resource.sourceRecordIds,
    })) {
      expect(new Set(values).size, `${resource.id}: כפילויות ב-${name}`).toBe(values.length);
    }
  }
});

test('placements אינם מכילים topic/collection כפולים והם מצביעים למזהים route-safe', () => {
  for (const placement of sourceMaterialPlacements) {
    expect(placement.resourceId, 'placement.resourceId').toMatch(ROUTE_SAFE_ID);
    expect(new Set(placement.topicChapterIds).size, `${placement.resourceId}: topicChapterIds כפולים`).toBe(
      placement.topicChapterIds.length
    );
    expect(new Set(placement.collectionChapterIds).size, `${placement.resourceId}: collectionChapterIds כפולים`).toBe(
      placement.collectionChapterIds.length
    );
    for (const chapterId of [...placement.topicChapterIds, ...placement.collectionChapterIds]) {
      expect(chapterId, `${placement.resourceId}: chapter id`).toMatch(ROUTE_SAFE_ID);
    }
  }
});

test('פרקים פומביים אינם מכילים item חסר title/note/url', () => {
  for (const grade of choveret) {
    for (const chapter of materialChapters(grade)) {
      for (const item of chapter.items) {
        expect(item.title.trim().length, `${grade.slug}/${chapter.id}/${item.id}: title`).toBeGreaterThan(0);
        expect(item.note.trim().length, `${grade.slug}/${chapter.id}/${item.id}: note`).toBeGreaterThan(0);
        expect(item.url.trim().length, `${grade.slug}/${chapter.id}/${item.id}: url`).toBeGreaterThan(0);
      }
    }
  }
});
