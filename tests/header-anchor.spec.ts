import { expect, test } from '@playwright/test';

/**
 * הכותרת דביקה (`position: sticky`), והעוגנים בכל האתר מקבלים מרווח
 * גלילה מהטוקן `--header-h` בלבד — ערך קבוע אחד (76px) ב-global.css.
 *
 * הסיכון: ‏`min-block-size` בלבד. כשהניווט נשבר לשתי שורות במסך צר,
 * הכותרת בפועל גבוהה מהטוקן, ואז קפיצה לעוגן נוחתת *מתחת* לכותרת
 * הדביקה — היעד מוסתר בדיוק ברגע שהמשתמש הגיע אליו (5.17).
 *
 * הבדיקה מודדת את הגובה האמיתי ואת מיקום היעד אחרי קפיצה, ולא מסתמכת
 * על הערך שבטוקן.
 */

const WIDTHS = [360, 390, 768, 1280, 1920];

test('--header-real-h עוקב אחרי הגובה האמיתי של הכותרת בכל רוחב (5.17)', async ({ page }) => {
  const offenders: string[] = [];

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/chativat-beynayim/kita-z/');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

    const measured = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return {
        real: document.querySelector<HTMLElement>('.site-header')!.getBoundingClientRect().height,
        runtime: parseFloat(root.getPropertyValue('--header-real-h')),
        token: parseFloat(root.getPropertyValue('--header-h')),
      };
    });

    // הטוקן הקבוע הוא רצפת עיצוב בלבד; מה שחייב להיות מדויק הוא הערך
    // הנמדד, כי ממנו נגזר מרווח הגלילה של כל עוגן באתר
    if (!(Math.abs(measured.runtime - measured.real) <= 1)) {
      offenders.push(
        `${width}px: --header-real-h=${measured.runtime} מול כותרת ${Math.round(measured.real)}px (טוקן ${measured.token}px)`,
      );
    }
  }

  expect(offenders, `מרווח הגלילה לא יתאים לכותרת: ${offenders.join(' | ')}`).toHaveLength(0);
});

test('קפיצה לעוגן אינה נבלעת מתחת לכותרת הדביקה בנייד ובדסקטופ (5.17)', async ({ page }) => {
  for (const width of [360, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/chativat-beynayim/kita-z/');
    await page.evaluate(() => document.fonts.ready);

    // עוגן אמיתי מתוך העמוד — לא מזהה מומצא
    const anchorId = await page.evaluate(() => {
      const link = [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].find(
        (a) => a.getAttribute('href')!.length > 1 && document.querySelector(a.getAttribute('href')!),
      );
      return link?.getAttribute('href')?.slice(1) ?? '';
    });
    if (!anchorId) continue;

    await page.evaluate((id) => {
      location.hash = `#${id}`;
    }, anchorId);
    await page.waitForTimeout(250);

    const geometry = await page.evaluate((id) => {
      const header = document.querySelector<HTMLElement>('.site-header')!;
      const target = document.getElementById(id)!;
      return {
        headerBottom: header.getBoundingClientRect().bottom,
        targetTop: target.getBoundingClientRect().top,
      };
    }, anchorId);

    expect(
      geometry.targetTop,
      `${width}px: ראש היעד #${anchorId} (${Math.round(geometry.targetTop)}px) נבלע מתחת לכותרת (${Math.round(geometry.headerBottom)}px)`,
    ).toBeGreaterThanOrEqual(geometry.headerBottom - 1);
  }
});

/**
 * עמודים עם override מקומי למרווח הגלילה חייבים לגזור אותו מהגובה הנמדד
 * (‎--header-real-h‎) ולא מהטוקן הקבוע: הטוקן (76px) נמוך מהכותרת כשהניווט
 * נשבר לשורות, והעוגן נוחת מוסתר בדיוק ברגע ההגעה אליו (5.17).
 *
 * המקרה המדוד: ‏`.grade-exams` בעמוד המבחנים — סרגל הקפיצה שבראש העמוד
 * מצביע על ‎#grade-*‎, ועם הטוקן הקבוע היעד נבלע ‎~54px‎ ב-360px.
 *
 * האיטרציה הראשונה רצה על viewport ברירת המחדל של הפרויקט — בפרויקט
 * המובייל זהו Pixel 7 אמיתי (412px, כותרת שבורה לשורות) ולא הדמיה צרה.
 * ‏reduced-motion מנטרל את חשיפת הגלילה (‎translateY(26px)‎ של data-reveal),
 * כדי שהמדידה תהיה גאומטריה יציבה ולא אמצע אנימציה.
 */
test('עוגני סרגל הקפיצה בעמוד המבחנים נוחתים מתחת לכותרת בכל רוחב (5.17)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const offenders: string[] = [];

  for (const width of [0, 360, 390]) {
    if (width) await page.setViewportSize({ width, height: 900 });
    await page.goto('/chativat-beynayim/mivchanim/');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

    // עוגן אמיתי מסרגל הקפיצה — היעד חייב להתקיים ב-DOM (לא רק ב-URL)
    const anchorId = await page.evaluate(() => {
      const link = document.querySelector<HTMLAnchorElement>('a[href^="#grade-"]');
      const id = link?.getAttribute('href')?.slice(1) ?? '';
      return id && document.getElementById(id) ? id : '';
    });
    expect(anchorId, 'סרגל הקפיצה חייב להצביע על מקטע קיים בעמוד').not.toBe('');

    await page.evaluate((id) => {
      location.hash = `#${id}`;
    }, anchorId);
    await page.waitForTimeout(250);

    const geometry = await page.evaluate((id) => {
      const header = document.querySelector<HTMLElement>('.site-header')!;
      const target = document.getElementById(id)!;
      return {
        headerHeight: Math.round(header.getBoundingClientRect().height),
        headerBottom: header.getBoundingClientRect().bottom,
        targetTop: target.getBoundingClientRect().top,
      };
    }, anchorId);

    if (!(geometry.targetTop >= geometry.headerBottom - 1)) {
      offenders.push(
        `${width || 'native'}px: ראש היעד #${anchorId} (${Math.round(geometry.targetTop)}px) נבלע מתחת לכותרת בגובה ${geometry.headerHeight}px`,
      );
    }
  }

  expect(offenders, `עוגן שנבלע מתחת לכותרת: ${offenders.join(' | ')}`).toHaveLength(0);
});
