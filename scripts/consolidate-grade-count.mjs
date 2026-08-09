#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const hits = execFileSync('git', ['grep', '-n', '-w', 'publishedGradeCount', '--', 'src'], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

if (hits.length !== 3) {
  throw new Error(`Refusing grade-count consolidation: expected definition + import + call, found ${hits.length}.\n${hits.join('\n')}`);
}
if (!hits.some((h) => h.startsWith('src/data/publishing.ts:')) || hits.filter((h) => h.startsWith('src/pages/chativat-beynayim/index.astro:')).length !== 2) {
  throw new Error(`Refusing grade-count consolidation: unexpected consumers.\n${hits.join('\n')}`);
}

const publishingPath = 'src/data/publishing.ts';
let publishing = readFileSync(publishingPath, 'utf8');
const expectedPublishing = `import { isAttributionPending } from './attribution';
import { supplementalItemsForChapter } from './project-supplements';
import { hafifaUnit, mishvaotUnit } from './units';`;
if (!publishing.includes(expectedPublishing)) throw new Error('publishing.ts import block changed; refusing automatic edit.');
publishing = publishing.replace(expectedPublishing, `import { isAttributionPending } from './attribution';`);

const marker = `\n/**\n * יחידות legacy ששויכו לנושא קנוני נספרות כחלק מהנושא, לא כעמוד נפרד.\n * שמירת המיפוי כאן מונעת ממונים ישנים להציג מספר שונה מהקטלוג הציבורי.\n */\n`;
const start = publishing.indexOf(marker);
if (start < 0) throw new Error('publishedGradeCount legacy block start not found.');
publishing = publishing.slice(0, start).trimEnd() + '\n';
if (/publishedGradeCount|supplementalItemsForChapter|hafifaUnit|mishvaotUnit/.test(publishing)) {
  throw new Error('publishing.ts consolidation incomplete.');
}
writeFileSync(publishingPath, publishing);

const gatewayPath = 'src/pages/chativat-beynayim/index.astro';
let gateway = readFileSync(gatewayPath, 'utf8');
const oldImport = `import { publishedGradeCount } from '../../data/publishing';\nimport { choveret, gradeHref } from '../../data/choveret';`;
const newImport = `import { canonicalPublishedGradeCount } from '../../data/canonical-content';\nimport { choveret, gradeHref } from '../../data/choveret';`;
if ((gateway.split(oldImport).length - 1) !== 1) throw new Error('gateway publishedGradeCount import shape changed.');
gateway = gateway.replace(oldImport, newImport);
if ((gateway.match(/publishedGradeCount\(g\)/g) ?? []).length !== 1) throw new Error('gateway publishedGradeCount call shape changed.');
gateway = gateway.replace('publishedGradeCount(g)', 'canonicalPublishedGradeCount(g)');
if (/publishedGradeCount/.test(gateway)) throw new Error('gateway consolidation incomplete.');
writeFileSync(gatewayPath, gateway);

console.log('Consolidated grade counts onto canonicalPublishedGradeCount and removed the duplicate implementation.');
