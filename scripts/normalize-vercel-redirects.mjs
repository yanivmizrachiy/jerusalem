#!/usr/bin/env node

/**
 * נרמול הפניות בפלט Vercel (RULES 24.3.4).
 *
 * יש כאן שתי משפחות, בלי רשימת כתובות מקבילה:
 * 1. הפניות התאימות הקבועות — מקור האמת הוא `src/lib/legacyRedirects.mjs`.
 * 2. הפניות דינמיות של עמודי נושא — מקור האמת נשאר נתוני התוכן והלוגיקה
 *    ב-`nose/[grade]/[chapter].astro`. ב-output סטטי Astro מייצר עבור
 *    `Astro.redirect()` עמוד HTML עם meta-refresh; הסקריפט מזהה את הפלט הזה,
 *    ממיר אותו להפניית Vercel ‏301 אמיתית, מוחק את עמוד ה-HTML ומסיר את
 *    כתובת המקור מה-sitemap. כך אין 200+meta-refresh בפריסה ואין manifest
 *    ידני שני שיכול לסטות מהנתונים.
 *
 * נמדד 09/08/2026: ‏@astrojs/vercel 11.0.4 פולט להפניות הקונפיג regex בצורת
 * `^/path$` — בלי הלוכסן הסופי. הכתובות הקנוניות ששותפו מסתיימות בלוכסן,
 * ולכן כל הפניה מנורמלת ל-`^/path/?$` ונבדקת fail-closed בשתי הצורות.
 *
 * הסקריפט רץ מיד אחרי `astro build` (package.json + vercel.json). הוא
 * אידמפוטנטי: בהרצה חוזרת אין עמודי meta-refresh, ולכן נטען הדוח הנגזר
 * מההרצה הראשונה ומאומת מול config.json בלי להוסיף מסלולים כפולים.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LEGACY_REDIRECTS,
  LEGACY_REDIRECT_STATUS,
  trimSlash,
} from '../src/lib/legacyRedirects.mjs';

const OUTPUT_ROOT = fileURLToPath(new URL('../.vercel/output/', import.meta.url));
const STATIC_ROOT = path.join(OUTPUT_ROOT, 'static');
const CONFIG_PATH = path.join(OUTPUT_ROOT, 'config.json');
const DERIVED_REPORT_PATH = path.join(OUTPUT_ROOT, 'derived-static-redirects.json');
const DYNAMIC_REDIRECT_STATUS = 301;
const DYNAMIC_SOURCE_PREFIX = '/chativat-beynayim/nose/';

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const routes = Array.isArray(config.routes) ? config.routes : [];

const testSafely = (pattern, value) => {
  try {
    return new RegExp(pattern).test(value);
  } catch {
    return false;
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? null;
};

const refreshDestination = (html, file, problems) => {
  const destinations = [];
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if ((attr(tag, 'http-equiv') ?? '').toLowerCase() !== 'refresh') continue;
    const content = attr(tag, 'content');
    const parsed = content?.match(/^\s*0(?:\.0+)?\s*;\s*url\s*=\s*(.+?)\s*$/i);
    if (!parsed) {
      problems.push(`${file}: meta-refresh בפורמט לא צפוי — ${content ?? '(ללא content)'}`);
      continue;
    }
    destinations.push(parsed[1].replaceAll('&amp;', '&'));
  }

  if (destinations.length > 1) {
    problems.push(`${file}: נמצאו ${destinations.length} תגיות meta-refresh במקום אחת`);
    return null;
  }
  return destinations[0] ?? null;
};

const htmlFiles = (root) => {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
    }
  };
  visit(root);
  return files;
};

const sourcePathForHtml = (file) => {
  const relative = path.relative(STATIC_ROOT, file).split(path.sep).join('/');
  if (!relative.endsWith('/index.html')) return null;
  return `/${relative.slice(0, -'/index.html'.length)}/`;
};

const redirectRoutes = () =>
  routes.filter(
    (route) => route && typeof route.src === 'string' && typeof route.headers?.Location === 'string'
  );

const readDerivedReport = () => {
  if (!fs.existsSync(DERIVED_REPORT_PATH)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(DERIVED_REPORT_PATH, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const problems = [];
let normalizedLegacy = 0;

// --- 1. ההפניות הקבועות: אימות ונרמול שתי צורות הלוכסן. ---
for (const [from, destination] of Object.entries(LEGACY_REDIRECTS)) {
  const bare = trimSlash(from);
  const withSlash = `${bare}/`;

  const matching = redirectRoutes().filter((route) => testSafely(route.src, bare));
  if (matching.length !== 1) {
    problems.push(`${from}: נמצאו ${matching.length} מסלולי הפניה תואמים במקום אחד בדיוק`);
    continue;
  }

  const route = matching[0];
  if (route.headers.Location !== destination) {
    problems.push(`${from}: היעד בפלט הוא ${route.headers.Location} במקום ${destination}`);
    continue;
  }
  if (route.status !== LEGACY_REDIRECT_STATUS) {
    problems.push(`${from}: הסטטוס בפלט הוא ${route.status} במקום ${LEGACY_REDIRECT_STATUS}`);
    continue;
  }

  if (!testSafely(route.src, withSlash)) {
    if (!route.src.endsWith('$')) {
      problems.push(`${from}: תבנית לא צפויה בפלט — ${route.src}`);
      continue;
    }
    route.src = `${route.src.slice(0, -1)}/?$`;
    normalizedLegacy += 1;
  }

  if (!testSafely(route.src, bare) || !testSafely(route.src, withSlash)) {
    problems.push(`${from}: לאחר הנרמול התבנית עדיין אינה תופסת את שתי הצורות — ${route.src}`);
  }
}

// --- 2. הפניות דינמיות: נגזרות מה-meta-refresh ש-Astro יצר בפועל. ---
const discovered = [];
for (const file of htmlFiles(STATIC_ROOT)) {
  const html = fs.readFileSync(file, 'utf8');
  const destination = refreshDestination(html, file, problems);
  if (!destination) continue;

  const from = sourcePathForHtml(file);
  if (!from) {
    problems.push(`${file}: meta-refresh מחוץ למבנה route של index.html`);
    continue;
  }
  if (!from.startsWith(DYNAMIC_SOURCE_PREFIX)) {
    problems.push(`${from}: meta-refresh חדש מחוץ למשפחת הנושאים המותרת`);
    continue;
  }
  if (!destination.startsWith('/') || destination.startsWith('//')) {
    problems.push(`${from}: יעד redirect דינמי חייב להיות same-origin path — ${destination}`);
    continue;
  }

  const bare = trimSlash(from);
  const existing = redirectRoutes().filter((route) => testSafely(route.src, bare));
  if (existing.length > 0) {
    problems.push(`${from}: כבר קיים redirect ב-config ולכן המרה מה-HTML תיצור כפילות`);
    continue;
  }

  discovered.push({ from, destination, file });
}

const previousDerived = readDerivedReport();
let derived;
if (discovered.length > 0) {
  const bySource = new Set();
  for (const item of discovered) {
    if (bySource.has(item.from)) problems.push(`${item.from}: meta-refresh כפול בפלט הסטטי`);
    bySource.add(item.from);
  }
  derived = discovered.map(({ from, destination }) => ({ from, destination }));
} else {
  derived = previousDerived;
}

if (problems.length > 0) {
  console.error('נרמול הפניות נכשל — ה-build נעצר:');
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

if (discovered.length > 0) {
  const generatedRoutes = derived.map(({ from, destination }) => {
    const bare = trimSlash(from);
    return {
      src: `^${escapeRegex(bare)}/?$`,
      status: DYNAMIC_REDIRECT_STATUS,
      headers: { Location: destination },
    };
  });

  const firstHandle = routes.findIndex((route) => route && typeof route.handle === 'string');
  const insertAt = firstHandle >= 0 ? firstHandle : routes.length;
  routes.splice(insertAt, 0, ...generatedRoutes);

  // file-based route גובר על redirect; לכן ה-HTML חייב להיעלם מהפלט הסופי.
  for (const { file } of discovered) fs.rmSync(file);
}

// --- 3. sitemap: redirect אינו עמוד קנוני. מסירים מקורות דינמיים אם הופיעו. ---
const derivedPaths = new Set(derived.map(({ from }) => trimSlash(from)));
const sitemapFiles = fs.existsSync(STATIC_ROOT)
  ? fs.readdirSync(STATIC_ROOT)
      .filter((name) => /^sitemap(?:-\d+)?\.xml$/.test(name))
      .map((name) => path.join(STATIC_ROOT, name))
  : [];

for (const file of sitemapFiles) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(/<url>[^]*?<\/url>/g, (block) => {
    const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.replaceAll('&amp;', '&');
    if (!loc) return block;
    try {
      const pathname = trimSlash(new URL(loc).pathname);
      return derivedPaths.has(pathname) ? '' : block;
    } catch {
      return block;
    }
  });
  if (after !== before) fs.writeFileSync(file, after);
}

// --- 4. postconditions: כל derived redirect אמיתי, אין HTML ואין sitemap source. ---
for (const { from, destination } of derived) {
  const bare = trimSlash(from);
  const matching = redirectRoutes().filter((route) => testSafely(route.src, bare));
  if (matching.length !== 1) {
    problems.push(`${from}: אחרי ההמרה נמצאו ${matching.length} redirects במקום אחד`);
    continue;
  }
  const route = matching[0];
  if (route.status !== DYNAMIC_REDIRECT_STATUS || route.headers.Location !== destination) {
    problems.push(`${from}: redirect נגזר אינו 301 אל ${destination}`);
  }
  if (!testSafely(route.src, bare) || !testSafely(route.src, `${bare}/`)) {
    problems.push(`${from}: redirect נגזר אינו תופס את שתי צורות הלוכסן`);
  }

  const staticFile = path.join(STATIC_ROOT, bare.slice(1), 'index.html');
  if (fs.existsSync(staticFile)) problems.push(`${from}: עמוד meta-refresh עדיין קיים בפלט`);

  for (const sitemap of sitemapFiles) {
    const xml = fs.readFileSync(sitemap, 'utf8');
    const leaked = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].some((match) => {
      try {
        return trimSlash(new URL(match[1].replaceAll('&amp;', '&')).pathname) === bare;
      } catch {
        return false;
      }
    });
    if (leaked) problems.push(`${from}: כתובת redirect עדיין מופיעה ב-${path.basename(sitemap)}`);
  }
}

const remainingMetaRefresh = htmlFiles(STATIC_ROOT)
  .filter((file) => /<meta\b[^>]*http-equiv\s*=\s*(["'])refresh\1/i.test(fs.readFileSync(file, 'utf8')))
  .map((file) => `/${path.relative(STATIC_ROOT, file).split(path.sep).join('/')}`);
if (remainingMetaRefresh.length > 0) {
  problems.push(`נשארו עמודי meta-refresh בפלט: ${remainingMetaRefresh.join(', ')}`);
}

if (problems.length > 0) {
  console.error('נרמול הפניות נכשל — ה-build נעצר:');
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

fs.writeFileSync(DERIVED_REPORT_PATH, `${JSON.stringify(derived, null, 2)}\n`);
fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, '\t')}\n`);
console.log(
  `הפניות: ${Object.keys(LEGACY_REDIRECTS).length} legacy נבדקו (${normalizedLegacy} נורמלו), ` +
  `${derived.length} דינמיות הן HTTP 301 אמיתי; אין meta-refresh בפלט הסופי.`
);
