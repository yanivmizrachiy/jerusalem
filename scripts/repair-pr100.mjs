import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const SOURCE_SHA = process.env.PR100_SOURCE_SHA || 'e95fcdac16354e82fe80a291d2b1dff65b5599c2';

const read = (path) => fs.readFileSync(path, 'utf8');
const write = (path, content) => fs.writeFileSync(path, content);
const show = (path) => execFileSync('git', ['show', `${SOURCE_SHA}:${path}`], { encoding: 'utf8' });
const die = (msg) => { throw new Error(msg); };
const requireText = (text, needle, label = needle) => {
  if (!text.includes(needle)) die(`missing required text: ${label}`);
};
const forbidText = (text, needle, label = needle) => {
  if (text.includes(needle)) die(`forbidden stale text remains: ${label}`);
};

// 1) Homepage: take PR100's intended page, then remove the blocking SplashIntro completely.
{
  let s = show('src/pages/index.astro');
  s = s.replace("import SplashIntro from '../components/SplashIntro.astro';\n", '');
  s = s.replace('  <SplashIntro />\n', '');
  forbidText(s, 'SplashIntro');
  forbidText(s, 'start-btn');
  requireText(s, '<HeroVideo />');
  write('src/pages/index.astro', s);
}

// 2) Hero: use PR100's fixed video-board implementation and fix mobile initial-viewport actions (P2).
{
  let s = show('src/components/HeroVideo.astro');
  const oldMobile = `  @media (max-width: 700px) {\n    .hero-clip { inline-size: min(70vw, 280px); }\n    .lead-btn { inline-size: min(340px, 92vw); }\n  }`;
  const newMobile = `  @media (max-width: 700px) {\n    .hero-actions {\n      order: 2;\n      inline-size: min(100%, 350px);\n      display: grid;\n      grid-template-columns: repeat(3, minmax(0, 1fr));\n      gap: 0.4rem;\n      margin-block-start: 0.1rem;\n    }\n    .hero-team-lead { order: 3; }\n    .hero-team:not(.hero-team-lead) { order: 4; }\n    .hero-clip { inline-size: min(70vw, 280px); }\n    .lead-btn {\n      min-inline-size: 0;\n      inline-size: 100%;\n      min-block-size: 52px;\n      grid-template-columns: 1fr;\n      justify-items: center;\n      gap: 0.18rem;\n      padding: 0.35rem 0.2rem;\n      border-radius: 18px;\n      text-align: center;\n    }\n    .lead-icon { inline-size: 30px; block-size: 30px; }\n    .lead-copy strong { font-size: clamp(0.72rem, 3vw, 0.86rem); line-height: 1.1; }\n    .lead-copy small,\n    .lead-arrow { display: none; }\n  }`;
  requireText(s, oldMobile, 'PR100 original mobile block');
  s = s.replace(oldMobile, newMobile);
  requireText(s, 'class="hero-actions"');
  requireText(s, "href: '/chativat-beynayim/'");
  requireText(s, "href: '/chativa-elyona/'");
  requireText(s, "href: '/hodaot/'");
  requireText(s, 'grid-template-columns: repeat(3, minmax(0, 1fr))');
  write('src/components/HeroVideo.astro', s);
}

// 3) Base: preserve latest-main imports/navigation (#102), remove only the old heroSeen bootstrap.
{
  let s = read('src/layouts/Base.astro');
  const start = s.indexOf('    {/* סרטון הפתיחה — פעם אחת בכל session של הטאב');
  const end = s.indexOf('    <slot name="head" />', start);
  if (start < 0 || end < 0) die('legacy heroSeen bootstrap block not found safely in Base.astro');
  s = s.slice(0, start) + '    {/* העמוד הראשי עולה מיד — אין מנגנון "נצפה" ואין bootstrap של הסתרה\n        (RULES 6.2, הוראת יניב 10/08/2026). */}\n' + s.slice(end);
  forbidText(s, 'jerusalem.heroSeen.v1');
  requireText(s, "import '../styles/luxury-controls.css';", '#102 luxury controls import');
  write('src/layouts/Base.astro', s);
}

