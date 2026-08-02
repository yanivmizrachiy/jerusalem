import { test, expect } from '@playwright/test';

/** אינטראקציות הליבה — התנהגות אמיתית, לא הנחות (19.3) */

test('פס התאריך: גימטריה עברית ולועזי בלי אפסים מובילים (7.22)', async ({ page }) => {
  await page.goto('/');
  const he = page.locator('#date-he');
  const greg = page.locator('#date-greg');
  await expect(he).toHaveText(/^היום יום [א-ת]+, [א-ת]{1,3}[׳״][א-ת]? ב[א-ת"׳ ]+ ה[א-ת]+[״][א-ת]$/u, { timeout: 10_000 });
  await expect(greg).toHaveText(/^\d{1,2}\/\d{1,2}\/\d{2}$/);
});

test('הספירה לאחור אמיתית ומדויקת (7.20)', async ({ page }) => {
  await page.goto('/');
  const el = page.locator('[data-countdown]');
  await expect(el).toHaveText(/עוד \d+ ימים לפתיחת|מחר נפתחת|היום נפתחת|בעיצומה/, { timeout: 10_000 });
});

test('חוזר מפמ״ר: קפיצת MAF מעדכנת hash, סטטוס ו-iframe (9.3.11–9.3.12)', async ({ page }) => {
  await page.goto('/hozer-mafmar/');
  await page.locator('#MAF-13 [data-goto]').click();
  await expect(page).toHaveURL(/#MAF-13$/);
  await expect(page.locator('#viewer-status')).toContainText('עמודים 11–12');
  const src = await page.locator('#mafmar-frame').getAttribute('src');
  expect(src).toContain('#page=11');
});

test('MafmarRange: דפדוף כלוא לטווח המאומת', async ({ page }) => {
  await page.goto('/chativat-beynayim/kita-t/');
  const range = page.locator('#maf-04');
  await range.scrollIntoViewIfNeeded();
  const next = range.locator('[data-next]');
  const prev = range.locator('[data-prev]');
  await expect(prev).toBeDisabled();
  await next.click();
  await expect(range.locator('[data-ind]')).toHaveText(/עמוד 2 מתוך 2/);
  await expect(next).toBeDisabled();
});

test('נגן יחידה: החלפת משאב, hash עמוק ותווית סוג (יחידות ההוראה)', async ({ page }) => {
  await page.goto('/chativat-beynayim/hafifat-meshulashim/#TRI-013');
  await expect(page.locator('[data-status]')).toContainText('יישומון משפטי חפיפה');
  await page.locator('#TRI-005 [data-item]').click();
  await expect(page).toHaveURL(/#TRI-005$/);
  const src = await page.locator('[data-frame]').getAttribute('src');
  expect(src).toContain('youtube-nocookie.com/embed/');
  await expect(page.locator('[data-open]')).toHaveAttribute('href', /youtube\.com\/watch/);
});

test('כרטיסי צוות: קישורי WhatsApp ודוא״ל תקינים ונפרדים (7.16–7.18)', async ({ page }) => {
  await page.goto('/');
  const ayelet = page.locator('article', { hasText: 'איילת קריספין' });
  await expect(ayelet.locator('a[href="https://wa.me/972502721656"]')).toBeVisible();
  await expect(ayelet.locator('a[href="mailto:ayeletk59@gmail.com"]')).toBeVisible();
  await expect(ayelet.locator('a[href="tel:+972502721656"]')).toBeVisible();
});

test('ניווט פדגוגי: משוואות משולבת בשרשרת ז׳ (5.12)', async ({ page }) => {
  await page.goto('/chativat-beynayim/misparim-mechuvanim/');
  await expect(
    page.locator('.pager a', { hasText: 'הוראת משוואות ללא מספרים שליליים' })
  ).toBeVisible();
});
