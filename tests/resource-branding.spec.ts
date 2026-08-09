import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { brandForResource, brandedResourceIds } from '../src/data/resource-branding';
import { canonicalReaderItems } from '../src/data/canonical-content';
import { isAttributionPending } from '../src/data/attribution';

/**
 * מיתוג משאב (הוראת יניב, 09/08/2026): לוגו המודל מוצג אך ורק במשאבים
 * שממופים במפורש, ולעולם לא לפי היסק מכותרת.
 *
 * החוזה זהה בכל מכשיר; בדיקה אחת בדסקטופ מספיקה.
 */
test.skip(({ isMobile }) => isMobile === true, 'branding contract is device-independent');

const MOODLE_IDS = ['moodle-guide', 'moodle-slides'] as const;
const ALT = 'לוגו מודל מתמטיקה לחטיבת הביניים';
const ASSET = 'public/media/brands/moodle-logo.png';

const readerHref = (grade: string, id: string) => `/chativat-beynayim/reader/${grade}/${id}/`;

/** כל משאב ציבורי פעם אחת, עם השכבה שבה הוא מוגש. */
const publicResources = (() => {
  const seen = new Map<string, { id: string; title: string; grade: string }>();
  for (const { grade, item } of canonicalReaderItems) {
    if (!seen.has(item.id)) seen.set(item.id, { id: item.id, title: item.title, grade: grade.slug });
  }
  return [...seen.values()];
})();

test('המיפוי מפורש ומכסה בדיוק את משאבי המודל', () => {
  expect([...brandedResourceIds].sort()).toEqual([...MOODLE_IDS].sort());

  for (const id of MOODLE_IDS) {
    const brand = brandForResource(id);
    expect(brand, `${id} ממופה`).toBeTruthy();
    expect(brand!.id).toBe('moodle');
    expect(brand!.src).toBe('/media/brands/moodle-logo.png');
    expect(brand!.alt, 'הטקסט החלופי בדיוק כפי שנקבע').toBe(ALT);
  }
});

test('הנכס קיים והמידות המוצהרות תואמות את הקובץ — היחס אמיתי', () => {
  expect(existsSync(ASSET), `${ASSET} קיים בריפו`).toBe(true);

  // קריאת IHDR של ה-PNG: חתימה 8 בייטים, אורך 4, 'IHDR' 4, ואז רוחב וגובה
  const bytes = readFileSync(ASSET);
  expect(bytes.subarray(12, 16).toString('ascii'), 'קובץ PNG תקין').toBe('IHDR');
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);

  const brand = brandForResource('moodle-guide')!;
  expect(width, 'הרוחב המוצהר הוא הרוחב האמיתי').toBe(brand.width);
  expect(height, 'הגובה המוצהר הוא הגובה האמיתי').toBe(brand.height);

  // נכס מיתוג חייב להישאר קל — הוא משני בעמוד
  expect(bytes.length, 'הנכס אינו כבד').toBeLessThan(120_000);
});

test('אין היסק לפי כותרת: משאב ציבורי שכותרתו כוללת "מודל" אינו ממותג', async ({ page }) => {
  // משאבים שכותרתם נראית כמו סביבת המודל אך הם **אינם** ממופים. זה בדיוק
  // ההבדל שהחוזה שומר: כותרת תואמת אינה מספיקה, רק מיפוי מפורש מספיק.
  // (הסינון הוא מול רשימת המיפוי, לא מול תוצאת `brandForResource` — אחרת
  // הבדיקה הייתה מעגלית ועוברת מאליה.)
  const mapped = new Set(brandedResourceIds);
  const lookalikes = publicResources.filter(
    (resource) => /מודל/.test(resource.title) && !mapped.has(resource.id)
  );

  // הבדיקה חייבת להיות אמיתית: אם אין בקטלוג מקרי-דמיון, אין כאן מה להוכיח
  expect(
    lookalikes.length,
    'קיימים משאבים ציבוריים שכותרתם כוללת "מודל" — הם המקרה שהמיפוי המפורש מונע'
  ).toBeGreaterThan(0);

  for (const resource of lookalikes) {
    expect(
      brandForResource(resource.id),
      `${resource.id} ("${resource.title}") אינו ממופה ולכן אינו מקבל לוגו`
    ).toBeUndefined();

    await page.goto(readerHref(resource.grade, resource.id));
    await expect(
      page.locator('[data-resource-brand]'),
      `${resource.id}: אין לוגו מיתוג בעמוד`
    ).toHaveCount(0);
  }
});

test('כל מזהה ממופה מטופל: ציבורי מציג לוגו, ובהסגר אין לו עמוד ציבורי', async ({ page }) => {
  const publicIds = new Set(publicResources.map((resource) => resource.id));
  const published = brandedResourceIds.filter((id) => publicIds.has(id));
  const quarantined = brandedResourceIds.filter((id) => isAttributionPending(id));

  // אין מזהה ממופה שנופל בין הכיסאות — כל אחד נבדק באחד משני המסלולים
  expect(
    [...published, ...quarantined].sort(),
    'כל מזהה ממופה הוא או ציבורי או בהסגר — אין מזהה שלא נבדק'
  ).toEqual([...brandedResourceIds].sort());

  for (const id of published) {
    const resource = publicResources.find((entry) => entry.id === id)!;
    await page.goto(readerHref(resource.grade, id));

    const brand = page.locator('[data-resource-brand="moodle"]');
    await expect(brand, `${id}: הלוגו מוצג`).toHaveCount(1);

    const img = brand.locator('img');
    await expect(img).toHaveAttribute('alt', ALT);
    await expect(img).toHaveAttribute('src', '/media/brands/moodle-logo.png');

    // היחס נשמר בפועל, ובגודל מאוזן שאינו דומיננטי
    const box = (await img.boundingBox())!;
    const declared = brandForResource(id)!;
    expect(
      Math.abs(box.width / box.height - declared.width / declared.height),
      `${id}: יחס התמונה נשמר`
    ).toBeLessThan(0.02);

    const panel = (await page.locator('.res-panel').boundingBox())!;
    expect(box.width, `${id}: הלוגו אינו דומיננטי בלוח המידע`).toBeLessThan(panel.width * 0.5);
  }

  for (const id of quarantined) {
    // בהסגר אין עמוד ציבורי — ולכן אין מה להציג. זו הסיבה שהענף למעלה
    // אינו רץ עבורו, והיא נאכפת כאן במפורש במקום להישאר הנחה שקטה.
    for (const grade of ['z', 'h', 't']) {
      const status = (await page.request.get(readerHref(grade, id))).status();
      expect(status, `${id} (${grade}): משאב בהסגר אינו מוגש כעמוד ציבורי`).not.toBe(200);
    }
  }
});

test('משאבים ציבוריים אחרים אינם מציגים את הלוגו', async ({ page }) => {
  const samples = [
    { grade: 'z', id: 'tochnit-z' },
    { grade: 'z', id: 'misparim' },
    { grade: 't', id: 'ruach-tochnit' },
    { grade: 'h', id: 'kavit-flip' },
  ];

  for (const { grade, id } of samples) {
    await page.goto(readerHref(grade, id));
    await expect(page.locator('[data-resource-brand]'), `${id}: בלי לוגו מיתוג`).toHaveCount(0);
  }
});
