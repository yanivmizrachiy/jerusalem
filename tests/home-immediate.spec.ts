import { expect, test } from '@playwright/test';

test.describe('PR100 — עמוד ראשי מיידי', () => {
  test('first-load אמיתי מציג ניווט, צוות ושלוש כניסות בלי שער session', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.site-header .nav-list')).toBeVisible();
    await expect(page.locator('.rail')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'צוות הדרכה' })).toBeVisible();

    const actions = page.locator('.hero-actions .lead-btn');
    await expect(actions).toHaveCount(3);
    await expect(actions.nth(0)).toHaveAttribute('href', '/chativat-beynayim/');
    await expect(actions.nth(1)).toHaveAttribute('href', '/chativa-elyona/');
    await expect(actions.nth(2)).toHaveAttribute('href', '/hodaot/');
    for (const action of await actions.all()) {
      await expect(action).toBeVisible();
      const box = await action.boundingBox();
      expect(box).not.toBeNull();
      if (!box) throw new Error('hero action has no bounding box');
      expect(box.height).toBeGreaterThanOrEqual(44);
    }

    await expect(page.locator('.start-btn')).toHaveCount(0);
    await expect(page.locator('[data-splash]')).toHaveCount(0);
    const legacy = await page.evaluate(() => ({
      seen: sessionStorage.getItem('jerusalem.heroSeen.v1'),
      seenClass: document.documentElement.classList.contains('hero-seen'),
    }));
    expect(legacy).toEqual({ seen: null, seenClass: false });
  });

  for (const vp of [
    { width: 360, height: 740 },
    { width: 390, height: 844 },
  ]) {
    test(`שלוש הכניסות נשארות במסך הראשון בנייד ${vp.width}×${vp.height}`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/');

      const actions = page.locator('.hero-actions .lead-btn');
      await expect(actions).toHaveCount(3);
      for (const action of await actions.all()) {
        await expect(action).toBeVisible();
        const box = await action.boundingBox();
        expect(box).not.toBeNull();
        if (!box) throw new Error('hero action has no bounding box');
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
      }

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test('לוח הווידאו מושתק, ללא loop/controls; reduced-motion נשאר poster בלבד', async ({ page }) => {
    await page.goto('/');
    const video = page.locator('#hero-video');
    await expect(video).toHaveCount(1);
    await expect(video).not.toHaveAttribute('loop', '');
    await expect(video).not.toHaveAttribute('controls', '');
    await expect(video).toHaveAttribute('poster', '/media/hero-poster-880.avif');
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
    await expect.poll(() => video.getAttribute('src')).toContain('/media/hero-720.mp4');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    const reduced = page.locator('#hero-video');
    await expect(reduced).toHaveAttribute('poster', '/media/hero-poster-880.avif');
    expect((await reduced.getAttribute('src')) ?? '').toBe('');
  });

  test('חוזי #98/#99 נשמרים לצד הבית החדש', async ({ page }) => {
    await page.goto('/shearim/');
    await expect(page.locator('.choice-card')).toHaveCount(2);

    await page.goto('/');
    await expect(page.locator('.rail-track')).toHaveCount(1);
  });
});
