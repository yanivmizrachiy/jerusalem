/**
 * מדיניות התגובה של הפרוקסים (src/lib/proxyResponse.ts) — חוזים דטרמיניסטיים:
 *
 * 1. שגיאת פרוקסי היא עמוד HTML מעוצב (RULES 8.8) — לא טקסט חשוף בתוך
 *    המסגרת — באותו קוד סטטוס ובאותו מסר עובדתי (4.6).
 * 2. מסמכי HTML מוגשי-פרוקסי נושאים `frame-ancestors 'self'` ו-nosniff:
 *    משטח הפרוקסי ממוסגר רק מתוך האתר שלנו. המדיניות היא מדיניות-מסמך
 *    בלבד — passthrough של נכסים אינו נוגע בה.
 *
 * הבדיקות רצות in-process (כמו deep-review-regressions.spec.ts): מייבאות
 * את המסלולים עצמם ומחליפות את fetch הגלובלי, כדי שהחוזה ייאכף על הקוד
 * האמיתי בלי תלות ברשת.
 */
import { expect, test } from '@playwright/test';
import { ALL as emAll } from '../src/pages/api/em/[...path]';
import { ALL as mamAll } from '../src/pages/api/mam/[...path]';
import { applyDocumentSecurityHeaders, proxyErrorResponse } from '../src/lib/proxyResponse';

type EmContext = Parameters<typeof emAll>[0];
type MamContext = Parameters<typeof mamAll>[0];

const emContext = (path: string, url = `http://localhost/api/em/${path}`): EmContext =>
  ({ params: { path }, request: new Request(url) }) as unknown as EmContext;

const mamContext = (path: string, url = `http://localhost/api/mam/${path}`): MamContext =>
  ({ params: { path }, request: new Request(url) }) as unknown as MamContext;

const withFetchStub = async (
  stub: typeof globalThis.fetch,
  run: () => Promise<void>
): Promise<void> => {
  const realFetch = globalThis.fetch;
  globalThis.fetch = stub;
  try {
    await run();
  } finally {
    globalThis.fetch = realFetch;
  }
};

const failingFetch: typeof globalThis.fetch = async () => {
  throw new TypeError('network unreachable (stub)');
};

const htmlFetch: typeof globalThis.fetch = async () =>
  new Response('<html><head><title>stub</title></head><body>ok</body></html>', {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });

const pngFetch: typeof globalThis.fetch = async () =>
  new Response(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), {
    status: 200,
    headers: { 'content-type': 'image/png' },
  });

const html304Fetch: typeof globalThis.fetch = async () =>
  new Response(null, {
    status: 304,
    headers: { 'content-type': 'text/html; charset=utf-8', etag: '"revalidated"' },
  });

test('proxy error page is styled RTL HTML with the factual message and status', async () => {
  const res = proxyErrorResponse('המקור אינו זמין כרגע — נסו שוב בעוד רגע.', 502);
  expect(res.status).toBe(502);
  expect(res.headers.get('content-type')).toContain('text/html');

  const html = await res.text();
  expect(html).toContain('data-proxy-error');
  expect(html).toContain('dir="rtl"');
  expect(html).toContain('המקור אינו זמין כרגע — נסו שוב בעוד רגע.');
});

test('proxy error page carries document security and noindex headers', () => {
  const res = proxyErrorResponse('היעד הסופי אינו ברשימת ההיתר.', 502);
  expect(res.headers.get('content-security-policy')).toBe("frame-ancestors 'self'");
  expect(res.headers.get('x-content-type-options')).toBe('nosniff');
  expect(res.headers.get('referrer-policy')).toBe('no-referrer');
  expect(res.headers.get('x-robots-tag')).toContain('noindex');
});

