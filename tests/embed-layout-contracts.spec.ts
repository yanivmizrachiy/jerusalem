import { expect, test } from '@playwright/test';
import { canonicalReaderItems } from '../src/data/canonical-content';
import { embedLayoutFor, explicitEmbedLayout } from '../src/data/embed-layout';

test.skip(({ isMobile }) => isMobile === true, 'embed layout metadata is device-independent');

test('core interactive resources use viewport-driven interactive layout', () => {
  for (const id of ['tzirim', 'zaviyot', 'misparim']) {
    const layout = explicitEmbedLayout(id);
    expect(layout, `${id}: explicit layout exists`).toBeTruthy();
    expect(layout!.orientation).toBe('interactive');
    expect(layout!.minHeight).toContain('svh');
  }
});

test('linear-function flipbook has an explicit large landscape layout', () => {
  const entry = canonicalReaderItems.find(({ item }) => item.id === 'kavit-flip');
  expect(entry).toBeTruthy();

  const layout = embedLayoutFor(entry!.item);
  expect(layout.orientation).toBe('landscape');
  expect(layout.aspectRatio).toBe('16 / 10');
  expect(layout.minHeight).toBe('clamp(620px, 72vw, 960px)');
});

test('unknown document-shaped embeds default conservatively to portrait', () => {
  const entry = canonicalReaderItems.find(({ item }) =>
    ['pdf', 'doc', 'drive'].includes(item.kind) && !explicitEmbedLayout(item.id)
  );
  expect(entry).toBeTruthy();

  const layout = embedLayoutFor(entry!.item);
  expect(layout.orientation).toBe('portrait');
  expect(layout.aspectRatio).toBe('1 / 1.414');
});
