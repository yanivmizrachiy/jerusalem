#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const TARGET = 'src/data/choveret.ts';
const grep = execFileSync('git', ['grep', '-n', 'pageHref', '--', 'src'], { encoding: 'utf8' }).trim();
const hits = grep ? grep.split('\n') : [];

if (hits.length !== 4) {
  throw new Error(`Refusing pageHref cleanup: expected exactly 4 source hits, found ${hits.length}.\n${grep}`);
}
const outside = hits.filter((line) => !line.startsWith(`${TARGET}:`));
if (outside.length) {
  throw new Error(`Refusing pageHref cleanup: live references exist outside ${TARGET}:\n${outside.join('\n')}`);
}

let text = readFileSync(TARGET, 'utf8');
if (/\bpageHref\s*:/.test(text) || /\.pageHref\s*=/.test(text) || /\[['"]pageHref['"]\]\s*=/.test(text)) {
  throw new Error('Refusing pageHref cleanup: a data assignment exists.');
}

const edits = [
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
    `/** הכתובת הקנונית של עמוד משאב */
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

for (const [before, after] of edits) {
  const count = text.split(before).length - 1;
  if (count !== 1) throw new Error(`Refusing pageHref cleanup: exact legacy block count was ${count}, expected 1.`);
  text = text.replace(before, after);
}

if (/\bpageHref\b/.test(text)) throw new Error('pageHref remains after transformation.');
writeFileSync(TARGET, text);
console.log('Removed dormant pageHref field and all three unreachable routing branches.');
