import { expect, test } from '@playwright/test';
import { choveret, gradeMainDocs, itemHref, type ChoveretGrade } from '../src/data/choveret';
import { canonicalReaderItems } from '../src/data/canonical-content';

/**
 * חוזה טבלת הקישורים של חטיבת הביניים (RULES 3.32, הוראת יניב 09/08/2026):
 * הטבלה משמרת את הפונקציות של הטבלה הישנה — אך כל תא מוביל למקביל הרשמי
 * של תשפ״ז. מסמך תשפ״ו אינו fallback כאשר קיים מקור תשפ״ז, וכל היעדים
 * נגזרים מהמזהים הקנוניים שב-`src/data/choveret.ts` — אין רשימת כתובות
 * שנייה בטבלה ואין כאן: הציפיות מחושבות מאותם נתונים שהעמוד צורך.
 */
test.skip(({ isMobile }) => isMobile === true, 'link-table contract is device-independent');

const gradeOf = (slug: string): ChoveretGrade => choveret.find((g) => g.slug === slug)!;
const itemOf = (slug: string, id: string) => {
  const grade = gradeOf(slug);
  const item = grade.chapters.flatMap((c) => c.items).find((entry) => entry.id === id);
  expect(item, `${slug}/${id} קיים בקטלוג הקנוני`).toBeTruthy();
  return item!;
};

/**
 * המסמכים הרשמיים של תשפ״ז — הליבה של הטבלה. לכל מזהה קנוני: קובץ המקור
 * בתיקיית tashpaz של משרד החינוך והעותק המאומת שבריפו (RULES 9.8.2).
 */
const TASHPAZ_DOCS: ReadonlyArray<{ grade: string; id: string; remote: string; local: string }> = [
  { grade: 'z', id: 'tochnit-z', remote: 'plan_7.pdf', local: '/docs/plan-7-tashpaz.pdf' },
  { grade: 'z', id: 'prisa-z', remote: 'prisa_7.pdf', local: '/docs/prisa-7-tashpaz.pdf' },
  { grade: 'h', id: 'tochnit-h', remote: 'plan_8.pdf', local: '/docs/plan-8-tashpaz.pdf' },
  { grade: 'h', id: 'prisa-h', remote: 'prisa_8.pdf', local: '/docs/prisa-8-tashpaz.pdf' },
  { grade: 't', id: 'tochnit-t', remote: 'plan_9A.pdf', local: '/docs/plan-9a-tashpaz.pdf' },
  { grade: 't', id: 'prisa-t', remote: 'prisa_9A.pdf', local: '/docs/prisa-9a-tashpaz.pdf' },
  { grade: 't', id: 'tochnit-t-b', remote: 'plan_9B.pdf', local: '/docs/plan-9b-tashpaz.pdf' },
  { grade: 't', id: 'prisa-t-b', remote: 'prisa_9B.pdf', local: '/docs/prisa-9b-tashpaz.pdf' },
];

test('כל תוכניות ופריסות תשפ״ז מחוברות למקור הרשמי ולעותק המאומת — לא לתשפ״ו', () => {
  for (const doc of TASHPAZ_DOCS) {
    const item = itemOf(doc.grade, doc.id);
    expect(item.url, `${doc.id}: המקור הרשמי בתיקיית tashpaz`).toContain('/tashpaz/');
    expect(item.url.endsWith(`/${doc.remote}`), `${doc.id}: הקובץ הרשמי ${doc.remote}`).toBe(true);
    expect(new URL(item.url).hostname, `${doc.id}: דומיין משרד החינוך`).toBe(
      'meyda.education.gov.il'
    );
    expect(item.download, `${doc.id}: העותק המאומת בריפו`).toBe(doc.local);
    expect(item.embed?.startsWith(doc.local), `${doc.id}: ההטמעה מהעותק המאומת`).toBe(true);
  }

  // עמ״ט — רק מסמך תשפ״ז האמיתי שאליו מפנה החוזר (RULES 9.8.4)
  const amat = itemOf('z', 'amat-tashpaz');
  expect(amat.url.endsWith('/tashpaz/amat.pdf'), 'עמ״ט תשפ״ז בלבד').toBe(true);
});

/**
 * רשימת החסימה הקשיחה של RULES 16.9 — מזהי Google של תשפ״ו שהוחלפו.
 * הרשימה כאן היא אכיפה של סעיף החסימה, לא מקור תוכן; מקורה היחיד ב-RULES.
 */
const BLOCKED_TASHPAV_IDS = [
  '1X0eGs1fvFdvk6429mCfYcIvDQeuGGa1BzHAmxI4dQrg', // תוכנית הוראה ח׳ תשפ״ו — המקרה שדווח
  '14KjhWbFLH_xACivC32ETs0jyN7CwWadX9Q0NzxkclwY',
  '17bGFCtZjygxCWsj3Dya8la4trFfW2QYq',
  '1Fyy98IMHRtDoex4RhrPbUWDgCxE3vzhM',
  '1l40XxpILIZPGNqPBkCDAfUcJR5Njl1JP',
  '1kFCQt_dIwtvRK4gjC3mVNEQmxENRCppC',
  '1M0xtCJTqiOZEyYsG4SOZIZU8FsbnO2X6iuqGeBB9_dA',
  '1mLDtQqvYkOX3tQLdC9AcPVjeC36jodXJzzGP-gZ_0oI',
  '1hVEXoMaz55Bh0TbCZlJBDIYs7T-MM-sRSHu1zbd2Qjk',
  '1sjF0sQTi9xZeNpDaZ-gOzhqLP4KGRy1Fr5zeCcYC168',
  '1D4JdPdoOMc23XgMCbAv24D28tW7VkUyoK19U3ZVHAQE',
  '1u98c3VxZYCvuy9LPV-MzZyLKzYB6vI1I',
  '1bYWFDV0wPw-5BcawE6bCnnV9AmobaL-X', // חוזר מפמ״ר תשפ״ו
  'DAGMyXpeCoo', // מצגת חוזר מפמ״ר תשפ״ו
] as const;

