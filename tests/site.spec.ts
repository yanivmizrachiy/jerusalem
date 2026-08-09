import { test, expect } from '@playwright/test';
// מקור יחיד למסלולי התאימות — הבדיקה נגזרת מאותו קובץ שמזין את astro.config
import { LEGACY_PATHS, LEGACY_REDIRECTS, trimSlash } from '../src/lib/legacyRedirects.mjs';

/**
 * אזהרת Chromium שאינה בשליטתנו, ולכן מסוננת במחרוזת המדויקת שלה בלבד.
 *
 * מקור: נגן YouTube בתוך ההטמעה (`www.youtube-nocookie.com/embed/...`) מנסה
 * לקרוא ל-Compute Pressure API. אנחנו **לא** מאצילים לו את ההרשאה — ה-iframe
 * נטען בלי `allow="compute-pressure"` — ולכן Chromium חוסם את הקריאה כמתוכנן
 * ורושם ל-console:
 *   `Permissions policy violation: compute-pressure is not allowed in this document.`
 *
 * כלומר ההודעה היא **הראיה שהמדיניות עובדת**, לא תקלה: החסימה הצליחה.
 * ‏`compute-pressure` אינו מופיע בשום מקום בקוד המוצר (אומת ב-`src/`,
 * ב-`public/` וב-`astro.config.mjs`).
 *
 * לא ניתן להסיר את ההודעה בלי לפגוע: הוספת `allow="compute-pressure"` הייתה
 * מעניקה לצד שלישי API של חיישני עומס — בניגוד ל-RULES 4.11 (`allow` מצומצם) —
 * והסרת ההטמעה הייתה מוחקת תוכן שסעיף 10 מחייב.
 *
 * הסינון מכוון למשפט המלא והמדויק בלבד. כל הפרת permissions-policy אחרת
 * (מצלמה, מיקום, מיקרופון) תמשיך להכשיל את הבדיקה כרגיל.
 */
const COMPUTE_PRESSURE_DENIED =
  'Permissions policy violation: compute-pressure is not allowed in this document.';

/** כל המסלולים החיים — אינווריאנטים מחייבים (1.3, 18, 19.14) */
const routes = [
  '/',
  '/shearim/',
  '/hozer-mafmar/',
  '/chativat-beynayim/',
  '/chativat-beynayim/kita-z/',
  '/chativat-beynayim/kita-h/',
  '/chativat-beynayim/kita-t/',
  '/chativat-beynayim/kita-z/chomarim/',
  '/chativat-beynayim/kita-h/chomarim/',
  '/chativat-beynayim/kita-t/chomarim/',
  '/chativat-beynayim/mivchanim/',
  '/chativat-beynayim/nose/z/tichnun/',
  '/chativat-beynayim/nose/h/hozer/',
  '/chativat-beynayim/nose/t/yahal4/',
  '/chativat-beynayim/nose/z/noschaot/',
  '/chativat-beynayim/mishvaot/',
  '/chativat-beynayim/hafifat-meshulashim/',
  '/chativa-elyona/',
  '/chativa-elyona/3-yahal/',
  '/chativa-elyona/4-yahal/',
  '/chativa-elyona/5-yahal/',
  '/chativa-elyona/bchinot/',
  '/chativa-elyona/homrei-horaa/',
  '/pituach-miktzoi/',
  '/pituach-miktzoi/ai-geometria/',
  '/hodaot/',
  '/israel-realit/',
  '/luach/',
  '/chativat-beynayim/reader/z/maf-02/',
  '/chativat-beynayim/reader/t/mifrat-tnufa/',
];

