import { test, expect, type Page } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

/**
 * בדיקות הקבלה של תיקון ה-UX המלא (RULES 19.34, הוראת יניב 04–05/08/2026):
 * hero מלא, חץ החזרה מכרטיס צוות, רצועת WhatsApp נקייה, באנר תמונה מלאה,
 * עמודי האינטרנט של חטיבת הביניים וכותרת ה-Lovable של לוח השנה.
 */

// מצבי מסך נבדקים במפורש דרך setViewportSize בפרויקט הדסקטופ; אין צורך
// בהרצה כפולה בפרופיל המובייל (מצב צר נבדק בבדיקה ייעודית)
test.skip(({ isMobile }) => isMobile === true, 'רץ בפרויקט הדסקטופ עם viewports מפורשים');

/* ===== עמוד הבית ===== */

test('ה-hero מלא: שכבת רקע על כל הרוחב, בלי רצועות שחורות (6.12)', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  const media = page.locator('#hero-media');
  const bg = page.locator('.hero-bg');
  const mb = (await media.boundingBox())!;
  const bb = (await bg.boundingBox())!;
  expect(mb.width, 'ה-hero פרוס לכל הרוחב').toBeGreaterThanOrEqual(1900);
  expect(bb.width, 'שכבת הרקע מכסה את כל האזור').toBeGreaterThanOrEqual(mb.width);
  const bgImage = await bg.evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bgImage, 'הרקע הוא ה-poster — לא שחור ריק').toContain('hero-poster');
});

test('ה-poster והווידאו באותן מידות — בלי קפיצת layout (6.12)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  const media = (await page.locator('#hero-media').boundingBox())!;
  const video = (await page.locator('#hero-video').boundingBox())!;
  expect(await page.locator('#hero-video').getAttribute('poster')).toContain('hero-poster');
  expect(Math.abs(video.height - media.height), 'הווידאו ממלא את גובה האזור').toBeLessThanOrEqual(2);
});

test('רצועת WhatsApp בלי משפט ההסבר שנמחק (7.27)', async ({ page }) => {
  await page.goto('/');
  const sub = page.locator('.wa-band-sub');
  await expect(sub).toHaveText('קבוצה של מורים למתמטיקה בחטיבת הביניים');
  await expect(page.locator('.wa-band')).not.toContainText('לחיצה בכל נקודה');
});

test('כרטיס צוות: חץ אחד בעיגול בלי כיתוב, בלי כפתור התחל, ושחזור התצוגה (6.5)', async ({ page }) => {
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
  // כפתור "התחל" מוסתר כל עוד מוצג מורה יחיד
  await expect(page.locator('.start-btn')).toBeHidden();
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

  // רצועת "כללי" — החומרים המשותפים לא אבדו
  await expect(page.locator('.klali-band')).toHaveAttribute('href', '/chativat-beynayim/klali/');
  await noOverflow(page, 'שער 1440');
});

test('שער חטיבת הביניים בנייד: השלישים נערמים ונשארים גדולים (19.32)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/chativat-beynayim/');
  const thirds = page.locator('.split3 .third');
  await expect(thirds).toHaveCount(3);
  const boxes = await thirds.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()));
  expect(boxes[1].y, 'השלישים נערמים זה מתחת לזה').toBeGreaterThan(boxes[0].y + 100);
  for (const b of boxes) expect(b.height, 'מטרת מגע גדולה').toBeGreaterThanOrEqual(44);
  await noOverflow(page, 'שער 390');
});

