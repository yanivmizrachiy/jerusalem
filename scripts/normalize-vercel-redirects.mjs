#!/usr/bin/env node

/**
 * נרמול הפניות התאימות בפלט Vercel (RULES 24.3.4).
 *
 * נמדד 09/08/2026: ‏@astrojs/vercel 11.0.4 פולט לכל הפניה סטטית regex בצורת
 * `^/path$` — בלי הלוכסן הסופי (`escapeRegex` שב-dist/lib/redirects.js מפצל
 * לפי '/', מסנן מקטעים ריקים וסוגר ב-`$`, בלי שום אפשרות תצורה). הכתובות
 * הקנוניות ששותפו מסתיימות בלוכסן, ולכן בפרודקשן הן החזירו 404 במקום 301.
 *
 * הסקריפט רץ מיד אחרי `astro build` (שרשור ב-package.json; ‏vercel.json קובע
 * `buildCommand: npm run build` כדי שגם Vercel יריץ אותו) ומרחיב כל הפניית
 * תאימות ל-`^/path/?$` — שתי הצורות חיות. ‏fail-closed: הפניה חסרה, יעד שגוי,
 * סטטוס שגוי או תבנית שאינה תופסת את שתי הצורות מפילים את ה-build.
 *
 * מקור יחיד: `src/lib/legacyRedirects.mjs` (RULES 24.3.2) — אין כאן רשימה.
 */

import fs from 'node:fs';
import {
  LEGACY_REDIRECTS,
  LEGACY_REDIRECT_STATUS,
  trimSlash,
} from '../src/lib/legacyRedirects.mjs';

const CONFIG_PATH = new URL('../.vercel/output/config.json', import.meta.url);
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const routes = Array.isArray(config.routes) ? config.routes : [];

const testSafely = (pattern, value) => {
  try {
    return new RegExp(pattern).test(value);
  } catch {
    return false;
  }
};

const problems = [];
let normalized = 0;

for (const [from, destination] of Object.entries(LEGACY_REDIRECTS)) {
  const bare = trimSlash(from);
  const withSlash = `${bare}/`;

  const matching = routes.filter(
    (route) =>
      route &&
      typeof route.src === 'string' &&
      typeof route.headers?.Location === 'string' &&
      testSafely(route.src, bare)
  );

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
    normalized += 1;
  }

  if (!testSafely(route.src, bare) || !testSafely(route.src, withSlash)) {
    problems.push(`${from}: לאחר הנרמול התבנית עדיין אינה תופסת את שתי הצורות — ${route.src}`);
  }
}

if (problems.length > 0) {
  console.error('נרמול הפניות התאימות נכשל — ה-build נעצר:');
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(config, null, '\t')}\n`);
console.log(
  `הפניות תאימות: ${Object.keys(LEGACY_REDIRECTS).length} נבדקו מול הפלט, ${normalized} נורמלו ל-'/?$'.`
);
