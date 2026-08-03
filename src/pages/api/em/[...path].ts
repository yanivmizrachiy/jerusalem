/**
 * דפדפן פנימי לאתרים הקנוניים של יניב (RULES 9.4–9.5, הוראת יניב 03/08/2026):
 * misparim ו-zaviyot שולחים X-Frame-Options: SAMEORIGIN ולכן הטמעתם הישירה
 * הציגה לוח ריק. הפרוקסי מגיש אותם מאותו origin — allowlist קשיח בלבד;
 * שום יעד אחר אינו מועבר. (אסור לתקן בריפו של האתרים — עובדים רק על jerusalem.)
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const SITES: Record<string, string> = {
  misparim: 'https://misparim.vercel.app',
  zaviyot: 'https://zaviyot.vercel.app',
};

export const ALL: APIRoute = async ({ params, request }) => {
  const segments = (params.path ?? '').split('/');
  const site = segments.shift() ?? '';
  const origin = SITES[site];
  if (!origin) return new Response('Not found', { status: 404 });

  const path = `/${segments.join('/')}`;
  const search = new URL(request.url).search;
  const upstream = await fetch(`${origin}${path}${search}`, {
    headers: {
      'user-agent': request.headers.get('user-agent') ?? 'Mozilla/5.0',
      accept: request.headers.get('accept') ?? '*/*',
      'accept-language': 'he,en;q=0.8',
    },
    redirect: 'follow',
  });

  const headers = new Headers();
  const ct = upstream.headers.get('content-type') ?? 'application/octet-stream';
  headers.set('content-type', ct);
  const cache = upstream.headers.get('cache-control');
  if (cache) headers.set('cache-control', cache);

  const base = `/api/em/${site}/`;

  if (ct.includes('text/html')) {
    let html = await upstream.text();
    html = html.replace(/(href|src|action|content|data-src|poster)=("|')\//g, `$1=$2${base}`);
    // srcset/imagesrcset — רשימת מקורות מופרדת בפסיקים; הדפדפן מעדיף אותה על src,
    // ולכן בלעדיה הלוגו של האתר המוטמע נשבר (הוראת יניב, 03/08/2026)
    html = html.replace(/(srcset|imagesrcset)=("|')([^"']*)("|')/gi, (_m, attr, q, val, q2) =>
      `${attr}=${q}${(val as string).replace(/(^|,\s*)\//g, `$1${base}`)}${q2}`);
    // מחרוזות נכסים בתוך סקריפטים מוטמעים (Next.js טוען chunks לפי מחרוזת)
    html = html.replace(/(["'])\/_next\//g, `$1${base}_next/`);
    html = html.replace(new RegExp(origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), base.slice(0, -1));
    const goldScroll =
      '<style>::-webkit-scrollbar{width:30px;height:30px}::-webkit-scrollbar-track{background:#f5f1e8}::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#d4af5c,#b08d3e 45%,#77602a);border-radius:15px;border:5px solid #f5f1e8}html{scrollbar-color:#b08d3e #f5f1e8;scrollbar-width:auto}</style>';
    html = html.includes('</head>') ? html.replace('</head>', goldScroll + '</head>') : goldScroll + html;
    return new Response(html, { status: upstream.status, headers });
  }

  // גם נכסי CSS ו-JS מפנים לנתיבי שורש — משכתבים כדי שהכול יישאר בתוך הפרוקסי
  if (ct.includes('text/css')) {
    let css = await upstream.text();
    css = css.replace(/url\((["']?)\//g, `url($1${base}`);
    return new Response(css, { status: upstream.status, headers });
  }
  if (ct.includes('javascript')) {
    let js = await upstream.text();
    js = js.replace(/(["'])\/_next\//g, `$1${base}_next/`);
    return new Response(js, { status: upstream.status, headers });
  }

  return new Response(upstream.body, { status: upstream.status, headers });
};
