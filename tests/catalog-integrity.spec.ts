import { expect, test } from '@playwright/test';
import {
  chapterHref,
  choveret,
  gradeHref,
  itemHref,
  itemNeighbours,
  legacyNeedsReviewItems,
  materialChapters,
  type ChoveretGrade,
  type ChoveretItem,
} from '../src/data/choveret';
import { publishableItems } from '../src/data/publishing';
import {
  sourceMaterialPlacements,
  sourceMaterialResources,
  sourceNeedsReviewResources,
} from '../src/data/source-materials';
import { canonicalGrade, canonicalGrades, canonicalPublishedGradeCount } from '../src/data/canonical-content';
import { primaryResourceId } from '../src/data/primary-resources';

/**
 * בדיקות קטלוג דטרמיניסטיות. אין טעם להריץ אותן שוב בפרויקט mobile —
 * אין כאן הבדל device; בדיקות ה-UI הממוקדות בהמשך רצות בדפדפן דסקטופ אחד.
 */
test.skip(({ isMobile }) => isMobile === true, 'בדיקת integrity אחת מספיקה — הנתונים זהים בכל device');

const reviewIds = () =>
  new Set([
    ...sourceNeedsReviewResources.map((resource) => resource.id),
    ...legacyNeedsReviewItems.map((resource) => resource.id),
  ]);

test('קטלוג המקור: מזהים ייחודיים וכל placement מצביע למשאב ולפרק אמיתיים', () => {
  const byId = new Map(sourceMaterialResources.map((resource) => [resource.id, resource]));
  expect(byId.size, 'אין שני משאבי מקור עם אותו id').toBe(sourceMaterialResources.length);

  const gradeBySlug = new Map(choveret.map((grade) => [grade.slug, grade]));
  for (const placement of sourceMaterialPlacements) {
    const resource = byId.get(placement.resourceId);
    expect(resource, `placement orphan: ${placement.resourceId}`).toBeTruthy();
    expect(resource!.grades, `${placement.resourceId}: placement בשכבה שאינה רשומה במשאב`).toContain(placement.grade);

    const grade = gradeBySlug.get(placement.grade);
    expect(grade, `שכבה לא קיימת: ${placement.grade}`).toBeTruthy();
    const chapterIds = new Set(materialChapters(grade!).map((chapter) => chapter.id));

    for (const chapterId of placement.topicChapterIds) {
      expect(chapterIds.has(chapterId), `${placement.resourceId}: topic placement לא קיים ${placement.grade}/${chapterId}`).toBe(true);
    }
    for (const chapterId of placement.collectionChapterIds) {
      expect(chapterIds.has(chapterId), `${placement.resourceId}: collection placement לא קיים ${placement.grade}/${chapterId}`).toBe(true);
    }
  }
});

test('נתון מקור חשוד תמיד מסומן review — reviewReason אינו הערה קוסמטית', () => {
  const reasonWithoutReview = sourceMaterialResources
    .filter((resource) => Boolean(resource.reviewReason?.trim()) && resource.needsReview !== true)
    .map((resource) => `${resource.id} — ${resource.reviewReason}`);
  expect(
    reasonWithoutReview,
    `נמצאה אזהרת איכות על משאב שאינו בהסגר:\n${reasonWithoutReview.join('\n')}`
  ).toEqual([]);

  const reviewWithoutReason = sourceMaterialResources
    .filter((resource) => resource.needsReview === true && !resource.reviewReason?.trim())
    .map((resource) => resource.id);
  expect(
    reviewWithoutReason,
    `משאב needsReview חייב להסביר למה, כדי שלא יאבד ההקשר בביקורת עתידית: ${reviewWithoutReason.join(', ')}`
  ).toEqual([]);
});

test('URL מקור זהה בשתי רשומות קנוניות שונות מותר רק כקונפליקט מוסגר ומוסבר', () => {
  const groups = new Map<string, typeof sourceMaterialResources>();
  for (const resource of sourceMaterialResources) {
    const key = resource.url.trim();
    groups.set(key, [...(groups.get(key) ?? []), resource]);
  }

  const unsafe: string[] = [];
  for (const [url, resources] of groups) {
    if (resources.length < 2) continue;
    const ids = new Set(resources.map((resource) => resource.id));
    if (ids.size < 2) continue;

    const safeConflict = resources.every(
      (resource) => resource.needsReview === true && Boolean(resource.reviewReason?.trim())
    );
    if (!safeConflict) {
      unsafe.push(`${url} => ${resources.map((resource) => `${resource.id}:${resource.title}`).join(' | ')}`);
    }
  }

  expect(
    unsafe,
    `אותו URL חובר ליותר ממשאב קנוני אחד בלי quarantine מלא:\n${unsafe.join('\n')}`
  ).toEqual([]);
});

test('needsReview נשמר בקטלוג אך אינו מופיע בתצוגת החומרים הקנונית', async ({ page }) => {
  const quarantined = reviewIds();
  expect(quarantined.size, 'יש quarantine אמיתי לבדיקה').toBeGreaterThan(0);

  for (const grade of canonicalGrades) {
    for (const chapter of materialChapters(grade)) {
      const expectedVisible = publishableItems(chapter.items);
      if (expectedVisible.length === 0) continue;

      const response = await page.goto(chapterHref(grade.slug, chapter.id));
      expect(response?.status(), `${grade.slug}/${chapter.id}: הנושא נגיש`).toBeLessThan(400);

      if (expectedVisible.length === 1) {
        await page.waitForURL((url) => url.pathname === itemHref(grade.slug, expectedVisible[0]));
        expect(page.url()).not.toMatch(new RegExp([...quarantined].join('|')));
        continue;
      }

      const primaryId = primaryResourceId(chapter.id);
      const visiblePrimary = primaryId ? expectedVisible.find((item) => item.id === primaryId) : undefined;
      const expectedCards = expectedVisible.length - (visiblePrimary ? 1 : 0);
      const cards = page.locator('a.rcard');
      await expect(cards, `${grade.slug}/${chapter.id}: מספר הכרטיסים המשניים הפומביים`).toHaveCount(expectedCards);

      const hrefs = await cards.evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href));
      for (const reviewId of quarantined) {
        expect(hrefs.some((href) => href.includes(`/reader/${grade.slug}/${reviewId}/`)), `${reviewId} אינו פומבי`).toBe(false);
      }
    }
  }
});

