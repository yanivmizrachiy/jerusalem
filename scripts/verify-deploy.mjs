/**
 * אימות פריסה אמיתי (RULES 1.14, 4.6): לא "כנראה נפרס" — אלא הוכחה.
 *
 * שלב א׳: ממתין עד שהפרודקשן מגיש את חותם הבנייה של הקומיט שנמזג
 *         (<meta name="build-commit">, מוזרק מ-VERCEL_GIT_COMMIT_SHA).
 * שלב ב׳: מוודא שכל המסלולים הקנוניים מחזירים 200 ושהסמנים המחייבים
 *         של החוברת, הלוח והעמוד הראשי באמת נמצאים ב-HTML החי.
 *
 * שימוש:  node scripts/verify-deploy.mjs [--sha <7 תווים>] [--base <url>]
 * יציאה 0 = הפריסה אומתה; יציאה 1 = לא אומתה (חוסם דיווח הצלחה).
 */

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const BASE = (argOf('base', process.env.VERIFY_BASE_URL ?? 'https://jerusalem-virid.vercel.app')).replace(/\/$/, '');
const SHA = (argOf('sha', process.env.VERIFY_SHA ?? '')).slice(0, 7);
const TIMEOUT_MS = Number(argOf('timeout', '300')) * 1000;

/** המסלולים שחייבים לחיות אחרי כל פריסה */
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
  '/chativat-beynayim/klali/',
  '/chativat-beynayim/nose/z/tichnun/',
  '/chativat-beynayim/reader/z/tochnit-z/',
];

/** סמנים מחייבים: אם אחד מהם נעלם — רגרסיה שקטה בפרודקשן */
const MARKERS = [
  { path: '/chativat-beynayim/', needle: 'split3', what: 'מסך השלישים של חטיבת הביניים (3.26)' },
  { path: '/chativat-beynayim/', needle: 'klali-band', what: 'רצועת החומרים המשותפים (3.26)' },
  { path: '/chativat-beynayim/kita-z/', needle: 'מה אנחנו מלמדים?', what: 'אזור המבוא של השכבה (הוראת יניב 06/08)' },
  { path: '/chativat-beynayim/kita-z/', needle: 'חומרים להוראה', what: 'אזור החומרים בעמוד המבוא (06/08)' },
  { path: '/chativat-beynayim/kita-z/chomarim/', needle: 'class="topics"', what: 'רשימת הנושאים בתצוגת החומרים (3.29)' },
  { path: '/chativat-beynayim/nose/z/tichnun/', needle: 'class="rcard"', what: 'כרטיסי הקבצים בעמוד הנושא (3.29)' },
  { path: '/chativat-beynayim/reader/z/tochnit-z/', needle: 'res-panel', what: 'לוח הפעולות בעמוד המשאב (3.29, 8.2)' },
  { path: '/luach/', needle: 'jerusalem-calendar-wordmark', what: 'כותרת ה-Lovable של הלוח (23.14)' },
  { path: '/', needle: 'wa-band', what: 'רצועת ההצטרפות לקבוצה (7.27)' },
  { path: '/', needle: 'start-btn', what: 'כפתור ההתחלה בעמוד הראשי (7.28)' },
  { path: '/shearim/', needle: 'split-rule', what: 'המסך המחולק חצי-חצי בבחירת החטיבה (7.29)' },
];

const get = async (path) => {
  const res = await fetch(BASE + path, { redirect: 'follow', headers: { 'cache-control': 'no-cache' } });
  return { status: res.status, html: await res.text() };
};

