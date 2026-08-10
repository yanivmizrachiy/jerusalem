import { test, expect, type Page } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { choveret, materialChapters, materialsConservationReport } from '../src/data/choveret';
import {
  sourceCatalogConservation,
  sourceLinkLedger,
  sourceMaterialResources,
  sourceNoLinkRows,
} from '../src/data/source-materials';
import { hafifaUnit, mishvaotUnit } from '../src/data/units';
import { LEGACY_REDIRECTS } from '../src/lib/legacyRedirects.mjs';
import { isAttributionPending } from '../src/data/attribution';
import { publishableItems } from '../src/data/publishing';
import { canonicalGrade } from '../src/data/canonical-content';

/**
 * משאב מסמך ציבורי ומיוחס, לבדיקות פריסת "מסמך" (הטמעת Google Doc).
 * הוא מחליף משאב שעבר ל-quarantine בהיעדר ראיית ייחוס — אותה משפחת
 * הטמעה בדיוק, כדי שהחוזה הנבדק לא ייחלש (24.1). אסור להחליף כאן
 * ב-PDF: בדפדפן הבדיקה אין מציג PDF מובנה, ומשאב PDF מציג כרטיס
 * פתיחה במקום ההטמעה הנמדדת.
 */
const PUBLIC_DOC_RESOURCE = '/chativat-beynayim/reader/h/src-curriculum-71f88b7ed752/';

/**
 * מספר המשאבים ה**ציבוריים** בנושא, לפי הקטלוג הקנוני — אותה נוסחה שקובעת
 * ב-`nose/[grade]/[chapter].astro` אם הנושא מפנה ישירות למשאב יחיד או מציג
 * רשימה. הבדיקות משוות מול המודל הזה במקום לספור מחלקות CSS, כי משאב מרכזי
 * מוצג ככרטיס-גיבור ולא כ-`.rcard` (ראו ההערה בבדיקת הנושאים).
 */
const publicTopicResourceCount = (gradeSlug: string, topicHref: string): number => {
  const chapterId = topicHref.replace(/\/$/, '').split('/').pop()!;
  const grade = choveret.find((g) => g.slug === gradeSlug)!;
  const chapter = canonicalGrade(grade).chapters.find((c) => c.id === chapterId)!;
  return publishableItems(chapter.items).length;
};

/**
 * בדיקות הקבלה של תיקון ה-UX המלא (RULES 19.34, הוראת יניב 04–05/08/2026):
 * hero מלא, חץ החזרה מכרטיס צוות, רצועת WhatsApp נקייה, באנר תמונה מלאה,
 * עמודי האינטרנט של חטיבת הביניים וכותרת ה-Lovable של לוח השנה.
 */

/**
 * חלוקת הפרויקטים (תוקן 09/08/2026): עד כה הקובץ כולו דילג על פרופיל
 * המובייל, וכל בדיקה שכותרתה "בנייד" רצה בכרום דסקטופ עם setViewportSize
 * בלבד. ‏viewport צר אינו מכשיר: אין בו מגע, אין userAgent של מובייל ואין
 * DPR אמיתי — ולכן דווקא הקביעות על "מטרת מגע" ועל התנהגות נייד נבדקו
 * בסביבה שאינה נייד.
 *
 * מעכשיו בדיקה שכותרתה "בנייד" רצה **רק** בפרופיל Pixel 7 האמיתי, וכל
 * השאר רצות **רק** בפרויקט הדסקטופ. אין הרצה כפולה, ואין דילוג שמסתיר כשל.
 */
test.beforeEach(({ isMobile }, testInfo) => {
  const wantsMobile = testInfo.title.includes('בנייד');
  test.skip(
    wantsMobile !== (isMobile === true),
    wantsMobile ? 'רץ בפרופיל המובייל האמיתי בלבד' : 'רץ בפרויקט הדסקטופ בלבד',
  );
});

/** בדיקת נייד חייבת לרוץ על מכשיר מגע אמיתי — שלא תידרדר בשקט חזרה לדסקטופ צר. */
const assertRealMobile = async (page: Page) => {
  const touch = await page.evaluate(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0);
  expect(touch, 'בדיקת נייד חייבת לרוץ בפרופיל מכשיר אמיתי, לא ב-viewport צר').toBe(true);
};

/* ===== קטלוג חומרי ההוראה ===== */

test('קטלוג המקור נשמר במלואו ומדווח על כל חריגה', () => {
  expect(sourceLinkLedger).toHaveLength(146);
  expect(sourceMaterialResources).toHaveLength(145);
  expect(sourceNoLinkRows).toHaveLength(8);
  expect(sourceCatalogConservation.safeDuplicateMerges).toBe(1);
  expect(sourceCatalogConservation.excludedFromTeachingMaterials).toBe(2);
  expect(materialsConservationReport.finalCanonicalResourcesIncludingReview).toBeGreaterThan(145);
});

test('לכל שכבה רשימת נושאי־על ואוספים מדויקת — ללא פרקים מנהליים', () => {
  const expected = {
    z: [
      'z-directed-numbers',
      'z-coordinate-system',
      'z-expressions',
      'z-equations',
      'z-percentages',
      'z-order-operations',
      'z-angles',
      'z-areas-perimeters',
      'z-box-cube',
      'z-circle',
    ],
    h: [
      'h-linear-function',
      'h-equations',
      'h-systems',
      'h-percentages',
      'h-inequalities',
      'h-statistics',
      'h-congruent',
      'h-similar',
      'h-parallel',
      'h-areas-pythagoras',
      'h-coordinate-geometry',
      'h-angles',
    ],
    t: [
      't-technique',
      't-preanalysis',
      't-quadratic',
      't-literacy',
      't-quadrilaterals',
      't-kite',
      't-trapezoid',
      't-parallelogram',
      't-rectangle-rhombus',
      't-coordinate-geometry',
      't-similarity-pythagoras',
      't-proofs',
    ],
  } as const;

  for (const grade of choveret) {
    const chapters = materialChapters(grade);
    const topicIds = chapters.filter((chapter) => chapter.kind === 'topic').map((chapter) => chapter.id);
    expect(topicIds).toEqual(expected[grade.slug as keyof typeof expected]);

    for (const required of ['mivchanim', 'sikumim', 'mischakim']) {
      expect(chapters.some((chapter) => chapter.id === required), `${grade.slug}: ${required}`).toBe(true);
    }
    expect(chapters.some((chapter) => ['hozer', 'tichnun', 'yahal4', 'hamshech'].includes(chapter.id))).toBe(false);
  }
});

/* ===== עמוד הבית =====
   PR #100 החליף את שער הווידאו החוסם בעמוד מיידי: הסרטון קבוע כלוח קולנועי
   ממוסגר (ראו tests/home-immediate.spec.ts לחוזה המלא, כולל 360×740/390×844). */

test('רצועת WhatsApp בלי משפט ההסבר שנמחק (7.27)', async ({ page }) => {
  await page.goto('/');
  const sub = page.locator('.wa-band-sub');
  await expect(sub).toHaveText('קבוצה של מורים למתמטיקה בחטיבת הביניים');
  await expect(page.locator('.wa-band')).not.toContainText('לחיצה בכל נקודה');
});

test('כרטיס צוות: חץ אחד בעיגול בלי כיתוב, ושחזור התצוגה (6.5)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.team-arrow')).toHaveCount(0);
  const beforeY = await page.evaluate(() => scrollY);
  await page.locator('.hero-after a[href="#tzevet-ayelet"]').click();
  await expect(page).toHaveURL(/#tzevet-ayelet$/);
  await expect(page.locator('#tzevet-ayelet')).toBeVisible();
  const back = page.locator('[data-team-back]');
  await expect(back).toBeVisible();
  // חץ בלבד — בלי כיתוב גלוי; הנגישות דרך aria-label (6.5, 05/08/2026)
  await expect(back).toHaveText('');
  await expect(back).toHaveAttribute('aria-label', /חזרה/);
  await expect(back.locator('svg')).toHaveCount(1);
  const box = (await back.boundingBox())!;
  expect(box.height, 'גובה לחיץ ≥44px').toBeGreaterThanOrEqual(44);
  expect(Math.abs(box.width - box.height), 'עיגול — רוחב וגובה שווים').toBeLessThanOrEqual(2);
  await back.click();
  await expect(page).not.toHaveURL(/#tzevet-/);
  await expect(page.locator('[data-team-details]')).toBeHidden();
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => scrollY)) - beforeY), {
      message: 'הגלילה חזרה למיקום שקדם לפתיחת הכרטיס',
    })
    .toBeLessThanOrEqual(60);
});

/* ===== חטיבת ביניים ===== */

test('תמונת חטיבת הביניים מוצגת במלואה — יחס טבעי ותחתית גלויה (5.24)', async ({ page }) => {
  await page.goto('/chativat-beynayim/');
  const img = page.locator('.art-banner.is-full-image img');
  await img.scrollIntoViewIfNeeded();
  await expect(img).toBeVisible();
  const data = await img.evaluate((el: HTMLImageElement) => ({
    nw: el.naturalWidth,
    nh: el.naturalHeight,
    w: el.getBoundingClientRect().width,
    h: el.getBoundingClientRect().height,
  }));
  expect(data.nw).toBeGreaterThan(0);
  const naturalRatio = data.nw / data.nh;
  const shownRatio = data.w / data.h;
  expect(Math.abs(naturalRatio - shownRatio) / naturalRatio, 'היחס הטבעי נשמר — אין חיתוך').toBeLessThan(0.02);
});

/* ===== חטיבת הביניים כעמודי אינטרנט (הוראת יניב, 05/08/2026) =====
   החוברת המדפדפת בוטלה: שער השלישים, עמוד שכבה לכל כיתה, ועמוד משאב
   מחולק — הטמעה בצד אחד ולוח הפעולות בצד השני. */

const noOverflow = async (page: Page, label: string) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow, `גלילה אופקית ב-${label}`).toBeLessThanOrEqual(1);
};