test('needsReview אינו מקבל route reader פומבי', async ({ request }) => {
  const quarantined = reviewIds();

  for (const grade of choveret) {
    const rawIds = new Set(grade.chapters.flatMap((chapter) => chapter.items.map((item) => item.id)));
    for (const reviewId of quarantined) {
      if (!rawIds.has(reviewId)) continue;
      const response = await request.get(`/chativat-beynayim/reader/${grade.slug}/${reviewId}/`, { maxRedirects: 0 });
      expect(response.status(), `${grade.slug}/${reviewId}: route של quarantine אינו נבנה`).toBe(404);
    }
  }
});

test('כל המונים הציבוריים נגזרים מהקטלוג הקנוני שפורסם', async ({ page }) => {
  await page.goto('/chativat-beynayim/');
  for (const sourceGrade of choveret) {
    const grade = canonicalGrade(sourceGrade);
    const expected = canonicalPublishedGradeCount(grade);
    await expect(
      page.locator(`a.third[href="${gradeHref(grade.slug)}"] .third-count`),
      `שער חטיבת הביניים — ${grade.slug}`
    ).toContainText(`${expected} קבצים, קישורים ופעילויות`);
  }

  for (const sourceGrade of choveret) {
    const grade = canonicalGrade(sourceGrade);
    const expected = canonicalPublishedGradeCount(grade);
    await page.goto(gradeHref(grade.slug));
    await expect(page.locator('.band-materials .band-count'), `עמוד מבוא שכבה — ${grade.slug}`).toContainText(
      `${expected} קבצים, קישורים ופעילויות`
    );
  }
});

test('pager של משאב פומבי אינו יכול להפנות למשאב quarantine', async ({ page }) => {
  const quarantined = reviewIds();
  let candidate: { grade: ChoveretGrade; item: ChoveretItem } | undefined;

  for (const grade of choveret) {
    const seen = new Set<string>();
    for (const chapter of materialChapters(grade)) {
      for (const item of publishableItems(chapter.items)) {
        if (seen.has(item.id) || item.pageHref) continue;
        seen.add(item.id);
        const raw = itemNeighbours(grade, item.id);
        if ([raw.prev, raw.next].some((entry) => entry?.item.needsReview === true)) {
          candidate = { grade, item };
          break;
        }
      }
      if (candidate) break;
    }
    if (candidate) break;
  }

  expect(candidate, 'יש לפחות מקרה שבו סדר הקטלוג הגולמי סמוך ל-needsReview').toBeTruthy();
  const readerPath = itemHref(candidate!.grade.slug, candidate!.item);
  await page.goto(readerPath);

  const pagerHrefs = await page
    .locator('.res-pager a.pager-link')
    .evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute('href') ?? ''));
  for (const reviewId of quarantined) {
    expect(pagerHrefs.some((href) => href.includes(`/reader/${candidate!.grade.slug}/${reviewId}/`)), `${reviewId} לא מופיע ב-pager`).toBe(false);
  }
});

test('multi-placement: canonical נשאר יחיד אבל חזרה זוכרת את הנושא שממנו נפתח המשאב', async ({ page }) => {
  type Placement = {
    grade: ChoveretGrade;
    item: ChoveretItem;
    chapterIds: string[];
  };

  const placements = new Map<string, Placement>();
  for (const grade of choveret) {
    for (const chapter of materialChapters(grade)) {
      for (const item of publishableItems(chapter.items)) {
        const href = itemHref(grade.slug, item);
        if (!href.startsWith(`/chativat-beynayim/reader/${grade.slug}/`)) continue;
        const key = `${grade.slug}:${item.id}`;
        const current = placements.get(key) ?? { grade, item, chapterIds: [] };
        if (!current.chapterIds.includes(chapter.id)) current.chapterIds.push(chapter.id);
        placements.set(key, current);
      }
    }
  }

  const candidate = [...placements.values()].find((entry) => entry.chapterIds.length > 1);
  expect(candidate, 'בקטלוג קיים לפחות משאב פומבי אחד שמוצב ביותר מנושא אחד').toBeTruthy();

  const { grade, item, chapterIds } = candidate!;
  const chapterId = chapterIds[1];
  const chapterPath = chapterHref(grade.slug, chapterId);
  const readerPath = itemHref(grade.slug, item);

  await page.goto(chapterPath);
  const card = page.locator(`a.rcard[href="${readerPath}"]`);
  await expect(card).toHaveCount(1);
  await expect(card).toHaveAttribute('data-resource-context', chapterId);

  await card.click();
  await page.waitForURL((url) => url.pathname === readerPath && url.search === '');

  await expect(page.locator('.res-page')).toHaveAttribute('data-resource-context', chapterId);
  await expect(page.locator('.res-back')).toHaveAttribute('href', chapterPath);
  await expect(page.locator('.res-eyebrow a:last-of-type')).toHaveAttribute('href', chapterPath);
  await expect(page.locator('.crumbs li:nth-last-child(2) a')).toHaveAttribute('href', chapterPath);

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical, 'canonical נשאר URL יחיד בלי state ניווט').toBe(`https://jerusalem-virid.vercel.app${readerPath}`);
});
