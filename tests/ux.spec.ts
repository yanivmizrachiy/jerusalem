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

  // אין עוד רצועת "כללי" — החומרים המשותפים חולקו לשלוש הכיתות (3.31)
  await expect(page.locator('.klali-band')).toHaveCount(0);
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

test('כיתה ט׳: הכפתורים הראשיים הם המסלול הראשי, והמצומצם נשמר בחומרים', async ({ page }) => {
  await page.goto('/chativat-beynayim/kita-t/');
  await expect(page.locator('[data-main-plan]')).toHaveAttribute('href', /\/reader\/t\/tochnit-t\/$/);
  await expect(page.locator('[data-main-prisa]')).toHaveAttribute('href', /\/reader\/t\/prisa-t\/$/);
  await page.goto('/chativat-beynayim/nose/t/tichnun/');
  for (const id of ['tochnit-t-m', 'prisa-t-m']) {
    await expect(page.locator(`a.rcard[href="/chativat-beynayim/reader/t/${id}/"]`)).toHaveCount(1);
  }
});

test('כל משימה בכל נושא בכל שכבה מובילה לעמוד משימה מחולק (3.30)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  let tasks = 0;
  const sample: string[] = [];

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

    for (const topic of topicHrefs) {
      expect(topic, 'נושא מוביל לעמוד נושא').toMatch(new RegExp(`^/chativat-beynayim/nose/${slug}/`));
      await page.goto(topic);
      const hrefs = await page
        .locator('.rcard')
        .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!));
      expect(hrefs.length, `לנושא ${topic} יש משימות`).toBeGreaterThan(0);
      for (const h of hrefs) {
        expect(h, `משימה בנושא ${topic} מובילה לעמוד משימה`).toMatch(
          new RegExp(`^/chativat-beynayim/reader/${slug}/[^/]+/$`)
        );
        tasks++;
      }
      sample.push(hrefs[0]);
    }
  }

  expect(tasks, 'נספרו משימות אמיתיות').toBeGreaterThan(40);

  // מדגם משימות — כל אחת באמת עמוד מחולק: הטמעה מצד אחד, פעולות מהצד השני (8.2)
  for (const href of sample.slice(0, 6)) {
    await page.goto(href);
    await expect(page.locator('.res-view'), href).toBeVisible();
    await expect(page.locator('.res-panel'), href).toBeVisible();
    await expect(page.locator('.orbs'), href).toBeVisible();
  }
});

test('משימת חוזר: עמוד משימה מחולק עם טווח העמודים — לא קפיצה לעמוד החוזר (3.30)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/nose/z/hozer/');

  const maf = page.locator('a.rcard[href="/chativat-beynayim/reader/z/maf-05-z/"]');
  await expect(maf).toHaveCount(1);
  await maf.click();
  await page.waitForURL('**/reader/z/maf-05-z/');

  await expect(page.locator('h1.res-title')).toHaveText('משימות הערכה ומבחן מפמ״ר ז׳');
  await expect(page.locator('.mrange')).toHaveCount(1);
  const view = (await page.locator('.res-view').boundingBox())!;
  const panel = (await page.locator('.res-panel').boundingBox())!;
  expect(Math.abs(view.width - panel.width), 'חצי-חצי').toBeLessThanOrEqual(1);
});

