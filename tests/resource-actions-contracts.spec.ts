import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test.skip(({ isMobile }) => isMobile === true, 'source architecture contracts are device-independent');

test('ResourceSplit consumes the shared action component and has no local action-board markup', async () => {
  const split = await source('src/components/ResourceSplit.astro');
  expect(split).toContain("import ResourceActions from './ResourceActions.astro'");
  expect(split).toContain('<ResourceActions');
  expect(split).not.toContain('<div class="orbs"');
  expect(split).not.toContain('class="res-actions"');
});

test('iframe success is driven by a real load event, never a timeout false-green', async () => {
  const split = await source('src/components/ResourceSplit.astro');
  expect(split).toContain("iframe.addEventListener(");
  expect(split).toContain("'load'");
  expect(split).toContain("frame.classList.add('is-loaded')");
  expect(split).not.toMatch(/setTimeout\([^)]*is-loaded/s);
  expect(split).not.toMatch(/setTimeout\([^)]*classList\.add\(['\"]is-loaded/s);
});

test('shared action component owns copy, Web Share and fullscreen behavior', async () => {
  const actions = await source('src/components/ResourceActions.astro');
  expect(actions).toContain('data-resource-actions');
  expect(actions).toContain('navigator.clipboard.writeText');
  expect(actions).toContain("typeof navigator.share === 'function'");
  expect(actions).toContain('requestFullscreen');
  expect(actions).toContain("error.name === 'AbortError'");
});
