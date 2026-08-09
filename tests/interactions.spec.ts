import { test, expect } from '@playwright/test';
import { LEGACY_REDIRECTS } from '../src/lib/legacyRedirects.mjs';

/** אינטראקציות הליבה — התנהגות אמיתית, לא הנחות (19.3) */

test('פס התאריך: גימטריה עברית ולועזי בלי אפסים מובילים (7.22)', async ({ page }) => {
  await page.goto('/');
  const he = page.locator('#date-he');
  const greg = page.locator('#date-greg');
  await expect(he).toHaveText(/^היום יום [א-ת]+, [א-ת]{1,3}[׳״][א-ת]? ב[א-ת"׳ ]+ ה[א-ת]+[״][א-ת]$/u, { timeout: 10_000 });
  await expect(greg).toHaveText(/^\d{1,2}\/\d{1,2}\/\d{2}$/);
});

test('הספירה לאחור אמיתית ומדויקת (7.20)', async ({ page }) => {
  const opening = Date.UTC(2026, 8, 1);
  const dayInJerusalem = (d: Date) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jerusalem',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .formatToParts(d)
        .map((x) => [x.type, x.value])
    );
    return Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day));
  };
  const days = Math.round((opening - dayInJerusalem(new Date())) / 86_400_000);
  const expected =
    days > 1
      ? `עוד ${days} ימים לפתיחת שנת הלימודים תשפ״ז`
      : days === 1
        ? 'מחר נפתחת שנת הלימודים תשפ״ז!'
        : days === 0
          ? 'היום נפתחת שנת הלימודים תשפ״ז — בהצלחה!'
          : 'שנת הלימודים תשפ״ז בעיצומה — בהצלחה!';

  await page.goto('/');
  await expect(page.locator('[data-countdown]')).toHaveText(expected, { timeout: 10_000 });
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

test('חפיפת משולשים: כתובת legacy מגיעה לנושא הקנוני בלי עמוד ייעודי', async ({ page }) => {
  // הכתובת הישנה היא היום הפניית HTTP אמיתית ולא עמוד עם meta-refresh, ולכן
  // מקומית נאכף שאין בה עוד עמוד; ההפניה עצמה מאומתת מול הפרודקשן
  // ב-scripts/verify-deploy.mjs, שנגזר מאותו מקור תאימות.
  expect(LEGACY_REDIRECTS['/chativat-beynayim/hafifat-meshulashim/']).toBe(
    '/chativat-beynayim/nose/h/h-congruent/'
  );
  expect((await page.request.fetch('/chativat-beynayim/hafifat-meshulashim/', { redirect: 'manual' })).status()).toBe(404);

  await page.goto('/chativat-beynayim/nose/h/h-congruent/');
  await expect(page.locator('h1.chapter-title')).toContainText('חפיפת משולשים');
  expect(await page.locator('a.rcard').count()).toBeGreaterThan(0);
  await expect(page.locator('.uplay-viewer')).toHaveCount(0);
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

test('משוואות: כתובת legacy מגיעה לנושא הקנוני וכל חומרי היחידה נשמרים', async ({ page }) => {
  expect(LEGACY_REDIRECTS['/chativat-beynayim/mishvaot/']).toBe('/chativat-beynayim/nose/z/z-equations/');
  expect((await page.request.fetch('/chativat-beynayim/mishvaot/', { redirect: 'manual' })).status()).toBe(404);

  await page.goto('/chativat-beynayim/nose/z/z-equations/');
  await expect(page.locator('h1.chapter-title')).toContainText('משוואות');
  expect(await page.locator('a.rcard').count()).toBeGreaterThan(0);
  await expect(page.locator('.uplay-viewer')).toHaveCount(0);
  await expect(page.locator('a[data-to-topics]')).toBeVisible();
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
  await page.evaluate(() => document.documentElement.classList.add('hero-done'));
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
