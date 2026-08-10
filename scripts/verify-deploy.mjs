/**
 * אימות פריסה אמיתי (RULES 1.14, 4.6): לא "כנראה נפרס" — אלא הוכחה.
 *
 * שלב א׳: ממתין עד שהפרודקשן מגיש את חותם הבנייה של הקומיט שנמזג.
 * שלב ב׳: מוודא שמסלולים קנוניים מחזירים 200, מסלולי תאימות מחזירים
 *         redirect אמיתי, והסמנים המחייבים קיימים ב-markup החי.
 * שלב ג׳: בודק אינווריאנטים מבניים מרכזיים ולא רק נוכחות מחרוזות.
 *
 * שימוש: node scripts/verify-deploy.mjs [--sha <7 תווים>] [--base <url>]
 * יציאה 0 = הפריסה אומתה; יציאה 1 = לא אומתה.
 */

import { LEGACY_REDIRECTS, LEGACY_REDIRECT_STATUS } from '../src/lib/legacyRedirects.mjs';

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = (argOf('base', process.env.VERIFY_BASE_URL ?? 'https://jerusalem-virid.vercel.app')).replace(/\/$/, '');
const SHA = (argOf('sha', process.env.VERIFY_SHA ?? '')).slice(0, 7);
const TIMEOUT_MS = Number(argOf('timeout', '300')) * 1000;

/** מסלולים קנוניים שחייבים להחזיר 200 אחרי כל פריסה */
const ROUTES = [
  '/',
  '/shearim/',
  '/chativat-beynayim/',
  '/chativa-elyona/',
  '/hozer-mafmar/',
  '/luach/',
  '/hodaot/',
  '/chativat-beynayim/kita-z/',
  '/chativat-beynayim/kita-h/',
  '/chativat-beynayim/kita-t/',
  '/chativat-beynayim/kita-z/chomarim/',
  '/chativat-beynayim/kita-h/chomarim/',
  '/chativat-beynayim/kita-t/chomarim/',
  '/chativat-beynayim/nose/z/z-directed-numbers/',
  '/chativat-beynayim/reader/z/tochnit-z/',
  '/chativat-beynayim/prisot/',
  '/chativat-beynayim/reader/z/prisa-z/',
  '/chativat-beynayim/reader/z/amat-tashpaz/',
];

/**
 * מסלולי תאימות שאסור להסוות כ-200 באמצעות follow. הרשימה נגזרת מהמקור
 * היחיד (src/lib/legacyRedirects.mjs) — אין כאן טבלה מקבילה שמתיישנת.
 *
 * הכתובות נבדקות בשתי הצורות, עם לוכסן סופי ובלעדיו: הקישורים ששותפו
 * בעבר נשאו לוכסן סופי, ואילו ה-regex שנפלט ל-Vercel נכתב בלעדיו.
 */
const REDIRECTS = Object.entries(LEGACY_REDIRECTS).flatMap(([path, target]) =>
  [path, path.replace(/\/$/, '')].map((variant) => ({
    path: variant,
    status: LEGACY_REDIRECT_STATUS,
    target,
    what: `מסלול תאימות ${variant}`,
  })),
);

/**
 * נקודות הפרוקסי הן הקוד היחיד שרץ כפונקציה בפרודקשן, ולכן הן היחידות
 * שסוללת Playwright המקומית (שרת קבצים סטטי) אינה יכולה לבדוק כלל.
 * בלי הבדיקות האלה אפשר לשבור את שתי ההטמעות המרכזיות בלי ששום שער יצעק.
 */
const PROXY_CHECKS = [
  { path: '/api/em/misparim/', needle: '__EM_PROXY__', what: 'פרוקסי מספרים מכוונים (9.4)' },
  { path: '/api/em/zaviyot/', needle: '__EM_PROXY__', what: 'פרוקסי זוויות (9.5)' },
  { path: '/api/mam/', needle: '__EM_PROXY__', what: 'פרוקסי אתר ההמחשות (9.1)' },
];