test('רכיב החוברת נשמר בריפו אך אינו מיובא בשום עמוד (הוראת יניב, 4.14)', async () => {
  // יניב ביקש לשמור את הרכיב לעת הצורך — הוא קובץ היעד של הסטודיו הפרטי.
  // הבדיקה חוסמת מחיקה שקטה שלו, ובמקביל מוודאת שהוא באמת לא נבנה לאתר.
  expect(existsSync('src/components/Booklet.astro'), 'Booklet.astro נשמר בריפו').toBe(true);
  expect(readFileSync('package.json', 'utf8'), 'התלות page-flip נשמרה').toContain('page-flip');
  const imported = ['src/pages', 'src/layouts', 'src/components']
    .flatMap((dir) => globAstro(dir))
    .filter((f) => !f.endsWith('Booklet.astro'))
    .filter((f) => /from ['"][^'"]*Booklet\.astro['"]/.test(readFileSync(f, 'utf8')));
  expect(imported, 'הרכיב אינו מיובא בשום עמוד — ולכן אינו נשלח לגולשים').toEqual([]);
});

/** כל קובצי ה-astro תחת נתיב, רקורסיבית */
function globAstro(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) out.push(...globAstro(p));
    else if (e.name.endsWith('.astro')) out.push(p);
  }
  return out;
}

test('שער חטיבת הביניים: שלושה שלישים שווים, בלי חוברת מדפדפת (3.29, 05/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/');

  // החוברת ומנוע הדפדוף נמחקו כליל
  await expect(page.locator('[data-book], .book-shell, .stf__item')).toHaveCount(0);

  const thirds = page.locator('.split3 .third');
  await expect(thirds).toHaveCount(3);

  const widths = await thirds.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().width));
  expect(Math.max(...widths) - Math.min(...widths), 'שלושת השלישים שווים ברוחבם').toBeLessThanOrEqual(2);

  // כל שליש הוא קישור לעמוד השכבה שלו, והכיתוב הוא שם השכבה
  const targets = ['kita-z', 'kita-h', 'kita-t'];
  const titles = ['מתמטיקה לכיתה ז׳', 'מתמטיקה לכיתה ח׳', 'מתמטיקה לכיתה ט׳'];
  for (let i = 0; i < 3; i++) {
    await expect(thirds.nth(i)).toHaveAttribute('href', `/chativat-beynayim/${targets[i]}/`);
    await expect(thirds.nth(i).locator('.third-title')).toHaveText(titles[i]);
    const text = (await thirds.nth(i).locator('.third-count').textContent()) ?? '';
    expect(Number(text.match(/\d+/)?.[0] ?? 0), 'מניין קבצים אמיתי').toBeGreaterThan(0);
  }

  // אין עוד רצועת "כללי" — החומרים המשותפים חולקו לשלוש הכיתות (3.31)
  await expect(page.locator('.klali-band')).toHaveCount(0);
  await noOverflow(page, 'שער 1440');
});

test('שער חטיבת הביניים בנייד: השלישים נערמים ונשארים גדולים (19.32)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await assertRealMobile(page);
  await page.goto('/chativat-beynayim/');
  const thirds = page.locator('.split3 .third');
  await expect(thirds).toHaveCount(3);
  const boxes = await thirds.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()));
  expect(boxes[1].y, 'השלישים נערמים זה מתחת לזה').toBeGreaterThan(boxes[0].y + 100);
  for (const b of boxes) expect(b.height, 'מטרת מגע גדולה').toBeGreaterThanOrEqual(44);
  await noOverflow(page, 'שער 390');
});

test('תצוגת החומרים: רשימת נושאים בלבד, וכל נושא נפתח לרשימת משימות (הוראת יניב, 06/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/kita-z/chomarim/');

  await expect(page.locator('h1.grade-title')).toHaveText('מתמטיקה לכיתה ז׳');

  // המסך הראשון הוא רשימת הנושאים — ואין בו כרטיסי משימות כלל
  const topics = page.locator('.topics .topic');
  expect(await topics.count(), 'יש רשימת נושאים').toBeGreaterThan(2);
  await expect(page.locator('.rcard')).toHaveCount(0);
  for (const h of await topics.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) {
    expect(h, 'שורת נושא גדולה ונוחה').toBeGreaterThanOrEqual(44);
  }

  // כל השאר יורד ממש למטה — הניווט מתחת לקיפול
  const nav = (await page.locator('.grade-nav').boundingBox())!;
  const last = (await topics.last().boundingBox())!;
  expect(nav.y, 'הניווט הרחק מתחת לרשימת הנושאים').toBeGreaterThan(last.y + last.height + 60);

  // לחיצה על נושא מגיעה לעמוד הנושא ובו רשימת המשימות שלו
  const href = await topics.nth(1).getAttribute('href');
  expect(href).toMatch(/^\/chativat-beynayim\/nose\/z\//);
  await topics.nth(1).click();
  await page.waitForURL((u) => u.pathname === href);
  await expect(page.locator('h1.chapter-title')).toBeVisible();

  const cards = page.locator('.rcard');
  expect(await cards.count(), 'יש כרטיסי משימות').toBeGreaterThan(0);
  const hrefs = await cards.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')));
  // כל משימה מובילה לעמוד המשימה שלה — לא לעוגן בעמוד אחר (3.30)
  for (const h of hrefs) expect(h, 'לכל משימה עמוד משימה').toMatch(/^\/chativat-beynayim\/reader\/z\//);

  // חזרה לרשימת הנושאים
  await expect(page.locator('[data-to-topics]')).toHaveAttribute('href', '/chativat-beynayim/kita-z/chomarim/');
  await noOverflow(page, 'עמוד נושא 1440');

  // מעבר לשכבה הבאה וחזרה לשער — בתחתית תצוגת החומרים
  await page.goto('/chativat-beynayim/kita-z/chomarim/');
  await expect(page.locator('.grade-nav a[href="/chativat-beynayim/kita-h/chomarim/"]')).toHaveCount(1);
  await expect(page.locator('.grade-nav a[href="/chativat-beynayim/"]')).toHaveCount(1);
  await expect(page.locator('.grade-nav a[data-to-intro]')).toHaveAttribute('href', '/chativat-beynayim/kita-z/');
  await noOverflow(page, 'עמוד שכבה 1440');
});

