/**
 * כללי פרסום של קטלוג החומרים.
 *
 * `needsReview` הוא quarantine אמיתי: הרשומה נשמרת בקטלוג ובדוחות השימור,
 * אך אינה נחשבת חומר פומבי עד שאדם מאמת אותה ומסיר את הסימון.
 */
export interface ReviewableMaterial {
  id: string;
  needsReview?: boolean;
}

export const isPublishableMaterial = <T extends ReviewableMaterial>(item: T): boolean => item.needsReview !== true;

export const publishableItems = <T extends ReviewableMaterial>(items: readonly T[]): T[] =>
  items.filter(isPublishableMaterial);

export const publishedGradeCount = <
  T extends ReviewableMaterial,
  C extends { materials?: boolean; items: readonly T[] },
  G extends { chapters: readonly C[] },
>(grade: G): number => {
  const ids = new Set<string>();
  for (const chapter of grade.chapters) {
    if (chapter.materials === false) continue;
    for (const item of chapter.items) {
      if (isPublishableMaterial(item)) ids.add(item.id);
    }
  }
  return ids.size;
};