test('source link appears only when a real fallen source exists, attribute-escaped', async () => {
  const withLink = await proxyErrorResponse('נפל.', 502, 'https://misparim.vercel.app/x?a=1&b="2"').text();
  expect(withLink).toContain('פתיחה במקור בכרטיסייה חדשה');
  expect(withLink).toContain('rel="noopener noreferrer"');
  expect(withLink).toContain('&amp;b=&quot;2&quot;');
  expect(withLink).not.toContain('b="2"');

  const withoutLink = await proxyErrorResponse('נדחה.', 502).text();
  expect(withoutLink).not.toContain('<a ');
});

test('applyDocumentSecurityHeaders sets exactly the document policy', () => {
  const headers = applyDocumentSecurityHeaders(new Headers());
  expect(headers.get('content-security-policy')).toBe("frame-ancestors 'self'");
  expect(headers.get('x-content-type-options')).toBe('nosniff');
  expect(headers.get('referrer-policy')).toBe('no-referrer');
});

test('em proxy answers upstream failure with the styled error page, still 502', async () => {
  await withFetchStub(failingFetch, async () => {
    const res = await emAll(emContext('misparim/'));
    expect(res.status).toBe(502);
    expect(res.headers.get('content-type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('data-proxy-error');
    expect(html).toContain('המקור אינו זמין כרגע');
    // המקור שנפל הוא יעד אמיתי — מוצע לפתיחה ישירה
    expect(html).toContain('https://misparim.vercel.app/');
  });
});

test('mam proxy answers upstream failure with the styled error page, still 502', async () => {
  await withFetchStub(failingFetch, async () => {
    const res = await mamAll(mamContext(''));
    expect(res.status).toBe(502);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(await res.text()).toContain('data-proxy-error');
  });
});

test('proxied HTML documents carry frame-ancestors self and nosniff', async () => {
  await withFetchStub(htmlFetch, async () => {
    for (const res of [await emAll(emContext('misparim/')), await mamAll(mamContext(''))]) {
      expect(res.status).toBe(200);
      expect(res.headers.get('content-security-policy')).toBe("frame-ancestors 'self'");
      expect(res.headers.get('x-content-type-options')).toBe('nosniff');
      // ההקשחה אינה מחליפה את משמר זמן-הריצה — הוא עדיין מוזרק ראשון
      expect(await res.text()).toContain('__EM_PROXY__');
    }
  });
});

test('HTML 304 revalidation keeps the document security policy — em', async () => {
  await withFetchStub(html304Fetch, async () => {
    const req = new Request('http://localhost/api/em/misparim/', {
      headers: { 'if-none-match': '"revalidated"' },
    });
    const res = await emAll({ params: { path: 'misparim/' }, request: req } as unknown as EmContext);
    expect(res.status).toBe(304);
    // בלי ההחלה על המסלול ה-bodyless — revalidation מחזיר מסמך בלי המדיניות
    expect(res.headers.get('content-security-policy')).toBe("frame-ancestors 'self'");
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    // כותרות המטמון של המקור ממשיכות לעבור (copyResponseHeaders)
    expect(res.headers.get('etag')).toBe('"revalidated"');
    expect(await res.text()).toBe('');
  });
});

test('HTML 304 revalidation keeps the document security policy — mam', async () => {
  await withFetchStub(html304Fetch, async () => {
    const req = new Request('http://localhost/api/mam/', {
      headers: { 'if-none-match': '"revalidated"' },
    });
    const res = await mamAll({ params: { path: '' }, request: req } as unknown as MamContext);
    expect(res.status).toBe(304);
    expect(res.headers.get('content-security-policy')).toBe("frame-ancestors 'self'");
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('etag')).toBe('"revalidated"');
    expect(await res.text()).toBe('');
  });
});

test('asset passthrough is untouched by the document policy', async () => {
  await withFetchStub(pngFetch, async () => {
    const res = await emAll(emContext('misparim/logo.png'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-security-policy')).toBeNull();
  });
});

test('allowlist miss stays a plain 404', async () => {
  await withFetchStub(failingFetch, async () => {
    const res = await emAll(emContext('evil/'));
    expect(res.status).toBe(404);
  });
});
