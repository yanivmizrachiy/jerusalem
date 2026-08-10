import { expect, test } from '@playwright/test';
import { canonicalReaderItems } from '../src/data/canonical-content';

/**
 * חוזי עמוד המשאב על מכשיר אמיתי (Issue #68, P1):
 * הקובץ רץ רק בפרויקט המובייל ומוכיח מגע, stacking, PDF fallback,
 * יעדי מגע וסיבוב מסך מול מכשיר Playwright mobile אמיתי.
 */
test.skip(({ isMobile }) => !isMobile, 'חוזי מכשיר אמיתי — רצים רק בפרויקט המובייל');

const readerHref = (entry: (typeof canonicalReaderItems)[number]) =>
  `/chativat-beynayim/reader/${entry.grade.slug}/${entry.item.id}/`;

const docEntry = canonicalReaderItems.find(({ item }) => item.kind === 'doc' && item.embed);
const pdfEntry = canonicalReaderItems.find(({ item }) => item.kind === 'pdf' && item.embed);

const noHorizontalOverflow = async (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test('בנייד ההטמעה ראשונה, הלוח אחריה, ואין גלילה אופקית (8.6, 19.32)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(docEntry!));

  const view = page.locator('.res-view');
  const panel = page.locator('.res-panel');
  await expect(view).toBeVisible();
  await expect(panel).toBeVisible();

  const [viewBox, panelBox] = [await view.boundingBox(), await panel.boundingBox()];
  expect(viewBox && panelBox, 'לשני הצדדים יש מידות').toBeTruthy();
  expect(viewBox!.y, 'ההטמעה מתחילה מעל לוח המידע').toBeLessThan(panelBox!.y);
  expect(Math.abs(viewBox!.x - panelBox!.x), 'שני הצדדים באותה עמודה').toBeLessThanOrEqual(2);
  expect(await noHorizontalOverflow(page), 'אפס גלילה אופקית').toBeLessThanOrEqual(1);
});

test('מגע בשטח ההטמעה מגיע ל-iframe — שום שכבה אינה חוסמת (3.29)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(docEntry!));

  const iframe = page.locator('.res-view iframe').first();
  await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toBeVisible();

  const hitTag = await page.evaluate(() => {
    const frame = document.querySelector('.res-view iframe');
    if (!frame) return 'missing-iframe';
    const box = frame.getBoundingClientRect();
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + Math.min(box.height / 2, innerHeight / 2),
    );
    if (hit === frame) return 'iframe';
    return hit ? `${hit.tagName.toLowerCase()}.${[...hit.classList].join('.')}` : 'nothing';
  });
  expect(hitTag, 'מרכז ההטמעה חייב להיות לחיץ').toBe('iframe');
});

test('PDF בלי מציג מובנה: כרטיס פתיחה אמיתי במקום מסגרת ריקה, ולא שניהם (8.8)', async ({ page }) => {
  expect(pdfEntry, 'בקטלוג חייב להישאר משאב מסוג pdf').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // מכריחים את מסלול Android/PDF fallback לפני טעינת העמוד כדי שהחוזה
  // לעולם לא ייעלם בשקט בעקבות שינוי בגרסת Chromium של ה-runner.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'pdfViewerEnabled', {
      configurable: true,
      get: () => false,
    });
  });
  await page.goto(readerHref(pdfEntry!));

  const fallback = page.locator('[data-pdf-fb]');
  await expect(fallback).toBeVisible();
  await expect(page.locator('.res-view [data-frame]')).toBeHidden();

  const open = fallback.locator('a[href]').first();
  await expect(open).toBeVisible();
  const box = await open.boundingBox();
  expect(box, 'לפעולת הפתיחה יש תיבת מגע').toBeTruthy();
  expect(box!.width, 'רוחב מטרת המגע בכרטיס').toBeGreaterThanOrEqual(44);
  expect(box!.height, 'גובה מטרת המגע בכרטיס').toBeGreaterThanOrEqual(44);
});

test('כל פעולות לוח המשאב הגלויות הן מטרות מגע ≥44px (5.16)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(docEntry!));

  // Scope מפורש ללוח המשאב: Footer/WhatsApp חיצוניים אינם יכולים ליצור false-green.
  // הפעולות הדינמיות (share/fullscreen) נמדדות גם הן אם הדפדפן חשף אותן.
  const board = page.locator('[data-resource-actions]').first();
  await expect(board).toBeVisible();
  const visibleActions = board.locator('[data-action]:visible');
  const count = await visibleActions.count();
  expect(count, 'בלוח יש פעולות גלויות אמיתיות').toBeGreaterThanOrEqual(4);

  for (let i = 0; i < count; i++) {
    const action = visibleActions.nth(i);
    const kind = (await action.getAttribute('data-action')) ?? `#${i + 1}`;
    await action.scrollIntoViewIfNeeded();
    const box = await action.boundingBox();
    expect(box, `${kind}: לפעולה יש תיבת מגע`).toBeTruthy();
    expect(box!.width, `${kind}: רוחב מטרת המגע`).toBeGreaterThanOrEqual(44);
    expect(box!.height, `${kind}: גובה מטרת המגע`).toBeGreaterThanOrEqual(44);
  }
});

test('סיבוב מסך אינו שובר את הפריסה — לרוחב ובחזרה (19.32)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(docEntry!));

  const portrait = page.viewportSize()!;
  for (const size of [
    { width: portrait.height, height: portrait.width },
    portrait,
  ]) {
    await page.setViewportSize(size);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

    expect(await noHorizontalOverflow(page), `${size.width}×${size.height}: אפס גלילה אופקית`).toBeLessThanOrEqual(1);
    const viewBox = await page.locator('.res-view').boundingBox();
    expect(viewBox, `${size.width}×${size.height}: ההטמעה קיימת`).toBeTruthy();
    expect(viewBox!.width, `${size.width}×${size.height}: ההטמעה בתוך גבולות המסך`).toBeLessThanOrEqual(
      size.width + 1,
    );
  }
});