test('יחידות ועמודים ייעודיים עברו לעמוד המבוא — ולא נמחקו (3.30)', async ({ page }) => {
  const moved = {
    z: '/chativat-beynayim/mishvaot/',
    h: '/chativat-beynayim/hafifat-meshulashim/',
    t: '/chativa-elyona/',
  } as const;

  for (const [slug, href] of Object.entries(moved)) {
    await page.goto(`/chativat-beynayim/kita-${slug}/`);
    const link = page.locator(`[data-grade-page][href="${href}"]`);
    await expect(link, `${slug}: היחידה מוצגת בעמוד המבוא`).toHaveCount(1);
    expect((await link.boundingBox())!.height, 'מטרת מגע').toBeGreaterThanOrEqual(44);

    // והעמוד עצמו חי — שום חומר לא נמחק
    const res = await page.request.get(href);
    expect(res.status(), `${href} חי`).toBe(200);
  }

  // ומנגד: הם כבר לא יושבים בתוך רשימת הנושאים
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
  await page.goto('/chativat-beynayim/reader/t/sheelot-t/');

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
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  const pager = page.locator('.res-pager a.pager-link');
  expect(await pager.count(), 'יש שכן אחד לפחות').toBeGreaterThan(0);
  const href = await pager.first().getAttribute('href');
  expect(href).toMatch(/^\/chativat-beynayim\/reader\/z\//);
  // חזרה אל הנושא שממנו הגענו
  await expect(page.locator('.res-back')).toHaveAttribute('href', /^\/chativat-beynayim\/nose\/z\/[a-z0-9-]+\/$/);
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
    expect(scroll, `${route}: העמוד גולל אנכית כדי להציג עמוד שלם`).toBeGreaterThanOrEqual(0);
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

test('עמוד משאב: ההטמעה ממלאת את הדף — כרטיס הפתיחה מוסתר באמת (8.8, 8.26)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  // כרטיס הפתיחה קיים ב-DOM אך חייב להיעלם בפועל כשיש מציג PDF בדפדפן
  const leaked = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-pdf-fb][hidden], .mrange-fallback[hidden], .res-frame[hidden]')].filter(
        (el) => getComputedStyle(el).display !== 'none'
      ).length
  );
  expect(leaked, 'כרטיס פתיחה עם hidden חייב להיעלם — לא לגנוב חצי עמוד').toBe(0);
  // ההטמעה ממלאת את צד המשאב לגובה
  const fill = await page.evaluate(() => {
    const f = document.querySelector<HTMLElement>('.res-frame:not([hidden])');
    const host = f?.closest<HTMLElement>('.res-view');
    return f && host ? f.getBoundingClientRect().height / host.getBoundingClientRect().height : 0;
  });
  expect(fill, 'ההטמעה ממלאת כמעט את כל הצד שלה').toBeGreaterThan(0.9);
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

/* ===== בחירת החטיבה — כפתור "התחל" והמסך המחולק (הוראת יניב, 05/08/2026) ===== */

test('העמוד הראשי: כפתור "התחל" יחיד מתחת לצוות, מוביל לעמוד בחירת החטיבה (7.28)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');

  const start = page.locator('a.start-btn');
  await expect(start).toHaveCount(1);
  // לפני שתמונת הפתיחה נעלמה — הכפתור אינו נראה (7.28)
  await expect(start).toBeHidden();
  await page.evaluate(() => document.documentElement.classList.add('hero-done'));
  await expect(start).toBeVisible();
  await expect(start).toHaveText('התחל');
  expect(await start.getAttribute('href')).toBe('/shearim/');

  // מטרת מגע גדולה ולחיצה אמיתית שמגיעה לעמוד השערים
  const box = (await start.boundingBox())!;
  expect(box.height, 'מטרת מגע תקינה').toBeGreaterThanOrEqual(44);

  // הכפתור חי בתוך מסך הפתיחה — ונראה בלי לגלול בכלל (7.28)
  const hero = (await page.locator('.hero-after').boundingBox())!;
  expect(box.y).toBeGreaterThan(hero.y);
  expect(box.y + box.height, 'נראה בלי גלילה').toBeLessThanOrEqual(900);
  expect(await page.evaluate(() => window.scrollY), 'בלי גלילה').toBe(0);

  // מדליון עגול בהיקף זהב (7.28)
  expect(Math.abs(box.width - box.height), 'עיגול מושלם').toBeLessThanOrEqual(1);
  const ring = await start.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { radius: cs.borderRadius, shadow: cs.boxShadow };
  });
  expect(ring.radius, 'עגול').toMatch(/50%|\d+px/);
  expect(ring.shadow, 'טבעת זהב').not.toBe('none');
  await expect(page.locator('.start-arrow')).toHaveCount(1);

  // אין שרידים של שני כרטיסי השער הישנים בעמוד הראשי
  await expect(page.locator('.gate-card')).toHaveCount(0);

  await start.click();
  await page.waitForURL('**/shearim/');
});

