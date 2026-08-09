import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import {
  LEGACY_REDIRECTS,
  LEGACY_REDIRECT_STATUS,
  trimSlash,
} from '../src/lib/legacyRedirects.mjs';

/**
 * חוזה טבלת ההפניות הנפלטת (RULES 24.3.4): השרת הסטטי של הסוללה אינו מגיש
 * 301, אבל טבלת הניתוב שנפלטה ל-`.vercel/output/config.json` — הקובץ
 * ש-Vercel באמת מקבל — כן ניתנת לאימות מקומי. נמדד 09/08/2026: האדפטר פולט
 * `^/path$` בלי הלוכסן הסופי, בעוד הקישורים הקנוניים ששותפו מסתיימים
 * בלוכסן — ולכן החזירו 404 בפרודקשן. הנרמול שבשרשרת ה-build
 * (`scripts/normalize-vercel-redirects.mjs`) מוכח כאן על הפלט האמיתי.
 *
 * מקור אמת יחיד: `src/lib/legacyRedirects.mjs` — אין כאן רשימת כתובות שנייה,
 * והחוזה גם אוכף שלא צצה רשימה מקבילה ב-vercel.json. האימות מול האתר החי
 * נשאר ב-`scripts/verify-deploy.mjs` (24.3.4) — החוזה הזה אינו מחליף אותו.
 */
test.skip(({ isMobile }) => isMobile === true, 'emitted route table is device-independent');

const CONFIG_PATH = '.vercel/output/config.json';

const readRoutes = (): Array<{ src?: string; status?: number; headers?: Record<string, string> }> => {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  return Array.isArray(config.routes) ? config.routes : [];
};

const redirectRoutes = () =>
  readRoutes().filter(
    (route) => typeof route.src === 'string' && typeof route.headers?.Location === 'string'
  );

for (const [from, destination] of Object.entries(LEGACY_REDIRECTS)) {
  test(`הפניה נפלטת ותופסת את שתי הצורות: ${from}`, () => {
    const bare = trimSlash(from);
    const matching = redirectRoutes().filter((route) => new RegExp(route.src!).test(bare));
    expect(matching, `${from}: מסלול הפניה אחד בדיוק בפלט — בלי כפילויות`).toHaveLength(1);

    const route = matching[0];
    expect(route.headers!.Location, `${from}: היעד הקנוני`).toBe(destination);
    expect(route.status, `${from}: הפניה קבועה אמיתית`).toBe(LEGACY_REDIRECT_STATUS);
    expect(
      new RegExp(route.src!).test(`${bare}/`),
      `${from}: הצורה עם הלוכסן חייבת לחיות — ${route.src}`
    ).toBe(true);
    expect(
      new RegExp(route.src!).test(bare),
      `${from}: הצורה בלי הלוכסן חייבת לחיות — ${route.src}`
    ).toBe(true);
  });
}

test('אין הפניה נפלטת שאינה בקנון — שום legacy route לא נשאר בטעות', () => {
  const canonical = Object.keys(LEGACY_REDIRECTS).map((from) => trimSlash(from));
  const strays = redirectRoutes().filter(
    (route) => !canonical.some((bare) => new RegExp(route.src!).test(bare))
  );
  expect(
    strays.map((route) => `${route.src} -> ${route.headers!.Location}`),
    'כל מסלול הפניה בפלט חייב לנבוע מ-LEGACY_REDIRECTS'
  ).toEqual([]);
  expect(redirectRoutes(), 'מספר ההפניות בפלט = מספר הרשומות בקנון').toHaveLength(
    Object.keys(LEGACY_REDIRECTS).length
  );
});

test('הנרמול דטרמיניסטי ואידמפוטנטי — הרצה שנייה אינה משנה את הפלט', () => {
  const before = readFileSync(CONFIG_PATH, 'utf8');
  execFileSync(process.execPath, ['scripts/normalize-vercel-redirects.mjs'], { stdio: 'pipe' });
  const after = readFileSync(CONFIG_PATH, 'utf8');
  expect(after, 'אותו קלט → אותו פלט, בייט אחר בייט').toBe(before);
});

test('vercel.json: כותרות האבטחה נשמרות, buildCommand מריץ את השרשרת, ואין רשימת הפניות שנייה', () => {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));

  // buildCommand חייב להריץ את שרשרת ה-npm — אחרת הנרמול לא רץ אצל Vercel.
  expect(vercel.buildCommand, 'Vercel מריץ את שרשרת ה-build של הפרויקט').toBe('npm run build');

  // SSOT: אסור שרשימת הפניות מקבילה תצוץ ב-vercel.json (RULES 24.3.2).
  expect(vercel.redirects, 'אין רשימת הפניות שנייה מחוץ ל-legacyRedirects.mjs').toBeUndefined();

  // כותרות האבטחה של הפרודקשן נשארות בדיוק כפי שנקבעו.
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
