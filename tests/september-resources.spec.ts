import { expect, test } from '@playwright/test';
import { MONTHLY_DOC_LABEL, choveret, gradeMainDocs } from '../src/data/choveret';
import { canonicalReaderItems } from '../src/data/canonical-content';
import { authorsForResource } from '../src/data/authors';

/**
 * פריסות ספטמבר (הוראת יניב, 09/08/2026): שלושה משאבים קנוניים של עידן
 * אחוון — אחד לכל שכבה — במיפוי קשיח שאסור להתהפך: ז׳→7th, ח׳→8th, ט׳→9th.
 * הקרדיט המוצג: "עידן אחוון — מדריך בית ספרי בעיר ירושלים" בלבד; שם נוסף
 * המופיע באתר החיצוני אינו מוצג בתצוגת המשאב שלנו. אתרי my.canva.site
 * חוסמים מסגור (X-Frame-Options: SAMEORIGIN — נמדד 09/08/2026, 24.4.1),
 * ולכן עמוד המשאב מציג כרטיס פתיחה אמיתי, לא iframe.
 */

const SEPTEMBER = [
  { slug: 'z', id: 'prisa-september-z', url: 'https://idanahvan.my.canva.site/9-26-7th-grade' },
  { slug: 'h', id: 'prisa-september-h', url: 'https://idanahvan.my.canva.site/9-26-8th-grade' },
  { slug: 't', id: 'prisa-september-t', url: 'https://idanahvan.my.canva.site/9-26-9th-grade' },
] as const;

const readerHref = (slug: string, id: string) => `/chativat-beynayim/reader/${slug}/${id}/`;

test.describe('חוזה הנתונים — מיפוי, ייחוד וייחוס', () => {
  test.skip(({ isMobile }) => isMobile === true, 'data contract is device-independent');

  test('המיפוי שכבה→כתובת מדויק ואינו מתהפך', () => {
    for (const { slug, id, url } of SEPTEMBER) {
      const grade = choveret.find((entry) => entry.slug === slug)!;
      const { monthly } = gradeMainDocs(grade);
      expect(monthly, `${slug}: לפריסה החודשית יש פריט`).toBeTruthy();
      expect(monthly!.item.id, `${slug}: המזהה הקנוני`).toBe(id);
      expect(monthly!.item.url, `${slug}: הכתובת המדויקת — בלי היסק מסדר מערך`).toBe(url);
      expect(monthly!.item.embed, `${slug}: אין embed — המקור חוסם מסגור`).toBeUndefined();
      expect(monthly!.item.download, `${slug}: אין קובץ הורדה — אסור כפתור הורדה מזויף`).toBeUndefined();
    }
  });

  test('כל משאב ספטמבר מופיע פעם אחת בלבד בקטלוג הציבורי', () => {
    for (const { slug, id } of SEPTEMBER) {
      const appearances = canonicalReaderItems.filter((entry) => entry.item.id === id);
      expect(appearances, `${id}: הופעה קנונית אחת`).toHaveLength(1);
      expect(appearances[0].grade.slug, `${id}: בשכבה הנכונה בלבד`).toBe(slug);
    }
  });

  test('הייחוס: עידן אחוון, מדריך בית ספרי בעיר ירושלים — לכל שלושת המשאבים', () => {
    for (const { id } of SEPTEMBER) {
      const authors = authorsForResource(id);
      expect(authors, `${id}: יוצר אחד`).toHaveLength(1);
      expect(authors[0].name).toBe('עידן אחוון');
      expect(authors[0].role).toBe('מדריך בית ספרי בעיר ירושלים');
      expect(authors[0].kind).toBe('person');
    }
  });
});

