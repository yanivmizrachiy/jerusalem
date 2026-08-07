import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** נגישות אוטומטית — WCAG 2.2 AA (RULES 21.18) על העמודים המייצגים */
const pages = [
  '/',
  '/shearim/',
  '/hozer-mafmar/',
  '/chativat-beynayim/',
  '/chativat-beynayim/kita-z/',
  '/chativat-beynayim/kita-z/chomarim/',
  '/chativat-beynayim/reader/t/sheelot-t/',
  '/chativat-beynayim/hafifat-meshulashim/',
  '/chativa-elyona/bchinot/',
  '/luach/',
];

for (const route of pages) {
  test(`axe נקי לפי WCAG 2.2 AA: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle').catch(() => {});
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      // תוכן מוטמע חיצוני אינו בשליטתנו (8.8)
      .exclude('iframe')
      .analyze();

    // WCAG conformance נקבע לפי הכלל שנכשל, לא לפי דירוג impact של axe.
    // לכן כל violation תחת תגיות ה-AA שבחרנו הוא כשל build, גם אם impact=moderate/minor.
    const detail = results.violations
      .map((v) => `${v.id} [${v.impact ?? 'unknown'}]: ${v.nodes.length} nodes (${v.nodes[0]?.target})`)
      .join('\n');
    expect(results.violations, detail).toHaveLength(0);
  });
}
