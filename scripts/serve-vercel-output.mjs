#!/usr/bin/env node

/**
 * שרת הקבלה המקומי של פלט Vercel.
 *
 * `serve .vercel/output/static` לבדו אינו יודע לקרוא את טבלת ה-routing של
 * Vercel, ולכן redirect אמיתי ב-config.json נראה מקומית כ-404. זה יצר חוזה
 * שקרי: בדיקות דפדפן נאלצו לצפות ב-404 במקום להוכיח ניווט 301.
 *
 * הסקריפט אינו מחזיק רשימת redirects נוספת. אחרי `npm run build` הוא גוזר
 * קובץ serve זמני משני מקורות האמת שכבר הוכחו ב-build:
 * - LEGACY_REDIRECTS — הפניות התאימות המפורשות;
 * - derived-static-redirects.json — הפניות נושא שנגזרו מ-Astro.redirect.
 *
 * הקובץ נכתב רק תחת `.vercel/output/` ואינו tracked או חלק מהאתר הציבורי.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { LEGACY_REDIRECTS, trimSlash } from '../src/lib/legacyRedirects.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const OUTPUT_ROOT = path.join(ROOT, '.vercel', 'output');
const STATIC_ROOT = path.join(OUTPUT_ROOT, 'static');
const DERIVED_REPORT = path.join(OUTPUT_ROOT, 'derived-static-redirects.json');
const SERVE_CONFIG = path.join(OUTPUT_ROOT, 'serve.json');

const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const port = portIndex >= 0 ? Number(args[portIndex + 1]) : 4321;
if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error(`פורט Playwright לא תקין: ${args[portIndex + 1] ?? '(חסר)'}`);
  process.exit(1);
}

if (!fs.existsSync(STATIC_ROOT)) {
  console.error('פלט build חסר: .vercel/output/static — הרץ npm run build לפני השרת.');
  process.exit(1);
}
if (!fs.existsSync(DERIVED_REPORT)) {
  console.error('דוח redirects נגזר חסר — normalize-vercel-redirects לא השלים את ה-build.');
  process.exit(1);
}

let derived;
try {
  derived = JSON.parse(fs.readFileSync(DERIVED_REPORT, 'utf8'));
} catch {
  console.error('derived-static-redirects.json אינו JSON תקין.');
  process.exit(1);
}
if (!Array.isArray(derived)) {
  console.error('derived-static-redirects.json חייב להיות מערך.');
  process.exit(1);
}

const redirects = [
  ...Object.entries(LEGACY_REDIRECTS).map(([from, destination]) => ({ from, destination })),
  ...derived,
];

const seen = new Set();
const serveRedirects = [];
for (const entry of redirects) {
  const from = entry?.from;
  const destination = entry?.destination;
  if (
    typeof from !== 'string' ||
    typeof destination !== 'string' ||
    !from.startsWith('/') ||
    from.startsWith('//') ||
    !destination.startsWith('/') ||
    destination.startsWith('//')
  ) {
    console.error(`redirect מקומי לא תקין: ${JSON.stringify(entry)}`);
    process.exit(1);
  }

  const bare = trimSlash(from);
  for (const source of [bare, `${bare}/`]) {
    const key = `${source}\u0000${destination}`;
    if (seen.has(key)) continue;
    seen.add(key);
    serveRedirects.push({ source, destination, type: 301 });
  }
}

fs.writeFileSync(
  SERVE_CONFIG,
  `${JSON.stringify({ redirects: serveRedirects }, null, 2)}\n`,
  'utf8',
);

console.log(
  `Local Vercel redirect harness: ${redirects.length} redirects, ${serveRedirects.length} slash variants, port ${port}.`,
);

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(
  npx,
  [
    'serve',
    '.vercel/output/static',
    '-l',
    String(port),
    '--no-clipboard',
    '--config',
    '../serve.json',
  ],
  { cwd: ROOT, stdio: 'inherit' },
);

const forward = (signal) => {
  if (!child.killed) child.kill(signal);
};
process.on('SIGINT', () => forward('SIGINT'));
process.on('SIGTERM', () => forward('SIGTERM'));

child.on('error', (error) => {
  console.error(`לא ניתן להפעיל את serve: ${error.message}`);
  process.exit(1);
});
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
