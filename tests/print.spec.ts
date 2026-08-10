import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { canonicalReaderItems } from '../src/data/canonical-content';

/**
 * חבילת ההדפסה (RULES 8.13–8.17, 19.25–19.26): גיליון @media print אמיתי
 * שנבדק ב-emulateMedia, לא הנחה. אין כאן דיאלוג צבע/שחור-לבן (8.13) —
 * זה מחייב כפתור חדש ב-ResourceActions.astro, שנמצא כרגע בבעלות PR #127
 * פעיל; מדווח כהחלטת מוצר נפרדת ולא ממומש כאן.
 */

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const readerHref = (entry: (typeof canonicalReaderItems)[number]) =>
  `/chativat-beynayim/reader/${entry.grade.slug}/${entry.item.id}/`;

const docEntry = canonicalReaderItems.find(({ item }) => item.kind === 'doc' && item.embed);

const noHorizontalOverflow = async (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test('גיליון ההדפסה מגדיר A4 עם שוליים אמיתיים (8.16)', async () => {
  const css = await source('src/styles/global.css');
  expect(css).toMatch(/@media print\s*\{[\s\S]*?@page\s*\{\s*size:\s*A4;\s*margin:/);
});

test('הדפסה בעמוד המשאב: ניווט, פוטר ופעולות דקורטיביות יורדים, ואין קופסה ריקה (8.16, 8.17)', async ({
  page,
}) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc עם הטמעה').toBeTruthy();
  await page.goto(readerHref(docEntry!));
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('iframe')).toBeHidden();
  await expect(page.locator('.embed-frame')).toBeHidden();
  await expect(page.locator('.res-view')).toBeHidden();
  await expect(page.locator('.orbs [data-action="download"]')).toBeHidden();
  await expect(page.locator('.orbs [data-action="copy"]')).toBeHidden();

  // צד המידע קורס לעמודה אחת ומקבל את מלוא הרוחב — לא נשארת מחצית עמוד
  // לבנה אחרי שצד ההטמעה ירד (8.16).
  const panel = page.locator('.res-panel');
  await expect(panel).toBeVisible();
  const [panelBox, splitBox] = [await panel.boundingBox(), await page.locator('.res-split').boundingBox()];
  expect(panelBox && splitBox, 'לשני האלמנטים יש מידות בהדפסה').toBeTruthy();
  expect(panelBox!.width, 'לוח המידע ממלא את רוחב האזור המודפס').toBeGreaterThanOrEqual(splitBox!.width - 2);

  expect(await noHorizontalOverflow(page), 'אפס גלילה אופקית בהדפסה').toBeLessThanOrEqual(1);
});

test('הדפסה בעמוד המשאב: קישור "פתיחה במקור" נשאר גלוי עם הכתובת המלאה (8.17)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc עם הטמעה').toBeTruthy();
  await page.goto(readerHref(docEntry!));
  await page.emulateMedia({ media: 'print' });

  const sourceLink = page.locator('.orbs [data-action="source"]');
  await expect(sourceLink).toBeVisible();
  const href = await sourceLink.getAttribute('href');
  expect(href).toBeTruthy();

  if (href!.startsWith('http')) {
    const afterContent = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      return el ? getComputedStyle(el, '::after').content : null;
    }, '.orbs [data-action="source"]');
    expect(afterContent, 'הכתובת המלאה מופיעה ליד הקישור בהדפסה').toContain(href);
  }
});

test('הדפסה במשאב plan/prisa: התוכן הטבעי (לא iframe) נשאר גלוי (8.16, 8.17)', async ({ page }) => {
  // ל-plan/prisa אין iframe בתוך .embed-frame — .res-view מכיל HTML אמיתי
  // (PlanPrisaWeb). הכלל הגורף שמוריד את .res-view חייב להחריג אותו,
  // אחרת גם התוכן וגם קישורי המקור/ההורדה נעלמים מהדף המודפס.
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.res-split.is-web-doc .res-view')).toBeVisible();
  await expect(page.locator('.ppw')).toBeVisible();
  await expect(page.locator('.ppw-source').first()).toBeVisible();
});

test('הדפסה בעמוד הבית: ניווט, פוטר וסרטון הפתיחה יורדים, ואין גלילה אופקית (8.16)', async ({ page }) => {
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });

  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.locator('.site-footer')).toBeHidden();
  await expect(page.locator('.rail')).toBeHidden();
  await expect(page.locator('video')).toBeHidden();

  expect(await noHorizontalOverflow(page), 'אפס גלילה אופקית בהדפסה').toBeLessThanOrEqual(1);
});
