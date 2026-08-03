import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/** נגישות אוטומטית — WCAG 2.2 AA (RULES 21.18) על העמודים המייצגים */
const pages = [
  '/',
  '/hozer-mafmar/',
  '/chativat-beynayim/',
  '/chativat-beynayim/hafifat-meshulashim/',
  '/chativa-elyona/bchinot/',
  '/luach/',
];

for (const route of pages) {
  test(`axe נקי (serious+critical): ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle').catch(() => {});
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      // תוכן מוטמע חיצוני אינו בשליטתנו (8.8)
      .exclude('iframe')
      .analyze();

    const severe = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    const detail = severe
      .map((v) => `${v.id}: ${v.nodes.length} nodes (${v.nodes[0]?.target})`)
      .join('\n');
    expect(severe, detail).toHaveLength(0);
  });
}
