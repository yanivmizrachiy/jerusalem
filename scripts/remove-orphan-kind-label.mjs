#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const hits = execFileSync('git', ['grep', '-n', '-w', 'kindLabel', '--', 'src'], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

const bookletHits = hits.filter((h) => h.startsWith('src/components/Booklet.astro:'));
const choveretHits = hits.filter((h) => h.startsWith('src/data/choveret.ts:'));
if (hits.length !== 3 || bookletHits.length !== 2 || choveretHits.length !== 1) {
  throw new Error(`Refusing kindLabel cleanup: unexpected consumers.\n${hits.join('\n')}`);
}

const target = 'src/data/choveret.ts';
let text = readFileSync(target, 'utf8');
const block = `\nexport const kindLabel: Record<ItemKind, string> = {\n  site: 'פעילות אינטראקטיבית',\n  doc: 'מסמך',\n  drive: 'קובץ',\n  pdf: 'PDF',\n  canva: 'מצגת',\n  flip: 'חוברת דפדוף',\n  maf: 'מתוך החוזר',\n  link: 'קישור',\n};`;
if ((text.split(block).length - 1) !== 1) throw new Error('kindLabel export block changed; refusing automatic edit.');
text = text.replace(block, '');
if (/export const kindLabel/.test(text)) throw new Error('kindLabel export remains after cleanup.');
writeFileSync(target, text);
console.log('Removed orphan global kindLabel; Booklet-local mapping remains untouched.');
