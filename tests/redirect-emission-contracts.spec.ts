import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expect, test } from '@playwright/test';
import {
  LEGACY_REDIRECTS,
  LEGACY_REDIRECT_STATUS,
  trimSlash,
} from '../src/lib/legacyRedirects.mjs';

/**
 * חוזה טבלת ההפניות הנפלטת (RULES 24.3.4): השרת הסטטי של הסוללה אינו מגיש
 * 301, אבל טבלת הניתוב שנפלטה ל-`.vercel/output/config.json` — הקובץ
 * ש-Vercel באמת מקבל — כן ניתנת לאימות מקומי.
 *
 * שתי משפחות נשמרות בלי SSOT ידני כפול:
 * - legacy: מקור אמת `src/lib/legacyRedirects.mjs`;
 * - dynamic topic redirects: נגזרים מהפלט ש-Astro יצר עבור `Astro.redirect`,
 *   ומדווחים אוטומטית ב-`.vercel/output/derived-static-redirects.json`.
 *
 * `scripts/normalize-vercel-redirects.mjs` חייב להשאיר פלט סופי עם HTTP 301
 * אמיתי בשתי צורות הלוכסן, בלי עמודי meta-refresh ובלי כתובות redirect
 * ב-sitemap. אימות מול האתר החי נשאר ב-`scripts/verify-deploy.mjs`.
 */
test.skip(({ isMobile }) => isMobile === true, 'emitted route table is device-independent');

const CONFIG_PATH = '.vercel/output/config.json';
const DERIVED_REPORT_PATH = '.vercel/output/derived-static-redirects.json';
const STATIC_ROOT = '.vercel/output/static';

type EmittedRoute = { src?: string; status?: number; headers?: Record<string, string>; handle?: string };
type DerivedRedirect = { from: string; destination: string };

const readRoutes = (): EmittedRoute[] => {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  return Array.isArray(config.routes) ? config.routes : [];
};

const redirectRoutes = () =>
  readRoutes().filter(
    (route) => typeof route.src === 'string' && typeof route.headers?.Location === 'string'
  );

const readDerived = (): DerivedRedirect[] => {
  expect(existsSync(DERIVED_REPORT_PATH), 'ה-build יוצר דוח redirects נגזר').toBe(true);
  const report = JSON.parse(readFileSync(DERIVED_REPORT_PATH, 'utf8'));
  expect(Array.isArray(report), 'דוח redirects נגזר הוא מערך').toBe(true);
  return report as DerivedRedirect[];
};

const htmlFiles = (root: string): string[] => {
  if (!existsSync(root)) return [];
  const files: string[] = [];
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
    }
  };
  visit(root);
  return files;
};

for (const [from, destination] of Object.entries(LEGACY_REDIRECTS)) {
  test(`הפניה legacy נפלטת ותופסת את שתי הצורות: ${from}`, () => {
    const bare = trimSlash(from);
    const matching = redirectRoutes().filter((route) => new RegExp(route.src!).test(bare));
    expect(matching, `${from}: מסלול הפניה אחד בדיוק בפלט — בלי כפילויות`).toHaveLength(1);

    const route = matching[0];
    expect(route.headers!.Location, `${from}: היעד הקנוני`).toBe(destination);
    expect(route.status, `${from}: הפניה קבועה אמיתית`).toBe(LEGACY_REDIRECT_STATUS);
    expect(new RegExp(route.src!).test(`${bare}/`), `${from}: הצורה עם הלוכסן חיה`).toBe(true);
    expect(new RegExp(route.src!).test(bare), `${from}: הצורה בלי הלוכסן חיה`).toBe(true);
  });
}