for (const { slug, id, url } of SEPTEMBER) {
  test(`עמוד ספטמבר ${slug}: כרטיס פתיחה אמיתי, פעולות אמת, קרדיט נכון בלבד`, async ({ page }) => {
    await page.goto(readerHref(slug, id));

    // כרטיס פתיחה במקום iframe — המקור חוסם מסגור (8.8)
    const openCard = page.locator('.res-view .res-open-card');
    await expect(openCard, 'כרטיס הפתיחה מוצג').toBeVisible();
    await expect(openCard.locator(`a[href="${url}"]`), 'כפתור פתיחה אמיתי ליעד המדויק').toHaveCount(1);
    await expect(page.locator('.res-view iframe'), 'אין iframe ריק').toHaveCount(0);

    // לוח הפעולות לפי היכולת האמיתית (8.4, 8.27)
    await expect(page.locator('.orbs a[href^="https://wa.me/"]')).toHaveCount(1);
    await expect(page.locator('.orbs a[href^="mailto:"]')).toHaveCount(1);
    await expect(page.locator('.orbs [data-copy]')).toHaveCount(1);
    const externalHrefs = await page
      .locator('.orbs a[target="_blank"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(externalHrefs.some((href) => href === url), 'פתיחה במקור — היעד המדויק').toBe(true);
    await expect(page.locator('.orbs a[download]'), 'אין הורדה מזויפת (8.18)').toHaveCount(0);

    // הקרדיט המוצג — עידן אחוון בלבד, עם התפקיד המדויק
    const attribution = page.locator('.res-panel .author-attribution');
    await expect(attribution).toContainText('עידן אחוון');
    await expect(attribution).toContainText('מדריך בית ספרי בעיר ירושלים');

    // הקביעה השלילית ממוקדת בתצוגת המשאב עצמה: הכותרת העליונה של האתר
    // נושאת כדין את שם מובילת התחום (7.22), ולכן הבדיקה אינה סורקת את
    // העמוד כולו אלא את לוח המשאב ואת אזור ההטמעה בלבד.
    for (const scope of ['.res-panel', '.res-view'] as const) {
      const text = (await page.locator(scope).innerText()).replace(/\s+/g, ' ');
      expect(text, `${scope}: ללא קרדיט נוסף בתצוגת המשאב`).not.toContain('קריספין');
      expect(text, `${scope}: ללא איות חלופי`).not.toContain('קירספין');
    }

    // ניווט: חזרה אמיתית לאזור "מה אנחנו מלמדים?" של השכבה — אין מבוי סתום
    await expect(page.locator('.res-back')).toHaveAttribute(
      'href',
      `/chativat-beynayim/kita-${slug}/#ma-melamdim`
    );
  });
}

test('כפתור "רגע לפני — ספטמבר" מופיע בעמוד כל שכבה ומוביל לפריט שלה', async ({ page }) => {
  for (const { slug, id } of SEPTEMBER) {
    await page.goto(`/chativat-beynayim/kita-${slug}/`);
    const button = page.locator('[data-main-monthly]');
    await expect(button, `${slug}: כפתור החודש קיים`).toHaveCount(1);
    await expect(button).toContainText(MONTHLY_DOC_LABEL);
    await expect(button).toHaveAttribute('href', readerHref(slug, id));
    const box = (await button.boundingBox())!;
    expect(box.height, `${slug}: מטרת מגע תקינה`).toBeGreaterThanOrEqual(44);
  }
});

test('בנייד: כפתור ספטמבר נגיש וכרטיס הפתיחה שמיש', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'חוזה נייד — רץ בפרופיל Pixel 7 בלבד (24.2.4)');

  await page.goto('/chativat-beynayim/kita-z/');
  const button = page.locator('[data-main-monthly]');
  await expect(button).toBeVisible();
  const box = (await button.boundingBox())!;
  expect(box.height, 'מטרת מגע ≥44px בנייד').toBeGreaterThanOrEqual(44);

  await page.goto(readerHref('z', 'prisa-september-z'));
  const open = page.locator('.res-view .res-open-card a.btn');
  await expect(open).toBeVisible();
  const openBox = (await open.boundingBox())!;
  expect(openBox.height, 'כפתור הפתיחה נגיש למגע').toBeGreaterThanOrEqual(44);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow, 'אין גלילה אופקית').toBeLessThanOrEqual(1);
});
