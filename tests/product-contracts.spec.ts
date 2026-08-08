import { expect, test } from '@playwright/test';
import { canonicalGrades } from '../src/data/canonical-content';
import { resourceDisplayLabel } from '../src/data/resource-labels';

const grade = (slug: string) => canonicalGrades.find((candidate) => candidate.slug === slug)!;

test('semantic labels do not expose generic technical file labels', () => {
  expect(resourceDisplayLabel({ resourceType: 'game', delivery: 'printable', kind: 'drive' })).toBe('משחק להדפסה');
  expect(resourceDisplayLabel({ resourceType: 'game', delivery: 'digital', kind: 'site' })).toBe('משחק מתוקשב');
  expect(resourceDisplayLabel({ resourceType: 'worksheet', delivery: 'printable', kind: 'pdf' })).toBe('דף עבודה להדפסה');
  expect(resourceDisplayLabel({ resourceType: 'interactive-activity', delivery: 'digital', kind: 'site' })).toBe('פעילות אינטראקטיבית');
  expect(resourceDisplayLabel({ kind: 'drive' })).toBe('משאב לימודי');
});

test('equations and congruence legacy units are merged into normal canonical topics', () => {
  const equations = grade('z').chapters.find((chapter) => chapter.id === 'z-equations')!;
  const congruence = grade('h').chapters.find((chapter) => chapter.id === 'h-congruent')!;

  expect(equations.items.some((item) => item.id === 'EQ-001')).toBeTruthy();
  expect(equations.items.some((item) => item.id === 'MZ-27')).toBeTruthy();
  expect(congruence.items.some((item) => item.id === 'TRI-001')).toBeTruthy();

  expect(grade('z').pages?.some((page) => page.href === '/chativat-beynayim/mishvaot/')).toBeFalsy();
  expect(grade('h').pages?.some((page) => page.href === '/chativat-beynayim/hafifat-meshulashim/')).toBeFalsy();
});

test('upper secondary is a placeholder and exam repository is a real page', async ({ page }) => {
  await page.goto('/chativa-elyona/');
  await expect(page.getByRole('heading', { name: 'העמוד יתעדכן בהמשך' })).toBeVisible();

  await page.goto('/chativat-beynayim/mivchanim/');
  await expect(page.getByRole('heading', { level: 1, name: 'מאגר מבחנים לחטיבת הביניים' })).toBeVisible();
  await expect(page.getByText('מבחנים לכיתה ז׳', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('מבחנים לכיתה ח׳', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('מבחנים לכיתה ט׳', { exact: true }).first()).toBeVisible();
});

test('middle-school gateway exposes the full-width test repository entry', async ({ page }) => {
  await page.goto('/chativat-beynayim/');
  const link = page.getByRole('link', { name: /מאגר מבחנים לחטיבת הביניים/ });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/chativat-beynayim/mivchanim/');
});
