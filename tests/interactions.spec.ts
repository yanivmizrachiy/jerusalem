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
  await page.goto('/chativat-beynayim/reader/t/maf-04/');
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

test('אחרי הסרטון מופיע צוות ההדרכה — לא תוכן אחר (6.5)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); // מדלג ישר למצב הסיום
  await page.goto('/');
  const after = page.locator('#hero-after');
  await expect(after.locator('h1')).toHaveText('צוות הדרכה');
  for (const name of ['איילת קריספין', 'ויקטוריה צורי', 'אורלי לוין', 'יניב רז']) {
    await expect(after.locator('.hero-name', { hasText: name })).toBeVisible();
  }
  await expect(after.locator('img.hero-avatar')).toHaveCount(4);
});

test('כרטיסי צוות: קישורי WhatsApp ודוא״ל תקינים ונפרדים (7.16–7.18)', async ({ page }) => {
  // הפרטים נחשפים רק בעוגן אישי — אין כפילות צוות בעמוד (הוראת 03/08/2026)
  await page.goto('/');
  await expect(page.locator('[data-team-details]')).toBeHidden();
  await page.goto('/#tzevet-ayelet');
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

test('כפתורי WhatsApp אמיתיים: כל כפתור מוביל ישירות למספר הנכון (7.16)', async ({ page }) => {
  const { team } = await import('../src/data/team');
  const { whatsappCommunity } = await import('../src/data/resources');

  await page.goto('/');
  for (const m of team) {
    await expect(
      page.locator(`#tzevet a.btn-whatsapp[href="https://wa.me/${m.phoneIntl}"]`),
      `כפתור WhatsApp של ${m.name}`
    ).toHaveCount(1);
  }
  // "מה צפוי?": הלוגו העגול + כיתוב ירוק יחיד — שניהם ישירות לקבוצה (7.20)
  await expect(page.locator(`.rail a[href="${whatsappCommunity.url}"]`)).toHaveCount(2);
  // רצועת ההצטרפות בתחתית העמוד — כולה קישור אחד ישירות לקבוצה, עם הכיתובים (7.27)
  const band = page.locator(`a.wa-band[href="${whatsappCommunity.url}"]`);
  await expect(band).toHaveCount(1);
  await expect(band.locator('.wa-band-title')).toHaveText('הצטרפו לקבוצת המורים בווטסאפ');
  await expect(band.locator('.wa-band-sub')).toContainText('קבוצה של מורים למתמטיקה בחטיבת הביניים');
  // הכפתורים האישיים של יניב רז — פייסבוק והאתר האישי (7.25–7.26)
  const yaniv = team.find((m) => m.facebook)!;
  await expect(page.locator(`#tzevet a.btn-facebook[href="${yaniv.facebook}"]`)).toHaveCount(1);
  await expect(page.locator(`#tzevet a.btn-site[href="${yaniv.website}"]`)).toHaveCount(1);
  // עוגן אישי: המסך הפותח מקשר לכרטיס של כל חבר צוות, לא לראש הרשימה (6.5)
  for (const m of team) {
    await expect(page.locator(`.hero-after a[href="#tzevet-${m.slug}"]`)).toHaveCount(1);
    await expect(page.locator(`article#tzevet-${m.slug}`)).toHaveCount(1);
  }

  await page.goto('/chativat-beynayim/');
  await expect(page.locator(`a[href="${whatsappCommunity.url}"]`)).toHaveCount(1);
});
