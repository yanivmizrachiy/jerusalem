import { canonicalGrades } from './canonical-content';
import { middleSchoolResourceCount } from './site-counts';

export const productStatus = {
  canonicalGradeCount: canonicalGrades.length,
  middleSchoolResourceCount,
  hasThreeMiddleSchoolGrades: canonicalGrades.map((grade) => grade.slug).join(',') === 'z,h,t',
} as const;