/** יעד שאינו ב-allowlist חייב להיחסם — הגבול הזה הוא כל האבטחה של הפרוקסי. */
const PROXY_REJECTS = [
  { path: '/api/em/evil/', status: 404, what: 'יעד שאינו ב-allowlist נדחה' },
  { path: '/api/em/', status: 404, what: 'פרוקסי בלי שם אתר נדחה' },
];

/** סמנים מחייבים: אם אחד מהם נעלם — רגרסיה שקטה בפרודקשן */
const MARKERS = [
  { path: '/chativat-beynayim/', needle: 'grade-shortcuts', what: 'ניווט הקיצורים של חטיבת הביניים (3.26)' },
  { path: '/chativat-beynayim/kita-z/', needle: 'מה אנחנו מלמדים?', what: 'אזור המבוא של השכבה (06/08)' },
  { path: '/chativat-beynayim/kita-z/', needle: 'חומרים להוראה', what: 'אזור החומרים בעמוד המבוא (06/08)' },
  { path: '/chativat-beynayim/kita-z/chomarim/', needle: 'class="topics"', what: 'רשימת הנושאים בתצוגת החומרים (3.29)' },
  { path: '/chativat-beynayim/nose/z/z-directed-numbers/', needle: 'class="rcard"', what: 'כרטיסי קבצים בנושא לימודי אמיתי (3.29)' },
  { path: '/chativat-beynayim/reader/z/tochnit-z/', needle: 'data-plan-prisa-web', what: 'תוכנית/פריסה כתצוגת HTML — ללא PDF מוטמע (3.32.1)' },
  { path: '/chativat-beynayim/reader/z/tochnit-z/', needle: 'מקור משרד החינוך', what: 'קישור המקור הרשמי נשמר בתוכנית/פריסה (3.32.1)' },
  { path: '/chativat-beynayim/reader/z/tochnit-z/', needle: 'PDF להורדה', what: 'עותק ה-PDF המאומת נשמר להורדה (3.32.1)' },
  { path: '/chativat-beynayim/prisot/', needle: 'data-prisa-index', what: 'עמוד מרכזי לכל ארבע פריסות ההוראה' },
  { path: '/chativat-beynayim/reader/z/prisa-z/', needle: 'data-prisa-links', what: 'קישורי המקור הפעילים נשמרו בתצוגת הפריסה' },
  { path: '/hodaot/', needle: 'href="/chativat-beynayim/prisot/"', what: 'כפתור פריסות הוראה בהודעות שוטפות' },
  { path: '/chativat-beynayim/reader/z/amat-tashpaz/', needle: 'class="orbs"', what: 'לוח הפעולות החי במשאב רגיל (8.4)' },
  { path: '/luach/', needle: 'jerusalem-calendar-wordmark', what: 'כותרת ה-Lovable של הלוח (23.14)' },
  { path: '/', needle: 'wa-band', what: 'רצועת ההצטרפות לקבוצה (7.27)' },
  { path: '/', needle: 'hero-actions', what: 'כפתורי הפעולה המובילים בעמוד הראשי (7.28)' },
  { path: '/shearim/', needle: 'choice-card', what: 'כרטיסי הבחירה המעודנים בבחירת החטיבה (7.29)' },
  // ModEL: הייחוס אומת על ידי בעל הפרויקט (24.6.7) ולכן המשאב פומבי. שלושת
  // הסמנים יחד מוכיחים שהעמוד חי, שהלוגו מוצג ושהייחוס הארגוני מוצג.
  { path: '/chativat-beynayim/reader/z/moodle-guide/', needle: 'data-resource-brand="moodle"', what: 'לוגו המודל בעמוד המשאב (24.6)' },
  { path: '/chativat-beynayim/reader/z/moodle-guide/', needle: 'לוגו מודל מתמטיקה לחטיבת הביניים', what: 'הטקסט החלופי של לוגו המודל (24.6.5)' },
  { path: '/chativat-beynayim/reader/z/moodle-slides/', needle: 'צוות מודל — משרד החינוך', what: 'ייחוס צוות מודל — משרד החינוך (24.6.7)' },
  // פריסות ספטמבר (הוראת יניב, 09/08/2026): מיפוי שכבה→כתובת קשיח, והייחוס
  // "עידן אחוון" מוצג בעמוד המשאב. הכתובות המדויקות — ז׳→7th, ח׳→8th, ט׳→9th.
  { path: '/chativat-beynayim/reader/z/prisa-september-z/', needle: 'idanahvan.my.canva.site/9-26-7th-grade', what: 'פריסת ספטמבר ז׳ — היעד המדויק' },
  { path: '/chativat-beynayim/reader/h/prisa-september-h/', needle: 'idanahvan.my.canva.site/9-26-8th-grade', what: 'פריסת ספטמבר ח׳ — היעד המדויק' },
  { path: '/chativat-beynayim/reader/t/prisa-september-t/', needle: 'idanahvan.my.canva.site/9-26-9th-grade', what: 'פריסת ספטמבר ט׳ — היעד המדויק' },
  { path: '/chativat-beynayim/reader/z/prisa-september-z/', needle: 'עידן אחוון', what: 'ייחוס עידן אחוון בעמוד ספטמבר' },
];

