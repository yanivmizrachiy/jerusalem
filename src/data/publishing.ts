import { isAttributionPending } from './attribution';

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