test('אף משאב קנוני פעיל אינו מפנה למזהה תשפ״ו חסום (16.9)', () => {
  const leaks: string[] = [];
  for (const { grade, item } of canonicalReaderItems) {
    const haystack = [item.url, item.embed, item.download].filter(Boolean).join(' ');
    for (const blocked of BLOCKED_TASHPAV_IDS) {
      if (haystack.includes(blocked)) {
        leaks.push(`${grade.slug}/${item.id} → ${blocked}`);
      }
    }
  }
  expect(leaks, `מזהי תשפ״ו חסומים בקטלוג הפעיל:\n${leaks.join('\n')}`).toEqual([]);
});

test('הטבלה בעמוד חטיבת הביניים: כל תא מוביל ליעד הקנוני של תשפ״ז', async ({ page }) => {
  await page.goto('/chativat-beynayim/');
  const table = page.locator('.quick-links');
  await expect(table, 'טבלת הקישורים קיימת בעמוד').toHaveCount(1);

  // הציפיות מחושבות מאותם נתונים קנוניים שהעמוד צורך — לא רשימה שנייה.
  const z = gradeOf('z');
  const h = gradeOf('h');
  const t = gradeOf('t');
  const expected: ReadonlyArray<[string, string]> = [
    ['תוכנית הלימודים', itemHref('z', itemOf('z', 'tochnit-limudim-z'))],
    ['תוכנית הוראה ז׳', itemHref('z', gradeMainDocs(z).plan!.item)],
    ['פריסת הוראה ז׳', itemHref('z', gradeMainDocs(z).prisa!.item)],
    ['פריסת הוראה ז׳ עמ״ט', itemHref('z', itemOf('z', 'amat-tashpaz'))],
    ['תוכנית הוראה ח׳', itemHref('h', gradeMainDocs(h).plan!.item)],
    ['פריסת הוראה ח׳', itemHref('h', gradeMainDocs(h).prisa!.item)],
    ['פריסת הוראה ח׳ עמ״ט', itemHref('h', itemOf('h', 'amat-tashpaz'))],
    ['תוכנית הוראה ט׳', itemHref('t', gradeMainDocs(t).plan!.item)],
    ['פריסת הוראה ט׳', itemHref('t', gradeMainDocs(t).prisa!.item)],
    ['תוכנית הוראה ט׳ מצומצמת', itemHref('t', itemOf('t', 'tochnit-t-b'))],
    ['פריסת הוראה ט׳ מצומצמת', itemHref('t', itemOf('t', 'prisa-t-b'))],
    ['חומרי הוראה — המרחב הפדגוגי', itemHref('z', itemOf('z', 'merchav-chatb'))],
  ];

  for (const [label, href] of expected) {
    const link = table.locator(`a:text-is("${label}")`);
    await expect(link, `"${label}" קיים בטבלה פעם אחת`).toHaveCount(1);
    await expect(link, `"${label}" מוביל ליעד הקנוני`).toHaveAttribute('href', href);
  }

  // תוכנית הוראה ח׳ — העוגן המפורש שנדרש: המזהה הקנוני tochnit-h של תשפ״ז.
  await expect(table.locator('a:text-is("תוכנית הוראה ח׳")')).toHaveAttribute(
    'href',
    '/chativat-beynayim/reader/h/tochnit-h/'
  );

  // אף קישור בטבלה אינו Google Docs ואינו נושא מזהה תשפ״ו חסום.
  const hrefs = await table.locator('a').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href') ?? '')
  );
  expect(hrefs.length, 'לטבלה יש קישורים אמיתיים').toBeGreaterThanOrEqual(12);
  for (const href of hrefs) {
    expect(href, 'אין מסמכי Google ישנים בטבלה').not.toContain('docs.google.com');
    for (const blocked of BLOCKED_TASHPAV_IDS) {
      expect(href, `אין מזהה תשפ״ו חסום בטבלה`).not.toContain(blocked);
    }
  }

  // תא ספטמבר קיים; תוכנו מנוהל בנפרד ואינו ננעל כאן.
  await expect(table.locator('a:has-text("ספטמבר")')).toHaveCount(1);
});

test('תוכנית הוראה ח׳ נפתחת בעמוד המשאב עם הקובץ המאומת של תשפ״ז', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/h/tochnit-h/');
  await expect(page.locator('.res-panel .res-title')).toHaveText('תוכנית הוראה ח׳');

  // הפעולות נבדקות לפי היעד האמיתי (8.4): הורדה מהעותק המאומת, מקור רשמי.
  await expect(page.locator('.orbs a[download], .orbs a[href="/docs/plan-8-tashpaz.pdf"]').first())
    .toHaveAttribute('href', '/docs/plan-8-tashpaz.pdf');
  const sourceHref = await page
    .locator('.orbs a[target="_blank"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
  expect(
    sourceHref.some((href) => href.endsWith('/tashpaz/plan_8.pdf')),
    'פתיחה במקור מובילה לקובץ הרשמי של תשפ״ז'
  ).toBe(true);
});
