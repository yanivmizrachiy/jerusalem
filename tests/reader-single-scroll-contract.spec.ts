import { expect, test } from '@playwright/test';

const ROUTES = [
  '/chativat-beynayim/reader/z/misparim/',
  '/chativat-beynayim/reader/h/src-curriculum-71f88b7ed752/',
  '/chativat-beynayim/reader/z/maf-02/',
] as const;

test.skip(({ isMobile }) => isMobile === true, 'wide-reader single-scroll contract is desktop-specific');

test('wide reader has one working document scrollbar, no nested panel scrollbar, and no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator('.res-view')).toBeVisible();
    await expect(page.locator('.res-panel')).toBeVisible();

    const proof = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      const panel = document.querySelector<HTMLElement>('.res-panel')!;
      const view = document.querySelector<HTMLElement>('.res-view')!;
      const panelStyle = getComputedStyle(panel);
      const rootOverflowY = getComputedStyle(root).overflowY;
      const bodyOverflowY = getComputedStyle(body).overflowY;
      const maxScroll = root.scrollHeight - root.clientHeight;

      // Prove the document scroll path is operational, not merely geometrically
      // overflowing. Force instant scrolling only for this measurement and restore it.
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, Math.min(200, Math.max(0, maxScroll)));
      const actualScrollY = window.scrollY;
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previousScrollBehavior;

      return {
        documentVerticalOverflow: maxScroll,
        documentHorizontalOverflow: root.scrollWidth - root.clientWidth,
        rootOverflowY,
        bodyOverflowY,
        actualScrollY,
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
      ['hidden', 'clip'].includes(proof.rootOverflowY),
      `${route}: the root element must not lock document scrolling`,
    ).toBe(false);
    expect(
      ['hidden', 'clip'].includes(proof.bodyOverflowY),
      `${route}: body must not leak a scroll lock`,
    ).toBe(false);
    expect(
      proof.actualScrollY,
      `${route}: window.scrollY must actually change when the document is scrolled`,
    ).toBeGreaterThan(20);
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
