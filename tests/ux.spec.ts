import { test, expect, type Page } from '@playwright/test';

/**
 * בדיקות הקבלה של תיקון ה-UX המלא (RULES 19.34, הוראת יניב 04/08/2026):
 * hero מלא, כפתור חזרה טקסטואלי מכרטיס צוות, רצועת WhatsApp נקייה,
 * באנר תמונה מלאה, מכונת המצבים של החוברת וכותרת ה-Lovable של לוח השנה.
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

test('כרטיס צוות: כפתור חזרה טקסטואלי במקום חץ עגול, ושחזור התצוגה (6.5)', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.team-arrow')).toHaveCount(0);
  const beforeY = await page.evaluate(() => scrollY);
  await page.locator('.hero-after a[href="#tzevet-ayelet"]').click();
  await expect(page).toHaveURL(/#tzevet-ayelet$/);
  await expect(page.locator('#tzevet-ayelet')).toBeVisible();
  const back = page.locator('[data-team-back]');
  await expect(back).toBeVisible();
  await expect(back).toHaveText(/חזרה לתצוגה הקודמת/);
  const box = (await back.boundingBox())!;
  expect(box.height, 'גובה לחיץ ≥44px').toBeGreaterThanOrEqual(44);
  await back.click();
  await expect(page).not.toHaveURL(/#tzevet-/);
  await expect(page.locator('[data-team-details]')).toBeHidden();
  await expect
    .poll(async () => Math.abs((await page.evaluate(() => scrollY)) - beforeY), {
      message: 'הגלילה חזרה למיקום שקדם לפתיחת הכרטיס',
    })
    .toBeLessThanOrEqual(60);
});

/* ===== חטיבת ביניים — באנר ומכונת המצבים של החוברת ===== */

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

/* עמוד גלוי במנוע הדפדוף (StPageFlip): מקבל display:block מוזרק inline */
const shown = (page: Page) => page.locator('.stf__item[style*="display: block"]');

/** ממתינים לנחיתת העלה — המנוע מסמן data-turning בזמן היפוך */
const settle = async (page: Page) => {
  await expect(page.locator('[data-book][data-turning]')).toHaveCount(0);
};

const openToc = async (page: Page) => {
  await page.goto('/chativat-beynayim/');
  await expect(page.locator('[data-book].is-ready')).toHaveCount(1);
  await page.locator('.rashi-row').first().click();
  await expect(page).toHaveURL(/#toc-z/);
  // פתיחת שכבה משתלטת על המסך ובונה מחדש את המנוע — ממתינים להתייצבות (05/08)
  await expect(page.locator('.book-shell.is-full')).toHaveCount(1);
  await settle(page);
};

test('שער: דף בודד גדול — ≥70% מגובה החלון, בלי גלילה פנימית ובלי exit (3.29)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/chativat-beynayim/');
  await expect(page.locator('[data-book].is-ready')).toHaveCount(1);
  await expect(page.locator('.book-shell.on-rashi')).toHaveCount(1);
  await expect(page.locator('.book-shell.is-full')).toHaveCount(0);
  await expect(page.locator('[data-exit]')).toBeHidden();
  const vis = shown(page);
  await expect(vis).toHaveCount(1);
  await expect(vis).toHaveAttribute('data-page', 'rashi');
  const box = (await vis.boundingBox())!;
  expect(box.height, 'השער גבוה — לפחות 70% מגובה החלון').toBeGreaterThanOrEqual(900 * 0.7);
  expect(box.width, 'השער אינו צר בצורה חריגה').toBeGreaterThanOrEqual(560);
  const scrolls = await vis.evaluate((el) => {
    const f = el.querySelector('.page-face')!;
    return f.scrollHeight - f.clientHeight;
  });
  expect(scrolls, 'אין scrollbar פנימי בשער').toBeLessThanOrEqual(4);
});