test('עמוד מבוא: מה אנחנו מלמדים, תוכנית ופריסה תשפ״ז, חומרים והמחשות (הוראת יניב, 06/08)', async ({ page }) => {
  const docs = {
    z: ['tochnit-z', 'prisa-z'],
    h: ['tochnit-h', 'prisa-h'],
    t: ['tochnit-t', 'prisa-t'],
  } as const;
  const letters = { z: 'ז׳', h: 'ח׳', t: 'ט׳' } as const;

  for (const slug of ['z', 'h', 't'] as const) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/chativat-beynayim/kita-${slug}/`);

    // 1. אזור "מה אנחנו מלמדים?"
    await expect(page.locator('#ma-melamdim .band-title')).toHaveText('מה אנחנו מלמדים?');

    // 2. שני כפתורים רשמיים — קישורים אמיתיים אל פריטי תשפ״ז הנכונים
    const plan = page.locator('[data-main-plan]');
    const prisa = page.locator('[data-main-prisa]');
    await expect(plan).toHaveAttribute('href', `/chativat-beynayim/reader/${slug}/${docs[slug][0]}/`);
    await expect(prisa).toHaveAttribute('href', `/chativat-beynayim/reader/${slug}/${docs[slug][1]}/`);
    await expect(plan.locator('.doc-name')).toHaveText(`תוכנית ההוראה לכיתה ${letters[slug]}`);
    await expect(prisa.locator('.doc-name')).toHaveText(`פריסת ההוראה לכיתה ${letters[slug]}`);
    for (const el of [plan, prisa]) {
      expect((await el.boundingBox())!.height, 'מטרת מגע נוחה').toBeGreaterThanOrEqual(44);
    }

    // 3. אזור "חומרים להוראה" — קישור אחד גדול אל השכבה הנכונה
    const band = page.locator('[data-materials]');
    await expect(band).toHaveAttribute('href', `/chativat-beynayim/kita-${slug}/chomarim/`);
    await expect(band.locator('.band-title')).toHaveText('חומרים להוראה');
    await expect(band.locator('.band-sub')).toHaveText('דפי עבודה, מבחנים, משחקים, קישורים ועוד...');

    // 4. אתר ההמחשות של איילת — אותו רכיב משותף, דרך הפרוקסי
    await expect(page.locator('#hamchashot iframe')).toHaveAttribute('src', '/api/mam/');

    // 5. ניווט אחיד
    await expect(page.locator('.grade-nav a[href="/chativat-beynayim/"]')).toHaveCount(1);
    await expect(page.locator('.grade-nav a[data-to-materials]')).toHaveCount(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `גלילה אופקית בכיתה ${slug}`).toBeLessThanOrEqual(1);
  }
});

test('כיתה ט׳: הכפתורים הראשיים מקשרים לנתיבים הנכונים', async ({ page }) => {
  await page.goto('/chativat-beynayim/kita-t/');
  const plan = page.locator('[data-main-plan]');
  await expect(plan).toBeVisible();
  const href = await plan.getAttribute('href');
  expect(href).toContain('/reader/t/tochnit-t/');
  const prisa = page.locator('[data-main-prisa]');
  await expect(prisa).toBeVisible();
  const prisaHref = await prisa.getAttribute('href');
  expect(prisaHref).toContain('/reader/t/prisa-t/');
});

test('האוספים הגדולים מוצגים בכל שכבה, ותנופה מופיע רק במבחנים של ט׳', async ({ page }) => {
  const expectedTitles = {
    z: ['מבחנים לכיתה ז׳', 'משימות סיכום לשכבת ז׳', 'משחקים לכיתה ז׳'],
    h: ['מבחנים לכיתה ח׳', 'משימות סיכום לשכבת ח׳', 'משחקים לכיתה ח׳'],
    t: ['מבחנים לכיתה ט׳', 'משימות סיכום לשכבת ט׳', 'משחקים לכיתה ט׳'],
  } as const;

  for (const slug of ['z', 'h', 't'] as const) {
    await page.goto(`/chativat-beynayim/kita-${slug}/chomarim/`);
    const titles = await page.locator('.topics .topic-title').allTextContents();
    for (const title of expectedTitles[slug]) expect(titles).toContain(title);

    const hrefs = await page
      .locator('.topics .topic')
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute('href') ?? ''));
    expect(hrefs.some((href) => /\/(hozer|tichnun|yahal4|hamshech)\/$/.test(href))).toBe(false);
  }

  await page.goto('/chativat-beynayim/nose/t/mivchanim/');
  for (const id of ['mifrat-tnufa', 'tnufa-rama', 'tnufa-mankal']) {
    await expect(page.locator(`a.rcard[href="/chativat-beynayim/reader/t/${id}/"]`), id).toHaveCount(1);
  }

  // `kvatzim-nosim` נשמר במקור אך אינו מיוחס, ולכן הוא ב-quarantine ואינו
  // מוצג — הוכחה ישירה שאין דליפה של פריט אנונימי לרשימה הציבורית (24.1).
  expect(isAttributionPending('kvatzim-nosim'), 'kvatzim-nosim ב-quarantine').toBe(true);
  await expect(
    page.locator('a.rcard[href="/chativat-beynayim/reader/t/kvatzim-nosim/"]'),
    'משאב ללא ייחוס אינו מופיע ברשימה הציבורית'
  ).toHaveCount(0);

  await page.goto('/chativat-beynayim/kita-t/chomarim/');
  await expect(page.locator('.topics')).not.toContainText('הכנה ל־4 יח״ל');

  // הקביעה נשארת בדיוק כשהייתה — 200 ותו לא. מה שמנוסה שוב הוא **התעבורה**
  // ולא התוצאה: שרת הקבצים הסטטי של הסוללה החזיר ECONNRESET תחת עומד ריצה
  // מקבילה ב-CI (נמדד 09/08/2026), וזו תקלת חיבור ולא רגרסיית מוצר. ‏404
  // אמיתי היה ממשיך לחזור 404 עד סוף הפולינג והבדיקה הייתה נכשלת — ולכן
  // זה אינו retry שמסתיר כשל (RULES 24.2.1).
  await expect
    .poll(
      async () => {
        try {
          return (await page.request.get('/chativat-beynayim/maavar-4-yahal/')).status();
        } catch {
          return 0;
        }
      },
      { timeout: 15_000, message: 'עמוד המעבר ל-4 יח״ל חייב להיות חי' }
    )
    .toBe(200);
});

test('כל משימה בכל נושא בכל שכבה מובילה לעמוד משימה מחולק (3.30)', async ({ page }) => {
  // הבדיקה מנווטת בפועל לכל הנושאים בשלוש השכבות ולמדגם משימות — כ-60
  // ניווטים. סולו היא לוקחת ~10 שניות, אבל תחת ריצה מקבילה מלאה היא חצתה
  // את תקרת 45 השניות ונפלה כ-flake (נמדד 09/08/2026). ‏retries=0 הוא חלק
  // מחוזה האיכות, ולכן התקציב מורחב במקום להחזיר ניסיונות חוזרים.
  //
  // החוזה עודכן (Issue #73): נושא אינו חייב להציג רשימה. נושא שיש בו בדיוק
  // משאב ציבורי אחד עובר **ישירות** למשאב עצמו (301 ב-`nose/[grade]/[chapter]`),
  // ונושא עם שניים ומעלה מציג רשימת משימות. שני המסלולים נבדקים כאן בפועל,
  // ושניהם חייבים להתקיים — כדי שהבדיקה לא תעבור על ידי ביטול אחד מהם.
  test.slow();
  await page.setViewportSize({ width: 1440, height: 900 });
  let tasks = 0;
  let singleItemTopics = 0;
  let listTopics = 0;
  const sample: string[] = [];

  /** מחכה עד שהניווט נח: או רשימת משימות, או עמוד המשימה עצמו */
  const settle = async () => {
    await page.locator('.rcard, .res-view').first().waitFor({ state: 'attached' });
    return new URL(page.url()).pathname;
  };

  for (const [slug, materials] of [
    ['z', '/chativat-beynayim/kita-z/chomarim/'],
    ['h', '/chativat-beynayim/kita-h/chomarim/'],
    ['t', '/chativat-beynayim/kita-t/chomarim/'],
  ] as const) {
    await page.goto(materials);
    const topicHrefs = await page
      .locator('.topics .topic')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!));
    expect(topicHrefs.length, `לשכבה ${slug} יש נושאים`).toBeGreaterThan(0);

    const taskPath = new RegExp(`^/chativat-beynayim/reader/${slug}/[^/]+/$`);

    for (const topic of topicHrefs) {
      expect(topic, 'נושא מוביל לעמוד נושא').toMatch(new RegExp(`^/chativat-beynayim/nose/${slug}/`));
      await page.goto(topic);
      const landed = await settle();

      if (landed === topic) {
        // נושא עם שתי משימות ומעלה — רשימה לחיצה.
        //
        // נמדד 09/08/2026: אסור לספור `.rcard` בלבד. בנושא שיש בו משאב
        // מרכזי (`.primary-resource`) הוא מוצג ככרטיס-גיבור ולא כ-`.rcard`,
        // ולכן נושא עם שני משאבים ציבוריים — מרכזי + אחד — מציג `.rcard`
        // אחד בלבד (למשל z-angles). ספירה לפי מחלקה הייתה מסיקה בטעות
        // "משאב יחיד" ומפילה נושא תקין. הספירה היא לפי **יעדי המשאב
        // בפועל**, מנוכי כפילות, כדי שתתאים לחוזה הקנוני שב-
        // `nose/[grade]/[chapter].astro` (הפניה כאשר publicItems.length === 1).
        const targets = await page
          .locator('a[data-resource-context]')
          .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!));
        const hrefs = [...new Set(targets)];
        expect(hrefs.length, `נושא שמציג רשימה חייב שני משאבים ומעלה: ${topic}`).toBeGreaterThan(1);
        for (const h of hrefs) {
          expect(h, `משימה בנושא ${topic} מובילה לעמוד משימה`).toMatch(taskPath);
          tasks++;
        }

        // והמודל הקנוני מסכים: לנושא הזה באמת יותר ממשאב ציבורי אחד
        expect(
          publicTopicResourceCount(slug, topic),
          `${topic}: הקטלוג הקנוני מסכים שיש כאן יותר ממשאב אחד`
        ).toBeGreaterThan(1);

        sample.push(hrefs[0]);
        listTopics++;
      } else {
        // נושא עם משאב ציבורי יחיד — מעבר ישיר למשימה, בלי מסך ביניים ריק
        expect(landed, `נושא עם משאב יחיד עובר ישירות למשימה: ${topic}`).toMatch(taskPath);
        await expect(page.locator('.res-view'), landed).toBeVisible();
        await expect(page.locator('.res-panel'), landed).toBeVisible();
        await expect(page.locator('.orbs'), landed).toBeVisible();
        expect(await page.locator('.rcard').count(), `אין רשימה בעמוד משימה: ${landed}`).toBe(0);

        // והמודל הקנוני מסכים: כאן באמת יש בדיוק משאב ציבורי אחד
        expect(
          publicTopicResourceCount(slug, topic),
          `${topic}: הקטלוג הקנוני מסכים שיש כאן בדיוק משאב אחד`
        ).toBe(1);

        tasks++;
        singleItemTopics++;
      }
    }
  }

  expect(tasks, 'נספרו משימות אמיתיות').toBeGreaterThan(40);
  expect(listTopics, 'קיימים נושאים שמציגים רשימת משימות').toBeGreaterThan(0);
  expect(singleItemTopics, 'קיימים נושאים שעוברים ישירות למשאב היחיד').toBeGreaterThan(0);

  // מדגם משימות מתוך הרשימות — כל אחת באמת עמוד מחולק (8.2)
  for (const href of sample.slice(0, 6)) {
    await page.goto(href);
    await expect(page.locator('.res-view'), href).toBeVisible();
    await expect(page.locator('.res-panel'), href).toBeVisible();
    await expect(page.locator('.orbs'), href).toBeVisible();
  }
});

test('משימת חוזר נשמרת במסלול הקנוני אך אינה מוצגת כנושא בחומרים (3.30)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/reader/z/maf-05-z/');

  await expect(page.locator('h1.res-title')).toHaveText('משימות הערכה ומבחן מפמ״ר ז׳');
  await expect(page.locator('.mrange')).toHaveCount(1);
  const view = (await page.locator('.res-view').boundingBox())!;
  const panel = (await page.locator('.res-panel').boundingBox())!;
  expect(Math.abs(view.width - panel.width), 'חצי-חצי').toBeLessThanOrEqual(1);

  await page.goto('/chativat-beynayim/nose/z/hozer/');
  await page.waitForURL('**/hozer-mafmar/');
});

test('יחידות המשוואות והחפיפה נשמרו בתוך הנושא הקנוני — בלי כרטיס ייעודי (3.30)', async ({ page }) => {
  // החוזה עודכן (Issue #73): יחידות ההוראה הישנות אינן עוד כרטיס ייעודי בעמוד
  // המבוא ואינן עמוד־נגן נפרד. כל חומריהן חיים בתוך הנושא הקנוני, והכתובת
  // הישנה נשארת חיה כהפניה — כדי שקישורים ששותפו לא יישברו (5.17, 3.6, 3.12).
  test.slow();
  const units = [
    { slug: 'z', legacy: '/chativat-beynayim/mishvaot/', topic: '/chativat-beynayim/nose/z/z-equations/', unit: mishvaotUnit },
    { slug: 'h', legacy: '/chativat-beynayim/hafifat-meshulashim/', topic: '/chativat-beynayim/nose/h/h-congruent/', unit: hafifaUnit },
  ] as const;

  for (const { slug, legacy, topic, unit } of units) {
    // 1. אין כרטיס ייעודי בעמוד המבוא של השכבה
    await page.goto(`/chativat-beynayim/kita-${slug}/`);
    await expect(
      page.locator(`[data-grade-page][href="${legacy}"]`),
      `${slug}: אין עוד כרטיס ייעודי ליחידה בעמוד המבוא`
    ).toHaveCount(0);

    // 2. הכתובת הישנה רשומה במקור התאימות היחיד ומפנה לנושא הקנוני.
    //    ההפניה עצמה היא 301 בשכבת הניתוב, ולכן היא נאכפת מול הפרודקשן
    //    ב-scripts/verify-deploy.mjs; מקומית נאכף מה שכן ניתן להוכיח —
    //    שאין יותר עמוד ביניים עם meta-refresh בכתובת הישנה.
    expect(LEGACY_REDIRECTS[legacy], `${legacy} רשום במקור התאימות`).toBe(topic);
    const stale = await page.request.fetch(legacy, { redirect: 'manual' });
    expect(stale.status(), `${legacy} אינו עוד עמוד 200`).toBe(404);

    // 3. הנושא הקנוני חי — בלי נגן יחידה
    await page.goto(topic);
    await expect(page.locator('h1.chapter-title')).toBeVisible();
    expect(await page.locator('.uplay-viewer, .uplay-list').count(), 'אין נגן יחידה במסלול הזה').toBe(0);

    // 4. הנושא הקנוני מציג בפועל את משאבי היחידה כמשימות לחיצות
    const cardHrefs = new Set(
      await page
        .locator('a.rcard')
        .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!))
    );
    expect(cardHrefs.size, `${topic}: רשימת משימות אמיתית`).toBeGreaterThan(1);

    // 5. אפס אובדן חומר — ושני מסלולים נפרדים, לפי חוזה הייחוס הקשיח (24.1):
    //
    //    כל מזהי היחידה הישנה חייבים להישאר קיימים בשכבת המקור הקנונית.
    //    משאב שיש לו ייחוס מאומת מתפרסם כעמוד משימה חי (200); משאב שטרם
    //    נמצאה לו ראיית ייחוס נשמר בנתונים אך נמצא ב-quarantine ואינו
    //    פומבי. "אפס אובדן משאבים" אינו "כל משאב חייב להיות ציבורי" —
    //    ואסור לתקן כאן בהחזרת משאב אנונימי לציבור.
    const chapterId = topic.replace(/\/$/, '').split('/').pop()!;
    const sourceIds = new Set(
      canonicalGrade(choveret.find((g) => g.slug === slug)!)
        .chapters.find((c) => c.id === chapterId)!
        .items.map((item) => item.id)
    );

    const lost: string[] = [];
    const unpublished: string[] = [];
    const leaked: string[] = [];

    for (const resource of unit.resources) {
      // 5a. שימור: המזהה קיים בקטלוג הקנוני של הנושא
      if (!sourceIds.has(resource.id)) lost.push(resource.id);

      const href = `/chativat-beynayim/reader/${slug}/${resource.id}/`;
      const status = (await page.request.get(href)).status();

      if (isAttributionPending(resource.id)) {
        // 5b. quarantine: אינו דולף לציבור
        if (status === 200) leaked.push(`${resource.id} (200)`);
      } else if (status !== 200) {
        // 5c. משאב מיוחס חייב להתפרסם
        unpublished.push(`${resource.id} (${status})`);
      }
    }

    expect(lost, `מזהים שאבדו מקטלוג המקור של ${unit.title}: ${lost.join(', ')}`).toHaveLength(0);
    expect(
      unpublished,
      `משאבים מיוחסים שלא התפרסמו ב-${unit.title}: ${unpublished.join(', ')}`
    ).toHaveLength(0);
    expect(
      leaked,
      `משאבים ללא ייחוס שדלפו לציבור ב-${unit.title}: ${leaked.join(', ')}`
    ).toHaveLength(0);

    // 5d. והחוזה אינו ריק משני צדדיו: ביחידות האלה יש גם מיוחס וגם ב-quarantine
    expect(
      unit.resources.some((r) => !isAttributionPending(r.id)),
      `${unit.title}: קיים משאב מיוחס שמתפרסם`
    ).toBe(true);
    expect(
      unit.resources.some((r) => isAttributionPending(r.id)),
      `${unit.title}: קיים משאב ב-quarantine`
    ).toBe(true);
  }

  // שער החטיבה העליונה נשאר קישור בעמוד המבוא של ט׳ — הוא אינו יחידת הוראה
  await page.goto('/chativat-beynayim/kita-t/');
  const gateway = page.locator('[data-grade-page][href="/chativa-elyona/"]');
  await expect(gateway, 'ט׳: השער לחטיבה העליונה נשאר בעמוד המבוא').toHaveCount(1);
  expect((await gateway.boundingBox())!.height, 'מטרת מגע').toBeGreaterThanOrEqual(44);

  // ומנגד: היחידות אינן חוזרות כנושא מלאכותי ברשימת הנושאים
  for (const [slug, materials] of [
    ['z', '/chativat-beynayim/kita-z/chomarim/'],
    ['h', '/chativat-beynayim/kita-h/chomarim/'],
  ] as const) {
    await page.goto(materials);
    await expect(page.locator('.topics .topic[href*="/nose/' + slug + '/unit"]')).toHaveCount(0);
  }
});

test('החומרים המשותפים חולקו לשלוש הכיתות ואין עוד עמוד "כללי" (3.31)', async ({ page }) => {
  // חומר שמשרת את כל השכבות (מרכז המורים, עמ״ט וכו׳) מופיע בכל אחת מהן
  for (const slug of ['z', 'h', 't'] as const) {
    const res = await page.request.get(`/chativat-beynayim/reader/${slug}/maor/`);
    expect(res.status(), `החומר המשותף חי בכיתה ${slug}`).toBe(200);
  }
  // עמוד "כללי" הישן כבר לא קיים
  const gone = await page.request.get('/chativat-beynayim/klali/');
  expect(gone.status(), 'עמוד כללי הוסר').toBeGreaterThanOrEqual(400);
});

test('עמוד מבוא בנייד: הכול נגיש בלי גלילה אופקית (19.32)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await assertRealMobile(page);
  await page.goto('/chativat-beynayim/kita-h/');
  await expect(page.locator('#ma-melamdim .band-title')).toBeVisible();
  await expect(page.locator('[data-materials]')).toBeVisible();
  for (const sel of ['[data-main-plan]', '[data-main-prisa]', '[data-materials]']) {
    expect((await page.locator(sel).boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('עמוד משאב: חצי-חצי — הטמעה מימין, פעולות משמאל (8.2)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // מסמך Google ציבורי ומיוחס — אותה משפחת הטמעה שנבדקה כאן קודם, אחרי
  // שהמשאב הקודם עבר ל-quarantine בהיעדר ראיית ייחוס (24.1).
  await page.goto(PUBLIC_DOC_RESOURCE);

  const view = (await page.locator('.res-view').boundingBox())!;
  const panel = (await page.locator('.res-panel').boundingBox())!;
  expect(view.x, 'ההטמעה בצד ימין (RTL)').toBeGreaterThan(panel.x);
  expect(Math.abs(view.width - panel.width), 'חצי-חצי מדויק — הפרש עד פיקסל').toBeLessThanOrEqual(1);

  // לוח הפעולות המלא — נבדק לפי היעד האמיתי של כל פעולה, לא לפי שם מחלקה (8.4)
  await expect(page.locator('.orbs a[href^="https://wa.me/"]')).toHaveCount(1);
  await expect(page.locator('.orbs a[href^="mailto:"]')).toHaveCount(1);
  await expect(page.locator('.orbs [data-copy]')).toHaveCount(1);
  await expect(page.locator('.orbs a[target="_blank"]')).not.toHaveCount(0);

  // ההטמעה נטענת ואינה חסומה בשכבה מעליה (19.33)
  const frame = page.locator('.res-frame iframe');
  await expect(frame).toBeVisible();
  const hit = await page.evaluate(() => {
    const f = document.querySelector('.res-frame iframe');
    if (!f) return 'no-iframe';
    const r = f.getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return el === f ? 'ok' : `${el?.tagName}.${(el as HTMLElement)?.className}`;
  });
  expect(hit, 'מרכז ההטמעה פוגע ב-iframe עצמו').toBe('ok');

  await noOverflow(page, 'עמוד משאב 1440');
});

test('עמוד משאב: ניווט קודם/הבא בתוך השכבה וחזרה לפרק (5.12)', async ({ page }) => {
  // משאב חומרים אמיתי ומוצג — מספרים מכוונים בכיתה ז׳
  await page.goto('/chativat-beynayim/reader/z/misparim/');
  const pager = page.locator('.res-pager a.pager-link');
  expect(await pager.count(), 'יש שכן אחד לפחות').toBeGreaterThan(0);
  const hrefs = await pager.evaluateAll((links) =>
    links.map((link) => link.getAttribute('href') ?? '')
  );
  for (const href of hrefs) {
    expect(href, 'כל שכן הוא משאב בתוך אותה שכבה').toMatch(/^\/chativat-beynayim\/reader\/z\//);
  }
  // חזרה אל הנושא שממנו הגיע המשתמש
  await expect(page.locator('.res-back')).toHaveAttribute(
    'href',
    '/chativat-beynayim/nose/z/z-directed-numbers/'
  );
});

test('עמוד משאב מחוץ לסדר הקריאה: חזרה לאזור "מה אנחנו מלמדים?" (3.30)', async ({ page }) => {
  // תוכנית ההוראה נמצאת באזור "מה אנחנו מלמדים?" — לא כנושא בחומרים,
  // ולכן אין לה שכנים בסדר הקריאה של החומרים.
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  await expect(page.locator('.res-back')).toHaveAttribute('href', '/chativat-beynayim/kita-z/#ma-melamdim');
});

// חוזה הגלילה של עמוד המשאב הרחב חי ב-tests/reader-single-scroll-contract.spec.ts:
// אותם שלושה מסלולים, עם הוכחת התנהגות אמיתית (הגלילה פועלת, אין פס גלילה
// פנימי בלוח, וההטמעה נשארת מעל 420px) במקום קביעת scrollHeight ≥ 0 שתמיד עברה.

test('עמוד משאב בנייד: ההטמעה לפני ההסבר (8.6)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await assertRealMobile(page);
  await page.goto(PUBLIC_DOC_RESOURCE);
  const view = (await page.locator('.res-view').boundingBox())!;
  const panel = (await page.locator('.res-panel').boundingBox())!;
  expect(view.y, 'ההטמעה מוצגת ראשונה').toBeLessThan(panel.y);
  expect(view.height, 'ההטמעה גבוהה ושימושית').toBeGreaterThan(300);
  await noOverflow(page, 'עמוד משאב 390');
});

test('פריט מהחוזר מוצג עם טווח העמודים המאומת ולא כמסגרת ריקה (9.3.11)', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/maf-02/');
  await expect(page.locator('.res-panel .res-title')).not.toBeEmpty();
  await expect(page.locator('.res-view .mrange')).toHaveCount(1);
});

test('עמוד תוכנית/פריסה: תצוגת ה-HTML ממלאת את צד המשאב בלי fallback של PDF (3.32.1)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  await expect(page.locator('[data-plan-prisa-web]')).toHaveCount(1);
  await expect(page.locator('.res-view iframe, [data-pdf-fb], .res-open-card')).toHaveCount(0);
  const fill = await page.evaluate(() => {
    const reader = document.querySelector<HTMLElement>('[data-plan-prisa-web]');
    const host = reader?.closest<HTMLElement>('.res-view');
    return reader && host ? reader.getBoundingClientRect().width / host.getBoundingClientRect().width : 0;
  });
  expect(fill, 'תצוגת ה-HTML ממלאת כמעט את כל רוחב הצד שלה').toBeGreaterThan(0.98);
});

test('הטמעות PDF בלי סרגל השחור של הדפדפן (8.26)', async ({ page }) => {
  const bad: string[] = [];
  for (const route of [
    '/chativat-beynayim/reader/z/tochnit-z/',
    '/chativat-beynayim/reader/t/prisa-t/',
    '/chativat-beynayim/reader/z/amat-tashpaz/',
  ]) {
    await page.goto(route);
    bad.push(
      ...(await page.evaluate(() =>
        [...document.querySelectorAll('iframe[data-esrc]')]
          .map((f) => (f as HTMLIFrameElement).dataset.esrc || '')
          .filter((s) => /\.pdf(\?|#|$)/i.test(s) && !s.includes('toolbar=0'))
      ))
    );
  }
  expect(bad, 'כל PDF נטען עם toolbar=0 — המסגור הוא הזכוכית נייבי-זהב שלנו').toEqual([]);
});

/* ===== לוח השנה — כותרת ה-Lovable המדויקת ===== */

test('קובץ הכותרת המקורי קיים וה-src מפנה אליו (23.14)', async ({ page }) => {
  const resp = await page.request.get('/media/art/calendar/jerusalem-calendar-wordmark-original.png');
  expect(resp.status()).toBe(200);
  expect((await resp.body()).length, 'הבייטים המקוריים — 1,037,247').toBe(1037247);
  await page.goto('/luach/');
  await expect(page.locator('#luach-wordmark')).toHaveAttribute(
    'src',
    '/media/art/calendar/jerusalem-calendar-wordmark-original.png'
  );
});

test('h1 סמנטי קיים ואין כותרת גרפית כפולה (23.14)', async ({ page }) => {
  await page.goto('/luach/');
  const h1 = page.locator('h1');
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText('לוח שנה ירושלמי');
  await expect(page.locator('.luach-art')).toHaveCount(0);
  await expect(page.locator('.luach-wordmark img')).toHaveCount(1);
});

test('reduced motion מציג את הכותרת מיד — בלי אנימציה (23.14)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/luach/');
  const anim = await page
    .locator('#luach-wordmark')
    .evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toBe('none');
});

test('הכותרת שלמה ורספונסיבית — בלי חיתוך ב-390 וב-1440 (23.14)', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/luach/');
    const img = page.locator('#luach-wordmark');
    await expect(img).toBeVisible();
    const box = (await img.boundingBox())!;
    expect(box.width, `בתוך המסך ב-${width}px`).toBeLessThanOrEqual(width);
    expect(Math.abs(box.width / box.height - 1584 / 672), 'יחס הנכס נשמר').toBeLessThan(0.02);
  }
});

/* ===== לוח השנה — שליחה לטלפון בלחיצה אחת (23.5) ===== */

test('שליחה לטלפון מוסרת תמונת PNG אמיתית לחלון השיתוף (23.5)', async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __shared: unknown }).__shared = null;
    navigator.canShare = (d?: ShareData) => !!d?.files?.length;
    navigator.share = async (d?: ShareData) => {
      const files = await Promise.all(
        [...(d?.files ?? [])].map(async (f) => ({
          name: f.name,
          type: f.type,
          size: f.size,
          head: [...new Uint8Array((await f.arrayBuffer()).slice(0, 8))],
        }))
      );
      (window as unknown as { __shared: unknown }).__shared = { files, title: d?.title, text: d?.text };
    };
  });
  await page.goto('/luach/');
  await page.click('#open-vacations');
  await page.click('#vac-send');
  await page.waitForFunction(() => (window as unknown as { __shared: unknown }).__shared !== null);
  const shared = (await page.evaluate(() => (window as unknown as { __shared: unknown }).__shared)) as {
    files: { name: string; type: string; size: number; head: number[] }[];
    text: string;
  };
  expect(shared.files).toHaveLength(1);
  expect(shared.files[0].type).toBe('image/png');
  expect(shared.files[0].name).toBe('לוח-החופשות-תשפז.png');
  // חתימת PNG אמיתית — לא קובץ ריק ולא דמה
  expect(shared.files[0].head).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(shared.files[0].size).toBeGreaterThan(20_000);
  expect(shared.text).toContain('https://jerusalem-virid.vercel.app/luach/');
  await expect(page.locator('#vac-send-status')).toContainText('הועברה לחלון השיתוף');
});

test('בלי Web Share — הלחיצה מורידה את תמונת הלוח כקובץ אמיתי (23.5)', async ({ page }) => {
  await page.addInitScript(() => {
    delete (Navigator.prototype as unknown as Record<string, unknown>).share;
    delete (Navigator.prototype as unknown as Record<string, unknown>).canShare;
  });
  await page.goto('/luach/');
  await page.click('#open-vacations');
  const waitDownload = page.waitForEvent('download');
  await page.click('#vac-send');
  const download = await waitDownload;
  expect(download.suggestedFilename()).toBe('לוח-החופשות-תשפז.png');
  await expect(page.locator('#vac-send-status')).toContainText('הורדה');
});

/* ===== בחירת החטיבה — כרטיסי הבחירה והמסך (10/08/2026) =====
   הכניסה מהעמוד הראשי עצמה עברה משער "התחל" חוסם לשלוש כניסות ישירות
   (RULES 7.28, הוראת יניב 10/08/2026) — ראו tests/home-immediate.spec.ts.
   הבדיקות שלמטה עוסקות בעמוד `/shearim/` עצמו, שנשאר ללא שינוי. */

test('בחירת החטיבה: שני כרטיסי יוקרה קטנים וצבעוניים — לא חצאי מסך (10/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/shearim/');
  await page.waitForTimeout(700);

  const cards = page.locator('.choice-card');
  await expect(cards).toHaveCount(2);

  const a = (await cards.nth(0).boundingBox())!;
  const b = (await cards.nth(1).boundingBox())!;

  // זה לצד זה, ברוחב שווה — אבל קומפקטיים, לא חצאי-ענק של המסך
  expect(Math.abs(a.width - b.width), 'רוחב שווה').toBeLessThanOrEqual(2);
  expect(Math.abs(a.y - b.y), 'אותה שורה').toBeLessThanOrEqual(2);
  expect(a.width, 'כרטיס קטן ועדין — לא חצי מסך').toBeLessThanOrEqual(560);
  expect(a.height, 'גובה מרוסן').toBeLessThanOrEqual(440);
  expect(a.height, 'ועדיין נוכח ונוח').toBeGreaterThanOrEqual(150);

  // שניהם בהירים ועדינים — אין עוד חצי נייבי קודר
  const lum = (rgb: string) => {
    const m = rgb.match(/\d+/g);
    if (!m) return 255;
    const [r, g, bl] = m.map(Number);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  for (const i of [0, 1]) {
    const bg = await cards.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor);
    const title = await cards.nth(i).locator('.card-title').evaluate((el) => getComputedStyle(el).color);
    expect(lum(bg), `כרטיס ${i}: רקע בהיר ועדין`).toBeGreaterThan(200);
    expect(lum(title), `כרטיס ${i}: כותרת כהה וקריאה`).toBeLessThan(90);
    await expect(cards.nth(i).locator('.card-chip'), `כרטיס ${i}: שבב צבעוני`).toBeVisible();
  }

  // כל כרטיס הוא קישור אמיתי לחטיבה
  expect(await cards.nth(0).getAttribute('href')).toBe('/chativat-beynayim/');
  expect(await cards.nth(1).getAttribute('href')).toBe('/chativa-elyona/');

  // הסצנה מתחילה מיד מתחת לניווט — בלי רצועה לבנה — ויורדת עד תחתית המסך
  const scene = (await page.locator('.gate-scene').boundingBox())!;
  const header = (await page.locator('.site-header').boundingBox().catch(() => null)) ?? { y: 0, height: 0 };
  expect(scene.y, 'הצבע נוגע בניווט').toBeLessThanOrEqual(header.y + header.height + 2);
  expect(scene.height, 'הסצנה ממלאת את המסך').toBeGreaterThanOrEqual(440);

  // רצועת הווטסאפ ופס התחתית הכחול נשמרים (7.24, 7.27)
  await expect(page.locator('.wa-band')).toBeVisible();
  await expect(page.locator('.footer-navy')).toHaveCount(1);
});

for (const [label, w, h] of [
  ['מחשב', 1440, 900],
  ['נייד', 390, 844],
] as const) {
  test(`בחירת החטיבה (${label}): כפתור חזרה לעמוד הראשי בתחתית העמוד (7.29)`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/shearim/');
    await page.waitForTimeout(900);

    const back = page.locator('.back-home');
    await expect(back).toHaveCount(1);
    await expect(back).toBeVisible();
    expect(await back.getAttribute('href'), 'מוביל לעמוד הראשי').toBe('/');

    // מטרת מגע תקינה, ובתחתית האזור הצבוע — לא באמצעו
    const b = (await back.boundingBox())!;
    const scene = (await page.locator('.gate-scene').boundingBox())!;
    expect(b.height, 'מטרת מגע').toBeGreaterThanOrEqual(44);
    expect(b.y, 'בתחתית העמוד').toBeGreaterThan(scene.y + scene.height * 0.7);
    expect(b.y + b.height, 'בתוך האזור הצבוע').toBeLessThanOrEqual(scene.y + scene.height + 1);

    // לחיצה אמיתית שמחזירה לעמוד הראשי
    await back.click();
    await page.waitForURL((u) => new URL(u).pathname === '/');
  });
}

test('בחירת החטיבה: ריחוף מרים את הכרטיס בעדינות — בלי התנפחות חצאים (10/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/shearim/');
  await page.waitForTimeout(900);

  const card = page.locator('.choice-card').nth(0);
  const rest = (await card.boundingBox())!;
  await card.hover();
  await page.waitForTimeout(500);
  const hov = (await card.boundingBox())!;

  expect(rest.y - hov.y, 'הכרטיס מתרומם בעדינות').toBeGreaterThanOrEqual(2);
  expect(Math.abs(hov.width - rest.width), 'בלי שינוי רוחב — אין עוד התרחבות חצאים').toBeLessThanOrEqual(8);

  // הריחוף על כפתור החזרה אינו מזיז את הכרטיסים
  await page.locator('.back-home').hover();
  await page.waitForTimeout(500);
  const after = (await card.boundingBox())!;
  expect(Math.abs(after.width - rest.width), 'הכרטיסים יציבים').toBeLessThanOrEqual(2);
});

test('בחירת החטיבה בנייד: הכרטיסים נערמים בלי גלילה אופקית (10/08)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await assertRealMobile(page);
  await page.goto('/shearim/');
  await page.waitForTimeout(700);
  const cards = page.locator('.choice-card');
  const a = (await cards.nth(0).boundingBox())!;
  const b = (await cards.nth(1).boundingBox())!;
  expect(b.y, 'הכרטיס השני מתחת לראשון').toBeGreaterThan(a.y + a.height - 2);
  expect(a.height, 'כל כרטיס נשאר גדול ונוח למגע').toBeGreaterThanOrEqual(150);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});


test('בחירת החטיבה: הצבע יורד עד רצועת הווטסאפ, כיתוב הכיתות וחץ עדין (7.29)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/shearim/');
  await page.waitForTimeout(900);

  await expect(page.locator('.card-chip').nth(0)).toHaveText('כיתות ז׳–ט׳');
  await expect(page.locator('.card-chip').nth(1)).toHaveText('כיתות י׳–י״ב');
  await expect(page.locator('.card-cta svg')).toHaveCount(2);

  const split = (await page.locator('.gate-scene').boundingBox())!;
  expect(Math.abs(split.y + split.height - 900), 'הצבע מגיע לתחתית המסך').toBeLessThanOrEqual(3);

  // אחרי גלילה — רצועת הווטסאפ צמודה לצבע, בלי רצועה לבנה
  await page.locator('.wa-band').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const s2 = (await page.locator('.gate-scene').boundingBox())!;
  const wa = (await page.locator('.wa-band-wrap').boundingBox())!;
  expect(Math.abs(wa.y - (s2.y + s2.height)), 'אין שטח לבן בין הצבע לווטסאפ').toBeLessThanOrEqual(2);
});

for (const [label, w, h] of [
  ['מחשב', 1440, 900],
  ['נייד', 390, 844],
] as const) {
  test(`בחירת החטיבה (${label}): בלי פירורי לחם — הצבע נוגע בניווט העליון (7.29)`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/shearim/');
    await page.waitForTimeout(900);

    // שורת "ראשי › בחירת החטיבה" נמחקה מהעמוד הזה (5.13; חריג מפורש ל-5.3)
    await expect(page.locator('.crumbs')).toHaveCount(0);

    // הכותרת הסמנטית נשמרת — קיימת, בטקסט הנכון, ומוסתרת חזותית
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('בחירת החטיבה');
    const hb = (await h1.boundingBox())!;
    expect(hb.height, 'ה-h1 מוסתר חזותית ואינו תופס שטח').toBeLessThanOrEqual(2);

    // הצבע מתחיל מיד מתחת לניווט — אפס רצועה לבנה ביניהם
    const header = (await page.locator('#site-header').boundingBox())!;
    const split = (await page.locator('.gate-scene').boundingBox())!;
    expect(
      Math.abs(split.y - (header.y + header.height)),
      'אין רצועה לבנה בין הניווט לצבע'
    ).toBeLessThanOrEqual(2);

    // והשטח שהתפנה באמת תפוס בחצי צבוע — לא ברקע העמוד
    const filled = await page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return !!el?.closest('.gate-scene');
    }, [Math.round(w / 2), Math.round(split.y + 6)] as [number, number]);
    expect(filled, 'הסצנה הצבועה ממלאת את השטח שמתחת לניווט').toBe(true);
  });
}

/** בהירות ממוצעת של כל עצירות הצבע בגרדיאנט — לזיהוי "כהה" בלי לנעול הקסה */
const gradientLuma = (bg: string) =>
  [...bg.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)].map(
    (m) => 0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]
  );

test('ניווט עליון: "ישראל ריאלית" במקום "הודעות", עם יעודכן בקרוב וחזרה (7.30)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  const nav = page.locator('#site-header .nav-list');
  await expect(nav.getByRole('link', { name: 'הודעות' })).toHaveCount(0);
  const link = nav.getByRole('link', { name: 'ישראל ריאלית' });
  await expect(link).toHaveCount(1);

  await link.click();
  await page.waitForURL('**/israel-realit/');
  await expect(page.locator('h1')).toHaveText('ישראל ריאלית');
  const lede = page.locator('.soon-lede');
  await expect(lede).toHaveText('יעודכן בקרוב');
  const size = await lede.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size, 'כיתוב גדול').toBeGreaterThanOrEqual(30);

  // כפתור החזרה מחזיר בפועל לעמוד שממנו הגענו
  const back = page.locator('#soon-back');
  await expect(back).toBeVisible();
  await back.click();
  await page.waitForURL((u) => !u.pathname.includes('israel-realit'));
});

test('תחתית האתר: בלוק הניווט נמחק, הפס הכחול סוגר את המסך (7.24)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');

  // כל מה שנמחק — בלי שריד אחד
  await expect(page.locator('.footer-nav')).toHaveCount(0);
  await expect(page.locator('.to-top')).toHaveCount(0);
  await expect(page.locator('.footer-brand')).toHaveCount(0);
  await expect(page.locator('nav[aria-label="ניווט תחתון"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'חזרה לראש העמוד' })).toHaveCount(0);

  // הקרדיט נשאר — השם בזהב בהיר וקריא על הכחול (7.24)
  const managed = page.locator('.footer-managed');
  await expect(managed).toHaveText('האתר מנוהל על ידי יניב רז');
  const nameLuma = gradientLuma(
    await managed.locator('strong').evaluate((el) => getComputedStyle(el).color)
  )[0];
  expect(nameLuma, 'שם המנהל בזהב בהיר').toBeGreaterThan(150);

  // הפס הכחול־הכהה סוגר את העמוד ממש
  const navy = page.locator('.footer-navy');
  await expect(navy).toHaveCount(1);
  const luma = gradientLuma(await navy.evaluate((el) => getComputedStyle(el).backgroundImage));
  expect(luma.length, 'לפס יש רקע צבעוני').toBeGreaterThan(0);
  expect(Math.max(...luma), 'הפס התחתון כחול־כהה').toBeLessThan(45);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const nb = (await navy.boundingBox())!;
  expect(nb.height, 'לפס יש נוכחות אמיתית כמו הפס העליון').toBeGreaterThanOrEqual(60);
  expect(Math.abs(nb.y + nb.height - 900), 'הפס הכחול הוא החלק הכי תחתון במסך').toBeLessThanOrEqual(3);

  // והירוק של הווטסאפ צמוד לו — בלי רווח ביניהם. נמדד על תיבת הפריסה
  // (offsetTop) ולא על ה-rect החזותי, שמושפע מאנימציית החשיפה בגלילה
  const flush = await page.evaluate(() => {
    const wrap = document.querySelector<HTMLElement>('.wa-band-wrap')!;
    const footer = document.querySelector<HTMLElement>('.site-footer')!;
    return {
      gap: Math.round(footer.offsetTop - (wrap.offsetTop + wrap.offsetHeight)),
      margin: getComputedStyle(footer).marginBlockStart,
    };
  });
  expect(flush.gap, 'הירוק צמוד לכחול').toBeLessThanOrEqual(1);
  expect(flush.margin, 'בלי מרווח מעל הפוטר בעמוד עם רצועת ווטסאפ').toBe('0px');
});

test('תחתית האתר: הפס הכחול סוגר גם עמוד בלי רצועת ווטסאפ (7.24)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/luach/');
  const navy = page.locator('.footer-navy');
  await expect(navy).toHaveCount(1);
  await expect(page.locator('.footer-nav')).toHaveCount(0);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  const nb = (await navy.boundingBox())!;
  expect(Math.abs(nb.y + nb.height - 900), 'הפס הכחול סוגר את העמוד').toBeLessThanOrEqual(3);
});

test('פס "מה צפוי?": הכיתוביות רצות מלמטה למעלה ברצף — לא רוטציה (7.20, הוראת יניב 10/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.rail')).toBeVisible();

  // אנימציה רציפה ואינסופית על המסילה, עם העותק הכפול שיוצר לולאה חלקה
  const track = page.locator('.rail .rail-track');
  await expect(track).toHaveCount(1);
  await expect(page.locator('.rail .rail-dup')).toHaveCount(1);
  const anim = await track.evaluate((el) => {
    const s = getComputedStyle(el);
    return { name: s.animationName, state: s.animationPlayState, iteration: s.animationIterationCount };
  });
  expect(anim.name, 'אנימציית rail-rise פעילה').toContain('rail-rise');
  expect(anim.state, 'המסילה רצה').toBe('running');
  expect(anim.iteration, 'לולאה אינסופית').toBe('infinite');

  // המסילה באמת נעה כלפי מעלה בין שתי מדידות
  const yAt = () => track.evaluate((el) => el.getBoundingClientRect().y);
  const y1 = await yAt();
  await page.waitForTimeout(1200);
  const y2 = await yAt();
  expect(y1 - y2, 'המסילה עולה מלמטה למעלה').toBeGreaterThan(0.5);

  // ריחוף עוצר את הריצה (7.20)
  await page.locator('.rail-title').hover();
  const paused = await track.evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(paused, 'ריחוף עוצר').toBe('paused');
});

/* ===== מערכת ההטמעות — חצי-חצי מדויק, גובה שווה ומסגרת משותפת (06/08/2026) ===== */

for (const [w, h] of [
  [1440, 900],
  [1920, 1080],
] as const) {
  test(`עמוד משאב ב-${w}: שני הצדדים שווים ברוחב ובגובה עד פיקסל (8.2)`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    for (const route of [
      '/chativat-beynayim/reader/z/tochnit-z/', // HTML מלא שנגזר מ-PDF רשמי
      '/chativat-beynayim/reader/z/misparim/', // אלגברה — פעילות אינטראקטיבית
      '/chativat-beynayim/reader/z/maf-02/', // מקטע מהחוזר
    ]) {
      await page.goto(route);
      const view = (await page.locator('.res-view').boundingBox())!;
      const panel = (await page.locator('.res-panel').boundingBox())!;

      expect(Math.abs(view.width - panel.width), `${route}: רוחב שווה`).toBeLessThanOrEqual(1);
      expect(Math.abs(view.y - panel.y), `${route}: אותו קו עליון`).toBeLessThanOrEqual(1);

      // אזור צפייה נדיב בכל סוג משאב
      expect(view.height, `${route}: אזור צפייה גדול`).toBeGreaterThanOrEqual(560);

      // צד המידע אינו נמתח לגובה ההטמעה — אין בו שטח לבן ענק
      expect(panel.height, `${route}: אין שטח לבן מיותר משמאל`).toBeLessThan(view.height);
      expect(view.x, `${route}: ההטמעה בצד ימין (RTL)`).toBeGreaterThan(panel.x);

      // המרווח בין הצדדים משמעותי ואינו חופף
      const gap = view.x - (panel.x + panel.width);
      expect(gap, `${route}: gap יוקרתי`).toBeGreaterThanOrEqual(30);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${route}: אין גלילה אופקית`).toBeLessThanOrEqual(1);
    }
  });
}

