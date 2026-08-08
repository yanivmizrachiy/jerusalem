import { expect, test } from '@playwright/test';
import { canonicalGrades } from '../src/data/canonical-content';
import { mafmarSections } from '../src/data/mafmar';

const sectionById = new Map(mafmarSections.map((section) => [section.id, section]));

test('Grade 9 never surfaces Mafmar sections whose audience is upper secondary', () => {
  const gradeT = canonicalGrades.find((grade) => grade.slug === 't')!;
  const upperSecondarySections = gradeT.chapters
    .flatMap((chapter) => chapter.items)
    .filter((item) => item.maf)
    .map((item) => sectionById.get(item.maf!))
    .filter((section) => section?.audience === 'חט״ע');

  expect(upperSecondarySections).toEqual([]);
});
