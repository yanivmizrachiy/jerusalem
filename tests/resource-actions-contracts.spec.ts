import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test.skip(({ isMobile }) => isMobile === true, 'action-board ownership contracts are device-independent');

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

test('MafmarRange has no duplicate action board — only page-range navigation survives', async () => {
  const mrange = await source('src/components/MafmarRange.astro');
  expect(mrange).not.toContain('mrange-actions');
  expect(mrange).not.toContain('data-wa');
  expect(mrange).not.toContain('data-mail');
  expect(mrange).not.toContain('data-copy');
  expect(mrange).not.toContain('data-resource-actions');
  expect(mrange).toContain('data-prev');
  expect(mrange).toContain('data-next');
  expect(mrange).toContain('mrange-ind');
  expect(mrange).toContain('mrange-pager');
});

test('Mafmar full page has no generic ResourceActions — document navigation survives', async () => {
  const mafmar = await source('src/pages/hozer-mafmar.astro');
  expect(mafmar).not.toContain("import ResourceActions");
  expect(mafmar).not.toContain('<ResourceActions');
  expect(mafmar).not.toContain('data-resource-actions');
  expect(mafmar).not.toContain('mafmarCanonical');
  expect(mafmar).toContain('pg-prev');
  expect(mafmar).toContain('pg-next');
  expect(mafmar).toContain('data-goto');
  expect(mafmar).toContain('viewer-open-card');
});

test('plan/prisa native HTML resources do not own a generic action board either', async () => {
  const ppw = await source('src/components/PlanPrisaWeb.astro');
  expect(ppw).not.toContain("import ResourceActions");
  expect(ppw).not.toContain('<ResourceActions');
  expect(ppw).not.toContain('data-resource-actions');
  expect(ppw).not.toContain('class="orbs"');
});

test('iframe success is driven by a real load event, never a timeout false-green', async () => {
  const split = await source('src/components/ResourceSplit.astro');
  const mafmar = await source('src/pages/hozer-mafmar.astro');

  expect(split).toContain('iframe.addEventListener(');
  expect(split).toContain("'load'");
  expect(split).toContain("frame.classList.add('is-loaded')");
  expect(split).not.toMatch(/setTimeout\([^)]*is-loaded/s);
  expect(split).not.toMatch(/setTimeout\([^)]*classList\.add\(['"]is-loaded/s);

  expect(mafmar).toContain("frame.addEventListener('load'");
  expect(mafmar).toContain("shell.classList.add('is-loaded')");
  expect(mafmar).not.toMatch(/setTimeout\([^)]*is-loaded/s);
  expect(mafmar).not.toMatch(/setTimeout\([^)]*classList\.add\(['"]is-loaded/s);
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
});

test('Mafmar section embedded in a resource page has no action board, keeps page navigation', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/maf-02/');
  await expect(page.locator('.orbs')).toHaveCount(0);
  await expect(page.locator('[data-resource-actions]')).toHaveCount(0);
  await expect(page.locator('.mrange-actions')).toHaveCount(0);
  const pager = page.locator('.mrange-pager');
  await expect(pager).toHaveCount(1);
  await expect(pager.locator('[data-prev]')).toHaveCount(1);
  await expect(pager.locator('[data-next]')).toHaveCount(1);
});

test('Mafmar full page has no action board, keeps part jumps, section jumps and document paging', async ({ page }) => {
  await page.goto('/hozer-mafmar/');
  await expect(page.locator('.orbs')).toHaveCount(0);
  await expect(page.locator('[data-resource-actions]')).toHaveCount(0);
  await expect(page.locator('.part-btn')).toHaveCount(4);
  await expect(page.locator('#pg-prev')).toHaveCount(1);
  await expect(page.locator('#pg-next')).toHaveCount(1);
});