// 4) Global CSS: preserve current-main luxury/table work (#101/#102), remove only the hero-done gate.
{
  let s = read('src/styles/global.css');
  const start = s.indexOf('/* ---------- פתיחת העמוד הראשי: שום כפתור פעולה עד שהתמונה נעלמת ----------');
  const end = s.indexOf('/* ============================================================', start);
  if (start < 0 || end < 0) die('legacy hero-done CSS block not found safely');
  const replacement = `/* ---------- העמוד הראשי עולה מיד (RULES 6.2, הוראת יניב 10/08/2026) ----------\n   הניווט העליון ופס "מה צפוי?" גלויים וניתנים למיקוד מהרגע הראשון. */\n\n`;
  s = s.slice(0, start) + replacement + s.slice(end);
  forbidText(s, 'html:not(.hero-done)');
  write('src/styles/global.css', s);
}

// 5) Production verification: PR100 homepage marker + #98 compact choice-card marker must coexist.
{
  let s = read('scripts/verify-deploy.mjs');
  const old = "{ path: '/', needle: 'start-btn', what: 'כפתור ההתחלה בעמוד הראשי (7.28)' }";
  const newer = "{ path: '/', needle: 'hero-actions', what: 'כפתורי הפעולה המובילים בעמוד הראשי (7.28)' }";
  requireText(s, old, 'current-main homepage deploy marker');
  s = s.replace(old, newer);
  requireText(s, "needle: 'choice-card'", '#98 choice-card marker');
  forbidText(s, "needle: 'start-btn'");
  write('scripts/verify-deploy.mjs', s);
}

// 6) Interaction and responsive suites: remove the synthetic hero-done reveal, keep newer-main coverage.
{
  let s = read('tests/interactions.spec.ts');
  const old = "test('אחרי הסרטון מופיע צוות ההדרכה — לא תוכן אחר (6.5)', async ({ page }) => {\n  await page.emulateMedia({ reducedMotion: 'reduce' }); // מדלג ישר למצב הסיום\n";
  const newer = "test('המסך הראשוני מציג את צוות ההדרכה מיד — לא תוכן אחר (6.5)', async ({ page }) => {\n";
  requireText(s, old, 'legacy interaction hero test');
  s = s.replace(old, newer);
  s = s.replace("  await page.evaluate(() => document.documentElement.classList.add('hero-done'));\n", '');
  write('tests/interactions.spec.ts', s);
}

{
  let s = read('tests/responsive.spec.ts');
  const old = "        // בעמוד הבית הניווט והפס נחשפים רק אחרי שתמונת הפתיחה נעלמה (6.3)\n        await page.evaluate(() => document.documentElement.classList.add('hero-done'));\n";
  requireText(s, old, 'legacy responsive hero-done bypass');
  s = s.replace(old, '');
  forbidText(s, "classList.add('hero-done')");
  write('tests/responsive.spec.ts', s);
}

// 7) Project context: replace only the obsolete homepage/video row; preserve all later context.
{
  let s = read('docs/PROJECT_CONTEXT.md');
  const rows =
    '| המסך הראשוני והסרטון | `src/components/HeroVideo.astro` + `public/media/hero-*` | העמוד עולה מיד (RULES 6.2, 10/08/2026): אין מנגנון `heroSeen`, אין bootstrap ב-`Base.astro` ואין הסתרת ניווט/פס; הסרטון לוח קבוע ממוסגר — מושתק, פעם אחת, בלי loop; רגישי תנועה מקבלים poster בלבד; נכסי hero קנוניים בלבד |\n' +
    '| כפתורי הפעולה המובילים | `src/components/HeroVideo.astro` (`nav.hero-actions`) | שלושה קישורים — `/chativat-beynayim/`, `/chativa-elyona/`, `/hodaot/` — גלויים מיד, ≥44px, גוון לכל כפתור (RULES 7.28); אין `start-btn`; `/shearim/` חי בכתובתו בלי כניסה מהעמוד הראשי |';
  const next = s.replace(/^\| סרטון פתיחה \|.*$/m, rows);
  if (next === s) die('PROJECT_CONTEXT homepage row not found');
  write('docs/PROJECT_CONTEXT.md', next);
}