/** נכסים שחייבים להיות מוגשים בפועל (לא רק מוזכרים ב-markup). */
const ASSETS = [
  { path: '/media/brands/moodle-logo.png', type: 'image/png', what: 'נכס לוגו המודל (24.6.4)' },
];

/**
 * תקרת זמן לכל בקשה בודדת. בלעדיה בקשה תלויה מקפיאה את האימות עד
 * לטיים-אאוט של ה-job, והפלט נראה כאילו הבדיקה עוד רצה במקום שנכשלה.
 */
const REQUEST_TIMEOUT_MS = 20_000;

const get = async (path, redirect = 'follow', init = {}) => {
  const res = await fetch(BASE + path, {
    redirect,
    headers: { 'cache-control': 'no-cache', ...(init.headers ?? {}) },
    method: init.method ?? 'GET',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const body = init.method === 'HEAD' ? '' : await res.text();
  return {
    status: res.status,
    html: body,
    location: res.headers.get('location') ?? '',
    contentType: res.headers.get('content-type') ?? '',
    allow: res.headers.get('allow') ?? '',
  };
};

const normalizedLocation = (location) => {
  try {
    const u = new URL(location, BASE);
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return location;
  }
};

/**
 * ה-HTML בלי <style>/<script>. Astro מטביע גיליונות סגנונות בעמודים קטנים,
 * ולכן חיפוש ב-HTML הגולמי עלול לעבור ירוק גם כשהרכיב נמחק מה-DOM.
 */
const markup = (html) => html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exitCode = 1;
};

// ===== שלב א׳: הקומיט הנכון חי =====
if (SHA) {
  const deadline = Date.now() + TIMEOUT_MS;
  let live = '';
  let ok = false;
  while (Date.now() < deadline) {
    try {
      const { html } = await get('/');
      live = html.match(/name="build-commit" content="([^"]+)"/)?.[1] ?? '';
      if (live === SHA) {
        ok = true;
        break;
      }
    } catch {
      /* הפריסה עדיין מתחלפת — ננסה שוב */
    }
    await sleep(10_000);
  }
  if (!ok) {
    fail(`הפרודקשן לא מגיש את הקומיט ${SHA} בתוך ${TIMEOUT_MS / 1000}s (חי כרגע: ${live || 'לא ידוע'})`);
    process.exit(1);
  }
  console.log(`✓ הקומיט ${SHA} חי בפרודקשן`);
} else {
  console.log('· ללא --sha: מדלג על אימות הקומיט, בודק תוכן בלבד');
}

