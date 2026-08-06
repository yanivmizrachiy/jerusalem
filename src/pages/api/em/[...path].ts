/**
 * דפדפן פנימי לאתרים הקנוניים של יניב (RULES 9.4–9.5, הוראת יניב 03/08/2026):
 * misparim ו-zaviyot שולחים X-Frame-Options: SAMEORIGIN ולכן הטמעתם הישירה
 * הציגה לוח ריק. הפרוקסי מגיש אותם מאותו origin — allowlist קשיח בלבד;
 * שום יעד אחר אינו מועבר. (אסור לתקן בריפו של האתרים — עובדים רק על jerusalem.)
 */
import type { APIRoute } from 'astro';
import { injectGuard, injectGoldScrollbar } from '../../../lib/proxyGuard';

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

  const base = `/api/em/${site}/`;
  const path = `/${segments.join('/')}`;
  let search = new URL(request.url).search;
  // מייעל התמונות של Next מקבל את נתיב המקור בפרמטר url; ערך שכבר עבר
  // יישור לקידומת הפרוקסי חייב לחזור לנתיב המקורי — אחרת המקור עונה 400
  // (ממצא ביקורת 03/08/2026: הלוגו דרך ‎_next/image‎ נשבר בהטמעה)
  if (path.startsWith('/_next/image') && search) {
    const q = new URLSearchParams(search);
    const u = q.get('url');
    if (u && u.startsWith(base)) {
      q.set('url', u.slice(base.length - 1));
      search = `?${q.toString()}`;
    }
  }
  let upstream: Response;
  try {
    upstream = await fetch(`${origin}${path}${search}`, {
      headers: {
        'user-agent': request.headers.get('user-agent') ?? 'Mozilla/5.0',
        accept: request.headers.get('accept') ?? '*/*',
        'accept-language': 'he,en;q=0.8',
      },
      // הפניות נחוצות ל-Next, אבל היעד הסופי נבדק מיד אחריהן
      redirect: 'follow',
      // בלי תקרת זמן בקשה תלויה מחזיקה פונקציה עד לטיים-אאוט של הפלטפורמה
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    return new Response('המקור אינו זמין כרגע — נסו שוב בעוד רגע.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  // ה-allowlist חייב לחול גם על סוף שרשרת ההפניות, אחרת redirect במקור
  // מוציא אותנו אל דומיין שלא אושר — ואנחנו מגישים אותו מה-origin שלנו
  if (upstream.url && !upstream.url.startsWith(origin)) {
    return new Response('היעד הסופי אינו ברשימת ההיתר.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const headers = new Headers();
  const ct = upstream.headers.get('content-type') ?? 'application/octet-stream';
  headers.set('content-type', ct);
  const cache = upstream.headers.get('cache-control');
  if (cache) headers.set('cache-control', cache);

  if (ct.includes('text/html')) {
    let html = await upstream.text();
    html = html.replace(/(href|src|action|content|data-src|poster)=("|')\/(?!\/)/g, `$1=$2${base}`);
    // srcset/imagesrcset — רשימת מקורות מופרדת בפסיקים; הדפדפן מעדיף אותה על src,
    // ולכן בלעדיה הלוגו של האתר המוטמע נשבר (הוראת יניב, 03/08/2026)
    html = html.replace(/(srcset|imagesrcset)=("|')([^"']*)("|')/gi, (_m, attr, q, val, q2) =>
      `${attr}=${q}${(val as string).replace(/(^|,\s*)\/(?!\/)/g, `$1${base}`)}${q2}`);
    // רקעים בתוך style מוטבע — הפנורמה של zaviyot מוגדרת כ-url(/panorama/…)
    // במאפיין CSS מותאם ונשברה בהטמעה (ממצא ביקורת 03/08/2026)
    html = html.replace(/url\((["']?)\/(?!\/)/g, `url($1${base}`);
    // מחרוזות נכסים בתוך סקריפטים מוטמעים (Next.js טוען chunks לפי מחרוזת)
    html = html.replace(/(["'])\/_next\//g, `$1${base}_next/`);
    html = html.replace(new RegExp(origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), base.slice(0, -1));
    // משמר זמן-הריצה — חייב לרוץ לפני כל סקריפט של האפליקציה (proxyGuard.ts)
    html = injectGuard(html, base.slice(0, -1));
    html = injectGoldScrollbar(html);
    return new Response(html, { status: upstream.status, headers });
  }

  // גם נכסי CSS ו-JS מפנים לנתיבי שורש — משכתבים כדי שהכול יישאר בתוך הפרוקסי
  if (ct.includes('text/css')) {
    let css = await upstream.text();
    css = css.replace(/url\((["']?)\/(?!\/)/g, `url($1${base}`);
    return new Response(css, { status: upstream.status, headers });
  }
  if (ct.includes('javascript')) {
    let js = await upstream.text();
    js = js.replace(/(["'])\/_next\//g, `$1${base}_next/`);
    // גם נכסים שורשיים בודדים (למשל pdf.worker.min.mjs) — בלעדיהם מציג
    // ה-PDF בתוך האתר המוטמע נשבר (ממצא ביקורת 03/08/2026)
    js = js.replace(/(["'])\/([\w.-]+\.(?:mjs|js|json|wasm|pdf|png|jpe?g|svg|webp|woff2?))(["'])/g, `$1${base}$2$3`);
    return new Response(js, { status: upstream.status, headers });
  }

  return new Response(upstream.body, { status: upstream.status, headers });
};
