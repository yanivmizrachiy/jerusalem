import { expect, test } from '@playwright/test';
import {
  sourceMaterialPlacements,
  sourceMaterialResources,
  type SourceGrade,
} from '../src/data/source-materials';

/**
 * חוזה ה-provenance של הסיווג הפדגוגי (RULES 24.5.1, 24.5.4):
 * שכבה אינה נקבעת בניחוש — היא חייבת להיות מגובה בתווית השכבה שנשמרה
 * מהמסמך הרשמי בשדה `evidence` של הרשומה. הביקורת המלאה בוצעה
 * ב-09/08/2026 (אפס סתירות); הבדיקה הזו מקבעת אותה לכל שינוי עתידי.
 */
test.skip(({ isMobile }) => isMobile === true, 'taxonomy contract is device-independent');

const GRADE_OF_DIGIT: Record<string, SourceGrade> = { '7': 'z', '8': 'h', '9': 't' };
const GRADE_OF_LETTER: Record<string, SourceGrade> = { 'ז': 'z', 'ח': 'h', 'ט': 't' };

/**
 * פירוק תווית שכבה עברית מהמקור. אות שכבה נספרת רק כשאחריה גרש —
 * אחרת "הטרוגני" הייתה נקראת ט' ו"חזקות" הייתה נקראת ז'+ח'.
 * טווח ז'-ט' כולל גם את ח'.
 */
const parseHebrewGradeLabel = (label: string): Set<SourceGrade> | null => {
  if (label.includes('(missing)')) return null;
  const grades = new Set<SourceGrade>();
  for (const match of label.matchAll(/[זחט](?=['׳])/g)) {
    grades.add(GRADE_OF_LETTER[match[0]]);
  }
  if (grades.has('z') && grades.has('t') && !grades.has('h') && /[-–]/.test(label)) {
    grades.add('h');
  }
  return grades;
};

/** כל השכבות שהראיות של הרשומה מעידות עליהן, בשני ניבי המקור. */
const evidencedGrades = (
  evidence: readonly string[]
): { grades: Set<SourceGrade>; sawMissingLabel: boolean } => {
  const grades = new Set<SourceGrade>();
  let sawMissingLabel = false;
  for (const line of evidence) {
    for (const match of line.matchAll(/Grade\s*([789])/g)) {
      grades.add(GRADE_OF_DIGIT[match[1]]);
    }
    const label = line.match(/Explicit source grade label:\s*(.+)/);
    if (label) {
      const parsed = parseHebrewGradeLabel(label[1]);
      if (parsed === null) sawMissingLabel = true;
      else for (const grade of parsed) grades.add(grade);
    }
  }
  return { grades, sawMissingLabel };
};

test('לכל רשומת מקור יש ראיה מתועדת — אין רשומה עיוורת', () => {
  const blind = sourceMaterialResources
    .filter((resource) => !Array.isArray(resource.evidence) || resource.evidence.length === 0)
    .map((resource) => resource.id);
  expect(blind, `רשומות מקור בלי ראיה: ${blind.join(', ')}`).toEqual([]);
});

test('סיווג השכבה זהה לתווית השכבה שבמסמך המקור — בשני ניבי הראיה', () => {
  const mismatches: string[] = [];
  for (const resource of sourceMaterialResources) {
    const { grades } = evidencedGrades(resource.evidence);
    if (grades.size === 0) continue; // נבדק בחוזה ההסגר שלמטה
    const declared = new Set(resource.grades);
    const extra = [...declared].filter((grade) => !grades.has(grade));
    const missing = [...grades].filter((grade) => !declared.has(grade));
    if (extra.length > 0 || missing.length > 0) {
      mismatches.push(
        `${resource.id}: declared=[${[...declared].join(',')}] evidence=[${[...grades].join(',')}] — ${resource.title}`
      );
    }
  }
  expect(mismatches, `סיווג שכבה שסוטה מהראיה:\n${mismatches.join('\n')}`).toEqual([]);
});

test('רשומה בלי תווית שכבה במקור אינה מסווגת בניחוש — היא מוסגרת עם נימוק', () => {
  for (const resource of sourceMaterialResources) {
    const { grades } = evidencedGrades(resource.evidence);
    if (grades.size > 0) continue;
    expect(
      resource.needsReview,
      `${resource.id}: אין ראיית שכבה — חובה needsReview`
    ).toBe(true);
    expect(
      Boolean(resource.reviewReason?.trim()),
      `${resource.id}: הסגר בלי נימוק מאבד את ההקשר`
    ).toBe(true);
    expect(resource.grades, `${resource.id}: אסור לנחש שכבה בלי ראיה`).toEqual([]);
  }
});

test('כל שיבוץ יושב בשכבה מוצהרת של המשאב שלו', () => {
  const byId = new Map(sourceMaterialResources.map((resource) => [resource.id, resource]));
  const broken: string[] = [];
  for (const placement of sourceMaterialPlacements) {
    const resource = byId.get(placement.resourceId);
    if (!resource) {
      broken.push(`${placement.resourceId}: שיבוץ למשאב שאינו קיים`);
      continue;
    }
    if (!resource.grades.includes(placement.grade)) {
      broken.push(
        `${placement.resourceId}: משובץ ב-${placement.grade} אך מוצהר [${resource.grades.join(',')}]`
      );
    }
  }
  expect(broken, broken.join('\n')).toEqual([]);
});

test('כל משחק שייך לאוסף המשחקים — הסוג והאוסף אינם סותרים', () => {
  const strayGames = sourceMaterialResources
    .filter((resource) => resource.resourceType === 'game' && !resource.collections.includes('games'))
    .map((resource) => resource.id);
  expect(strayGames, `משחקים מחוץ לאוסף: ${strayGames.join(', ')}`).toEqual([]);
});
