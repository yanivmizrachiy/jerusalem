import { test, expect } from '@playwright/test';

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
  '/chativat-beynayim/misparim-mechuvanim/',
  '/chativat-beynayim/zaviyot/',
  '/chativat-beynayim/maarechet-tzirim/',
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
  '/chativat-beynayim/klali/',
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

    // אפס גלילה אופקית (5.8, חוזה הרספונסיביות)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, 'גלילה אופקית אסורה').toBeLessThanOrEqual(1);

    // אפס שגיאות console (4.5). מסוננות: תקלות טעינה של מקורות חיצוניים ב-headless
    // וחסימת iframe על ידי אתר חיצוני — התרחיש שה-fallback שלנו מטפל בו (8.8).
    const hard = errors.filter(
      (e) =>
        !/net::|Failed to load resource|third-party cookie/i.test(e) &&
        !(
          /Refused to display|violates the following Content Security Policy/.test(e) &&
          !/127\.0\.0\.1|localhost/.test(e)
        )
    );
    expect(hard, `שגיאות console: ${hard.join(' | ')}`).toHaveLength(0);
  });
}

// העמודים המרוכזים של מבחנים ומשחקים הוחלפו בפרקים שבעמוד "משותף לכל
// השכבות" (1.10, 3.29); הכתובות הישנות נשארות חיות ומפנות מיידית לפרק
// הנכון — קישורים ששותפו לא נשברים
const moved: Record<string, string> = {
  '/chativat-beynayim/mivchanim/': '#meitzav',
  '/chativat-beynayim/mischakim/': '#mischakim',
};
for (const [old, hash] of Object.entries(moved)) {
  test(`הפניה לעמוד המשותף: ${old}`, async ({ page }) => {
    await page.goto(old);
    await page.waitForURL((u) => u.pathname === '/chativat-beynayim/klali/', { timeout: 10_000 });
    expect(new URL(page.url()).hash).toBe(hash);
    // הפרק שאליו הופנינו באמת קיים בעמוד
    await expect(page.locator(`section.chapter${hash}`)).toHaveCount(1);
  });
}
