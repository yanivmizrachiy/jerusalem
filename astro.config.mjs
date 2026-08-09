// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { LEGACY_PATHS, LEGACY_REDIRECTS, LEGACY_REDIRECT_STATUS, trimSlash } from './src/lib/legacyRedirects.mjs';

// מסלולי התאימות מוגדרים פעם אחת ב-src/lib/legacyRedirects.mjs ומתורגמים
// כאן להפניית HTTP אמיתית (301) במקום עמוד 200 עם meta-refresh
const redirects = Object.fromEntries(
  Object.entries(LEGACY_REDIRECTS).map(([from, destination]) => [
    from,
    { status: LEGACY_REDIRECT_STATUS, destination },
  ]),
);

// אתר מחוז ירושלים — סטטי + נקודת פרוקסי להמחשות (prerender=false)
export default defineConfig({
  site: 'https://jerusalem-virid.vercel.app',
  output: 'static',
  adapter: vercel(),
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  redirects,
  integrations: [
    // כתובת שרק מפנה אינה עמוד קנוני ואינה נכנסת ל-sitemap (RULES 18)
    sitemap({ filter: (page) => !LEGACY_PATHS.has(trimSlash(new URL(page).pathname) + '/') }),
  ],
  // שרת הפיתוח מכבד PORT מהסביבה כדי לא להתנגש בשרתים מקבילים
  server: { port: Number(process.env.PORT) || 4322 },
});
