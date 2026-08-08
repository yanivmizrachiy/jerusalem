import { canonicalGrades } from './canonical-content';
import { isPublishableMaterial } from './publishing';

/**
 * מניין אמיתי של משאבים ציבוריים קנוניים בחטיבת הביניים.
 * אותו resource id נספר פעם אחת גם אם הוא משויך לכמה שכבות/נושאים.
 */
export const middleSchoolResourceIds = new Set(
  canonicalGrades.flatMap((grade) =>
    grade.chapters.flatMap((chapter) =>
      chapter.items.filter(isPublishableMaterial).map((item) => item.id)
    )
  )
);

export const middleSchoolResourceCount = middleSchoolResourceIds.size;
export const middleSchoolResourceCountText = `${middleSchoolResourceCount} קבצים, קישורים ומסמכים באתר`;
