import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test.skip(({ isMobile }) => isMobile === true, 'source architecture contracts are device-independent');

test('ResourceSplit consumes the shared action component and has no local action-board behavior', async () => {
  const split = await source('src/components/ResourceSplit.astro');
  expect(split).toContain("import ResourceActions from './ResourceActions.astro'");
  expect(split).toContain('<ResourceActions');
  expect(split).not.toContain('<div class="orbs"');
  expect(split).not.toContain('class="res-actions"');
  expect(split).not.toContain("document.querySelectorAll<HTMLElement>('.orb')");
  expect(split).not.toContain("orb.addEventListener('pointermove'");
});

test('Mafmar consumes the exact same ResourceActions component and preserves dynamic fragment sharing', async () => {
  const mafmar = await source('src/pages/hozer-mafmar.astro');
  expect(mafmar).toContain("import ResourceActions from '../components/ResourceActions.astro'");
  expect(mafmar).toContain('<ResourceActions');
  expect(mafmar).not.toContain('class="res-actions"');
  expect(mafmar).toContain("copyAction.dataset.copy = url");
  expect(mafmar).toContain("shareAction.dataset.share = url");
  expect(mafmar).toContain("waAction.href = `https://wa.me/?text=${encodeURIComponent(text)}`");
});

test('iframe success is driven by a real load event, never a timeout false-green', async () => {
  const split = await source('src/components/ResourceSplit.astro');
  const mafmar = await source('src/pages/hozer-mafmar.astro');

  expect(split).toContain("iframe.addEventListener(");
  expect(split).toContain("'load'");
  expect(split).toContain("frame.classList.add('is-loaded')");
  expect(split).not.toMatch(/setTimeout\([^)]*is-loaded/s);
  expect(split).not.toMatch(/setTimeout\([^)]*classList\.add\(['\"]is-loaded/s);

  expect(mafmar).toContain("frame.addEventListener('load'");
  expect(mafmar).toContain("shell.classList.add('is-loaded')");
  expect(mafmar).not.toMatch(/setTimeout\([^)]*is-loaded/s);
  expect(mafmar).not.toMatch(/setTimeout\([^)]*classList\.add\(['\"]is-loaded/s);
});

test('shared action component owns copy, Web Share, fullscreen and pointer behavior', async () => {
  const actions = await source('src/components/ResourceActions.astro');
  expect(actions).toContain('data-resource-actions');
  expect(actions).toContain('navigator.clipboard.writeText');
  expect(actions).toContain("typeof navigator.share === 'function'");
  expect(actions).toContain('requestFullscreen');
  expect(actions).toContain("error.name === 'AbortError'");
  expect(actions).toContain("board.querySelectorAll<HTMLElement>('.orb')");
  expect(actions).toContain("orb.addEventListener('pointermove'");
});