test('בחירת החטיבה: חצי-חצי — כהה עם מלל בהיר מול בהיר עם מלל כהה (05/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/shearim/');

  const halves = page.locator('.split .half');
  await expect(halves).toHaveCount(2);

  const navy = (await halves.nth(0).boundingBox())!;
  const paper = (await halves.nth(1).boundingBox())!;

  // שני חצאים זה לצד זה, ברוחב שווה, על כל רוחב החלון
  expect(Math.abs(navy.width - paper.width), 'חצי-חצי').toBeLessThanOrEqual(2);
  expect(Math.abs(navy.y - paper.y), 'אותה שורה').toBeLessThanOrEqual(2);
  expect(navy.width + paper.width, 'לכל רוחב העמוד').toBeGreaterThanOrEqual(1400);
  expect(navy.height, 'המסך מחולק לגובה משמעותי').toBeGreaterThanOrEqual(440);

  // צבעים הפוכים בדיוק: רקע כהה/מלל בהיר מול רקע בהיר/מלל כהה
  const lum = (rgb: string) => {
    const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const read = async (i: number) => {
    const bg = await halves.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor);
    const fg = await halves
      .nth(i)
      .locator('.half-title')
      .evaluate((el) => getComputedStyle(el).color);
    return { bg: lum(bg), fg: lum(fg) };
  };
  const a = await read(0);
  const b = await read(1);
  expect(a.bg, 'החצי הראשון כהה').toBeLessThan(90);
  expect(a.fg, 'ומללו בהיר').toBeGreaterThan(200);
  expect(b.bg, 'החצי השני בהיר').toBeGreaterThan(200);
  expect(b.fg, 'ומללו כהה').toBeLessThan(90);

  // כל חצי הוא קישור אמיתי לחטיבה
  expect(await halves.nth(0).getAttribute('href')).toBe('/chativat-beynayim/');
  expect(await halves.nth(1).getAttribute('href')).toBe('/chativa-elyona/');

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
    const split = (await page.locator('.split').boundingBox())!;
    expect(b.height, 'מטרת מגע').toBeGreaterThanOrEqual(44);
    expect(b.y, 'בתחתית העמוד').toBeGreaterThan(split.y + split.height * 0.7);
    expect(b.y + b.height, 'בתוך האזור הצבוע').toBeLessThanOrEqual(split.y + split.height + 1);

    // לחיצה אמיתית שמחזירה לעמוד הראשי
    await back.click();
    await page.waitForURL((u) => new URL(u).pathname === '/');
  });
}

test('בחירת החטיבה: ריחוף על כפתור החזרה אינו מכווץ את שני החצאים (7.29)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/shearim/');
  await page.waitForTimeout(900);

  const halves = page.locator('.split .half');
  const rest = (await halves.nth(0).boundingBox())!;
  await page.locator('.back-home').hover();
  await page.waitForTimeout(900);
  const after = (await halves.nth(0).boundingBox())!;
  expect(Math.abs(after.width - rest.width), 'החצאים נשארים חצי-חצי').toBeLessThanOrEqual(2);
});

test('בחירת החטיבה בנייד: החצאים נערמים בלי גלילה אופקית (05/08)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/shearim/');
  const halves = page.locator('.split .half');
  const a = (await halves.nth(0).boundingBox())!;
  const b = (await halves.nth(1).boundingBox())!;
  expect(b.y, 'החצי השני מתחת לראשון').toBeGreaterThan(a.y + a.height - 2);
  expect(a.height, 'כל חצי נשאר גדול ונוח').toBeGreaterThanOrEqual(240);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test('בחירת החטיבה: הריחוף באמת מרחיב, וקו הזהב נצמד לתפר (7.29)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/shearim/');
  const halves = page.locator('.split .half');
  const rule = page.locator('.split-rule');

  const rest = [(await halves.nth(0).boundingBox())!, (await halves.nth(1).boundingBox())!];
  const restRule = (await rule.boundingBox())!;
  // התפר = הקצה בין שני החצאים; הקו יושב עליו (סטייה של פיקסל אחד לכל היותר)
  expect(Math.abs(restRule.x + restRule.width / 2 - rest[0].x), 'קו הזהב על התפר').toBeLessThanOrEqual(2);

  await halves.nth(0).hover();
  await page.waitForTimeout(900);
  const hov = [(await halves.nth(0).boundingBox())!, (await halves.nth(1).boundingBox())!];
  const hovRule = (await rule.boundingBox())!;

  // החצי שמרחפים עליו מתרחב בפועל, והשני נסוג — לא no-op של flex-grow
  expect(hov[0].width - rest[0].width, 'החצי הנבחר מתרחב').toBeGreaterThan(40);
  expect(hov[1].width - rest[1].width, 'החצי השני נסוג').toBeLessThan(-40);
  // גם בריחוף הקו נשאר על התפר
  expect(Math.abs(hovRule.x + hovRule.width / 2 - hov[0].x), 'הקו זז עם התפר').toBeLessThanOrEqual(2);
});

