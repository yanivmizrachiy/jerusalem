import { expect, test } from '@playwright/test';
import { authorAssignments, authorById, authors, pageAuthors } from '../src/data/authors';
import { canonicalReaderItems } from '../src/data/canonical-content';

// חוזה הנתונים זהה בכל device; בדיקת UI אחת בדסקטופ מספיקה כאן.
test.skip(({ isMobile }) => isMobile === true, 'author registry is device-independent');

test('כל author-id משויך קיים במקור האמת ושמות המחברים האישיים ייחודיים', () => {
  expect(new Set(authors.map((author) => author.id)).size).toBe(authors.length);
  expect(new Set(authors.map((author) => author.slug)).size).toBe(authors.length);

  for (const [resourceId, authorIds] of Object.entries(authorAssignments)) {
    expect(authorIds.length, `${resourceId}: יש לפחות ייחוס אחד`).toBeGreaterThan(0);
    expect(new Set(authorIds).size, `${resourceId}: אין ייחוס כפול`).toBe(authorIds.length);
    for (const authorId of authorIds) {
      expect(authorById(authorId), `${resourceId}: author-id קיים — ${authorId}`).toBeTruthy();
    }
  }
});

test('משרד החינוך הוא ייחוס טקסטואלי בלבד — בלי עמוד מחבר אישי', () => {
  const ministry = authorById('ministry-of-education');
  expect(ministry).toBeTruthy();
  expect(ministry!.kind).toBe('organization');
  expect(ministry!.pageEligible).toBe(false);
  expect(pageAuthors.some((author) => author.id === ministry!.id)).toBe(false);
});

test('כל מחבר אישי עם משאבים שפורסמו מקבל עמוד שמציג רק משאבים משויכים', async ({ page }) => {
  const publicIds = new Set(canonicalReaderItems.map(({ item }) => item.id));

  for (const author of pageAuthors) {
    const assignedIds = Object.entries(authorAssignments)
      .filter(([resourceId, authorIds]) => publicIds.has(resourceId) && authorIds.includes(author.id))
      .map(([resourceId]) => resourceId);

    if (assignedIds.length === 0) continue;

    const response = await page.goto(`/chativat-beynayim/mechabrim/${author.slug}/`);
    expect(response?.status(), `${author.name}: עמוד מחבר קיים`).toBe(200);
    await expect(page.locator('h1')).toHaveText(author.name);

    const hrefs = await page
      .locator('.resource-grid a')
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute('href') ?? ''));

    expect(hrefs.length, `${author.name}: מוצג לפחות משאב אחד`).toBeGreaterThan(0);
    for (const resourceId of assignedIds) {
      expect(
        hrefs.some((href) => href.includes(`/${resourceId}/`)),
        `${author.name}: המשאב ${resourceId} מופיע בעמוד המחבר`
      ).toBe(true);
    }
  }
});
