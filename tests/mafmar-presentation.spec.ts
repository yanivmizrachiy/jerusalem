import { test, expect } from '@playwright/test';

test.describe('חוזר מפמ״ר במצגת והודעות שוטפות', () => {
  test('העמוד הראשי מוביל להודעות שוטפות', async ({ page }) => {
    await page.goto('/');
    const entry = page.getByRole('link', { name: /הודעות שוטפות/ });
    await expect(entry).toBeVisible();
    await expect(entry).toHaveAttribute('href', '/hodaot/');
  });

  test('הודעות שוטפות מציגות גם את החוזר וגם את המצגת', async ({ page }) => {
    await page.goto('/hodaot/');
    await expect(page.getByRole('heading', { name: 'הודעות שוטפות', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /^חוזר המפמ״ר ←$/ })).toHaveAttribute('href', '/hozer-mafmar/');
    await expect(page.getByRole('link', { name: /^חוזר המפמ״ר במצגת ←$/ })).toHaveAttribute('href', '/hozer-mafmar-presentation/');
    await expect(page.locator('iframe[title="חוזר מפמ״ר תשפ״ז — המסמך המלא"]')).toBeVisible();
    await expect(page.locator('[data-mafmar-deck]')).toBeVisible();
  });

  test('המצגת נגזרת מכל 23 מקטעי החוזר ושומרת כפתור לחוזר המלא', async ({ page }) => {
    const response = await page.goto('/hozer-mafmar-presentation/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'חוזר מפמ״ר במצגת', level: 1 })).toBeVisible();

    const deck = page.locator('[data-mafmar-deck]');
    await expect(deck.locator('[data-slide]')).toHaveCount(28);
    await expect(deck.locator('[data-slide].is-active')).toHaveCount(1);
    await expect(deck.getByRole('link', { name: 'פתיחת חוזר המפמ״ר המלא' }).first()).toHaveAttribute('href', '/hozer-mafmar/');

    await deck.locator('[data-deck-next]').click();
    await expect(deck.locator('[data-deck-status]')).toHaveText('2 מתוך 28');
  });
});
