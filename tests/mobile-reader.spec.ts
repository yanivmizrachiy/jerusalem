import { expect, test } from '@playwright/test';
import { canonicalReaderItems } from '../src/data/canonical-content';

/**
 * חוזי עמוד המשאב על מכשיר אמיתי (Issue #68, ‏P1 — Mobile אמיתי):
 * הכיסוי הקיים לסדר-הנייד ולשכבות ההטמעה רץ בפרויקט הדסקטופ בלבד,
 * ו-viewport צר בתוך Desktop Chrome אינו הוכחה להתנהגות מכשיר (מגע,
 * ‏userAgent, ‏isMobile). הקובץ הזה רץ אך ורק בפרויקט המובייל — Pixel 7
 * אמיתי — ובודק את מה ש-RULES דורש שם במפורש: הטמעה ראשונה (8.6),
 * מגע שמגיע להטמעה בלי שכבה חוסמת (3.29), כרטיס פתיחה אמיתי ל-PDF
 * כשאין מציג מובנה (8.8), יעדי מגע ≥44px (5.16) וסיבוב מסך בלי שבירה
 * (19.32).
 *
 * היעדים נגזרים מהקטלוג הקנוני (canonical-content) ולא מכתובות קשיחות,
 * כדי שהחוזה ישרוד שינויי תוכן כל עוד קיים משאב מהסוג הנבדק.
 */

test.skip(({ isMobile }) => !isMobile, 'חוזי מכשיר אמיתי — רצים רק בפרויקט המובייל');

const readerHref = (entry: (typeof canonicalReaderItems)[number]) =>
  `/chativat-beynayim/reader/${entry.grade.slug}/${entry.item.id}/`;

// רק פריטים עם embed אמיתי מרנדרים iframe; בלעדיו מוצג כרטיס פתיחה בלבד
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

  // עמודה אחת: ההטמעה מעל הלוח, ולא זה לצד זה
  expect(viewBox!.y, 'ההטמעה מתחילה מעל לוח המידע').toBeLessThan(panelBox!.y);
  expect(
    Math.abs(viewBox!.x - panelBox!.x),
    'שני הצדדים באותה עמודה (לא פריסה צד-לצד)',
  ).toBeLessThanOrEqual(2);

  expect(await noHorizontalOverflow(page), 'אפס גלילה אופקית').toBeLessThanOrEqual(1);
});

test('מגע בשטח ההטמעה מגיע ל-iframe — שום שכבה אינה חוסמת (3.29)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(docEntry!));

  const iframe = page.locator('.res-view iframe').first();
  await iframe.scrollIntoViewIfNeeded();
  await expect(iframe).toBeVisible();

  // hit-testing אמיתי: הנקודה במרכז ההטמעה חייבת לפגוע ב-iframe עצמו.
  // שלד הטעינה והקישוטים חייבים להיות pointer-events:none, ולכן כל
  // אלמנט אחר שנתפס כאן הוא שכבה שחוסמת מגע — בדיוק הרגרסיה האסורה.
  const hitTag = await page.evaluate(() => {
    const frame = document.querySelector('.res-view iframe');
    if (!frame) return 'missing-iframe';
    const box = frame.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + Math.min(box.height / 2, innerHeight / 2));
    if (hit === frame) return 'iframe';
    return hit ? `${hit.tagName.toLowerCase()}.${[...hit.classList].join('.')}` : 'nothing';
  });
  expect(hitTag, 'מרכז ההטמעה חייב להיות לחיץ').toBe('iframe');
});

test('PDF בלי מציג מובנה: כרטיס פתיחה אמיתי במקום מסגרת ריקה, ולא שניהם (8.8)', async ({ page }) => {
  expect(pdfEntry, 'בקטלוג חייב להישאר משאב מסוג pdf').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(pdfEntry!));

  const viewerAbsent = await page.evaluate(
    () => 'pdfViewerEnabled' in navigator && navigator.pdfViewerEnabled === false,
  );
  test.skip(!viewerAbsent, 'לדפדפן הריצה יש מציג PDF — תרחיש האנדרואיד אינו ניתן לשחזור כאן');

  // הכרטיס הוא היחיד על הדף: מסגרת ההטמעה מוסתרת באמת — לא כרטיס מתחת
  // להטמעה חיה (8.26; זו בדיוק רגרסיית ה-hidden-מול-display שנתפסה בעבר)
  const fallback = page.locator('[data-pdf-fb]');
  await expect(fallback).toBeVisible();
  await expect(page.locator('.res-view [data-frame]')).toBeHidden();

  // פעולת הפתיחה שבכרטיס היא מטרת מגע אמיתית
  const open = fallback.locator('a[href]').first();
  await expect(open).toBeVisible();
  const box = await open.boundingBox();
  expect(box!.width, 'רוחב מטרת המגע בכרטיס').toBeGreaterThanOrEqual(44);
  expect(box!.height, 'גובה מטרת המגע בכרטיס').toBeGreaterThanOrEqual(44);
});

test('פעולות לוח המשאב הן מטרות מגע ≥44px — לפי היעד האמיתי, לא לפי מחלקה (5.16)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(docEntry!));

  const actions = [
    { locator: page.locator('a[href^="https://wa.me/"]').first(), what: 'WhatsApp' },
    { locator: page.locator('a[href^="mailto:"]').first(), what: 'דוא״ל' },
    { locator: page.locator('[data-copy]').first(), what: 'העתקת קישור' },
  ];

  for (const { locator, what } of actions) {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator, `פעולת ${what} קיימת`).toBeVisible();
    const box = await locator.boundingBox();
    expect(box!.width, `${what}: רוחב מטרת המגע`).toBeGreaterThanOrEqual(44);
    expect(box!.height, `${what}: גובה מטרת המגע`).toBeGreaterThanOrEqual(44);
  }
});

test('סיבוב מסך אינו שובר את הפריסה — לרוחב ובחזרה (19.32)', async ({ page }) => {
  expect(docEntry, 'בקטלוג חייב להישאר משאב מסוג doc').toBeTruthy();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(readerHref(docEntry!));

  const portrait = page.viewportSize()!;
  for (const size of [
    { width: portrait.height, height: portrait.width }, // סיבוב לרוחב
    portrait, // וחזרה
  ]) {
    await page.setViewportSize(size);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

    expect(await noHorizontalOverflow(page), `${size.width}×${size.height}: אפס גלילה אופקית`).toBeLessThanOrEqual(1);

    const viewBox = await page.locator('.res-view').boundingBox();
    expect(viewBox!.width, `${size.width}×${size.height}: ההטמעה בתוך גבולות המסך`).toBeLessThanOrEqual(
      size.width + 1,
    );
  }
});
