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
  // הנחיתה: כפולת המפתח של השכבה — שני העמודים גלויים יחד (סדר ה-DOM של
  // המנוע אינו מובטח, ולכן ממקדים לפי מזהה העמוד ולא לפי first)
  const vis = '.stf__item[style*="display: block"]';
  await expect(page.locator(`${vis}[data-page="toc-z"] h2.gtoc-title`)).toHaveText('מתמטיקה לכיתה ז׳');
  // מולו העמוד השני של אותו מפתח — "המשך" (הכפולה כולה היא תוכן העניינים)
  await expect(page.locator(`${vis}[data-page="toc-z-2"] h2.toc-title`)).toContainText('מתמטיקה לכיתה ז׳ —');
  // כל פרקי השכבה נמצאים על הכפולה עצמה — אין עמוד תוכן-עניינים נוסף (05/08/2026)
  const heads = shown(page).locator('.idx-ch-name');
  await expect(heads.filter({ hasText: 'תכנון והוראה' })).toHaveCount(1);
  await expect(heads.filter({ hasText: 'מהחוזר הרשמי' })).toHaveCount(1);
  // שורת קובץ במפתח קופצת ישירות לעמוד המשאב
  await shown(page).locator('button.idx-row').first().click();
  await settle(page);
  await expect(page).toHaveURL(/#it-z-/);
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

test('מפתח השכבה מרוכז בכפולה אחת — שני עמודים בדיוק לכל שכבה (3.29)', async ({ page }) => {
  await page.goto('/chativat-beynayim/');
  // אין יותר עמוד תוכן-עניינים לכל פרק
  await expect(page.locator('.bp-toc')).toHaveCount(0);
  const grades = ['z', 'h', 't', 'klali'];
  for (const g of grades) {
    const pair = page.locator(`.bp-gtoc[data-page="toc-${g}"], .bp-gtoc[data-page="toc-${g}-2"]`);
    await expect(pair, `שכבה ${g}: שני עמודי מפתח בדיוק`).toHaveCount(2);
    // שני העמודים יחד מכילים את כל הפרקים ואת כל הקבצים של השכבה
    await expect(pair.locator('.idx-ch'), `שכבה ${g}: יש פרקים במפתח`).not.toHaveCount(0);
    await expect(pair.locator('.idx-row'), `שכבה ${g}: יש שורות קבצים`).not.toHaveCount(0);
    // כל עמוד נושא כותרת מזוהה
    await expect(pair.locator('h2')).toHaveCount(2);
  }
  // סך עמודי המפתח בספר: 2 לכל שכבה
  await expect(page.locator('.bp-gtoc')).toHaveCount(grades.length * 2);
});

test('אף עמוד מפתח אינו גולש — הכול נכנס בכפולה (3.29)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const g of ['z', 'h', 't', 'klali']) {
    await page.goto(`/chativat-beynayim/#toc-${g}`);
    await settle(page);
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll('.bp-gtoc')]
        .map((p) => {
          const l = p.querySelector<HTMLElement>('.idx');
          if (!l || l.clientHeight === 0) return null;
          return l.scrollHeight > l.clientHeight + 4 ? (p as HTMLElement).dataset.page : null;
        })
        .filter(Boolean)
    );
    expect(overflowing, `שכבה ${g}: אין עמוד מפתח שגולש`).toEqual([]);
  }
});

test('פתיחת משאב: is-full, הטמעה בדף הימני, "חזרה לאתר"/Escape חוזרים לשער (3.29, 05/08)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openToc(page);
  await shown(page).locator('button.idx-row').first().click();
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

test('בהשתלטות האתר שמאחור אינו נגיש למקלדת ולקורא מסך, והמיקוד חוזר ביציאה (4.7, 5.15)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openToc(page);
  // הניווט העליון והפוטר מסומנים inert — Tab לא נודד לאתר המכוסה
  const covered = await page.evaluate(() => {
    const shell = document.querySelector('.book-shell')!;
    const outside = ['#site-header', '.datebar', 'footer'];
    return outside.map((sel) => {
      const el = document.querySelector(sel);
      if (!el || shell.contains(el)) return { sel, present: false, inert: true, hidden: true };
      const blocked = !!el.closest('[inert]');
      return { sel, present: true, inert: blocked, hidden: !!el.closest('[aria-hidden="true"]') };
    });
  });
  for (const c of covered) {
    expect(c.inert, `${c.sel} חסום למקלדת בהשתלטות`).toBe(true);
    expect(c.hidden, `${c.sel} מוסתר מקורא מסך בהשתלטות`).toBe(true);
  }
  // המיקוד נמצא בתוך החוברת ולא נשאר על האתר המכוסה
  expect(await page.evaluate(() => !!document.querySelector('.book-shell')!.contains(document.activeElement))).toBe(true);
  // ביציאה — האתר חוזר להיות נגיש והמיקוד אינו אבוד
  await page.locator('[data-exit]').click();
  await settle(page);
  const restored = await page.evaluate(() => ({
    anyInert: !!document.querySelector('#site-header[inert], .datebar[inert], footer[inert]'),
    anyHidden: !!document.querySelector('#site-header[aria-hidden], .datebar[aria-hidden], footer[aria-hidden]'),
  }));
  expect(restored.anyInert, 'האתר אינו נשאר חסום אחרי היציאה').toBe(false);
  expect(restored.anyHidden, 'האתר אינו נשאר מוסתר מ-AT אחרי היציאה').toBe(false);
  // המיקוד מוחזר לשער אחרי שהמנוע מסיים להיבנות מחדש (הבנייה מאפסת מיקוד ל-body)
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.className ?? ''), { timeout: 5000 })
    .toContain('rashi-row');
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
