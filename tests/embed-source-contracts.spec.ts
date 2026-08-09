import { expect, test } from '@playwright/test';
import { canonicalReaderItems } from '../src/data/canonical-content';
import { verifiedEmbedSourceFor } from '../src/data/embed-sources';

test('coordinate-system primary resource uses the runtime-verified direct embed source', () => {
  const tzirim = canonicalReaderItems.find(({ item }) => item.id === 'tzirim')?.item;
  expect(tzirim, 'tzirim remains in the canonical public catalog').toBeTruthy();
  expect(tzirim?.url).toBe('https://yanivmizrachiy.github.io/coordinate-first-quadrant/');
  expect(tzirim?.embed).toBe('https://yanivmizrachiy.github.io/coordinate-first-quadrant/');
});

test('verified embed evidence is explicit by resource id rather than inferred from arbitrary URLs', () => {
  expect(verifiedEmbedSourceFor('tzirim')).toBe('https://yanivmizrachiy.github.io/coordinate-first-quadrant/');
  expect(verifiedEmbedSourceFor('unknown-resource')).toBeUndefined();
});
