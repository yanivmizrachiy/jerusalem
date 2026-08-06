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

    const actions = page.locator('.orbs .orb:visible, .res-pager a, .res-back');
    const count = await actions.count();
    expect(count, `${route}: קיימות פעולות אמיתיות`).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const box = await actions.nth(index).boundingBox();
      if (!box) continue;
      expect(box.x + box.width, `${route}: פעולה ${index + 1} אינה זולגת לימין`).toBeLessThanOrEqual(view.x - 1);
    }

    await expect(page.locator('.res-view > a, .res-view > button, .res-view .orbs')).toHaveCount(0);
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

/* ===== שומר האורבים במסלול reader אמיתי =====
   נוסף אחרי שיניב דיווח שאינו רואה את כפתורי הפעולה. האבחון מול הפרודקשן
   הראה שהם חיים ותקינים, ושהם קיימים אך ורק במסלולי `reader/` — לא בעמוד
   הראשי, לא בשער החטיבה ולא בעמוד השכבה. הבדיקה נועלת בדיוק את זה, כדי
   ששקט עתידי לא ייראה כמו תקינות. */
const readerRoutes = [
  '/chativat-beynayim/reader/z/tochnit-z/',
  '/chativat-beynayim/reader/z/misparim/',
  '/chativat-beynayim/reader/t/sheelot-t/',
] as const;

for (const size of [
  { label: 'מחשב', width: 1440, height: 900 },
  { label: 'נייד', width: 390, height: 844 },
] as const) {
  test(`לוח הפעולות (אורבים) חי וגלוי בכל מסלול reader — ${size.label} (8.4, 19.32)`, async ({ page }) => {
    await page.setViewportSize({ width: size.width, height: size.height });

    for (const route of readerRoutes) {
      await page.goto(route);

      // לאורבים כניסה מדורגת (`orb-rise`, השהיה עד 800ms + 700ms) עם
      // `animation-fill-mode: both`, ולכן בפריימים הראשונים ה-opacity הוא 0.
      // ממתינים שייחשפו בפועל במקום למדוד מוקדם מדי ולהאשים את המוצר.
      await expect
        .poll(
          () =>
            page.evaluate(
              () =>
                [...document.querySelectorAll('.orb')].filter((e) => {
                  const cs = getComputedStyle(e);
                  const r = e.getBoundingClientRect();
                  return cs.display !== 'none' && +cs.opacity > 0.01 && r.width > 0;
                }).length
            ),
          { message: `${route}: האורבים נחשפים אחרי הכניסה המדורגת`, timeout: 8000 }
        )
        .toBeGreaterThanOrEqual(5);

      const counts = await page.evaluate(() => {
        const orbs = [...document.querySelectorAll('.orb')];
        const visible = orbs.filter((e) => {
          const cs = getComputedStyle(e);
          const r = e.getBoundingClientRect();
          return cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.01 && r.width > 0;
        });
        return {
          containers: document.querySelectorAll('.orbs').length,
          visible: visible.length,
          legacy: document.querySelectorAll('.res-actions').length,
          outsideViewport: visible.filter((e) => {
            const r = e.getBoundingClientRect();
            return r.left < -1 || r.right > window.innerWidth + 1;
          }).length,
          tooSmall: visible.filter((e) => {
            const r = e.getBoundingClientRect();
            return r.width < 44 || r.height < 44;
          }).length,
        };
      });

      expect(counts.containers, `${route}: קיים מכל אורבים אחד`).toBe(1);
      expect(counts.visible, `${route}: לפחות חמש פעולות גלויות`).toBeGreaterThanOrEqual(5);
      expect(counts.legacy, `${route}: לוח הפעולות הישן אינו קיים עוד`).toBe(0);
      expect(counts.outsideViewport, `${route}: כל האורבים בתוך רוחב המסך`).toBe(0);
      expect(counts.tooSmall, `${route}: מטרת מגע 44px לכל אורב`).toBe(0);
      expect(await horizontalOverflow(page), `${route}: אין גלילה אופקית`).toBeLessThanOrEqual(1);
    }
  });
}

test('אורבים קיימים אך ורק במסלולי reader — לא בעמוד הראשי ובשערים', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ['/', '/chativat-beynayim/', '/chativat-beynayim/kita-z/']) {
    await page.goto(route);
    const n = await page.evaluate(() => document.querySelectorAll('.orbs').length);
    expect(n, `${route}: אין כאן לוח פעולות של משאב — וזו ההתנהגות הנכונה`).toBe(0);
  }
});
