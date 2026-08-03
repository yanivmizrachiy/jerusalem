/**
 * דפדפן פנימי לאתר ההמחשות (RULES 9.1, הוראת יניב 03/08/2026):
 * פרוקסי מחוזי שמגיש את mamhishim.my.canva.site מאותו origin —
 * מסיר את חסימת frame-ancestors ומאפשר גלישה אמיתית בתוך האתר.
 * מוגבל אך ורק לדומיין ההמחשות; שום יעד אחר אינו מועבר.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const ORIGIN = 'https://mamhishim.my.canva.site';

export const ALL: APIRoute = async ({ params, request }) => {
  const path = params.path ? `/${params.path}` : '/';
  const search = new URL(request.url).search;
  const target = `${ORIGIN}${path}${search}`;

  const upstream = await fetch(target, {
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

  if (ct.includes('text/html')) {
    let html = await upstream.text();
    // כתובות יחסיות-שורש ומוחלטות של האתר → דרך הפרוקסי
    html = html.replace(/(href|src|action|content|data-src)=("|')\//g, '$1=$2/api/mam/');
    html = html.replace(/https:\/\/mamhishim\.my\.canva\.site/g, '/api/mam');
    return new Response(html, { status: upstream.status, headers });
  }

  return new Response(upstream.body, { status: upstream.status, headers });
};
