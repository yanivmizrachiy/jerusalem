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

patch('tests/quick-links-contracts.spec.ts', (src) => {
  src = replaceOnce(
    src,
    "import { canonicalReaderItems } from '../src/data/canonical-content';",
    "import { canonicalReaderItems } from '../src/data/canonical-content';\nimport { planPrisaDocumentFor } from '../src/data/plan-prisa-web';",
    'quick-links import'
  );
  src = replaceOnce(
    src,
    "    expect(item.download, `${doc.id}: העותק המאומת בריפו`).toBe(doc.local);\n    expect(item.embed?.startsWith(doc.local), `${doc.id}: ההטמעה מהעותק המאומת`).toBe(true);",
    "    expect(item.download, `${doc.id}: העותק המאומת בריפו`).toBe(doc.local);\n    expect(item.embed, `${doc.id}: PDF אינו מוטמע עוד`).toBeUndefined();\n    const webDoc = planPrisaDocumentFor(item.download);\n    expect(webDoc, `${doc.id}: קיימת תצוגת HTML מלאה`).toBeTruthy();\n    expect(webDoc?.pdf, `${doc.id}: ה-HTML נגזר מאותו PDF מאומת`).toBe(doc.local);",
    'quick-links embed contract'
  );
  return src;
});

patch('src/components/PlanPrisaWeb.astro', (src) => {
  src = replaceOnce(
    src,
    "    background: color-mix(in srgb, var(--pp-accent) calc(48% + (var(--pp-row) % 4) * 8%), #d5a24f);",
    "    background: color-mix(in srgb, var(--pp-accent) 62%, #d5a24f);",
    'valid row accent CSS'
  );
  return src;
});

patch('src/components/ResourceSplit.astro', (src) => {
  src = replaceOnce(
    src,
    "  @media (max-width: 1099px) {\n    .res-split { grid-template-columns: 1fr; block-size: auto; gap: clamp(1.4rem, 4vw, 2.2rem); }",
    "  @media (max-width: 1099px) {\n    .res-split,\n    .res-split.is-web-doc { grid-template-columns: 1fr; block-size: auto; gap: clamp(1.4rem, 4vw, 2.2rem); }",
    'web doc mobile collapse'
  );
  return src;
});

patch('scripts/verify-deploy.mjs', (src) => {
  src = replaceOnce(
    src,
    "  { path: '/chativat-beynayim/reader/z/tochnit-z/', needle: 'res-panel', what: 'לוח הפעולות בעמוד המשאב (3.29, 8.2)' },",
    "  { path: '/chativat-beynayim/reader/z/tochnit-z/', needle: 'res-panel', what: 'לוח הפעולות בעמוד המשאב (3.29, 8.2)' },\n  { path: '/chativat-beynayim/reader/z/tochnit-z/', needle: 'data-plan-prisa-web', what: 'תוכנית/פריסה כתצוגת HTML — ללא PDF מוטמע (3.32.1)' },",
    'verify deployment marker'
  );
  return src;
});