/**
 * ה-HTML בלי <style>/<script>. Astro מטביע גיליונות סגנונות בעמודים קטנים,
 * ולכן חיפוש מחרוזת ב-HTML הגולמי עובר ירוק גם כשהרכיב נמחק מה-DOM —
 * נמדד: 36 מופעים של 'wa-band' בעמוד הראשי, 26 מהם בתוך <style>.
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

// ===== שלב ב׳: מסלולים וסמנים =====
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

for (const { path, needle, what } of MARKERS) {
  try {
    const { html } = await fetchOnce(path);
    if (markup(html).includes(needle)) console.log(`✓ ${what}`);
    else fail(`${what} — הסמן "${needle}" חסר ב-${path}`);
  } catch (e) {
    fail(`בדיקת "${what}" נכשלה: ${e.message}`);
  }
}

// ===== שלב ג׳: מבנה — כמות נכונה, לא רק נוכחות מחרוזת =====
const countOf = (html, re) => (html.match(re) || []).length;
try {
  const { html } = await fetchOnce('/chativat-beynayim/');
  const m = markup(html);

  // שער חטיבת הביניים: בדיוק שלושה שלישים (3.26) — מונע קריסה שקטה
  // לשניים או לארבעה, ומונע חזרה של החוברת המדפדפת
  const thirds = countOf(m, /class="third[ "]/g);
  if (thirds === 3) console.log(`✓ שער חטיבת הביניים — שלושה שלישים בדיוק (3.26)`);
  else fail(`שער חטיבת הביניים: ${thirds} שלישים במקום 3 (3.26)`);

  const booklet = countOf(m, /data-book|stf__item|flip-host/g);
  if (booklet) fail(`נמצאו ${booklet} שרידי חוברת מדפדפת — המודל הישן חזר (3.29)`);
  else console.log('✓ אין שרידי חוברת מדפדפת (3.29)');

  // תצוגת החומרים של כל שכבה מגישה רשימת נושאים; הקבצים חיים בעמוד הנושא
  for (const [slug, path] of [
    ['z', '/chativat-beynayim/kita-z/chomarim/'],
    ['h', '/chativat-beynayim/kita-h/chomarim/'],
    ['t', '/chativat-beynayim/kita-t/chomarim/'],
    ['klali', '/chativat-beynayim/klali/'],
  ]) {
    const g = markup((await fetchOnce(path)).html);
    const topics = countOf(g, /class="topic"/g);
    const links = [...g.matchAll(/href="(\/chativat-beynayim\/nose\/[^"]+)"/g)].map((m) => m[1]);
    if (topics > 0 && links.length > 0) console.log(`✓ שכבה ${slug} — ${topics} נושאים (3.29)`);
    else fail(`שכבה ${slug}: ${topics} נושאים ו-${links.length} קישורי נושא (3.29)`);

    // הנושא הראשון של כל שכבה באמת מגיש כרטיסי קבצים
    const first = markup((await fetchOnce(links[0])).html);
    const cards = countOf(first, /class="rcard"/g);
    if (cards > 0) console.log(`✓ ${links[0]} — ${cards} כרטיסים (3.29)`);
    else fail(`${links[0]}: אין כרטיסי קבצים בעמוד הנושא (3.29)`);
  }

  // הטמעות PDF בלי סרגל הדפדפן השחור (8.26)
  const reader = markup((await fetchOnce('/chativat-beynayim/reader/z/tochnit-z/')).html);
  const pdfs = [...reader.matchAll(/data-esrc="([^"]+)"/g)].map((x) => x[1]).filter((u) => /\.pdf(\?|#|$)/i.test(u));
  const bare = pdfs.filter((u) => !u.includes('toolbar=0'));
  if (bare.length) fail(`${bare.length} הטמעות PDF בלי toolbar=0 — סרגל שחור חוזר (8.26)`);
  else console.log(`✓ ${pdfs.length} הטמעות PDF עם מסגור נייבי-זהב (8.26)`);
} catch (e) {
  fail(`בדיקת המבנה נכשלה: ${e.message}`);
}

if (process.exitCode === 1) {
  console.error('\n✗ הפריסה לא אומתה — אין להכריז על הצלחה.');
  process.exit(1);
}
console.log('\n✓ הפריסה אומתה במלואה.');
