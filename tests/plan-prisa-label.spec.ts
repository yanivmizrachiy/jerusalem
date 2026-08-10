import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('PlanPrisaWeb preserves the real cell count instead of capping grids at five columns', () => {
  const source = readFileSync(
    new URL('../src/components/PlanPrisaWeb.astro', import.meta.url),
    'utf8'
  );

  expect(source).toContain('columns: Math.max(row.cells.length, 1),');
  expect(source).not.toContain('Math.min(Math.max(row.cells.length, 1), 5)');
});

test('the notices page uses the exact Mafmar presentation label', async ({ page }) => {
  await page.goto('/hodaot/');

  await expect(page.getByRole('link', { name: 'דבר המפמ״ר במצגת ←' })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'דבר המפמ״ר במצגת' })).toHaveCount(1);
  await expect(page.locator('main')).not.toContainText('חוזר המפמ״ר במצגת');
});
