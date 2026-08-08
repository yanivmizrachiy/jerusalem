import { expect, test } from '@playwright/test';
import { primaryResourceByChapter } from '../src/data/primary-resources';

test('core learning topics have explicit primary resources', () => {
  expect(primaryResourceByChapter['z-coordinate-system']).toBe('tzirim');
  expect(primaryResourceByChapter['z-angles']).toBe('zaviyot');
  expect(primaryResourceByChapter['z-directed-numbers']).toBe('misparim');
  expect(primaryResourceByChapter['h-linear-function']).toBe('kavit-flip');
});
