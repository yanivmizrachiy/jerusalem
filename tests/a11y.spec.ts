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
  test(`axe נקי (serious+critical): ${route}`, async ({ page }) => {
    // סריקת axe מלאה על עמוד עשיר (למשל יחידת חפיפת המשולשים, 26 משאבים)
    // חוצה את תקרת 45 השניות תחת ריצה מקבילה, בעוד סולו היא ~9 שניות.
    // ‏retries=0 הוא חלק מחוזה האיכות, ולכן מרחיבים תקציב ולא מחזירים ניסיונות.
    test.slow();
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

    // ‏moderate/minor אינם חוסמים (הסף המתועד הוא serious+critical), אבל עד
    // כה הם נזרקו בשקט ולכן היו בלתי נראים לגמרי. מעכשיו הם מודפסים.
    const lesser = results.violations.filter(
      (v) => v.impact !== 'critical' && v.impact !== 'serious'
    );
    if (lesser.length) {
      console.log(
        `· ${route} — ${lesser.length} הפרות moderate/minor (מדווח, אינו חוסם): ` +
          lesser.map((v) => `${v.id}×${v.nodes.length}`).join(', '),
      );
    }

    const detail = severe
      .map((v) => `${v.id}: ${v.nodes.length} nodes (${v.nodes[0]?.target})`)
      .join('\n');
    expect(severe, detail).toHaveLength(0);
  });
}

/**
 * ‏axe מקבל `.exclude('iframe')` כי תוכן מוטמע חיצוני אינו בשליטתנו (8.8) —
 * אבל ההחרגה מוציאה גם את **אלמנט** ה-iframe עצמו, שהוא כן שלנו. כך
 * הפרה אמיתית של WCAG 4.1.2 (מסגרת בלי שם נגיש) לא הייתה נתפסת לעולם.
 * הבדיקה הזו סוגרת בדיוק את הפער הזה.
 */
const embedPages = [
  '/chativat-beynayim/reader/t/sheelot-t/',
  '/chativat-beynayim/reader/z/misparim/',
  '/hozer-mafmar/',
];

for (const route of embedPages) {
  test(`לכל iframe שלנו יש שם נגיש: ${route}`, async ({ page }) => {
    await page.goto(route);
    const nameless = await page.locator('iframe').evaluateAll((frames) =>
      frames
        .filter((f) => {
          const el = f as HTMLIFrameElement;
          if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return false;
          const name = el.getAttribute('title') || el.getAttribute('aria-label');
          return !name || !name.trim();
        })
        .map((f) => (f as HTMLIFrameElement).getAttribute('data-esrc') ?? f.outerHTML.slice(0, 80)),
    );
    expect(nameless, `מסגרות בלי title/aria-label: ${nameless.join(' | ')}`).toHaveLength(0);
  });
}
