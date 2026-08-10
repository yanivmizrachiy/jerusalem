import { test, expect } from '@playwright/test';
import { mafmarSections } from '../src/data/mafmar';

test.describe('חוזר מפמ״ר במצגת והודעות שוטפות', () => {
  test('העמוד הראשי מוביל להודעות שוטפות', async ({ page }) => {
    await page.goto('/');
    const entry = page.getByRole('link', { name: /הודעות שוטפות/ });
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute('href', '/hodaot/');
  });

  test('הודעות שוטפות מציגות גם את החוזר וגם את המצגת ביחס מסמך A4', async ({ page }) => {
    await page.goto('/hodaot/');
    await expect(page.getByRole('heading', { name: 'הודעות שוטפות', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /^חוזר המפמ״ר ←$/ })).toHaveAttribute('href', '/hozer-mafmar/');
    await expect(page.getByRole('link', { name: /^דבר המפמ״ר במצגת ←$/ })).toHaveAttribute('href', '/hozer-mafmar-presentation/');
    await expect(page.locator('iframe[title="חוזר מפמ״ר תשפ״ז — המסמך המלא"]')).toBeVisible();
    await expect(page.locator('[data-mafmar-deck]')).toBeVisible();

    const ratio = await page.locator('.pdf-shell').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width / rect.height;
    });
    expect(ratio).toBeCloseTo(595.32 / 841.92, 2);
  });

  test('המצגת נגזרת מכל 23 המקטעים המאומתים ושומרת קישור מדויק לכל מקטע', async ({ page }) => {
    expect(mafmarSections).toHaveLength(23);
    expect(mafmarSections.every((section) => section.verified === true)).toBe(true);

    const response = await page.goto('/hozer-mafmar-presentation/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'חוזר מפמ״ר במצגת', level: 1 })).toBeVisible();

    const deck = page.locator('[data-mafmar-deck]');
    await expect(deck.locator('[data-slide]')).toHaveCount(28);
    await expect(deck.locator('[data-slide].is-active')).toHaveCount(1);
    await expect(deck.getByRole('link', { name: 'פתיחת חוזר המפמ״ר המלא' }).first()).toHaveAttribute('href', '/hozer-mafmar/');

    for (const section of mafmarSections) {
      await expect(deck.locator(`a[href="/hozer-mafmar/#${section.id}"]`)).toHaveCount(1);
      await expect(deck.locator('[data-slide]').filter({ hasText: section.id })).toHaveCount(1);
    }

    const stage = deck.locator('.deck-stage');
    await expect(stage).toHaveAttribute('tabindex', '0');
    await expect(stage).toHaveAttribute('role', 'region');

    await deck.locator('[data-deck-next]').click();
    await expect(deck.locator('[data-deck-status]')).toHaveText('2 מתוך 28');
  });
});