test('עמוד מסמך שלם בהטמעה, וכל הפעולות רק בצד שמאל (הוראת יניב, 06/08)', async ({ page }) => {
  for (const [w, h] of [
    [1440, 900],
    [1920, 1080],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(PUBLIC_DOC_RESOURCE);

    const f = (await page.locator('.res-frame iframe').boundingBox())!;
    expect(f.height / f.width, `${w}: יחס עמוד — כל רוחב הדף נראה`).toBeGreaterThan(1.3);
    expect(f.height, `${w}: עמוד שלם ולא חתוך`).toBeGreaterThanOrEqual(640);

    // הגלילה בתוך ההטמעה אנכית בלבד
    const view = (await page.locator('.res-view').boundingBox())!;
    expect(f.width, `${w}: ההטמעה ממלאת את רוחב הצד`).toBeGreaterThan(view.width - 30);

    // כל כפתורי הפעולה נמצאים רק בצד שמאל, מחוץ לאזור ההטמעה
    const xs = await page
      .locator('.orbs .orb:visible, .res-pager a, .res-back')
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().right));
    expect(xs.length, 'יש לוח פעולות').toBeGreaterThan(3);
    for (const right of xs) expect(right, `${w}: פעולה בצד שמאל בלבד`).toBeLessThanOrEqual(view.x + 1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `${w}: אין גלילה אופקית`).toBeLessThanOrEqual(1);
  }
});