for (const route of routes) {
  test(`עמוד תקין: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    const resp = await page.goto(route);
    expect(resp?.status()).toBe(200);

    await expect(page.locator('html')).toHaveAttribute('lang', 'he');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page).toHaveTitle(/מחוז ירושלים/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();

    // אפס גלילה אופקית (5.8, חוזה הרספונסיביות).
    // המדידה נלקחת רק אחרי שהגופנים נטענו ואחרי פריים ציור אחד: גופן
    // התצוגה מחליף מידות טקסט אחרי load, ומדידה מיידית נתנה כשל מהבהב
    // (נמדד 09/08/2026 — retries=0 הופך הבהוב כזה לחסימת מיזוג אקראית).
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, 'גלילה אופקית אסורה').toBeLessThanOrEqual(1);

    // אפס שגיאות console (4.5).
    // מסוננות אך ורק תקלות של מקורות **חיצוניים**: ב-headless מקורות צד
    // שלישי נחסמים, וזה בדיוק התרחיש שה-fallback שלנו מטפל בו (8.8).
    // כשל טעינה של נכס משלנו (127.0.0.1) **אינו** מסונן — סינון גורף של
    // "Failed to load resource" הסתיר עד היום גם 404 של נכס ראשוני.
    const isFirstParty = (e: string) => /127\.0\.0\.1|localhost/.test(e);
    const hard = errors.filter((e) => {
      if (e.includes(COMPUTE_PRESSURE_DENIED)) return false;
      if (/third-party cookie/i.test(e)) return false;
      if (/net::|Failed to load resource/i.test(e)) return isFirstParty(e);
      if (/Refused to display|violates the following Content Security Policy/.test(e)) {
        return isFirstParty(e);
      }
      return true;
    });
    expect(hard, `שגיאות console: ${hard.join(' | ')}`).toHaveLength(0);
  });
}

// המשחקים המרוכזים הוחלפו בפרק בתוך עמודי הכיתות (1.10, 3.29, 3.31);
// הכתובת הישנה נשארת חיה ומפנה מיידית לפרק הקנוני.
// מאגר המבחנים, לעומת זאת, הוא כעת עמוד מרכזי אמיתי ולכן **אינו** ברשימה
// הזו — הוא נאכף כ-hub בבדיקה נפרדת ואסור שיהפוך להפניה.
const moved: Record<string, string> = {
  '/chativat-beynayim/mischakim/': '/chativat-beynayim/nose/z/mischakim/',
};
for (const [old, target] of Object.entries(moved)) {
  test(`הפניה לעמוד הנושא: ${old}`, async ({ page }) => {
    await page.goto(old);
    await page.waitForURL((u) => u.pathname === target, { timeout: 10_000 });
    await expect(page.locator('h1.chapter-title')).toBeVisible();
    expect(await page.locator('a.rcard').count()).toBeGreaterThan(0);
  });
}

/**
 * מסלולי התאימות (src/lib/legacyRedirects.mjs) הם היום הפניית HTTP אמיתית
 * שנפלטת לשכבת הניתוב של Vercel, ולא עמוד 200 עם meta-refresh.
 *
 * שרת הקבצים הסטטי של הסוללה אינו מכיר את שכבת הניתוב, ולכן ה-301 עצמו
 * מאומת מול הפרודקשן ב-scripts/verify-deploy.mjs. כאן נאכף מה שכן ניתן
 * להוכיח מקומית, ושתי הבדיקות האלה הן שתופסות נסיגה חזרה ל-meta-refresh:
 * שאין יותר עמוד תוכן בכתובת הישנה, ושהיעד עצמו חי ואמיתי.
 */
for (const [legacy, target] of Object.entries(LEGACY_REDIRECTS)) {
  test(`מסלול תאימות אינו עמוד 200: ${legacy}`, async ({ page }) => {
    const res = await page.request.fetch(legacy, { redirect: 'manual' });
    expect(
      res.status(),
      `${legacy} עדיין מוגש כעמוד — ההפניה חזרה להיות meta-refresh`,
    ).toBe(404);
  });

  test(`יעד מסלול התאימות חי: ${legacy} → ${target}`, async ({ page }) => {
    const res = await page.goto(target);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  });
}

test('מסלולי התאימות אינם מתפרסמים כעמודים קנוניים ב-sitemap (18)', async ({ page }) => {
  const index = await (await page.request.fetch('/sitemap-index.xml')).text();
  const files = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(files.length).toBeGreaterThan(0);

  const urls: string[] = [];
  for (const file of files) {
    const xml = await (await page.request.fetch(new URL(file).pathname)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  expect(urls.length).toBeGreaterThan(0);

  const leaked = urls.filter((url) => LEGACY_PATHS.has(trimSlash(new URL(url).pathname) + '/'));
  expect(leaked, `כתובות שרק מפנות דלפו ל-sitemap: ${leaked.join(', ')}`).toHaveLength(0);
});
