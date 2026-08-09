import fs from 'node:fs';

function replaceOnce(text, from, to, label) {
  const first = text.indexOf(from);
  if (first < 0) throw new Error(`missing anchor: ${label}`);
  if (text.indexOf(from, first + from.length) >= 0) throw new Error(`non-unique anchor: ${label}`);
  return text.slice(0, first) + to + text.slice(first + from.length);
}

function patch(path, transform) {
  const before = fs.readFileSync(path, 'utf8');
  const after = transform(before);
  if (after === before) throw new Error(`no change produced for ${path}`);
  fs.writeFileSync(path, after, 'utf8');
  console.log(`patched ${path}`);
}

patch('src/data/choveret.ts', (src) => {
  src = replaceOnce(
    src,
    ' * הקישור החי של משרד החינוך נשאר הקנוני (מועתק, משותף ונפתח במקור), וההטמעה\n * וההורדה מוגשות מעותק same-origin מאומת ב-/docs/ (RULES 8.26, 9.8).',
    ' * הקישור החי של משרד החינוך נשאר הקנוני (מועתק, משותף ונפתח במקור). התצוגה\n * באתר היא HTML שחולץ מעותק same-origin מאומת; ה-PDF נשאר להורדה ולמקור בלבד\n * ואינו מוטמע (RULES 3.32.1, 8.26, 9.8).',
    'gov comment'
  );
  src = replaceOnce(
    src,
    '  url: `${TASHPAZ}/${remote}`,\n  embed: `${local}${PDF_VIEW}`,\n  download: local,',
    '  url: `${TASHPAZ}/${remote}`,\n  download: local,',
    'gov PDF embed'
  );
  return src;
});

patch('src/components/ResourceSplit.astro', (src) => {
  src = replaceOnce(
    src,
    "import ResourceActions from './ResourceActions.astro';\nimport { embedLayoutFor } from '../data/embed-layout';",
    "import ResourceActions from './ResourceActions.astro';\nimport PlanPrisaWeb from './PlanPrisaWeb.astro';\nimport { embedLayoutFor } from '../data/embed-layout';\nimport { planPrisaDocumentFor } from '../data/plan-prisa-web';",
    'ResourceSplit imports'
  );
  src = replaceOnce(
    src,
    "const embedLayout = embedLayoutFor(item);\nconst embedStyle = `--resource-aspect:${embedLayout.aspectRatio ?? 'auto'}; --resource-min-h:${embedLayout.minHeight ?? '520px'}`;",
    "const embedLayout = embedLayoutFor(item);\nconst embedStyle = `--resource-aspect:${embedLayout.aspectRatio ?? 'auto'}; --resource-min-h:${embedLayout.minHeight ?? '520px'}`;\nconst planPrisaDoc = planPrisaDocumentFor(item.download);",
    'ResourceSplit data lookup'
  );
  src = replaceOnce(
    src,
    '<div class="res-split">',
    '<div class:list={[\'res-split\', { \'is-web-doc\': Boolean(planPrisaDoc) }]}>',
    'ResourceSplit layout class'
  );
  src = replaceOnce(
    src,
    "        fullscreen={Boolean(item.embed && item.kind !== 'maf')}",
    "        fullscreen={Boolean(item.embed && item.kind !== 'maf' && !planPrisaDoc)}",
    'ResourceSplit fullscreen'
  );
  src = replaceOnce(
    src,
    "      data-orientation={embedLayout.orientation}\n      style={embedStyle}",
    "      data-orientation={embedLayout.orientation}\n      data-web-document={planPrisaDoc ? 'true' : undefined}\n      style={embedStyle}",
    'ResourceSplit web marker'
  );
  src = replaceOnce(
    src,
    "        item.kind === 'maf' && item.maf ? (\n          <MafmarRange sectionId={item.maf} accent={chapter.color} fill />\n        ) : item.embed ? (",
    "        item.kind === 'maf' && item.maf ? (\n          <MafmarRange sectionId={item.maf} accent={chapter.color} fill />\n        ) : planPrisaDoc ? (\n          <PlanPrisaWeb document={planPrisaDoc} accent={chapter.color} />\n        ) : item.embed ? (",
    'ResourceSplit render branch'
  );
  src = replaceOnce(
    src,
    "  .res-split {\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: var(--embed-column-gap);\n    margin-block-start: clamp(1.4rem, 3vw, 2.4rem);\n    align-items: start;\n  }",
    "  .res-split {\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: var(--embed-column-gap);\n    margin-block-start: clamp(1.4rem, 3vw, 2.4rem);\n    align-items: start;\n  }\n\n  .res-split.is-web-doc {\n    grid-template-columns: minmax(280px, 0.58fr) minmax(0, 1.42fr);\n  }",
    'ResourceSplit wide web layout'
  );
  return src;
});

patch('RULES.md', (src) => {
  const clause = `3.32.1. **תוכניות ההוראה ופריסות ההוראה תשפ״ז מוצגות כעמודי אינטרנט אמיתיים — לא כ-PDF מוטמע** (הוראת יניב, 10/08/2026): שמונת קובצי ה-\`plan/prisa\` המאומתים של ז׳, ח׳, ט׳ מסלול ראשי וט׳ מסלול מצומצם נשארים מקור רשמי והורדה בלבד. כל המלל מופק באופן דטרמיניסטי מהעותקים המאומתים ב-\`public/docs/\` ומוצג ב-HTML צבעוני, אחיד, רספונסיבי, ניתן לחיפוש ולניווט; אין \`iframe\`/\`embed\` של קובצי PDF אלה. אסור להמציא, להשלים או לשכתב תוכן שלא קיים במסמך המקור. הכתובות הקנוניות של עמודי המשאב והקישורים הרשמיים נשארים ללא שינוי.\n\n`;
  if (src.includes('3.32.1. **תוכניות ההוראה')) throw new Error('RULES 3.32.1 already exists');
  const marker = '3.33.';
  const at = src.indexOf(marker);
  if (at < 0) throw new Error('missing RULES 3.33 anchor');
  return src.slice(0, at) + clause + src.slice(at);
});