test('הטמעות אתר שלם גדולות ומרווחות — לא קורסות לגובה ברירת מחדל (9.1)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [route, sel] of [
    ['/chativat-beynayim/', '.mam-frame'],
    ['/chativat-beynayim/reader/z/misparim/', '.res-frame'],
  ] as const) {
    await page.goto(route);
    const frame = (await page.locator(sel).boundingBox())!;
    const iframe = (await page.locator(`${sel} iframe`).boundingBox())!;
    // 150px הוא גובה ברירת המחדל של iframe — קריסה כזו קרתה בעבר
    expect(frame.height, `${sel}: מסגרת גדולה ומרווחת`).toBeGreaterThanOrEqual(700);
    expect(iframe.height, `${sel}: ההטמעה ממלאת את המסגרת`).toBeGreaterThanOrEqual(frame.height - 30);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `${route}: אין גלילה אופקית`).toBeLessThanOrEqual(1);
  }
});

test('כל ההטמעות חולקות את אותה מסגרת (.embed-frame) — לא CSS מקומי (8.26)', async ({ page }) => {
  const seen: Record<string, string> = {};
  for (const [route, sel] of [
    ['/chativat-beynayim/reader/z/amat-tashpaz/', '.res-frame'],
    ['/chativat-beynayim/', '.mam-frame'],
    ['/chativat-beynayim/reader/z/misparim/', '.res-frame'],
    ['/hozer-mafmar/', '.viewer-shell'],
  ] as const) {
    await page.goto(route);
    const el = page.locator(sel).first();
    await expect(el, `${sel} משתמש במסגרת המשותפת`).toHaveClass(/embed-frame/);
    seen[sel] = await el.evaluate((n) => {
      const s = getComputedStyle(n);
      // גם ה-pseudo-element נבדק: ::after מקומי היה עוקף את המשותף בשקט
      const a = getComputedStyle(n, '::after');
      return [s.borderTopLeftRadius, s.paddingTop, s.boxShadow, a.backgroundImage, a.borderTopLeftRadius].join('|');
    });
  }
  const values = [...new Set(Object.values(seen))];
  expect(values.length, `מסגרת אחידה בפועל: ${JSON.stringify(seen)}`).toBe(1);
});