// ===== שלב ב׳: מסלולים קנוניים, redirects וסמנים =====
const cache = new Map();
const fetchOnce = async (path) => {
  if (!cache.has(path)) cache.set(path, await get(path));
  return cache.get(path);
};

for (const path of ROUTES) {
  try {
    const { status } = await fetchOnce(path);
    if (status === 200) console.log(`✓ 200 ${path}`);
    else fail(`${path} החזיר ${status}`);
  } catch (e) {
    fail(`${path} נכשל: ${e.message}`);
  }
}

for (const { path, status: expectedStatus, target, what } of REDIRECTS) {
  try {
    const response = await get(path, 'manual');
    const actualTarget = normalizedLocation(response.location);
    if (response.status !== expectedStatus) {
      fail(`${what}: ${path} החזיר ${response.status} במקום ${expectedStatus}`);
      continue;
    }
    if (actualTarget !== target) {
      fail(`${what}: Location=${actualTarget || 'חסר'} במקום ${target}`);
      continue;
    }
    console.log(`✓ ${expectedStatus} ${path} → ${target}`);
  } catch (e) {
    fail(`בדיקת redirect "${what}" נכשלה: ${e.message}`);
  }
}

for (const { path, needle, what } of MARKERS) {
  try {
    const { html } = await fetchOnce(path);
    if (markup(html).includes(needle)) console.log(`✓ ${what}`);
    else fail(`${what} — הסמן "${needle}" חסר ב-${path}`);
  } catch (e) {
    fail(`בדיקת "${what}" נכשלה: ${e.message}`);
  }
}

// נכס שמוזכר ב-markup אך אינו מוגש בפועל הוא תמונה שבורה אצל הגולש
for (const { path, type, what } of ASSETS) {
  try {
    const { status, contentType } = await get(path);
    if (status !== 200) fail(`${what}: ${path} החזיר ${status}`);
    else if (!contentType.includes(type)) fail(`${what}: ${path} הוגש כ-${contentType}`);
    else console.log(`✓ ${what}`);
  } catch (e) {
    fail(`בדיקת "${what}" נכשלה: ${e.message}`);
  }
}

// ===== שלב ב׳2: נקודות הפרוקסי — הפונקציות היחידות שרצות בפרודקשן =====
for (const { path, needle, what } of PROXY_CHECKS) {
  try {
    const { status, html, contentType } = await get(path);
    if (status !== 200) {
      fail(`${what}: ${path} החזיר ${status}`);
      continue;
    }
    if (!contentType.includes('text/html')) {
      fail(`${what}: content-type הוא "${contentType}" ולא text/html`);
      continue;
    }
    // הסמן מוכיח שהפונקציה באמת רצה והזריקה את משמר זמן-הריצה,
    // ולא שקיבלנו דף שגיאה כלשהו עם קוד 200
    if (!html.includes(needle)) {
      fail(`${what}: הסמן "${needle}" חסר — הפונקציה לא הזריקה את המשמר`);
      continue;
    }
    console.log(`✓ ${what}`);
  } catch (e) {
    fail(`${what} נכשל: ${e.name === 'TimeoutError' ? `אין תשובה בתוך ${REQUEST_TIMEOUT_MS / 1000}s` : e.message}`);
  }
}

for (const { path, status: expected, what } of PROXY_REJECTS) {
  try {
    const { status } = await get(path);
    if (status === expected) console.log(`✓ ${what} (${status})`);
    else fail(`${what}: ${path} החזיר ${status} במקום ${expected}`);
  } catch (e) {
    fail(`${what} נכשל: ${e.message}`);
  }
}

/**
 * החוזה: פועל שאינו נתמך לעולם אינו מבוצע בשקט כ-GET. הפונקציה שלנו עונה
 * ‏405 (proxyHttp.ts), אבל נמדד בפועל (09/08/2026) ש-Vercel חוסם DELETE
 * ב-403 כבר בקצה, לפני שהבקשה מגיעה אלינו. שני הקודים מקיימים את החוזה;
 * ‏200 היה מפר אותו — ולכן הבדיקה נכשלת רק על הצלחה מדומה.
 */
