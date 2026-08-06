import { expect, test } from '@playwright/test';

/**
 * שכבת הגנה ייעודית לעמודי המשאב המחולקים.
 * המטרה: למנוע חזרה של viewer נמוך שמציג רק חצי עמוד, ולוודא שכל
 * פעולות האתר נשארות בחצי השמאלי ולא זולגות אל אזור ההטמעה.
 */
test.skip(({ isMobile }) => isMobile === true, 'רץ בפרויקט הדסקטופ עם viewports מפורשים');

const desktopViewports = [
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

async function horizontalOverflow(page: import('@playwright/test').Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

for (const viewport of desktopViewports) {
  test(`אתר חי ב-${viewport.width}: viewer גבוה, מלא וגלילה אמיתית בפנים`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/chativat-beynayim/reader/z/misparim/');

    const view = page.locator('.res-view');
    const iframe = page.locator('.res-frame iframe');
    await expect(iframe).toBeVisible();
    await expect(iframe).toHaveAttribute('src', /\/api\/em\/misparim\//);

    const viewBox = (await view.boundingBox())!;
    const frameBox = (await iframe.boundingBox())!;

    expect(frameBox.height, 'האתר החי אינו נדחס לחצי עמוד').toBeGreaterThanOrEqual(
      Math.round(viewport.height * 0.72)
    );
    expect(frameBox.width, 'ההטמעה ממלאת את רוחב החצי הימני').toBeGreaterThanOrEqual(viewBox.width - 24);
    expect(await horizontalOverflow(page), 'אין גלילה אופקית בעמוד החיצוני').toBeLessThanOrEqual(1);

    // הגלילה הפנימית חייבת להיות אפשרית מצדנו. אורך התוכן של האתר
    // החיצוני אינו בשליטתנו ולכן אינו קריטריון קבלה יציב.
    const scrollable = await iframe.evaluate((el) => {
      const f = el as HTMLIFrameElement;
      return f.getAttribute('scrolling') !== 'no' && getComputedStyle(f).overflow !== 'hidden';
    });
    expect(scrollable, 'שום הגדרה שלנו אינה חוסמת גלילה בתוך ההטמעה').toBe(true);
  });
}

test('מסמך מוטמע מקבל יחס עמוד מלא ולא viewer אופקי נמוך', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/reader/t/sheelot-t/');

  const view = (await page.locator('.res-view').boundingBox())!;
  const iframe = page.locator('.res-frame iframe');
  await expect(iframe).toBeVisible();
  const frame = (await iframe.boundingBox())!;

  expect(frame.height / frame.width, 'יחס אנכי שמאפשר לראות עמוד שלם').toBeGreaterThan(1.3);
  expect(frame.height, 'גובה קריאה מינימלי למסמך').toBeGreaterThanOrEqual(640);
  expect(frame.width, 'המסמך ממלא את רוחב אזור ההטמעה').toBeGreaterThanOrEqual(view.width - 24);
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
});

test('PDF מבקש התאמה לרוחב כבר בכתובת ההטמעה', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');

  const iframe = page.locator('.res-frame iframe').first();
  const requestedSource = (await iframe.getAttribute('src')) ?? (await iframe.getAttribute('data-esrc')) ?? '';
  expect(requestedSource, 'מציג ה-PDF נפתח במצב התאמה לרוחב').toContain('view=FitH');

  const aspectRatio = await iframe.evaluate((node) => getComputedStyle(node).aspectRatio);
  expect(aspectRatio, 'יחס A4 מוגדר גם כאשר הדפדפן מחליף את מציג ה-PDF').toContain('1');
});

test('כל פעולות עמוד המשאב נמצאות רק בחצי השמאלי', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of [
    '/chativat-beynayim/reader/z/misparim/',
    '/chativat-beynayim/reader/t/sheelot-t/',
  ]) {
    await page.goto(route);

    const panel = (await page.locator('.res-panel').boundingBox())!;
    const view = (await page.locator('.res-view').boundingBox())!;
    expect(panel.x + panel.width, `${route}: הפאנל כולו משמאל`).toBeLessThan(view.x);

    const actions = page.locator('.res-actions .btn, .res-pager a, .res-back');
    const count = await actions.count();
    expect(count, `${route}: קיימות פעולות אמיתיות`).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const box = await actions.nth(index).boundingBox();
      if (!box) continue;
      expect(box.x + box.width, `${route}: פעולה ${index + 1} אינה זולגת לימין`).toBeLessThanOrEqual(view.x - 1);
    }

    await expect(page.locator('.res-view > a, .res-view > button, .res-view .res-actions')).toHaveCount(0);
  }
});

test('בנייד ההטמעה ראשונה, גבוהה ונוחה, והפעולות אחריה', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/chativat-beynayim/reader/z/misparim/');

  const view = (await page.locator('.res-view').boundingBox())!;
  const panel = (await page.locator('.res-panel').boundingBox())!;
  const iframe = (await page.locator('.res-frame iframe').boundingBox())!;

  expect(view.y, 'ההטמעה מופיעה לפני הפעולות בנייד').toBeLessThan(panel.y);
  expect(iframe.height, 'גם בנייד חלון האתר אינו נמוך').toBeGreaterThanOrEqual(560);
  expect(await horizontalOverflow(page), 'אין גלילה אופקית בנייד').toBeLessThanOrEqual(1);
});