test('UnitPlaylist: שתי עמודות שוות והרשימה באמת גוללת בתוך גובה מוגבל', async ({ page }) => {
  // המסלול עודכן (Issue #73): ‏`/chativat-beynayim/mishvaot/` אינו עוד עמוד נגן
  // אלא הפניה לנושא הקנוני, ולכן חוזה הפריסה של הרכיב נאכף כאן על המסלול החי
  // שבו הוא באמת מוצג — מיזם ה-AI. ההגנה זהה: שתי עמודות שוות, גלילה פנימית
  // אמיתית ואפס גלילה אופקית.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pituach-miktzoi/ai-geometria/');

  const viewer = (await page.locator('.uplay-viewer').boundingBox())!;
  const list = (await page.locator('.uplay-list').boundingBox())!;
  expect(Math.abs(viewer.width - list.width), 'שתי העמודות שוות ברוחב').toBeLessThanOrEqual(1);
  expect(Math.abs(viewer.height - list.height), 'שתי העמודות שוות בגובה').toBeLessThanOrEqual(1);

  // הוכחה מספרית: הרשימה ארוכה מהגובה שלה ולכן היא גוללת בפנים
  const proof = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('.uplay-list')!;
    const before = el.scrollTop;
    el.scrollTop = 200;
    const after = el.scrollTop;
    el.scrollTop = before;
    return { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, moved: after, overflowY: getComputedStyle(el).overflowY };
  });
  expect(proof.overflowY).toBe('auto');
  expect(proof.scrollHeight, 'התוכן ארוך מגובה הרשימה').toBeGreaterThan(proof.clientHeight + 40);
  expect(proof.moved, 'הרשימה זזה בפועל בגלילה').toBeGreaterThan(0);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('בנייד: ההטמעה ראשונה, בלי גלילה אופקית ובלי scrollbar בלוח המידע (8.6)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await assertRealMobile(page);
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  const view = (await page.locator('.res-view').boundingBox())!;
  const panel = (await page.locator('.res-panel').boundingBox())!;
  expect(view.y, 'ההטמעה לפני ההסבר').toBeLessThan(panel.y);
  const panelScrolls = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>('.res-panel')!;
    return { over: getComputedStyle(el).overflowY, extra: el.scrollHeight - el.clientHeight };
  });
  expect(panelScrolls.extra, 'אין scrollbar פנימי בלוח המידע בנייד').toBeLessThanOrEqual(1);
  expect(view.height, 'ההטמעה גדולה ושימושית בנייד').toBeGreaterThanOrEqual(400);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

