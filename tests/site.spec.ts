import { test, expect } from '@playwright/test';

/**
 * אזהרת Chromium שאינה בשליטתנו, ולכן מסוננת במחרוזת המדויקת שלה בלבד.
 *
 * מקור: נגן YouTube בתוך ההטמעה (`www.youtube-nocookie.com/embed/...`) מנסה
 * לקרוא ל-Compute Pressure API. אנחנו **לא** מאצילים לו את ההרשאה — ה-iframe
 * נטען בלי `allow="compute-pressure"` — ולכן Chromium חוסם את הקריאה כמתוכנן
 * ורושם ל-console:
 *   `Permissions policy violation: compute-pressure is not allowed in this document.`
 */
const COMPUTE_PRESSURE_DENIED =
  'Permissions policy violation: compute-pressure is not allowed in this document.';

/** מסלולים שמחזירים עמוד HTML קנוני ב-200. כתובות legacy נבדקות בנפרד כ-301. */
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
    const internalRequestFailures: string[] = [];

    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('requestfailed', (request) => {
      const url = new URL(request.url());
      if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
        internalRequestFailures.push(
          `${request.method()} ${url.pathname}: ${request.failure()?.errorText ?? 'request failed'}`
        );
      }
    });

    const resp = await page.goto(route);
    expect(resp?.status()).toBe(200);

    await expect(page.locator('html')).toHaveAttribute('lang', 'he');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page).toHaveTitle(/מחוז ירושלים/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, 'גלילה אופקית אסורה').toBeLessThanOrEqual(1);

    // console של iframe חיצוני עשוי לדווח על חסימות רשת; כשל פנימי אינו יכול
    // להסתתר כאן כי requestfailed של localhost/127.0.0.1 נאכף בנפרד למעלה.
    const hard = errors.filter(
      (e) =>
        !/net::|Failed to load resource|third-party cookie/i.test(e) &&
        !e.includes(COMPUTE_PRESSURE_DENIED) &&
        !(
          /Refused to display|violates the following Content Security Policy/.test(e) &&
          !/127\.0\.0\.1|localhost/.test(e)
        )
    );
    expect(hard, `שגיאות console: ${hard.join(' | ')}`).toHaveLength(0);
    expect(
      internalRequestFailures,
      `נכסי אתר פנימיים שנכשלו: ${internalRequestFailures.join(' | ')}`
    ).toHaveLength(0);
  });
}

/** כתובות legacy חייבות להיות redirect HTTP אמיתי, לא 200 + meta refresh. */
const moved: Record<string, string> = {
  '/chativat-beynayim/mivchanim/': '/chativat-beynayim/nose/h/mivchanim/',
  '/chativat-beynayim/mischakim/': '/chativat-beynayim/nose/z/mischakim/',
  '/chativat-beynayim/misparim-mechuvanim/': '/chativat-beynayim/reader/z/misparim/',
  '/chativat-beynayim/zaviyot/': '/chativat-beynayim/reader/z/zaviyot/',
  '/chativat-beynayim/maarechet-tzirim/': '/chativat-beynayim/reader/z/tzirim/',
};

for (const [old, target] of Object.entries(moved)) {
  test(`HTTP 301 לכתובת הקנונית: ${old}`, async ({ request }) => {
    const response = await request.get(old, { maxRedirects: 0 });
    expect(response.status()).toBe(301);

    const location = response.headers()['location'];
    expect(location, `${old}: חסר Location`).toBeTruthy();
    expect(new URL(location!, 'http://localhost').pathname).toBe(target);

    const targetResponse = await request.get(target);
    expect(targetResponse.status(), `${target}: יעד ההפניה חייב להיות חי`).toBe(200);
  });
}