for (const width of [1440, 1920]) {
  test(`ספר פתוח ב-${width}: ≥88% מהבמה, דפים שווים, שדרה דקה (3.29)`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 900 });
    await openToc(page);
    const vis = shown(page);
    await expect(vis).toHaveCount(2);
    const boxes = [(await vis.nth(0).boundingBox())!, (await vis.nth(1).boundingBox())!].sort((a, b) => a.x - b.x);
    const [left, right] = boxes;
    expect(Math.abs(left.width - right.width), 'רוחב שני הדפים דומה').toBeLessThanOrEqual(2);
    const stage = (await page.locator('[data-stage]').boundingBox())!;
    const spreadW = right.x + right.width - left.x;
    expect(spreadW / stage.width, 'הספר תופס לפחות 88% מהבמה').toBeGreaterThanOrEqual(0.88);
    expect(right.x - (left.x + left.width), 'השדרה אינה רחבה מ-24px').toBeLessThanOrEqual(24);
    expect(left.height, 'דפים בגובה משמעותי').toBeGreaterThanOrEqual(560);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'אין גלילה אופקית').toBeLessThanOrEqual(1);
  });
}

test('לחיצה על שכבה: תוכן עניינים במסך מלא, סרגל שמאלי, הניווט העליון מכוסה (3.29, 05/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openToc(page);
  // תוכן העניינים משתלט על המסך — כפתור "חזרה לאתר" גלוי
  await expect(page.locator('.book-shell.is-full')).toHaveCount(1);
  await expect(page.locator('[data-exit]')).toBeVisible();
  // ההשתלטות מכסה את הניווט העליון של האתר
  const coversTop = await page.evaluate(() => {
    const el = document.elementFromPoint(Math.round(window.innerWidth / 2), 12);
    return !!el?.closest('.book-shell.is-full');
  });
  expect(coversTop, 'ההשתלטות מכסה את הניווט העליון').toBe(true);
  // הסרגל צמוד לשמאל המסך, אנכי וגבוה
  const bar = (await page.locator('.book-bar').boundingBox())!;
  expect(bar.x, 'הסרגל צמוד לשמאל').toBeLessThan(60);
  expect(bar.height, 'הסרגל אנכי וגבוה').toBeGreaterThan(300);
  // הנחיתה: עמוד תוכן העניינים של השכבה — הכותרת היא שם השכבה
  await expect(shown(page).locator('h2.gtoc-title')).toHaveText('מתמטיקה לכיתה ז׳');
  // מולו עמוד הפרק הראשון עם כותרת כיתה+נושא
  await expect(shown(page).locator('h2.toc-title').first()).toContainText('מתמטיקה לכיתה ז׳ —');
  // שורת פרק בתוכן השכבה קופצת ישירות לעמוד הפרק
  await shown(page).locator('.gtoc-row').filter({ hasText: 'תכנון והוראה' }).click();
  await settle(page);
  await expect(page).toHaveURL(/#toc-z-tichnun$/);
  await expect(shown(page).locator('.toc-nav-chip.is-here').filter({ hasText: 'תכנון והוראה' })).toHaveCount(1);
});

test('דפדוף: מקלדת וכפתורים מעדכנים מונה ו-hash — בלי עמוד ריק (3.29)', async ({ page }) => {
  await openToc(page);
  const counter = page.locator('[data-counter]');
  const before = await counter.textContent();
  await page.keyboard.press('ArrowLeft');
  await settle(page);
  expect(await counter.textContent(), 'חץ שמאלה מדפדף קדימה').not.toBe(before);
  await expect(shown(page).first()).not.toBeEmpty();
  await page.locator('.bnav-prev').click();
  await settle(page);
  expect(await counter.textContent(), 'דף קודם חוזר').toBe(before);
});

test('תוכן העניינים מחולק לעמודים אמיתיים עם כותרות כיתה ונושא (3.29)', async ({ page }) => {
  await page.goto('/chativat-beynayim/');
  const tocPages = page.locator('.bp-toc');
  const count = await tocPages.count();
  expect(count, 'עמוד לכל פרק — לא עמוד אחד ארוך לשכבה').toBeGreaterThanOrEqual(10);
  for (let i = 0; i < count; i++) {
    const h2 = tocPages.nth(i).locator('h2.toc-title');
    await expect(h2).toHaveCount(1);
    await expect(h2).toContainText(/(מתמטיקה לכיתה [זחט]׳|משותף לכל השכבות) — /);
  }
});

