import { isAttributionPending } from './attribution';
import { supplementalItemsForChapter } from './project-supplements';
import { hafifaUnit, mishvaotUnit } from './units';

/**
 * כללי פרסום של קטלוג החומרים.
 *
 * `needsReview` הוא quarantine אמיתי: הרשומה נשמרת בקטלוג ובדוחות השימור,
 * אך אינה נחשבת חומר פומבי עד שאדם מאמת אותה ומסיר את הסימון.
 *
 * גם ייחוס יוצר חסר הוא quarantine אמיתי. לפי חוזה הייחוס הקשיח, משאב
 * שמופיע ב-`ATTRIBUTION_PENDING` נשמר במקור אך אינו יכול להיות פומבי עד
 * שנמצאת ראיה ומתווסף לו ייחוס קנוני — אין "פטור ציבורי" זמני.
 */
export interface ReviewableMaterial {
  id: string;
  needsReview?: boolean;
}

export const isPublishableMaterial = <T extends ReviewableMaterial>(item: T): boolean =>
  item.needsReview !== true && !isAttributionPending(item.id);

export const publishableItems = <T extends ReviewableMaterial>(items: readonly T[]): T[] =>
  items.filter(isPublishableMaterial);

/**
 * יחידות legacy ששויכו לנושא קנוני נספרות כחלק מהנושא, לא כעמוד נפרד.
 * שמירת המיפוי כאן מונעת ממונים ישנים להציג מספר שונה מהקטלוג הציבורי.
 */
const canonicalLegacyIdsByChapter: Readonly<Record<string, readonly string[]>> = {
  'z-equations': mishvaotUnit.resources.map((resource) => resource.id),
  'h-congruent': hafifaUnit.resources.map((resource) => resource.id),
};

export const publishedGradeCount = <
  T extends ReviewableMaterial,
  C extends { id: string; materials?: boolean; items: readonly T[] },
  G extends { chapters: readonly C[] },
>(grade: G): number => {
  const ids = new Set<string>();

  for (const chapter of grade.chapters) {
    if (chapter.materials === false) continue;

    for (const item of chapter.items) {
      if (isPublishableMaterial(item)) ids.add(item.id);
    }

    for (const id of canonicalLegacyIdsByChapter[chapter.id] ?? []) {
      if (!isAttributionPending(id)) ids.add(id);
    }

    for (const item of supplementalItemsForChapter(chapter.id)) {
      if (isPublishableMaterial(item)) ids.add(item.id);
    }
  }

  return ids.size;
};