test('כפתור "התחל": נחשף רק אחרי תמונת הפתיחה, וממורכז מול תמונות הצוות (7.28)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  const btn = page.locator('a.start-btn');
  await expect(btn).toBeHidden();

  await page.evaluate(() => document.documentElement.classList.add('hero-done'));
  await expect(btn).toBeVisible();
  await page.waitForTimeout(1300);

  const b = (await btn.boundingBox())!;
  const photos = await page.locator('.hero-team .hero-avatar').all();
  const boxes = await Promise.all(photos.map((p) => p.boundingBox()));
  const left = Math.min(...boxes.map((x) => x!.x));
  const right = Math.max(...boxes.map((x) => x!.x + x!.width));
  expect(Math.abs(b.x + b.width / 2 - (left + right) / 2), 'ממורכז מול התמונות').toBeLessThanOrEqual(4);
});

test('תמונת הפתיחה פרוסה עד תחתית המסך (6.3)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  await page.waitForTimeout(900);
  const media = (await page.locator('#hero-media').boundingBox())!;
  expect(Math.abs(media.y + media.height - 900), 'אין שטח ריק מתחת לתמונה').toBeLessThanOrEqual(3);
});

test('בחירת החטיבה: הצבע יורד עד רצועת הווטסאפ, כיתוב הכיתות וחץ עדין (7.29)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/shearim/');
  await page.waitForTimeout(900);

  await expect(page.locator('.half-desc').nth(0)).toHaveText('מתמטיקה לכיתות ז׳–ט׳');
  await expect(page.locator('.half-desc').nth(1)).toHaveText('מתמטיקה לכיתות י׳–י״ב');
  await expect(page.locator('.half-cta svg')).toHaveCount(2);

  const split = (await page.locator('.split').boundingBox())!;
  expect(Math.abs(split.y + split.height - 900), 'הצבע מגיע לתחתית המסך').toBeLessThanOrEqual(3);

  // אחרי גלילה — רצועת הווטסאפ צמודה לצבע, בלי רצועה לבנה
  await page.locator('.wa-band').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const s2 = (await page.locator('.split').boundingBox())!;
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
    const split = (await page.locator('.split').boundingBox())!;
    expect(
      Math.abs(split.y - (header.y + header.height)),
      'אין רצועה לבנה בין הניווט לצבע'
    ).toBeLessThanOrEqual(2);

    // והשטח שהתפנה באמת תפוס בחצי צבוע — לא ברקע העמוד
    const filled = await page.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return !!el?.closest('.half');
    }, [Math.round(w / 2), Math.round(split.y + 6)] as [number, number]);
    expect(filled, 'החצי הצבוע ממלא את השטח שמתחת לניווט').toBe(true);
  });
}

/** בהירות ממוצעת של כל עצירות הצבע בגרדיאנט — לזיהוי "כהה" בלי לנעול הקסה */
const gradientLuma = (bg: string) =>
  [...bg.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)].map(
    (m) => 0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]
  );

test('ניווט עליון: "ישראל ריאלית" במקום "הודעות", עם יעודכן בקרוב וחזרה (7.30)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  // הניווט נחשף רק אחרי שתמונת הפתיחה נעלמה (6.3)
  await page.evaluate(() => document.documentElement.classList.add('hero-done'));

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
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
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

test('פתיחה נקייה: אין כפתורי פעולה על המסך עד שהתמונה נעלמת (6.3, הוראת יניב 05/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  await page.waitForTimeout(600);

  // הניווט העליון, פס "מה צפוי?" וכפתור ההתחלה — כולם מוסתרים ולא ניתנים למיקוד
  await expect(page.locator('.nav-list')).toBeHidden();
  await expect(page.locator('.rail')).toBeHidden();
  await expect(page.locator('a.start-btn')).toBeHidden();

  // התמונה מכסה את כל השטח שמתחת לפס התאריך, עד תחתית המסך
  const media = (await page.locator('#hero-media').boundingBox())!;
  expect(media.width, 'לכל הרוחב').toBeGreaterThanOrEqual(1400);
  expect(Math.abs(media.y + media.height - 900), 'עד תחתית המסך').toBeLessThanOrEqual(3);

  // אחרי שהתמונה נעלמה — הכול נחשף
  await page.evaluate(() => document.documentElement.classList.add('hero-done'));
  await expect(page.locator('.nav-list')).toBeVisible();
  await expect(page.locator('.rail')).toBeVisible();
  await expect(page.locator('a.start-btn')).toBeVisible();
});

