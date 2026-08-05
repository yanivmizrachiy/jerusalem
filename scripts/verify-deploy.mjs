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
  '/chativat-beynayim/reader/z/tochnit-z/',
];

/** סמנים מחייבים: אם אחד מהם נעלם — רגרסיה שקטה בפרודקשן */
const MARKERS = [
  { path: '/chativat-beynayim/', needle: 'flip-host', what: 'מנוע הדפדוף של החוברת (3.29)' },
  { path: '/chativat-beynayim/', needle: 'gtoc-title', what: 'תוכן העניינים של השכבה (3.29)' },
  { path: '/luach/', needle: 'jerusalem-calendar-wordmark', what: 'כותרת ה-Lovable של הלוח (23.14)' },
  { path: '/', needle: 'wa-band', what: 'רצועת ההצטרפות לקבוצה (7.27)' },
  { path: '/', needle: 'start-btn', what: 'כפתור ההתחלה בעמוד הראשי (7.28)' },
  { path: '/shearim/', needle: 'split-rule', what: 'המסך המחולק חצי-חצי בשערי הכניסה (7.29)' },
];

const get = async (path) => {
  const res = await fetch(BASE + path, { redirect: 'follow', headers: { 'cache-control': 'no-cache' } });
  return { status: res.status, html: await res.text() };
};

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
    if (html.includes(needle)) console.log(`✓ ${what}`);
    else fail(`${what} — הסמן "${needle}" חסר ב-${path}`);
  } catch (e) {
    fail(`בדיקת "${what}" נכשלה: ${e.message}`);
  }
}

if (process.exitCode === 1) {
  console.error('\n✗ הפריסה לא אומתה — אין להכריז על הצלחה.');
  process.exit(1);
}
console.log('\n✓ הפריסה אומתה במלואה.');
