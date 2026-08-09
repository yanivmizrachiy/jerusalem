#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const TARGET = 'src/data/choveret.ts';
const sourceHits = execFileSync('git', ['grep', '-n', 'pageHref', '--', 'src'], {
  encoding: 'utf8',
}).trim().split('\n').filter(Boolean);

const foreignHits = sourceHits.filter((line) => !line.startsWith(`${TARGET}:`));
if (foreignHits.length) {
  throw new Error(`Refusing dormant-field cleanup: pageHref is used outside ${TARGET}:\n${foreignHits.join('\n')}`);
}

let text = readFileSync(TARGET, 'utf8');
const occurrences = text.match(/\bpageHref\b/g)?.length ?? 0;
if (occurrences !== 4) {
  throw new Error(`Refusing dormant-field cleanup: expected exactly 4 pageHref occurrences, found ${occurrences}.`);
}

if (/\bpageHref\s*:/.test(text) || /\.pageHref\s*=/.test(text) || /\[['"]pageHref['"]\]\s*=/.test(text)) {
  throw new Error('Refusing dormant-field cleanup: a pageHref data assignment exists.');
}

const replacements = [
  [
`  /**
   * שדה היסטורי של רכיב החוברת הפרטי (RULES 4.14). אין להשתמש בו בפריטי
   * החומרים: כל משימה ברשימת המשימות חייבת להוביל לעמוד המשימה המחולק
   * (הוראת יניב, 06/08/2026). יעדים שאינם משימה — יחידות ועמודים ייעודיים —
   * חיים ב-\`pages\` של השכבה ולא בתוך הנושאים.
   */
  pageHref?: string;
`,
    '',
  ],
  [
`      chapter.items
        .filter((item) => !item.pageHref)
        .map((item) => ({ grade, chapter, item }))`,
    `      chapter.items.map((item) => ({ grade, chapter, item }))`,
  ],
  [
`/** הכתובת הקנונית של פריט: עמוד פנימי אם יש, אחרת עמוד המשאב */
export const itemHref = (gradeSlug: string, item: ChoveretItem) =>
  item.pageHref ?? \`/chativat-beynayim/reader/\${gradeSlug}/\${item.id}/\`;`,
    `/** הכתובת הקנונית של עמוד המשאב */
export const itemHref = (gradeSlug: string, item: ChoveretItem) =>
  \`/chativat-beynayim/reader/\${gradeSlug}/\${item.id}/\`;`,
  ],
  [
`    chapter.items
      .filter((item) => !item.pageHref)
      .map((item) => ({ grade, chapter, item }))`,
    `    chapter.items.map((item) => ({ grade, chapter, item }))`,
  ],
];

for (const [before, after] of replacements) {
  const count = text.split(before).length - 1;
  if (count !== 1) {
    throw new Error(`Refusing dormant-field cleanup: expected one exact replacement block, found ${count}.`);
  }
  text = text.replace(before, after);
}

if (/\bpageHref\b/.test(text)) {
  throw new Error('Dormant-field cleanup incomplete: pageHref remains after transformation.');
}

writeFileSync(TARGET, text);
console.log('Removed dormant pageHref field and its three unreachable routing branches.');
