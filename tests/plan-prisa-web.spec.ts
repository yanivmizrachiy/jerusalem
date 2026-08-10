import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { choveret } from '../src/data/choveret';
import { planPrisaContent } from '../src/data/plan-prisa-content.generated';
import { planPrisaDocumentFor, PLAN_PRISA_WEB_PDFS } from '../src/data/plan-prisa-web';

// מטריצת קבלה מלאה: כל שמונת מסמכי התוכנית/פריסה הרשמיים נבדקים באותו חוזה.
// הרצה סופית זו כוללת גם את חוזי ה-UX הקיימים של עמוד המשאב, ללא חריגת רוחב חדשה.
const CASES = [
  { grade: 'z', id: 'tochnit-z', pdf: '/docs/plan-7-tashpaz.pdf' },
  { grade: 'z', id: 'prisa-z', pdf: '/docs/prisa-7-tashpaz.pdf' },
  { grade: 'h', id: 'tochnit-h', pdf: '/docs/plan-8-tashpaz.pdf' },
  { grade: 'h', id: 'prisa-h', pdf: '/docs/prisa-8-tashpaz.pdf' },
  { grade: 't', id: 'tochnit-t', pdf: '/docs/plan-9a-tashpaz.pdf' },
  { grade: 't', id: 'prisa-t', pdf: '/docs/prisa-9a-tashpaz.pdf' },
  { grade: 't', id: 'tochnit-t-b', pdf: '/docs/plan-9b-tashpaz.pdf' },
  { grade: 't', id: 'prisa-t-b', pdf: '/docs/prisa-9b-tashpaz.pdf' },
] as const;

const itemOf = (gradeSlug: string, itemId: string) => {
  const grade = choveret.find((entry) => entry.slug === gradeSlug);
  const item = grade?.chapters.flatMap((chapter) => chapter.items).find((entry) => entry.id === itemId);
  expect(item, `${gradeSlug}/${itemId} קיים בקטלוג`).toBeTruthy();
  return item!;
};

test('שמונה מסמכי plan/prisa מחוברים ל-HTML מלא וה-PDF נשאר מקור/הורדה בלבד', () => {
  expect(PLAN_PRISA_WEB_PDFS).toHaveLength(8);
  expect(Object.keys(planPrisaContent.documents)).toHaveLength(8);

  for (const entry of CASES) {
    const item = itemOf(entry.grade, entry.id);
    expect(item.download, `${entry.id}: PDF מאומת`).toBe(entry.pdf);
    expect(item.embed, `${entry.id}: אין iframe PDF`).toBeUndefined();

    const document = planPrisaDocumentFor(item.download);
    expect(document, `${entry.id}: תוכן HTML קיים`).toBeTruthy();
    expect(document?.pdf).toBe(entry.pdf);
    expect(document?.pageCount).toBeGreaterThan(0);
    expect(document?.textLength).toBeGreaterThan(250);
    expect(document?.pages.length).toBe(document?.pageCount);

    const allRows: Array<{ readonly text: string }> = [];
    if (document) {
      for (const page of document.pages) {
        for (const row of page.rows) allRows.push(row);
      }
    }
    expect(allRows.length, `${entry.id}: חולצו שורות תוכן`).toBeGreaterThan(10);
    expect(allRows.every((row) => row.text.trim().length > 0)).toBe(true);
    expect(allRows.some((row) => /[א-ת]/.test(row.text)), `${entry.id}: קיים מלל עברי`).toBe(true);
    expect(allRows.some((row) => /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/.test(row.text)), `${entry.id}: אין תווי bidi סמויים`).toBe(false);
  }
});

test('ה-HTML המופק נעול בדיוק לעותקי ה-PDF המאומתים לפי SHA-256', () => {
  for (const document of Object.values(planPrisaContent.documents)) {
    const sourcePath = path.join(process.cwd(), 'public', document.pdf.replace(/^\//, ''));
    const digest = createHash('sha256').update(readFileSync(sourcePath)).digest('hex');
    expect(digest, `${document.id}: המקור לא השתנה מאז החילוץ`).toBe(document.sha256);
  }
});

test('כל שמונת עמודי המשאב מציגים תצוגת אינטרנט ולא iframe של PDF', async ({ page }) => {
  for (const entry of CASES) {
    await page.goto(`/chativat-beynayim/reader/${entry.grade}/${entry.id}/`);
    const reader = page.locator('[data-plan-prisa-web]');
    await expect(reader, `${entry.id}: קורא HTML אחד`).toHaveCount(1);
    await expect(page.locator('.res-view iframe'), `${entry.id}: אין iframe`).toHaveCount(0);
    await expect(reader.locator('[data-pp-page]').first(), `${entry.id}: לפחות עמוד אחד`).toBeVisible();
    expect(await reader.locator('[data-pp-row]').count(), `${entry.id}: שורות אמיתיות`).toBeGreaterThan(10);
    await expect(page.locator(`a[href="${entry.pdf}"]`).first(), `${entry.id}: PDF עדיין זמין להורדה`).toBeVisible();
  }
});

test('חיפוש פנימי מסנן את התוכן בלי לאבד את עמוד האינטרנט', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  const reader = page.locator('[data-plan-prisa-web]');
  const search = reader.locator('[data-pp-search]');
  const rows = reader.locator('[data-pp-row]');
  const before = await rows.count();
  expect(before).toBeGreaterThan(10);

  await search.fill('ספטמבר');
  await expect(reader.locator('[data-pp-result]')).toContainText(/שורות מתאימות|לא נמצאה התאמה/);
  const visible = await rows.evaluateAll((nodes) => nodes.filter((node) => !(node as HTMLElement).hidden).length);
  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThan(before);

  await search.fill('');
  const restored = await rows.evaluateAll((nodes) => nodes.filter((node) => !(node as HTMLElement).hidden).length);
  expect(restored).toBe(before);
});

test('תצוגת plan/prisa אינה מייצרת גלילה אופקית בנייד', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('[data-plan-prisa-web]')).toBeVisible();
});
