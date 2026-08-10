/**
 * מדיניות התגובה של הפרוקסים המחוזיים (‏/api/em, ‏/api/mam) — הצד המשלים
 * של proxyHttp.ts: שם נשמרת סמנטיקת הבקשה, כאן נקבעת צורת התגובה.
 *
 * שני עקרונות:
 * - **מסמך פרוקסי נצפה רק מתוך האתר שלנו**: התוכן המוגש מאותו origin נועד
 *   להטמעה בעמודי ירושלים בלבד. `frame-ancestors 'self'` מונע מאתר זר למסגר
 *   את משטח הפרוקסי שלנו תחת ה-origin שלנו, ו-`nosniff` מקבע שהסוג שהוכרז
 *   הוא הסוג שמבוצע. המדיניות חלה על מסמכי HTML ועל עמודי שגיאה — לא על
 *   נכסי passthrough, כדי לא לשבור נכס של המקור שסוגו אינו מוכרז.
 * - **כשל נראה כמו כשל, בעיצוב האתר** (RULES 8.8, 4.6): שגיאת פרוקסי בתוך
 *   iframe הציגה טקסט חשוף על לבן בתוך מסגרת הנייבי. עמוד השגיאה כאן נושא
 *   את אותו מסר עובדתי, באותם קודי סטטוס, בעברית RTL ובפלטת האתר — בלי
 *   להתחזות להצלחה ובלי תוכן מומצא.
 */

/** כותרות המסמך: חלות על HTML מוגש-פרוקסי ועל עמודי שגיאה בלבד. */
export function applyDocumentSecurityHeaders(headers: Headers): Headers {
  headers.set('content-security-policy', "frame-ancestors 'self'");
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'no-referrer');
  return headers;
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/**
 * עמוד שגיאה של הפרוקסי — מוגש בתוך ה-iframe במקום טקסט חשוף.
 * הסטטוס נשמר כפי שהוא; `sourceHref` מוצג רק כשקיים יעד אמיתי שמותר
 * להציע לפתיחה ישירה (מקור שנפל), לעולם לא ליעד שנדחה ב-allowlist.
 */
export function proxyErrorResponse(message: string, status: number, sourceHref?: string): Response {
  const link = sourceHref
    ? `<a class="src" href="${escapeHtml(sourceHref)}" target="_blank" rel="noopener noreferrer">פתיחה במקור בכרטיסייה חדשה</a>`
    : '';
  const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>ההטמעה אינה זמינה</title>
<style>
  html, body { margin: 0; block-size: 100%; }
  body {
    display: grid; place-items: center; padding: 24px; box-sizing: border-box;
    background: #1f293d; color: #fbf9f5;
    font-family: system-ui, -apple-system, 'Segoe UI', Arial, sans-serif;
    text-align: center;
  }
  .card {
    max-inline-size: 30rem; padding: 28px 32px; border-radius: 14px;
    background: rgb(251 249 245 / 0.04);
    border: 1px solid rgb(176 141 62 / 0.55);
    box-shadow: inset 0 -2px 0 rgb(176 141 62 / 0.55);
  }
  p { margin: 0; font-size: 1.05rem; line-height: 1.7; }
  .src {
    display: inline-block; margin-block-start: 18px; padding: 10px 22px;
    border-radius: 999px; border: 1px solid #b08d3e; color: #fbf9f5;
    text-decoration: none; font-size: 0.95rem;
  }
  .src:hover, .src:focus-visible { background: rgb(176 141 62 / 0.18); }
</style>
</head>
<body>
  <div class="card" data-proxy-error>
    <p>${escapeHtml(message)}</p>
    ${link}
  </div>
</body>
</html>`;
  const headers = new Headers({
    'content-type': 'text/html; charset=utf-8',
    // עמוד שגיאה לעולם אינו מאונדקס — בלי תלות במסלול ההצלחה
    'x-robots-tag': 'noindex, nofollow',
  });
  applyDocumentSecurityHeaders(headers);
  return new Response(html, { status, headers });
}
