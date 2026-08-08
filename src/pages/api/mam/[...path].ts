/**
 * דפדפן פנימי לאתר ההמחשות (RULES 9.1, הוראת יניב 03/08/2026):
 * פרוקסי מחוזי שמגיש את mamhishim.my.canva.site מאותו origin —
 * מסיר את חסימת frame-ancestors ומאפשר גלישה אמיתית בתוך האתר.
 * מוגבל אך ורק לדומיין ההמחשות; שום יעד אחר אינו מועבר.
 */
import type { APIRoute } from 'astro';
import { injectGuard, injectGoldScrollbar } from '../../../lib/proxyGuard';
import { ProxyRequestError, copyResponseHeaders, isBodyless, upstreamInit } from '../../../lib/proxyHttp';

export const prerender = false;

const ORIGIN = 'https://mamhishim.my.canva.site';
const ALLOWED_ORIGIN = new URL(ORIGIN).origin;

export const ALL: APIRoute = async ({ params, request }) => {
  const path = params.path ? `/${params.path}` : '/';
  const search = new URL(request.url).search;
  const target = `${ORIGIN}${path}${search}`;

  // הפועל, הגוף וכותרות הסמנטיקה נשמרים (proxyHttp.ts)
  let init: RequestInit;
  try {
    init = await upstreamInit(request);
  } catch (err) {
    if (err instanceof ProxyRequestError) return err.response;
    throw err;
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return new Response('המקור אינו זמין כרגע — נסו שוב בעוד רגע.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  // ה-allowlist חל גם על סוף שרשרת ההפניות ובודק origin אמיתי,
  // לא prefix טקסטואלי של הכתובת.
  if (upstream.url && new URL(upstream.url).origin !== ALLOWED_ORIGIN) {
    return new Response('היעד הסופי אינו ברשימת ההיתר.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const headers = new Headers();
  const ct = upstream.headers.get('content-type') ?? 'application/octet-stream';
  headers.set('content-type', ct);
  copyResponseHeaders(upstream, headers);

  // HEAD/204/304 נושאים כותרות בלבד
  if (isBodyless(request.method, upstream.status)) {
    return new Response(null, { status: upstream.status, headers });
  }

  if (ct.includes('text/html')) {
    let html = await upstream.text();
    // כתובות יחסיות-שורש ומוחלטות של האתר → דרך הפרוקסי
    html = html.replace(/(href|src|action|content|data-src)=("|')\/(?!\/)/g, '$1=$2/api/mam/');
    html = html.replace(/url\((["']?)\/(?!\/)/g, 'url($1/api/mam/');
    html = html.replace(/https:\/\/mamhishim\.my\.canva\.site/g, '/api/mam');
    // משמר זמן-הריצה — מיישר בקשות שנבנות ב-JS אל תוך הפרוקסי (proxyGuard.ts)
    html = injectGuard(html, '/api/mam');
    // גלילת זהב רחבה גם בתוך הסביבה המוטמעת (5.23) — אותו פס בכל ההטמעות
    html = injectGoldScrollbar(html);
    return new Response(html, { status: upstream.status, headers });
  }

  return new Response(upstream.body, { status: upstream.status, headers });
};
