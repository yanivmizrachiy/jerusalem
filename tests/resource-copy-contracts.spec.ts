import { expect, test } from '@playwright/test';
import { authorsForResource } from '../src/data/authors';
import { canonicalReaderItems } from '../src/data/canonical-content';
import { visibleResourceNote, visibleResourceSource, visibleResourceTitle } from '../src/data/resource-copy';
import { sourceMaterialResources } from '../src/data/source-materials';

test.skip(({ isMobile }) => isMobile === true, 'copy contracts are device-independent');

const byId = new Map(canonicalReaderItems.map(({ item }) => [item.id, item]));
const sourceById = new Map(sourceMaterialResources.map((item) => [item.id, item]));

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

const verifiedTitleExpectations: Readonly<Record<string, string>> = {
  'src-game-z-c9ff7e0990e6': 'מלחמה אלגברית - הצבות — מלחמה',
  'src-game-z-2240924d847e': 'מלחמה אלגברית - הצבות — קלפים מוגדלים',
  'src-curriculum-5164db8ab8b5': 'שטח משולש במערכת צירים',
  'src-game-h-496135f41e40': 'הנחיות למשחק התאמות - פונקציה קווית',
  'src-game-h-807bccfd80e5': 'קלפים למשחק התאמות - פונקציה קווית',
  'src-game-t-f96bc54899bb': 'מחפשים את הדלתון — ערכת משחק',
  'src-game-t-ee9cbe3251c4': 'מחפשים את הדלתון — ערכת פתרונות',
  'src-game-t-4511fce03b20': 'דומינו חוק הפילוג המורחב',
  'src-game-t-13edad04d513': 'דומינו חוק הפילוג המורחב — דף פעילות',
  'src-game-t-38f83b261a02': 'בינגו זיהוי מקדמים של פונקציה ריבועית',
  'src-game-t-8253c1eb9506': 'בינגו זיהוי מקדמים של פונקציה ריבועית — כרטיסיות הגרלה',
  'src-game-t-6a25b23e0c4e': 'בינגו קודקוד הפרבולה — לוחות',
  'src-game-t-3b8a123059d1': 'בינגו קודקוד הפרבולה — גלגל הגרלה',
};

test('כותרות משחק שחולצו משני קבצים נשארות כותרת קנונית אחת', () => {
  for (const [id, title] of Object.entries(verifiedTitleExpectations)) {
    const item = byId.get(id);
    expect(item, `${id}: המשאב קיים בקטלוג הקנוני`).toBeTruthy();
    expect(visibleResourceTitle(item!), `${id}: כותרת תצוגה מאומתת`).toBe(title);
  }
});

test('override של כותרת אינו ממציא מילים שלא הופיעו בכותרת המקור', () => {
  const tokens = (value: string) =>
    value
      .toLocaleLowerCase('he')
      .match(/[\p{L}\p{N}]+/gu) ?? [];

  for (const [id, expected] of Object.entries(verifiedTitleExpectations)) {
    const source = sourceById.get(id);
    expect(source, `${id}: קיימת רשומת מקור להשוואת אמת`).toBeTruthy();

    const sourceTokens = new Set(tokens(source!.title));
    const invented = tokens(expected).filter((token) => !sourceTokens.has(token));
    expect(
      invented,
      `${id}: כותרת תצוגה יכולה לקצר/לסדר, אבל לא להמציא מילים שלא היו במקור (${source!.title})`
    ).toEqual([]);
  }
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

test('שם מחבר מוסר גם מתוך מקטע מקור משולב בלי למחוק את שם המיזם', () => {
  const id = 'src-game-z-9345687178d9';
  const item = byId.get(id);
  expect(item).toBeTruthy();

  const creators = authorsForResource(id);
  const aliases = creators.flatMap((creator) => [creator.name, ...creator.aliases]);
  const source = visibleResourceSource(item!, aliases);

  expect(source).toContain('למידה זה שם המשחק');
  expect(source).not.toContain('בתיה מירזאיב');
});

test('עמוד משאב מציג ייחוס יוצר פעם אחת בתוך לוח המידע, בלי מחבר/קרדיט', async ({ page }) => {
  await page.goto('/chativat-beynayim/reader/z/src-game-z-2240924d847e/');
  const attribution = page.locator('.res-panel .author-attribution');
  await expect(attribution).toHaveCount(1);
  await expect(attribution).toContainText('מתמטיקה משולבת — מכון ויצמן');
  await expect(attribution).not.toContainText('קרדיט');
  await expect(attribution).not.toContainText('מחבר:');
  await expect(attribution.locator('a')).toHaveCount(0);
});