test('עמוד שכבה: פרקים, כרטיסי קבצים, סרגל קפיצה ומעבר בין שכבות (5.3–5.4)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/kita-z/');

  await expect(page.locator('h1.grade-title')).toHaveText('מתמטיקה לכיתה ז׳');

  // סרגל הקפיצה דביק ומכיל שבב לכל פרק, כל אחד ≥44px
  const chips = page.locator('.chapter-bar .chip');
  await expect(chips).toHaveCount(await page.locator('section.chapter').count());
  expect(await page.locator('.chapter-bar').evaluate((el) => getComputedStyle(el).position)).toBe('sticky');
  for (const h of await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height))) {
    expect(h, 'מטרת מגע ≥44px').toBeGreaterThanOrEqual(44);
  }

  // לחיצה על שבב מגלגלת לפרק הנכון
  const target = await chips.nth(1).getAttribute('href');
  await chips.nth(1).click();
  await expect(page).toHaveURL(new RegExp(`${target?.slice(1)}$`));

  // כל כרטיס מוביל ליעד אמיתי — עמוד משאב או עמוד פנימי
  const cards = page.locator('.rcard');
  expect(await cards.count(), 'יש כרטיסי קבצים').toBeGreaterThan(3);
  const hrefs = await cards.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')));
  for (const href of hrefs) expect(href, 'לכל כרטיס יעד').toMatch(/^\/(chativat-beynayim|chativa-elyona|hozer-mafmar)/);

  // מעבר לשכבה הבאה וחזרה לשער
  await expect(page.locator('.grade-pager a[href="/chativat-beynayim/kita-h/"]')).toHaveCount(1);
  await expect(page.locator('.grade-pager a[href="/chativat-beynayim/"]')).toHaveCount(1);
  await noOverflow(page, 'עמוד שכבה 1440');
});

test('עמוד שכבה "כללי" קיים ומציג את החומרים המשותפים (1.9)', async ({ page }) => {
  await page.goto('/chativat-beynayim/klali/');
  await expect(page.locator('h1.grade-title')).toHaveText('משותף לכל השכבות');
  expect(await page.locator('.rcard').count()).toBeGreaterThan(10);
});

test('עמוד משאב: חצי-חצי — הטמעה מימין, פעולות משמאל (8.2)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/reader/t/sheelot-t/');

  const view = (await page.locator('.res-view').boundingBox())!;
  const panel = (await page.locator('.res-panel').boundingBox())!;
  expect(view.x, 'ההטמעה בצד ימין (RTL)').toBeGreaterThan(panel.x);
  const ratio = view.width / (view.width + panel.width);
  expect(ratio, 'חלוקה מאוזנת בקירוב חצי-חצי').toBeGreaterThan(0.42);
  expect(ratio, 'חלוקה מאוזנת בקירוב חצי-חצי').toBeLessThan(0.62);

  // לוח הפעולות המלא
  await expect(page.locator('.res-actions .btn-whatsapp')).toHaveCount(1);
  await expect(page.locator('.res-actions .btn-gmail')).toHaveCount(1);
  await expect(page.locator('.res-actions [data-copy]')).toHaveCount(1);
  await expect(page.locator('.res-actions a[target="_blank"]')).not.toHaveCount(0);

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
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  const pager = page.locator('.res-pager a.pager-link');
  expect(await pager.count(), 'יש שכן אחד לפחות').toBeGreaterThan(0);
  const href = await pager.first().getAttribute('href');
  expect(href).toMatch(/^\/chativat-beynayim\/reader\/z\//);
  // חזרה אל הפרק שממנו הגענו
  await expect(page.locator('.res-back')).toHaveAttribute('href', /\/chativat-beynayim\/kita-z\/#/);
});

test('עמוד משאב במסך רחב: פס גלילה אחד — העמוד עצמו אינו נגלל (הוראת יניב, 06/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of [
    '/chativat-beynayim/reader/z/misparim/', // אתר חי מוטמע — כאן נוצר פס הגלילה הכפול
    '/chativat-beynayim/reader/t/sheelot-t/', // מסמך
    '/chativat-beynayim/reader/z/maf-02/', // טווח מהחוזר
  ]) {
    await page.goto(route);
    const scroll = await page.evaluate(
      () => document.documentElement.scrollHeight - document.documentElement.clientHeight
    );
    expect(scroll, `${route}: לעמוד עצמו אין גלילה — פס גלילה אחד בלבד`).toBeLessThanOrEqual(2);
    // ההטמעה עדיין גדולה ושימושית, לא נמחצה כדי להיכנס
    const view = (await page.locator('.res-view').boundingBox())!;
    expect(view.height, `${route}: צד המשאב נשאר גבוה`).toBeGreaterThan(420);
  }
});

test('עמוד משאב בנייד: ההטמעה לפני ההסבר (8.6)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/chativat-beynayim/reader/t/sheelot-t/');
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
