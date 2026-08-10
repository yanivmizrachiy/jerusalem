import { expect, test } from '@playwright/test';

const ROUTES = [
  '/chativat-beynayim/reader/z/misparim/',
  '/chativat-beynayim/reader/h/src-curriculum-71f88b7ed752/',
  '/chativat-beynayim/reader/z/maf-02/',
] as const;

test.skip(({ isMobile }) => isMobile === true, 'wide-reader single-scroll contract is desktop-specific');

test('wide reader has one document scrollbar, no nested panel scrollbar, and no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('.res-view')).toBeVisible();
    await expect(page.locator('.res-panel')).toBeVisible();

    const proof = await page.evaluate(() => {
      const root = document.documentElement;
      const panel = document.querySelector<HTMLElement>('.res-panel')!;
      const view = document.querySelector<HTMLElement>('.res-view')!;
      const panelStyle = getComputedStyle(panel);
      return {
        documentVerticalOverflow: root.scrollHeight - root.clientHeight,
        documentHorizontalOverflow: root.scrollWidth - root.clientWidth,
        panelVerticalOverflow: panel.scrollHeight - panel.clientHeight,
        panelOverflowY: panelStyle.overflowY,
        viewHeight: view.getBoundingClientRect().height,
      };
    });

    expect(
      proof.documentVerticalOverflow,
      `${route}: the browser document itself must provide the single vertical scroll path`,
    ).toBeGreaterThan(40);
    expect(
      ['auto', 'scroll'].includes(proof.panelOverflowY),
      `${route}: the information panel must not create a second scrollbar`,
    ).toBe(false);
    expect(
      proof.panelVerticalOverflow,
      `${route}: the information panel must expand to its content instead of clipping/scrolling internally`,
    ).toBeLessThanOrEqual(1);
    expect(proof.viewHeight, `${route}: the embedded resource remains useful rather than being crushed`).toBeGreaterThan(420);
    expect(
      proof.documentHorizontalOverflow,
      `${route}: the reader must not introduce horizontal page scrolling`,
    ).toBeLessThanOrEqual(1);
  }
});