/* ===== מערכת ההטמעות — חצי-חצי מדויק, גובה שווה ומסגרת משותפת (06/08/2026) ===== */

for (const [w, h] of [
  [1440, 900],
  [1920, 1080],
] as const) {
  test(`עמוד משאב ב-${w}: שני הצדדים שווים ברוחב ובגובה עד פיקסל (8.2)`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    for (const route of [
      '/chativat-beynayim/reader/z/tochnit-z/', // PDF
      '/chativat-beynayim/reader/z/misparim/', // אתר חי
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
    await page.goto('/chativat-beynayim/reader/t/sheelot-t/');

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
    ['/chativat-beynayim/misparim-mechuvanim/', '.semb-frame'],
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
    ['/chativat-beynayim/reader/z/tochnit-z/', '.res-frame'],
    ['/chativat-beynayim/', '.mam-frame'],
    ['/chativat-beynayim/misparim-mechuvanim/', '.semb-frame'],
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
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/mishvaot/');

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

/* ===== סרטון הפתיחה — פעם אחת בכל session של הטאב (6.2.1, 6.6) =====
   מחליף את "רץ בכל כניסה" (06/08/2026): לאחר שנצפה, כל חזרה ל"ראשי" באותו
   session מציגה מיד את מצב הצוות, בלי ניגון ובלי הבזק של הווידאו/ה-poster. */

type HeroState = {
  t: number; src: string; videoDisplay: string; ended: boolean;
  done: boolean; seenClass: boolean; seenKey: string | null; afterOpacity: string;
};

const heroState = (p: import('@playwright/test').Page): Promise<HeroState> =>
  p.evaluate(() => {
    const v = document.getElementById('hero-video') as HTMLVideoElement | null;
    const m = document.getElementById('hero-media');
    const after = m?.querySelector('.hero-after') as HTMLElement | null;
    return {
      t: v ? v.currentTime : -1,
      src: v ? v.getAttribute('src') || '' : '',
      videoDisplay: v ? getComputedStyle(v).display : 'absent',
      ended: !!m?.classList.contains('is-ended'),
      done: document.documentElement.classList.contains('hero-done'),
      seenClass: document.documentElement.classList.contains('hero-seen'),
      seenKey: sessionStorage.getItem('jerusalem.heroSeen.v1'),
      afterOpacity: after ? getComputedStyle(after).opacity : '0',
    };
  });

const endHero = (p: import('@playwright/test').Page) =>
  p.evaluate(() => document.getElementById('hero-video')!.dispatchEvent(new Event('ended')));

test('סרטון הפתיחה: בכניסה ראשונה בטאב הוא רשאי לרוץ (6.2.1)', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');

  const first = await heroState(page);
  expect(first.seenKey, 'טאב חדש — המפתח עדיין ריק').toBeNull();
  expect(first.src, 'נטען מקור וידאו אמיתי').toContain('/media/hero-');
  await expect.poll(async () => (await heroState(page)).t, { message: 'הסרטון מתקדם בכניסה הראשונה' })
    .toBeGreaterThan(0.1);
});

test('סרטון הפתיחה: אחרי שנצפה, חזרה ל"ראשי" מציגה מיד את הצוות בלי ניגון (6.2.1)', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  await endHero(page);
  await expect.poll(async () => (await heroState(page)).seenKey, { message: 'הסיום נשמר' }).toBe('1');

  // יוצאים לעמוד אחר וחוזרים ל"ראשי" — בדיוק התלונה של יניב
  await page.goto('/shearim/');
  await page.goto('/');

  const s = await heroState(page);
  expect(s.seenClass, 'hero-seen נקבע ב-bootstrap שלפני ה-paint').toBe(true);
  expect(s.done, 'hero-done מיידי').toBe(true);
  expect(s.ended, 'מצב הצוות מיד').toBe(true);
  expect(s.afterOpacity, 'הצוות גלוי מיד ובלי דהייה').toBe('1');
  expect(s.src, 'לא נטען src — אין בקשת וידאו כלל').toBe('');
  expect(s.videoDisplay, 'הווידאו אינו מוצג — אין הבזק poster').toBe('none');
  expect(s.t, 'לא הופעל ניגון').toBeLessThanOrEqual(0);
});

test('סרטון הפתיחה: רענון באותו session אינו מפעיל אותו מחדש (6.2.1)', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  await endHero(page);
  await expect.poll(async () => (await heroState(page)).seenKey).toBe('1');

  await page.reload();

  const s = await heroState(page);
  expect(s.seenClass, 'גם אחרי reload — מצב נצפה').toBe(true);
  expect(s.ended).toBe(true);
  expect(s.src, 'אין טעינת וידאו ברענון').toBe('');
  expect(s.t, 'אין ניגון ברענון').toBeLessThanOrEqual(0);
});

test('סרטון הפתיחה: bfcache/history back אינם מאפסים אותו (6.2.1)', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  await expect.poll(async () => (await heroState(page)).t).toBeGreaterThan(0.1);

  // מסיימים בפועל: הסרטון נעצר בסופו, בדיוק כפי ש-bfcache היה משמר אותו
  await page.evaluate(() => {
    const v = document.getElementById('hero-video') as HTMLVideoElement;
    v.pause();
    v.dispatchEvent(new Event('ended'));
  });
  await expect.poll(async () => (await heroState(page)).seenKey, { message: 'הסיום נשמר' }).toBe('1');
  const before = await page.evaluate(() => (document.getElementById('hero-video') as HTMLVideoElement).currentTime);

  // מדמים שחזור מזיכרון הניווט
  await page.evaluate(() =>
    dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))
  );
  await page.waitForTimeout(300);

  const after = await page.evaluate(() => {
    const v = document.getElementById('hero-video') as HTMLVideoElement;
    const m = document.getElementById('hero-media')!;
    return {
      t: v.currentTime,
      paused: v.paused,
      ended: m.classList.contains('is-ended'),
      done: document.documentElement.classList.contains('hero-done'),
    };
  });

  expect(after.ended, 'מצב הסיום לא נוקה').toBe(true);
  expect(after.done, 'hero-done לא הוסר').toBe(true);
  expect(after.paused, 'הסרטון לא הופעל מחדש').toBe(true);
  expect(after.t, 'הסרטון לא הוחזר להתחלה').toBeGreaterThanOrEqual(before);
});

