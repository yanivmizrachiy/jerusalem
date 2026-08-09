import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { brandForResource, brandedResourceIds } from '../src/data/resource-branding';
import { canonicalReaderItems } from '../src/data/canonical-content';
import { isAttributionPending } from '../src/data/attribution';
import { authorAssignments, authorById, authorsForResource } from '../src/data/authors';

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
  const seen = new Map<string, { id: string; title: string; grade: string; url?: string }>();
  for (const { grade, item } of canonicalReaderItems) {
    if (!seen.has(item.id)) {
      seen.set(item.id, { id: item.id, title: item.title, grade: grade.slug, url: item.url });
    }
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

test('משאבי המודל פומביים, מיוחסים לצוות מודל — משרד החינוך, ומחוץ להסגר', () => {
  const publicIds = new Set(publicResources.map((resource) => resource.id));

  for (const id of MOODLE_IDS) {
    // A + B: שניהם פומביים
    expect(publicIds.has(id), `${id} הוא משאב ציבורי`).toBe(true);
    // D: ואינם בהסגר
    expect(isAttributionPending(id), `${id} אינו ברשימת ההמתנה`).toBe(false);

    // C: ייחוס ארגוני קנוני, שאומת ישירות על ידי בעל הפרויקט
    expect(authorAssignments[id], `${id} משויך`).toEqual(['model-team']);
    const creators = authorsForResource(id);
    expect(creators.map((creator) => creator.name)).toEqual(['צוות מודל — משרד החינוך']);
    expect(creators[0].kind).toBe('organization');
  }

  // H: ארגון אינו מקבל עמוד מחבר אישי
  const org = authorById('model-team')!;
  expect(org, 'הישות קיימת במקור האמת').toBeTruthy();
  expect(org.kind).toBe('organization');
  expect(org.pageEligible, 'גוף מפרסם אינו מקבל עמוד מחבר אישי').toBe(false);
});

test('E: הלוגו מוצג בשני משאבי המודל, ביחס נכון ובגודל לא דומיננטי', async ({ page }) => {
  const publicIds = new Set(publicResources.map((resource) => resource.id));
  const published = brandedResourceIds.filter((id) => publicIds.has(id));

  // החוזה אינו רשאי לעבור בריק: שני המזהים הממופים חייבים להיות פומביים
  expect([...published].sort(), 'כל מזהה ממופה הוא פומבי ונבדק בפועל').toEqual(
    [...brandedResourceIds].sort()
  );

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

    // J: היוצר מוצג פעם אחת בלבד, בלי תוויות metadata בטקסט הגלוי
    const panelText = (await page.locator('.res-panel').innerText()).replace(/\s+/g, ' ');
    const occurrences = panelText.split('צוות מודל — משרד החינוך').length - 1;
    expect(occurrences, `${id}: שם היוצר מוצג פעם אחת בלבד`).toBe(1);
    for (const label of ['מחבר:', 'קרדיט:', 'קרדיטים:']) {
      expect(panelText, `${id}: אין תווית "${label}" בטקסט הגלוי`).not.toContain(label);
    }

    // אין כפילות לוגו בעמוד
    await expect(page.locator('[data-resource-brand]'), `${id}: לוגו אחד בלבד`).toHaveCount(1);
  }
});

test('I: Google Sites נשאר פתיחה חיצונית ולא iframe שבור', async ({ page }) => {
  // חוזה ההטמעה לא השתנה בעקבות המיתוג: אתר המודל מוגש מ-Google Sites
  // ששולח X-Frame-Options: DENY, ולכן אין לו embed והמשאב נפתח במקור.
  // הלוגו הוא מיתוג בלבד ואינו ראיה שניתן להטמיע את המקור (RULES 24.4).
  const guide = publicResources.find((resource) => resource.id === 'moodle-guide')!;
  await page.goto(readerHref(guide.grade, 'moodle-guide'));

  await expect(page.locator('[data-resource-brand="moodle"]'), 'הלוגו כן מוצג').toHaveCount(1);
  await expect(page.locator('.res-frame iframe'), 'אין iframe ל-Google Sites').toHaveCount(0);

  const openInSource = page.locator('.orbs a[target="_blank"][href*="sites.google.com"]');
  await expect(openInSource, 'פתיחה במקור אמיתית').toHaveCount(1);
});

test('G: דמיון בכתובת או בדומיין אינו מקנה מיתוג', async ({ page }) => {
  // משאבי המודל מוגשים מ-sites.google.com ומ-docs.google.com. בקטלוג יש
  // עשרות משאבים ציבוריים מאותם דומיינים בדיוק — הם חייבים להישאר בלי לוגו,
  // כדי להוכיח שהמיתוג מגיע מהמיפוי הקנוני ולא מהכתובת.
  const mapped = new Set(brandedResourceIds);
  const sameDomain = publicResources.filter(
    (resource) => !mapped.has(resource.id) && /(docs|sites)\.google\.com/.test(resource.url ?? '')
  );

  expect(sameDomain.length, 'קיימים משאבים ציבוריים מאותם דומיינים').toBeGreaterThan(0);

  for (const resource of sameDomain.slice(0, 8)) {
    expect(brandForResource(resource.id), `${resource.id} אינו ממופה`).toBeUndefined();
    await page.goto(readerHref(resource.grade, resource.id));
    await expect(
      page.locator('[data-resource-brand]'),
      `${resource.id}: אותו דומיין, בלי לוגו`
    ).toHaveCount(0);
  }
});

test('משאבים ציבוריים אחרים אינם מציגים את הלוגו', async ({ page }) => {
  // דגימה מכוונת מארבע משפחות הטמעה: PDF רשמי, אתר חי, Google Doc ו-Heyzine.
  const samples = [
    { grade: 'z', id: 'tochnit-z' },
    { grade: 'z', id: 'misparim' },
    { grade: 't', id: 'src-curriculum-124e4cb32286' },
    { grade: 'h', id: 'kavit-flip' },
  ];

  for (const { grade, id } of samples) {
    // דגימה שנכנסה ל-quarantine אינה עמוד ציבורי — הבדיקה הייתה עוברת על 404 ריק.
    expect(isAttributionPending(id), `${id}: הדגימה חייבת להיות משאב ציבורי`).toBe(false);
    await page.goto(readerHref(grade, id));
    await expect(page.locator('.res-panel'), `${id}: עמוד המשאב באמת קיים`).toBeVisible();
    await expect(page.locator('[data-resource-brand]'), `${id}: בלי לוגו מיתוג`).toHaveCount(0);
  }
});
