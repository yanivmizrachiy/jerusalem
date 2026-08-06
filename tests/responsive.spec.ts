import { test, expect } from '@playwright/test';

/**
 * חוק הברזל של הרספונסיביות (RULES 19.32): מטריצת מכשירים אמיתית —
 * אפס גלילה אופקית, ניווט לחיץ במידות מגע, תוכן נראה, הטמעה בגבולות המסך.
 */
const viewports = [
  { name: 'mobile-360', width: 360, height: 740 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
];

const pages = ['/', '/shearim/', '/luach/', '/chativat-beynayim/', '/hozer-mafmar/', '/chativa-elyona/bchinot/'];

for (const vp of viewports) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const route of pages) {
      test(`רספונסיבי: ${route}`, async ({ page }) => {
        await page.goto(route);
        // בעמוד הבית הניווט והפס נחשפים רק אחרי שתמונת הפתיחה נעלמה (6.3)
        await page.evaluate(() => document.documentElement.classList.add('hero-done'));

        // אפס גלילה אופקית
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, 'גלילה אופקית').toBeLessThanOrEqual(1);

        // ניווט ראשי: כל קישור נראה ובמידת מגע תקינה
        const navLinks = page.locator('header nav a');
        const count = await navLinks.count();
        expect(count).toBeGreaterThanOrEqual(5);
        for (let i = 0; i < count; i++) {
          const box = await navLinks.nth(i).boundingBox();
          expect(box, `קישור ניווט ${i} נראה`).toBeTruthy();
          expect(box!.height, `מטרת מגע בקישור ${i}`).toBeGreaterThanOrEqual(44);
        }

        // תוכן מרכזי ופס עליון נראים
        await expect(page.locator('main')).toBeVisible();
        await expect(page.locator('.datebar')).toBeVisible();

        // ההטמעה הדומיננטית אינה חורגת מהמסך
        const frame = page.locator('.mam-frame, .viewer-shell, .cal-wrap').first();
        if (await frame.count()) {
          const fb = await frame.boundingBox();
          if (fb) expect(fb.width, 'הטמעה בגבולות המסך').toBeLessThanOrEqual(vp.width + 1);
        }
      });
    }
  });
}
