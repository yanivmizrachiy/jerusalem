#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { basename, extname } from 'node:path';

const fail = [];
const warn = [];

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, 'en'));

const forbiddenPathPatterns = [
  /(^|\/)(node_modules|dist|\.astro|\.vercel|coverage|test-results|playwright-report|blob-report)(\/|$)/i,
  /(^|\/)(\.DS_Store|Thumbs\.db|Desktop\.ini)$/i,
  /\.(bak|old|orig|tmp|temp|swp|swo|log)$/i,
  /(^|\/)npm-debug\.log/i,
  /(^|\/)claude-evidence(?:-[^/]*)?(\/|$)/i,
  // שלוש חלופות hero נגזרות הוכחו ב-09/08/2026 כחסרות consumer: הקוד טוען
  // רק hero-1080/720 + hero-poster. אם בעתיד רוצים חלופה חדשה, היא חייבת
  // להיכנס דרך חוזה runtime מפורש — לא להישאר כ-binary יתום בתוך public/.
  /^public\/media\/hero-alt-/i,
];

const allowedEnv = new Set(['.env.example']);
const textExtensions = new Set([
  '.astro', '.css', '.html', '.js', '.cjs', '.mjs', '.json', '.md', '.ts', '.tsx', '.txt', '.yml', '.yaml', '.xml',
]);
const conflictScanExtensions = new Set([
  '.astro', '.css', '.html', '.js', '.cjs', '.mjs', '.json', '.ts', '.tsx', '.yml', '.yaml',
]);
const windowsReserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

const secretPatterns = [
  ['private key', /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/],
  ['Anthropic API key', /\bsk-ant-[A-Za-z0-9_-]{30,}\b/],
  ['OpenAI API key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{30,}\b/],
];

const lowerPaths = new Map();

for (const path of tracked) {
  const lower = path.toLocaleLowerCase('en-US');
  const previous = lowerPaths.get(lower);
  if (previous && previous !== path) {
    fail.push(`התנגשות אותיות גדולות/קטנות: ${previous} <> ${path}`);
  } else {
    lowerPaths.set(lower, path);
  }

  if (forbiddenPathPatterns.some((pattern) => pattern.test(path))) {
    fail.push(`קובץ זבל או פלט בנייה מנוהל ב-Git: ${path}`);
  }

  const rootName = path.split('/').at(-1) ?? path;
  if ((rootName === '.env' || rootName.startsWith('.env.')) && !allowedEnv.has(rootName)) {
    fail.push(`קובץ סביבה/סוד מנוהל ב-Git: ${path}`);
  }

  for (const segment of path.split('/')) {
    if (segment.endsWith(' ') || segment.endsWith('.')) {
      fail.push(`שם קובץ לא בטוח ב-Windows: ${path}`);
      break;
    }
    if (windowsReserved.test(segment)) {
      fail.push(`שם שמור של Windows: ${path}`);
      break;
    }
  }

  let size;
  try {
    size = statSync(path).size;
  } catch (error) {
    fail.push(`Git עוקב אחרי קובץ שלא ניתן לקריאה: ${path} (${error.message})`);
    continue;
  }

  if (size === 0 && basename(path) !== '.gitkeep') {
    warn.push(`קובץ ריק מנוהל: ${path}`);
  }

  const ext = extname(path).toLowerCase();
  if (size > 1_000_000 && textExtensions.has(ext)) {
    warn.push(`קובץ טקסט גדול מ-1MB: ${path} (${Math.ceil(size / 1024)}KB)`);
  }
  if (size > 5_000_000 && !textExtensions.has(ext)) {
    warn.push(`קובץ בינארי גדול מ-5MB — ודא שיש לו consumer/סיבת שימור: ${path} (${Math.ceil(size / 1024 / 1024)}MB)`);
  }

  if (!textExtensions.has(ext) || size > 2_000_000) continue;

  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    continue;
  }

  if (conflictScanExtensions.has(ext) && /^(?:<{7}|={7}|>{7})(?:\s|$)/m.test(text)) {
    fail.push(`סמני קונפליקט לא פתורים: ${path}`);
  }

  for (const [label, pattern] of secretPatterns) {
    if (pattern.test(text)) {
      fail.push(`חשד ל-${label} בתוך ${path}`);
    }
  }
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'check', 'test', 'quality', 'verify:deploy'];
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) {
    fail.push(`חסר script חובה ב-package.json: ${script}`);
  }
}

console.log(`Repo health: ${tracked.length} tracked files scanned.`);

if (warn.length) {
  console.log('\nWarnings:');
  for (const item of warn) console.log(`- ${item}`);
}

if (fail.length) {
  console.error('\nRepository health failed:');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}

console.log('\nRepository health passed: no tracked junk, secret-shaped values, path collisions or merge markers found.');
