import { expect, test } from '@playwright/test';
import { authorsForResource } from '../src/data/authors';
import { canonicalReaderItems } from '../src/data/canonical-content';
import { visibleResourceNote, visibleResourceSource, visibleResourceTitle } from '../src/data/resource-copy';

test.skip(({ isMobile }) => isMobile === true, 'copy contracts are device-independent');

const byId = new Map(canonicalReaderItems.map(({ item }) => [item.id, item]));

test('מלחמה אלגברית: כותרת אחת ובלי תווית קרדיט', () => {
  const war = byId.get('src-game-z-c9ff7e0990e6');
  const cards = byId.get('src-game-z-2240924d847e');
  expect(war).toBeTruthy();
  expect(cards).toBeTruthy();

  expect(visibleResourceTitle(war!)).toBe('מלחמה אלגברית - הצבות — מלחמה');
  expect(visibleResourceTitle(cards!)).toBe('מלחמה אלגברית - הצבות — קלפים מוגדלים');
  expect(visibleResourceNote(war!)).not.toContain('קרדיט:');
  expect(visibleResourceNote(cards!)).not.toContain('קרדיט:');
});

test('שם יוצר קנוני אינו משוכפל בשורת המקור', () => {
  for (const id of ['src-game-z-c9ff7e0990e6', 'src-game-z-2240924d847e']) {
    const item = byId.get(id)!;
    const creators = authorsForResource(id);
    const aliases = creators.flatMap((creator) => [creator.name, ...creator.aliases]);
    const source = visibleResourceSource(item, aliases);

    for (const alias of aliases) {
      expect(source, `${id}: ${alias} לא משוכפל במקור`).not.toContain(alias);
    }
  }
});

test('עמוד משאב מציג ייחוס יוצר בלי המילים מחבר או קרדיט', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/src-game-z-2240924d847e/');
  await expect(page.locator('.resource-author-shell')).toContainText('מתמטיקה משולבת — מכון ויצמן');
  await expect(page.locator('.resource-author-shell')).not.toContainText('קרדיט');
  await expect(page.locator('.resource-author-shell')).not.toContainText('מחבר:');
  await expect(page.locator('.resource-author-shell a')).toHaveCount(0);
});