try {
  const { status, allow } = await get('/api/em/misparim/', 'manual', { method: 'DELETE' });
  if (status === 405) console.log(`✓ פועל אסור נחסם בפונקציה (405, allow: ${allow || 'חסר'})`);
  else if (status === 403) console.log('✓ פועל אסור נחסם בקצה Vercel (403) — לא הגיע לפונקציה');
  else fail(`פועל אסור: DELETE החזיר ${status} — פועל שאינו נתמך חייב להיחסם, לא להתבצע`);
} catch (e) {
  fail(`בדיקת הפועל האסור נכשלה: ${e.message}`);
}

// HEAD נושא כותרות בלבד — גוף כאן היה מעיד שהפועל לא הועבר
try {
  const { status, html, contentType } = await get('/api/em/misparim/', 'follow', { method: 'HEAD' });
  if (status === 200 && contentType.includes('text/html') && html === '') {
    console.log('✓ HEAD מחזיר כותרות בלבד');
  } else {
    fail(`HEAD: status=${status} content-type="${contentType}" גוף=${html.length} בייטים`);
  }
} catch (e) {
  fail(`בדיקת HEAD נכשלה: ${e.message}`);
}

// ===== שלב ג׳: מבנה — כמות נכונה, לא רק נוכחות מחרוזת =====
const countOf = (html, re) => (html.match(re) || []).length;
try {
  const { html } = await fetchOnce('/chativat-beynayim/');
  const m = markup(html);

  const shortcuts = countOf(m, /class="gs-btn[ "]/g);
  if (shortcuts === 4) console.log('✓ שער חטיבת הביניים — ארבעה קיצורים בדיוק (3.26)');
  else fail(`שער חטיבת הביניים: ${shortcuts} קיצורים במקום 4 (3.26)`);

  const examLinks = countOf(m, /href="\/chativat-beynayim\/mivchanim\/"/g);
  if (examLinks === 1) console.log('✓ קישור יחיד למאגר המבחנים בשער (3.26)');
  else fail(`שער חטיבת הביניים: ${examLinks} קישורי מאגר במקום 1 (3.26)`);

  const legacyGate = countOf(m, /class="(?:split3|third[- "]|exams-cta)/g);
  if (legacyGate) fail(`נמצאו ${legacyGate} שרידי שלישים/כפתור מאגר ישן — המודל שבוטל חזר (3.26)`);
  else console.log('✓ אין שרידי מסך השלישים או כפתור המאגר הישן (3.26)');

  const booklet = countOf(m, /data-book|stf__item|flip-host/g);
  if (booklet) fail(`נמצאו ${booklet} שרידי חוברת מדפדפת — המודל הישן חזר (3.29)`);
  else console.log('✓ אין שרידי חוברת מדפדפת (3.29)');

  for (const [slug, path] of [
    ['z', '/chativat-beynayim/kita-z/chomarim/'],
    ['h', '/chativat-beynayim/kita-h/chomarim/'],
    ['t', '/chativat-beynayim/kita-t/chomarim/'],
  ]) {
    const g = markup((await fetchOnce(path)).html);
    const topics = countOf(g, /class="topic"/g);
    const links = [...g.matchAll(/href="(\/chativat-beynayim\/nose\/[^"]+)"/g)].map((match) => match[1]);
    if (topics > 0 && links.length > 0) console.log(`✓ שכבה ${slug} — ${topics} נושאים (3.29)`);
    else fail(`שכבה ${slug}: ${topics} נושאים ו-${links.length} קישורי נושא (3.29)`);

    // חוזה הנושא (Issue #73): נושא עם 2+ משאבים ציבוריים מציג רשימת כרטיסים,
    // ונושא עם משאב יחיד מפנה ישירות אל עמוד המשימה. אסור נושא ריק.
    const first = links[0];
    const raw = await get(first, 'manual');
    if (raw.status === LEGACY_REDIRECT_STATUS || raw.status === 308 || raw.status === 302) {
      const to = normalizedLocation(raw.location);
      if (!/^\/chativat-beynayim\/reader\/[^/]+\/[^/]+\/$/.test(to)) {
        fail(`${first}: נושא עם משאב יחיד הפנה ל-${to || 'לא ידוע'} ולא לעמוד משימה (3.30)`);
      } else if (!markup((await fetchOnce(to)).html).includes('res-panel')) {
        fail(`${first} → ${to}: היעד אינו עמוד משימה מחולק (8.2)`);
      } else {
        console.log(`✓ ${first} — משאב יחיד, מעבר ישיר ל-${to} (3.30)`);
      }
    } else {
      const cards = countOf(markup(raw.html), /class="rcard"/g);
      if (cards > 1) console.log(`✓ ${first} — ${cards} כרטיסים (3.29)`);
      else fail(`${first}: ${cards} כרטיסים — נושא שמציג רשימה חייב שתי משימות ומעלה (3.30)`);
    }
  }

  // מסגור PDF נבדק על משאב PDF רגיל. תוכנית/פריסה אינה PDF מוטמע יותר.
  const pdfReader = markup((await fetchOnce('/chativat-beynayim/reader/z/amat-tashpaz/')).html);
  const pdfs = [...pdfReader.matchAll(/data-esrc="([^"]+)"/g)].map((match) => match[1]).filter((u) => /\.pdf(\?|#|$)/i.test(u));
  const bare = pdfs.filter((u) => !u.includes('toolbar=0'));
  if (!pdfs.length) fail('משאב PDF רגיל לא כלל הטמעת PDF — אי אפשר לאמת את מסגור 8.26');
  else if (bare.length) fail(`${bare.length} הטמעות PDF בלי toolbar=0 — סרגל שחור חוזר (8.26)`);
  else console.log(`✓ ${pdfs.length} הטמעות PDF עם מסגור נייבי-זהב (8.26)`);

  // ה-smoke החי שהיה בעבר בתוך Playwright עבר לכאן: רק אחרי main/deploy.
  const orbs = countOf(pdfReader, /class="orb"/g);
  if (orbs < 5) fail(`לוח הפעולות החי: ${orbs} אורבים במקום לפחות 5 (8.4)`);
  else if (pdfReader.includes('res-actions')) fail('לוח הפעולות הישן res-actions חזר בפרודקשן (8.4)');
  else console.log(`✓ לוח הפעולות החי — ${orbs} אורבים, ללא res-actions ישן (8.4)`);
} catch (e) {
  fail(`בדיקת המבנה נכשלה: ${e.message}`);
}

if (process.exitCode === 1) {
  console.error('\n✗ הפריסה לא אומתה — אין להכריז על הצלחה.');
  process.exit(1);
}
// ההכרזה מפרטת מה נבדק בפועל — "אומת" בלי רשימה הוא בדיוק סוג ההצהרה
// שאסורה לפי 1.14 ו-4.6
console.log(
  [
    '',
    '✓ הפריסה אומתה — כל החוזים הבאים נבדקו בפועל:',
    `  · ${ROUTES.length} מסלולים קנוניים = 200`,
    `  · ${REDIRECTS.length} מסלולי תאימות = ${LEGACY_REDIRECT_STATUS} עם Location מדויק`,
    `  · ${PROXY_CHECKS.length} נקודות פרוקסי חיות + ${PROXY_REJECTS.length} דחיות allowlist + 405 + HEAD`,
    `  · ${MARKERS.length} סמנים מחייבים ב-markup + ${ASSETS.length} נכסים מוגשים`,
    '  · אינווריאנטים מבניים: קיצורי השער, נושאים, כרטיסים, מסגור PDF, לוח פעולות חי',
  ].join('\n'),
);