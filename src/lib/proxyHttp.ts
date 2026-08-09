/**
 * שכבת ה-HTTP המשותפת לשני הפרוקסי המחוזיים (‏/api/em, ‏/api/mam).
 *
 * הרקע (ממצא ריצה 09/08/2026): שני המסלולים מייצאים `ALL`, כלומר הם עונים
 * לכל פועל HTTP — אבל ה-fetch אל המקור נשלח תמיד כ-GET בלי גוף ובלי
 * כותרות הסמנטיקה. התוצאה: בקשת HEAD קיבלה גוף מלא, בקשת POST בוצעה
 * בשקט כ-GET (הצלחה מדומה — 4.6), ובקשת Range או בקשה מותנית איבדה את
 * המשמעות שלה ולכן כל נכס נמשך מחדש במלואו.
 *
 * העקרונות שנשמרים כאן במפורש:
 * - **גבול האבטחה אינו מתרחב**: רק GET/HEAD/POST/OPTIONS מועברים; PUT,
 *   DELETE ו-PATCH נחסמים ב-405. הפרוקסי מגיש אתרי לימוד לקריאה — אין
 *   סיבה להעניק לו יכולת כתיבה אל origin של צד שלישי.
 * - **אין העברת סודות**: ‏cookie, ‏authorization ו-set-cookie לעולם אינם
 *   עוברים בשני הכיוונים. הגולש אינו מזוהה מול המקור, והמקור אינו יכול
 *   לשתול עוגייה על הדומיין שלנו.
 * - **גוף חסום בגודל בזמן הקריאה**: ‏Content-Length גדול נדחה לפני buffering;
 *   כשאין length אמין, ה-stream נקרא בהדרגה ונקטע מיד אחרי 1MiB. כך התקרה
 *   מגינה באמת על זיכרון הפונקציה ולא נבדקת רק אחרי שכל הגוף כבר נטען.
 */

/** הפעלים היחידים שהפרוקסי מעביר. כל השאר → 405. */
const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'POST', 'OPTIONS']);

/** פעלים שאין להם גוף בקשה לפי התקן. */
const BODYLESS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** תקרת גוף בקשה — 1MiB. הפרוקסי מגיש אתרים סטטיים; גוף גדול מזה אינו לגיטימי. */
const MAX_BODY_BYTES = 1024 * 1024;

/**
 * כותרות בקשה שמועברות למקור. ‏range והמאמתים המותנים הם מה שהופך
 * בקשה חוזרת לזולה; בלעדיהם כל נכס נמשך שוב במלואו.
 */
const FORWARD_REQUEST_HEADERS = [
  'accept',
  'accept-language',
  'range',
  'if-none-match',
  'if-modified-since',
  'if-range',
];

/**
 * כותרות תגובה שנשמרות. ‏content-length מכוון בחסר: גוף HTML/CSS/JS
 * משוכתב בצד שלנו ואורכו משתנה, ולכן העתקת האורך המקורי הייתה יוצרת
 * תגובה פגומה.
 */
const FORWARD_RESPONSE_HEADERS = [
  'cache-control',
  'etag',
  'last-modified',
  'expires',
  'content-range',
  'accept-ranges',
  'vary',
  'content-language',
];

export class ProxyRequestError extends Error {
  constructor(readonly response: Response) {
    super('proxy request rejected');
  }
}

const plain = (body: string, status: number) =>
  new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

const tooLarge = () => new ProxyRequestError(plain('גוף הבקשה גדול מדי.', 413));

/**
 * קורא גוף בקשה עד תקרה קשיחה בלי לטעון קודם את כל ה-stream לזיכרון.
 * גם `Content-Length` שקרי/חסר אינו עוקף את הגבול: הספירה האמיתית נעשית
 * על ה-chunks שנקראו. מוחזר ArrayBuffer אמיתי כדי להתאים ל-BodyInit בכל
 * סביבת TypeScript/Fetch הנתמכת, בלי להסתמך על טיפוס Uint8Array רחב יותר.
 */
async function readBoundedBody(request: Request): Promise<ArrayBuffer> {
  const declared = request.headers.get('content-length');
  if (declared) {
    const declaredBytes = Number(declared);
    if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
      throw tooLarge();
    }
  }

  if (!request.body) return new ArrayBuffer(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value?.byteLength) continue;

      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel('proxy request body exceeds 1MiB');
        throw tooLarge();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  // `body` is freshly allocated above, therefore its backing buffer covers exactly
  // the bytes we want to forward and is an ArrayBuffer (not SharedArrayBuffer).
  return body.buffer as ArrayBuffer;
}

/**
 * בונה את ה-init של ה-fetch אל המקור מתוך הבקשה הנכנסת.
 * זורק ProxyRequestError עם תגובה מוכנה כאשר הבקשה נדחית.
 */
export async function upstreamInit(request: Request, timeoutMs = 12_000): Promise<RequestInit> {
  const method = request.method.toUpperCase();
  if (!ALLOWED_METHODS.has(method)) {
    throw new ProxyRequestError(
      new Response('הפעולה אינה נתמכת בפרוקסי.', {
        status: 405,
        headers: { 'content-type': 'text/plain; charset=utf-8', allow: 'GET, HEAD, POST, OPTIONS' },
      }),
    );
  }

  const headers = new Headers();
  headers.set('user-agent', request.headers.get('user-agent') ?? 'Mozilla/5.0');
  headers.set('accept-language', 'he,en;q=0.8');
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (!headers.has('accept')) headers.set('accept', '*/*');

  const init: RequestInit = {
    method,
    headers,
    // הפניות נחוצות ל-Next, אבל היעד הסופי נבדק מיד אחריהן
    redirect: 'follow',
    // בלי תקרת זמן בקשה תלויה מחזיקה פונקציה עד לטיים-אאוט של הפלטפורמה
    signal: AbortSignal.timeout(timeoutMs),
  };

  if (!BODYLESS.has(method)) {
    const raw = await readBoundedBody(request);
    if (raw.byteLength > 0) {
      init.body = raw;
      const ct = request.headers.get('content-type');
      if (ct) headers.set('content-type', ct);
    }
  }

  return init;
}

/** מעתיק לתגובה שלנו את כותרות הסמנטיקה של המקור (בלי set-cookie ובלי content-length). */
export function copyResponseHeaders(upstream: Response, headers: Headers): Headers {
  for (const name of FORWARD_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return headers;
}

/**
 * תגובות שאסור להן לשאת גוף. ‏304 ו-‏204 חייבים להישאר ריקים, ותשובה
 * ל-HEAD נושאת את הכותרות בלבד — אחרת הדפדפן מקבל גוף שלא ביקש.
 */
export function isBodyless(method: string, status: number): boolean {
  return method.toUpperCase() === 'HEAD' || status === 204 || status === 304;
}