test('פתיחת משאב: is-full, הטמעה בדף הימני, "חזרה לאתר"/Escape חוזרים לשער (3.29, 05/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openToc(page);
  await shown(page).locator('button.toc-item').first().click();
  await settle(page);
  // מצב עבודה מלא נשמר
  await expect(page.locator('.book-shell.is-full')).toHaveCount(1);
  const exit = page.locator('[data-exit]');
  await expect(exit).toBeVisible();
  // spread אמיתי: דף ההטמעה מימין, דף המידע משמאל, כל אחד דף ספר שלם
  const embed = (await page.locator('.stf__item[style*="display: block"].bp-item-embed').boundingBox())!;
  const info = (await page.locator('.stf__item[style*="display: block"].bp-item-info').boundingBox())!;
  expect(embed.width).toBeGreaterThan(500);
  expect(info.width).toBeGreaterThan(500);
  expect(embed.x, 'ההטמעה בדף הימני (RTL)').toBeGreaterThan(info.x);
  // "חזרה לאתר" — יציאה מלאה מההשתלטות אל השער שבזרימת האתר
  await exit.click();
  await settle(page);
  await expect(page.locator('.book-shell.is-full')).toHaveCount(0);
  await expect(page.locator('.book-shell.on-rashi')).toHaveCount(1);
  await expect(exit).toBeHidden();
  // Escape יוצא גם הוא אל השער
  await page.locator('.rashi-row').first().click();
  await settle(page);
  await expect(page.locator('.book-shell.is-full')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await settle(page);
  await expect(page.locator('.book-shell.is-full')).toHaveCount(0);
  await expect(page.locator('.book-shell.on-rashi')).toHaveCount(1);
});

test('deep link לעמוד reader נפתח במצב מלא ו"חזרה לאתר" חוזר לשער (3.29, 05/08)', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  await expect(page.locator('.book-shell.is-full')).toHaveCount(1);
  const exit = page.locator('[data-exit]');
  await expect(exit).toBeVisible();
  await exit.click();
  await settle(page);
  await expect(page.locator('.book-shell.is-full')).toHaveCount(0);
  await expect(page.locator('.book-shell.on-rashi')).toHaveCount(1);
});

test('במסך צר מוצג דף אחד וכפתורי מגע תקינים (3.29)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/chativat-beynayim/#toc-z-hozer');
  await expect(page.locator('[data-book].is-ready')).toHaveCount(1);
  await expect(shown(page)).toHaveCount(1);
  const nav = (await page.locator('.bnav-next').boundingBox())!;
  expect(nav.height, 'מטרת מגע ≥44px').toBeGreaterThanOrEqual(44);
});

test('ה-iframe בעמוד משאב לחיץ — אין שכבה מעליו (19.33)', async ({ page }) => {
  // פריט doc (לא PDF): ב-headless אין מציג PDF מובנה ומוצג בצדק כרטיס
  // הפתיחה (8.8) — הבדיקה הזאת בודקת שההטמעה עצמה אינה חסומה בשכבות
  await page.goto('/chativat-beynayim/reader/t/sheelot-t/');
  const frame = page.locator('.stf__item[style*="display: block"] iframe');
  await expect(frame).toBeVisible();
  const hit = await page.evaluate(() => {
    const f = document.querySelector('.stf__item[style*="display: block"] iframe');
    if (!f) return 'no-iframe';
    const r = f.getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return el === f ? 'ok' : `${el?.tagName}.${(el as HTMLElement)?.className}`;
  });
  expect(hit, 'הנקודה במרכז ההטמעה פוגעת ב-iframe עצמו').toBe('ok');
});

test('החוברת בלי גלילה אופקית — רחב וצר (3.29)', async ({ page }) => {
  for (const width of [1920, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/chativat-beynayim/#toc-z-hozer');
    await expect(page.locator('[data-book].is-ready')).toHaveCount(1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `גלילה אופקית ב-${width}px`).toBeLessThanOrEqual(1);
  }
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