/* ===== חוזר מפמ״ר: מסך מחולק (החוזר מימין, פעולות משמאל), מדריך ניווט
   מתחת, התמונה אחרונה (הוראת יניב, 06/08/2026) ===== */

test('חוזר מפמ״ר: החוזר עצמו למעלה — לפני כפתורי הקפיצה, המקטעים והתמונה', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => true, configurable: true })
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hozer-mafmar/');

  const y = async (sel: string) => (await page.locator(sel).first().boundingBox())!.y;
  const viewer = await y('.viewer');
  const jumps = await y('.part-jumps');
  const sections = await y('.sections-block');
  const banner = await y('.art-banner');

  expect(viewer, 'החוזר מוצג לפני כפתורי הקפיצה').toBeLessThan(jumps);
  expect(jumps, 'כפתורי הקפיצה לפני אינדקס המקטעים').toBeLessThan(sections);
  expect(banner, 'התמונה הכי למטה — אחרי כל שאר התוכן').toBeGreaterThan(sections);
  const last = await page.evaluate(() => {
    const kids = [...document.querySelectorAll('.page > *')];
    return kids[kids.length - 1]?.className ?? '';
  });
  expect(last, 'התמונה היא הרכיב האחרון בעמוד').toContain('art-banner');
});

test('חוזר מפמ״ר: מסך מחולק 50/50 — החוזר מימין, לוח הפעולות משמאל, עמוד שלם ביחס A4 (8.2)', async ({ page }) => {
  // ה-Chromium של הבדיקות מדווח pdfViewerEnabled=false; כאן נמדד מסלול
  // הדפדפן האמיתי עם מציג PDF, שבו ההטמעה חיה.
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => true, configurable: true })
  );
  for (const size of [
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/hozer-mafmar/');
    await expect(page.locator('#viewer-open-card')).toBeHidden();
    await expect(page.locator('#viewer-shell')).toBeVisible();
    // הפריסה מתייצבת לפני המדידה: גופנים + שני frames של rAF (יחס ה-A4
    // נגזר מהרוחב, ופס גלילה אנכי עלול לצוץ אחרי הפריסה הראשונה)
    await page.evaluate(
      () =>
        document.fonts.ready.then(
          () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        )
    );

    // מדידה אטומית אחת (הוראת יניב, 06/08/2026). `.res-split` בעמוד הזה נושא
    // `data-reveal`, שמנפיש על ההורה של שני החצאים `translateY(26px) → 0` למשך
    // 700ms. ארבע קריאות `boundingBox()` נפרדות הן ארבע פניות פרוטוקול, ותחת
    // `--workers=4` ההורה זז ביניהן — כך נולד הפרש מדומה של עד ~8px בין
    // `view.y` ל-`panel.y` בלי שום תזוזה אמיתית בפריסה (נמדד: ההורה ב-
    // `matrix(1,0,0,1,0,6.60–8.17)` ברגע המדידה; הכשלים היו 3.005 / 4.515 / 7.343).
    // קריאה אחת מודדת את ארבעתן באותו frame, ולכן תזוזת ההורה משותפת ומתבטלת.
    // הסובלנות נשארה `<= 3` — החוזה לא הוחלש, רק הוסר ארטיפקט הדגימה.
    // אין להמתין ל-`document.getAnimations()` כאן: באתר יש אנימציות אינסופיות
    // (`logo-spin`, פס התקדמות הגלילה, טבעת/הילת האורבים) וההמתנה לא תסתיים.
    const { view, panel, shell, frame } = await page.evaluate(() => {
      const rect = (sel: string) => {
        const { x, y, width, height } = document.querySelector(sel)!.getBoundingClientRect();
        return { x, y, width, height };
      };
      return {
        view: rect('.res-view'),
        panel: rect('.res-panel'),
        shell: rect('#viewer-shell'),
        frame: rect('#mafmar-frame'),
      };
    });

    // חצי-חצי מדויק: שתי העמודות שוות ברוחב ומתחילות באותו קו עליון
    expect(Math.abs(view.width - panel.width), `${size.width}: שני הצדדים שווים ברוחב`).toBeLessThanOrEqual(3);
    expect(Math.abs(view.y - panel.y), `${size.width}: שני הצדדים באותו קו עליון`).toBeLessThanOrEqual(3);
    // ב-RTL ההטמעה בצד ימין (x גדול יותר) והפעולות משמאל
    expect(view.x, `${size.width}: ההטמעה בצד ימין`).toBeGreaterThan(panel.x);

    // עמוד שלם ביחס A4 אמיתי של המסמך (595.32×841.92) — לא חלק ממנו
    const ratio = shell.height / shell.width;
    expect(ratio, `${size.width}: מסגרת הצפייה ביחס העמוד`).toBeGreaterThan(1.36);
    expect(ratio, `${size.width}: מסגרת הצפייה ביחס העמוד`).toBeLessThan(1.47);
    expect(shell.height, `${size.width}: העמוד גדול ושימושי`).toBeGreaterThan(520);

    // ההטמעה ממלאת את המסגרת — בלי מסגרת בתוך מסגרת
    expect(shell.width - frame.width, `${size.width}: ה-iframe ממלא את המסגרת`).toBeLessThanOrEqual(20);
    expect(shell.height - frame.height, `${size.width}: ה-iframe ממלא את המסגרת`).toBeLessThanOrEqual(20);
  }
});

