import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

/**
 * Newest explicit requirement (הוראת יניב, 10/08/2026) supersedes the previous
 * contract: Mafmar and plan/prisa native-HTML resources no longer show the
 * generic WhatsApp/download/copy/email/share/fullscreen action board. Ordinary
 * task/resource pages are unaffected — they still consume ResourceActions.
 */

test('ResourceSplit consumes the shared action component only for ordinary resources', async () => {
  const split = await source('src/components/ResourceSplit.astro');
  expect(split).toContain("import ResourceActions from './ResourceActions.astro'");
  expect(split).toContain('<ResourceActions');
  expect(split).toMatch(/showActions\s*=\s*item\.kind !== 'maf' && !planPrisaDoc/);
  expect(split).toMatch(/\{showActions && \(/);
  expect(split).not.toContain('<div class="orbs"');
  expect(split).not.toContain('class="res-actions"');
  expect(split).not.toContain("document.querySelectorAll<HTMLElement>('.orb')");
  expect(split).not.toContain("orb.addEventListener('pointermove'");
});

test('MafmarRange has no duplicate action board and renders local HTML', async () => {
  const mrange = await source('src/components/MafmarRange.astro');

  expect(mrange).not.toContain('mrange-actions');
  expect(mrange).not.toContain('data-resource-actions');

  expect(mrange).toContain("import MafmarWeb from './MafmarWeb.astro'");
  expect(mrange).toContain('<MafmarWeb');

  expect(mrange).not.toContain('<iframe');
  expect(mrange).not.toContain('<embed');
  expect(mrange).not.toContain('<object');
});

test('Mafmar full page has no ResourceActions and uses the canonical HTML reader', async () => {
  const mafmar = await source('src/pages/hozer-mafmar.astro');

  expect(mafmar).not.toContain("import ResourceActions");
  expect(mafmar).not.toContain('<ResourceActions');
  expect(mafmar).not.toContain('data-resource-actions');

  expect(mafmar).toContain("import MafmarWeb");
  expect(mafmar).toContain('<MafmarWeb canonical');

  expect(mafmar).not.toContain('<iframe');
  expect(mafmar).not.toContain('viewer-open-card');
  expect(mafmar).not.toContain('pg-prev');
  expect(mafmar).not.toContain('pg-next');
});

test('plan/prisa native HTML resources do not own a generic action board either', async () => {
  const ppw = await source('src/components/PlanPrisaWeb.astro');
  expect(ppw).not.toContain("import ResourceActions");
  expect(ppw).not.toContain('<ResourceActions');
  expect(ppw).not.toContain('data-resource-actions');
  expect(ppw).not.toContain('class="orbs"');
  // הקישור הרשמי של משרד החינוך נשמר כקישור פשוט לצד הורדת העותק המאומת
  expect(ppw).toMatch(/href=\{sourceUrl\}[^>]*target="_blank"/);
  expect(ppw).toMatch(/href=\{document\.pdf\}\s+download/);
  const split = await source('src/components/ResourceSplit.astro');
  expect(split).toMatch(/<PlanPrisaWeb[^>]*sourceUrl=\{item\.url\}/s);
});

test('ordinary iframe resources still require a real load event', async () => {
  const split = await source('src/components/ResourceSplit.astro');

  expect(split).toContain('iframe.addEventListener(');
  expect(split).toContain("'load'");
  expect(split).toContain("frame.classList.add('is-loaded')");

  expect(split).not.toMatch(/setTimeout\([^)]*is-loaded/s);
  expect(split).not.toMatch(
    /setTimeout\([^)]*classList\.add\(['"]is-loaded/s
  );
});

test('shared action component retains copy, Web Share, fullscreen and pointer behavior for its consumers', async () => {
  const actions = await source('src/components/ResourceActions.astro');
  expect(actions).toContain('data-resource-actions');
  expect(actions).toContain('navigator.clipboard.writeText');
  expect(actions).toContain("typeof navigator.share === 'function'");
  expect(actions).toContain('requestFullscreen');
  expect(actions).toContain("error.name === 'AbortError'");
  expect(actions).toContain("board.querySelectorAll<HTMLElement>('.orb')");
  expect(actions).toContain("orb.addEventListener('pointermove'");
});

/* ===== Live-page proof: the same contract, verified against rendered HTML ===== */

test('ordinary resource page renders the shared action board', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/misparim/');
  const orbs = page.locator('.orbs[data-resource-actions]');
  await expect(orbs).toHaveCount(1);
  await expect(orbs.locator('[data-action="whatsapp"]')).toHaveCount(1);
  await expect(orbs.locator('[data-action="copy"]')).toHaveCount(1);
  await expect(orbs.locator('[data-action="source"]')).toHaveCount(1);
});

test('plan/prisa native HTML resource page renders with no action board', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/tochnit-z/');
  await expect(page.locator('.orbs')).toHaveCount(0);
  await expect(page.locator('[data-resource-actions]')).toHaveCount(0);
  // the native web-document reader itself still renders in its place
  await expect(page.locator('[data-plan-prisa-web]')).toHaveCount(1);
  // המקור הרשמי של משרד החינוך וההורדה המקומית — שניהם חיים בלי הלוח הגנרי
  const official = page.locator(
    '[data-plan-prisa-web] a[href="https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/plan_7.pdf"]',
  );
  await expect(official).toHaveCount(1);
  await expect(official).toHaveAttribute('target', '_blank');
  await expect(page.locator('[data-plan-prisa-web] a[href="/docs/plan-7-tashpaz.pdf"][download]')).toHaveCount(1);
});

test('Mafmar section resource has no action board and renders local HTML', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/maf-02/');

  await expect(page.locator('.orbs')).toHaveCount(0);
  await expect(page.locator('[data-resource-actions]')).toHaveCount(0);

  const range = page.locator('[data-mafrange]');
  await expect(range).toHaveCount(1);
  await expect(range.locator('[data-mafmar-web]')).toHaveCount(1);

  const pages = await range.locator('[data-mafmar-page]').count();
  expect(pages).toBeGreaterThan(0);

  await expect(range.locator('iframe, embed, object')).toHaveCount(0);
});

test('Mafmar full page has no action board and renders all 18 HTML pages', async ({ page }) => {
  await page.goto('/hozer-mafmar/');

  await expect(page.locator('.orbs')).toHaveCount(0);
  await expect(page.locator('[data-resource-actions]')).toHaveCount(0);

  await expect(page.locator('.part-btn')).toHaveCount(4);
  await expect(page.locator('[data-mafmar-page]')).toHaveCount(18);
  await expect(page.locator('[data-mafmar-link]')).toHaveCount(58);

  await expect(
    page.locator(
      'iframe[src*="hozer-mafmar"], embed[src*="hozer-mafmar"], object[data*="hozer-mafmar"]'
    )
  ).toHaveCount(0);
});


test('בנייד: חוזר מפמ״ר HTML נשאר בתוך המסך והעוגנים לחיצים', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'החוזה רץ רק בפרויקט Pixel 7 האמיתי');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/hozer-mafmar/');

  await expect(page.locator('[data-mafmar-page]')).toHaveCount(18);

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );

  expect(overflow).toBeLessThanOrEqual(1);

  const firstPart = page.locator('.part-btn[href^="#"]').first();
  await expect(firstPart).toBeVisible();

  const href = await firstPart.getAttribute('href');
  expect(href).toMatch(/^#part-/);

  await firstPart.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));

  await expect(page.locator(href!)).toHaveCount(1);
});