// 8) RULES: transplant only PR100-owned contracts; retain all newer #98/#99/#101/#102 contracts.
{
  let main = read('RULES.md');
  const feat = show('RULES.md');

  const section = (text, a, b) => {
    const i = text.indexOf(a);
    const j = text.indexOf(b, i);
    if (i < 0 || j < 0) die(`RULES section not found: ${a} -> ${b}`);
    return text.slice(i, j);
  };
  main = main.replace(section(main, '# 6.', '# 7.'), section(feat, '# 6.', '# 7.'));

  const replaceEntry = (dst, src, num, nextNum) => {
    const re = new RegExp(`^${num.replace('.', '\\.') }\\..*?(?=^${nextNum.replace('.', '\\.') }\\.)`, 'ms');
    const sm = src.match(re);
    const dm = dst.match(re);
    if (!sm || !dm) die(`RULES entry not found: ${num}`);
    return dst.replace(re, sm[0]);
  };

  for (const [num, next] of [['3.2','3.3'], ['7.28','7.29'], ['19.10','19.11'], ['22.6','22.7']]) {
    main = replaceEntry(main, feat, num, next);
  }

  const entry = (text, num, nextNum) => {
    const re = new RegExp(`^${num.replace('.', '\\.') }\\..*?(?=^${nextNum.replace('.', '\\.') }\\.)`, 'ms');
    const m = text.match(re);
    if (!m) die(`RULES entry not found: ${num}`);
    return { re, text: m[0] };
  };
  const fm = entry(feat, '19.34', '19.35');
  const mm = entry(main, '19.34', '19.35');
  const fb = fm.text.match(/^- עמוד הבית:.*$/m);
  const mb = mm.text.match(/^- עמוד הבית:.*$/m);
  if (!fb || !mb) die('RULES 19.34 homepage bullet not found');
  const mergedEntry = mm.text.replace(/^- עמוד הבית:.*$/m, fb[0]);
  main = main.replace(mm.re, mergedEntry);

  requireText(main, 'תנועה רציפה מלמטה למעלה', '#99 continuous rail contract');
  if (!main.includes('כרטיסי בחירה קטנים') && !main.includes('כרטיסי יוקרה קטנים')) {
    die('#98 compact choice-card contract lost');
  }
  write('RULES.md', main);
}