test('חוזר מפמ״ר: בלי מציג PDF — כרטיס פתיחה אמיתי, בלי מסגרת ריקה ובלי דפדוף מדומה (8.8)', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => false, configurable: true })
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hozer-mafmar/');
  await expect(page.locator('#viewer-shell'), 'בלי מסגרת ריקה').toBeHidden();
  await expect(page.locator('.viewer-pager'), 'בלי דפדוף שאין לו מה לדפדף').toBeHidden();
  const card = page.locator('#viewer-open-card');
  await expect(card).toBeVisible();
  expect((await card.boundingBox())!.height, 'הכרטיס נוכח ואינו פס דק').toBeGreaterThan(300);
  // קפיצה למקטע מכוונת את הכרטיס לעמוד הנכון
  await page.locator('#MAF-13 [data-goto]').click();
  await expect(page.locator('#open-card-link')).toHaveAttribute('href', /#page=11$/);
});

test('חוזר מפמ״ר: דפדוף אמיתי עמוד-עמוד, בלי סרגל ה-PDF של הדפדפן (8.26)', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => true, configurable: true })
  );
  await page.goto('/hozer-mafmar/');
  const frame = page.locator('#mafmar-frame');
  const prev = page.locator('#pg-prev');
  const next = page.locator('#pg-next');

  await expect(prev, 'בעמוד הראשון אין "קודם"').toBeDisabled();
  await expect(page.locator('#pg-counter')).toHaveText(/עמוד 1 מתוך 18/);
  await next.click();
  await expect(frame).toHaveAttribute('src', /#page=2&/);
  await expect(page.locator('#pg-counter')).toHaveText(/עמוד 2 מתוך 18/);
  await expect(prev).toBeEnabled();
  await expect(frame, 'בלי סרגל PDF שחור ובלי חלונית ניווט').toHaveAttribute(
    'src',
    /toolbar=0&navpanes=0/
  );
});

test('חוזר מפמ״ר: אין כיתובי דמו בטקסט הגלוי (8.25, 8.26)', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => true, configurable: true })
  );
  await page.goto('/hozer-mafmar/');
  const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  // בדיוק המילים ש-8.25 אוסר בטקסט גלוי, ועוד שרידי הניסוח שנמחק
  for (const banned of [
    'מאומת', 'מאומתים', 'אומתו', 'בדוקים', 'רשמיים', 'נכרה ואומת',
    'מחליף:', 'עותק מאומת', 'מקור האמת', 'Lorem', 'TODO', 'משאבים',
  ]) {
    expect(text, `כיתוב דמו על המסך: ${banned}`).not.toContain(banned);
  }
  // שלד הטעינה וכרטיס הפתיחה לא גונבים חצי עמוד כשיש מציג PDF
  const leaked = await page.evaluate(
    () =>
      [...document.querySelectorAll('#viewer-open-card[hidden]')].filter(
        (el) => getComputedStyle(el).display !== 'none'
      ).length
  );
  expect(leaked, 'כרטיס הפתיחה מוסתר באמת כשיש מציג PDF').toBe(0);
});

test('חוזר מפמ״ר: קפיצה למקטע לא נבלעת מתחת לכותרת הדביקה (5.17)', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => true, configurable: true })
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hozer-mafmar/');
  await page.locator('#MAF-13 [data-goto]').click();
  await expect(page).toHaveURL(/#MAF-13$/);
  const geo = await page.evaluate(() => ({
    header: document.querySelector('header')!.getBoundingClientRect().bottom,
    stage: document.querySelector('.viewer-stage')!.getBoundingClientRect().top,
  }));
  expect(geo.stage, 'ראש ההטמעה נשאר מתחת לכותרת הדביקה').toBeGreaterThanOrEqual(geo.header - 1);
});

test('חוזר מפמ״ר: כפתורי החלקים נושאים עוגן אמיתי וקישור משותף משחזר אותם (9.3.12)', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => true, configurable: true })
  );
  await page.goto('/hozer-mafmar/');
  const parts = page.locator('.part-btn');
  await expect(parts).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    await expect(parts.nth(i), 'לכל חלק יש id — אחרת ה-hash מצביע לשומקום').toHaveAttribute('id', `part-${i + 1}`);
  }
  await parts.nth(1).click();
  await expect(page).toHaveURL(/#part-2$/);
  await expect(page.locator('#part-2'), 'החלק הנבחר מודגש').toHaveClass(/is-active/);
  // הקישור ששותף באמת פותח את החלק מחדש
  await page.goto('/hozer-mafmar/#part-2');
  await expect(page.locator('#part-2')).toHaveClass(/is-active/);
  await expect(page.locator('#mafmar-frame')).toHaveAttribute('src', /#page=10&/);
});

test('חוזר מפמ״ר: hidden באמת מסתיר — אין כפתור "מסך מלא" מת (5.13, 8.26)', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'pdfViewerEnabled', { get: () => true, configurable: true });
    Object.defineProperty(document, 'fullscreenEnabled', { get: () => false, configurable: true });
  });
  await page.goto('/hozer-mafmar/');
  await expect(page.locator('#fullscreen-btn'), 'בלי תמיכה במסך מלא — הכפתור לא מוצג').toBeHidden();
  // הכלל הגלובלי, לא תיקון מקומי: כל [hidden] בעמוד באמת נעלם
  const leaked = await page.evaluate(
    () => [...document.querySelectorAll('[hidden]')].filter((el) => getComputedStyle(el).display !== 'none').length
  );
  expect(leaked, 'שום אלמנט עם hidden אינו נשאר על המסך').toBe(0);
});

test('חוזר מפמ״ר: ניגודיות AA בכיתובים הקטנים והצבעוניים (4.7, 21.18)', async ({ page }) => {
  await page.goto('/hozer-mafmar/');
  const bad = await page.evaluate(() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d', { willReadFrequently: true })!;
    const rgb = (c: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = (c: string) => {
      const [r, g, b] = rgb(c).map((v) => {
        const n = v / 255;
        return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const out: string[] = [];
    for (const sel of ['.maf-id', '.part-num', '.maf-meta', '.viewer-status', '.part-page']) {
      document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
        const cs = getComputedStyle(el);
        let bg = 'rgb(255,255,255)';
        let p: HTMLElement | null = el;
        while (p) {
          const c = getComputedStyle(p).backgroundColor;
          if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') { bg = c; break; }
          p = p.parentElement;
        }
        const a = lum(cs.color);
        const z = lum(bg);
        const ratio = (Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05);
        const px = parseFloat(cs.fontSize);
        const large = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight) >= 700);
        const need = large ? 3 : 4.5;
        if (ratio < need) out.push(`${sel} ${px}px → ${ratio.toFixed(2)}:1 (דרוש ${need})`);
      });
    }
    return [...new Set(out)];
  });
  expect(bad, 'כל כיתוב עובר את סף הניגודיות הנדרש').toEqual([]);
});