test('Astro.redirect סטטי מקודם ל-HTTP 301 אמיתי — בלי HTML ובלי sitemap leak', () => {
  const derived = readDerived();
  expect(new Set(derived.map((entry) => entry.from)).size, 'אין מקורות dynamic כפולים').toBe(derived.length);

  const sitemapFiles = existsSync(STATIC_ROOT)
    ? readdirSync(STATIC_ROOT)
        .filter((name) => /^sitemap(?:-\d+)?\.xml$/.test(name))
        .map((name) => join(STATIC_ROOT, name))
    : [];

  for (const { from, destination } of derived) {
    expect(from.startsWith('/chativat-beynayim/nose/'), `${from}: משפחת source מותרת`).toBe(true);
    expect(destination.startsWith('/') && !destination.startsWith('//'), `${from}: יעד same-origin`).toBe(true);

    const bare = trimSlash(from);
    const matching = redirectRoutes().filter((route) => new RegExp(route.src!).test(bare));
    expect(matching, `${from}: redirect נגזר אחד בדיוק`).toHaveLength(1);
    const route = matching[0];
    expect(route.status, `${from}: סטטוס HTTP אמיתי`).toBe(301);
    expect(route.headers!.Location, `${from}: היעד שנגזר מה-build נשמר`).toBe(destination);
    expect(new RegExp(route.src!).test(bare), `${from}: בלי לוכסן`).toBe(true);
    expect(new RegExp(route.src!).test(`${bare}/`), `${from}: עם לוכסן`).toBe(true);

    const staticFile = join(STATIC_ROOT, bare.slice(1), 'index.html');
    expect(existsSync(staticFile), `${from}: file-based meta-refresh אינו נשאר בפריסה`).toBe(false);

    for (const sitemap of sitemapFiles) {
      const xml = readFileSync(sitemap, 'utf8');
      const leaked = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].some((match) => {
        try {
          return trimSlash(new URL(match[1].replaceAll('&amp;', '&')).pathname) === bare;
        } catch {
          return false;
        }
      });
      expect(leaked, `${from}: אינו canonical ב-${relative(STATIC_ROOT, sitemap)}`).toBe(false);
    }
  }
});

test('אין אף meta-refresh HTML בפלט הפריסה הסופי', () => {
  const offenders = htmlFiles(STATIC_ROOT)
    .filter((file) => /http-equiv\s*=\s*(["'])refresh\1/i.test(readFileSync(file, 'utf8')))
    .map((file) => relative(STATIC_ROOT, file));
  expect(offenders, 'client redirects אינם יכולים לחמוק כעמודי 200').toEqual([]);
});

test('אין redirect נפלט שאינו באחד משני מקורות האמת', () => {
  const derived = readDerived();
  const canonicalSources = [
    ...Object.keys(LEGACY_REDIRECTS),
    ...derived.map((entry) => entry.from),
  ].map((from) => trimSlash(from));

  const strays = redirectRoutes().filter(
    (route) => !canonicalSources.some((bare) => new RegExp(route.src!).test(bare))
  );
  expect(
    strays.map((route) => `${route.src} -> ${route.headers!.Location}`),
    'כל redirect בפלט חייב להיות legacy מפורש או נגזר מ-Astro.redirect בפועל'
  ).toEqual([]);
  expect(redirectRoutes(), 'מספר ההפניות בפלט = legacy + dynamic שנגזרו').toHaveLength(
    Object.keys(LEGACY_REDIRECTS).length + derived.length
  );
});

test('הנרמול דטרמיניסטי ואידמפוטנטי — הרצה שנייה אינה משנה את הפלט', () => {
  const configBefore = readFileSync(CONFIG_PATH, 'utf8');
  const reportBefore = readFileSync(DERIVED_REPORT_PATH, 'utf8');
  execFileSync(process.execPath, ['scripts/normalize-vercel-redirects.mjs'], { stdio: 'pipe' });
  const configAfter = readFileSync(CONFIG_PATH, 'utf8');
  const reportAfter = readFileSync(DERIVED_REPORT_PATH, 'utf8');
  expect(configAfter, 'config זהה בהרצה חוזרת').toBe(configBefore);
  expect(reportAfter, 'הדוח הנגזר זהה בהרצה חוזרת').toBe(reportBefore);
});

test('vercel.json: כותרות האבטחה נשמרות, buildCommand מריץ את השרשרת, ואין רשימת הפניות שנייה', () => {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));

  expect(vercel.buildCommand, 'Vercel מריץ את שרשרת ה-build של הפרויקט').toBe('npm run build');
  expect(vercel.redirects, 'אין redirect manifest ידני שני ב-vercel.json').toBeUndefined();

  const global = (vercel.headers ?? []).find(
    (entry: { source?: string }) => entry.source === '/(.*)'
  );
  expect(global, 'בלוק הכותרות הגלובלי קיים').toBeTruthy();
  const names = new Set(
    (global!.headers as Array<{ key: string }>).map((header) => header.key)
  );
  for (const required of [
    'X-Content-Type-Options',
    'Referrer-Policy',
    'X-Frame-Options',
    'Permissions-Policy',
  ]) {
    expect(names.has(required), `כותרת ${required} נשמרת`).toBe(true);
  }
});
