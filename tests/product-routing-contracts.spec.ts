import { expect, test } from '@playwright/test';
import { existsSync } from 'node:fs';
import {
  PRODUCT_ROUTE_EXCLUSIONS,
  UPPER_SECONDARY_PLACEHOLDER,
  UPPER_SECONDARY_PUBLIC_REDIRECTS,
} from '../src/lib/productRedirects.mjs';

test.skip(({ isMobile }) => isMobile === true, 'route manifest contract is device-independent');

test('כל כניסה ציבורית לחטיבה העליונה מתכנסת לעמוד ה-placeholder בלי למחוק מקור', () => {
  const expected = [
    '/chativa-elyona/3-yahal/',
    '/chativa-elyona/4-yahal/',
    '/chativa-elyona/5-yahal/',
    '/chativa-elyona/bchinot/',
    '/chativa-elyona/homrei-horaa/',
  ];

  expect(Object.keys(UPPER_SECONDARY_PUBLIC_REDIRECTS).sort()).toEqual(expected.sort());
  for (const [from, to] of Object.entries(UPPER_SECONDARY_PUBLIC_REDIRECTS)) {
    expect(to, `${from}: יעד ה-placeholder`).toBe(UPPER_SECONDARY_PLACEHOLDER);
    const file = `src/pages${from.slice(0, -1)}.astro`;
    expect(existsSync(file), `${from}: תוכן המקור נשמר בריפו`).toBe(true);
  }
});

test('מאגר מבחני חטיבת הביניים וה-placeholder עצמו לעולם אינם redirect aliases', () => {
  for (const path of PRODUCT_ROUTE_EXCLUSIONS) {
    expect(UPPER_SECONDARY_PUBLIC_REDIRECTS[path], `${path}: חייב להישאר עמוד אמיתי`).toBeUndefined();
  }
  expect(PRODUCT_ROUTE_EXCLUSIONS.has('/chativat-beynayim/mivchanim/')).toBe(true);
  expect(PRODUCT_ROUTE_EXCLUSIONS.has('/chativa-elyona/')).toBe(true);
});