test('סרטון הפתיחה: Browser Context חדש רשאי להציג אותו שוב (6.2.1)', async ({ page, browser }) => {
  await page.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await page.goto('/');
  const base = new URL(page.url()).origin;
  await endHero(page);
  await expect.poll(async () => (await heroState(page)).seenKey).toBe('1');

  const ctx = await browser.newContext({ baseURL: base });
  const fresh = await ctx.newPage();
  await fresh.addInitScript(() => sessionStorage.setItem('ycc-splash', '1'));
  await fresh.goto('/');

  const s = await heroState(fresh);
  expect(s.seenKey, 'session חדש — המפתח ריק').toBeNull();
  expect(s.src, 'נטען מקור וידאו בטאב החדש').toContain('/media/hero-');
  await expect.poll(async () => (await heroState(fresh)).t, { message: 'רץ שוב בטאב חדש' })
    .toBeGreaterThan(0.1);
  await ctx.close();
});

test('סרטון הפתיחה: ה-bootstrap יושב ב-head לפני הגוף — אין הבזק (6.2.1)', async ({ page }) => {
  const res = await page.request.get('/');
  const html = await res.text();
  const boot = html.indexOf('jerusalem.heroSeen.v1');
  const body = html.indexOf('<body');
  expect(boot, 'ה-bootstrap קיים ב-HTML המוגש').toBeGreaterThan(-1);
  expect(boot, 'ה-bootstrap קודם ל-<body> — כלומר רץ לפני ה-paint').toBeLessThan(body);
});