// 9) UX tests: transplant PR100 homepage contracts onto latest main, preserving #98/#99 coverage.
{
  const targetPath = 'tests/ux.spec.ts';
  let target = read(targetPath);
  const source = show(targetPath);

  const topTests = (text) => {
    const sf = ts.createSourceFile('ux.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    const out = [];
    for (const st of sf.statements) {
      if (!ts.isExpressionStatement(st) || !ts.isCallExpression(st.expression)) continue;
      const call = st.expression;
      if (!ts.isIdentifier(call.expression) || call.expression.text !== 'test') continue;
      const arg = call.arguments[0];
      if (!arg || (!ts.isStringLiteral(arg) && !ts.isNoSubstitutionTemplateLiteral(arg))) continue;
      out.push({ title: arg.text, start: st.getStart(sf), end: st.getEnd() });
    }
    return out;
  };

  const oneBy = (text, needle) => {
    const found = topTests(text).filter((x) => x.title.includes(needle));
    if (found.length !== 1) die(`expected one UX test containing '${needle}', found ${found.length}`);
    return found[0];
  };

  const replaceTest = (targetNeedle, sourceNeedle = targetNeedle) => {
    const t = oneBy(target, targetNeedle);
    const s = oneBy(source, sourceNeedle);
    target = target.slice(0, t.start) + source.slice(s.start, s.end) + target.slice(t.end);
  };

  replaceTest('ה-hero מלא:', 'העמוד הראשי עולה מיד: hero בהיר');
  replaceTest('ה-poster והווידאו באותן מידות', 'הסרטון קבוע וממוסגר:');
  replaceTest('כרטיס צוות: חץ אחד בעיגול בלי כיתוב');
  replaceTest('העמוד הראשי: כפתור "התחל" יחיד', 'העמוד הראשי: שלושה כפתורי פעולה מובילים');
  replaceTest('כפתור "התחל": נחשף רק אחרי', 'כפתורי הפעולה גלויים מיד וממורכזים');
  replaceTest('תמונת הפתיחה פרוסה עד תחתית המסך', 'המסך הראשוני פרוס עד תחתית החלון');
  replaceTest('ניווט עליון: "ישראל ריאלית"');
  replaceTest('פתיחה נקייה: אין כפתורי פעולה', 'העמוד עולה מיד: ניווט, פס וכפתורים גלויים');

  const oldMarker = '/* ===== סרטון הפתיחה — פעם אחת בכל session של הטאב';
  const newMarker = '/* ===== הסרטון — לוח קבוע במסך הראשוני';
  const oldAt = target.indexOf(oldMarker);
  const newAt = source.indexOf(newMarker);
  if (oldAt < 0 || newAt < 0) die('hero UX tail marker missing');
  target = target.slice(0, oldAt) + source.slice(newAt);

  // The splash no longer exists; no homepage test may bypass first-load state.
  target = target.replace(/^\s*await page\.addInitScript\(\(\) => sessionStorage\.setItem\('ycc-splash', '1'\)\);\n/gm, '');
  target = target.replace(/^\s*sessionStorage\.setItem\('ycc-splash', '1'\);\n/gm, '');
  // The old hero-done reveal is gone everywhere.
  target = target.replace(/^\s*await page\.evaluate\(\(\) => document\.documentElement\.classList\.add\('hero-done'\)\);\n/gm, '');

  if (!target.includes('כפתורי הפעולה נשארים במסך הראשוני בנייד')) {
    target += `\n\nfor (const vp of [{ width: 360, height: 740 }, { width: 390, height: 844 }]) {\n  test(\`כפתורי הפעולה נשארים במסך הראשוני בנייד \${vp.width}×\${vp.height} (7.28)\`, async ({ page }) => {\n    await page.setViewportSize(vp);\n    await page.goto('/');\n    const actions = page.locator('.hero-actions .lead-btn');\n    await expect(actions).toHaveCount(3);\n    for (const action of await actions.all()) {\n      const box = await action.boundingBox();\n      expect(box).not.toBeNull();\n      if (!box) throw new Error('hero action has no bounding box');\n      expect(box.height).toBeGreaterThanOrEqual(44);\n      expect(box.y).toBeGreaterThanOrEqual(0);\n      expect(box.y + box.height).toBeLessThanOrEqual(vp.height);\n    }\n    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);\n    expect(overflow).toBeLessThanOrEqual(1);\n  });\n}\n`;
  }

  for (const guard of [
    'שני כרטיסי יוקרה קטנים וצבעוניים',
    'ריחוף מרים את הכרטיס בעדינות',
    'הכרטיסים נערמים בלי גלילה אופקית',
    'rail-track',
  ]) requireText(target, guard, `newer-main UX coverage '${guard}'`);

  forbidText(target, 'ycc-splash');
  forbidText(target, "classList.add('hero-done')");
  write(targetPath, target);
}

// Fail-closed source contract audit before the expensive browser gate.
const finalIndex = read('src/pages/index.astro');
const finalBase = read('src/layouts/Base.astro');
const finalCss = read('src/styles/global.css');
const finalHero = read('src/components/HeroVideo.astro');
const finalVerify = read('scripts/verify-deploy.mjs');
const finalUx = read('tests/ux.spec.ts');
forbidText(finalIndex, 'SplashIntro');
forbidText(finalBase, 'jerusalem.heroSeen.v1');
forbidText(finalCss, 'html:not(.hero-done)');
forbidText(finalUx, 'ycc-splash');
requireText(finalHero, 'hero-actions');
requireText(finalHero, 'grid-template-columns: repeat(3, minmax(0, 1fr))');
requireText(finalVerify, "needle: 'hero-actions'");
requireText(finalVerify, "needle: 'choice-card'");
requireText(read('src/pages/shearim/index.astro'), 'choice-card', '#98 runtime cards');
requireText(read('src/components/NewsRail.astro'), 'rail-track', '#99 runtime rail');
requireText(finalCss, '.luxt', '#101 luxury table style');
requireText(finalBase, 'luxury-controls.css', '#102 controls stylesheet');

console.log('PR100 semantic repair completed; source contracts reconciled with current main.');
