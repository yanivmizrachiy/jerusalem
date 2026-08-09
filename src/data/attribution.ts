/**
 * חוזה הייחוס של הקטלוג הציבורי (הוראת יניב, 09/08/2026).
 *
 * הכלל: **לכל משאב ציבורי בחטיבת הביניים חייב להיות ייחוס יוצר מאומת.**
 * ייחוס ארגוני מאומת הוא ייחוס תקין; גוף ארגוני אינו מקבל עמוד מחבר אישי.
 * ייחוס שאינו ידוע או שאינו שלם חייב להיות מסומן לבדיקה — ואינו יכול
 * להישאר ציבורי עד שנמצאת ראיה מספקת.
 *
 * ראיות ייחוס מותרות:
 * 1. `owner-verified` — מסירה מפורשת של בעל הפרויקט לגבי היוצר/הגוף היוצר.
 * 2. `explicit-credit` — שם היוצר מופיע במפורש בכותרת/תיאור/קרדיט של המשאב.
 * 3. `district-designated` — מקור שהוגדר במפורש ב-RULES כמשאב מחוז ירושלים.
 * 4. `official-resource-domain` — המשאב עצמו הוא פרסום רשמי של הגוף ומוגש
 *    מהדומיין הרשמי שלו; חל על ארגון בלבד. עצם אירוח קישור חיצוני אינו מספיק.
 *
 * חשוב: `source-publication` הוא provenance בלבד. העובדה שקישור הופיע במסמך
 * של משרד החינוך או במסמך רשמי אחר **אינה** מוכיחה שהגוף שפרסם את האינדקס
 * יצר את המשאב המקושר. לכן source-publication לבדו לעולם אינו author assignment.
 *
 * מה שאסור: ניחוש מחבר, הסקה משם קובץ, הסקת אדם מדומיין, זיהוי אדם משם
 * פרטי חלקי, או הוספת גוף מפרסם רק מפני שהמשאב הופיע ברשימת קישורים שלו.
 */

/**
 * משאבים שטרם נמצאה להם ראיית ייחוס מלאה.
 * הרשומות נשמרות במקור ובדוחות השימור, אך אינן נכנסות לקטלוג הציבורי.
 */
const ORIGINAL_PENDING: readonly string[] = [
  'mechuvanim-tavnit',
  'pilug',
  'EQ-001',
  'EQ-002',
  'EQ-003',
  'EQ-004',
  'EQ-017',
  'EQ-018',
  'EQ-005',
  'EQ-006',
  'EQ-007',
  'EQ-008',
  'EQ-009',
  'EQ-010',
  'EQ-011',
  'EQ-012',
  'EQ-013',
  'EQ-014',
  'EQ-015',
  'EQ-016',
  'EQ-019',
  'ahuzim',
  'angle-canva-site',
  'noschaot-z',
  'noschaot-copy',
  'sadnat-hachana',
  'hanukka-choveret',
  'hanukka-z',
  'parasha',
  'sheelot-chashiva',
  'kavit-tavnit',
  'dema',
  'TRI-001',
  'TRI-014',
  'TRI-005',
  'TRI-008',
  'TRI-013',
  'TRI-016',
  'TRI-009',
  'TRI-010',
  'TRI-011',
  'TRI-012',
  'TRI-006',
  'TRI-015',
  'TRI-004',
  'TRI-002',
  'TRI-003',
  'TRI-019',
  'TRI-020',
  'TRI-021',
  'TRI-022',
  'TRI-023',
  'TRI-017',
  'TRI-018',
  'MZ-30',
  'TRI-024',
  'TRI-025',
  'TRI-026',
  'ishi-plus',
  'noschaot-h',
  'meitzav-demo',
  'meitzav-machvan',
  'kdam-analiza',
  'sheelot-t',
  'noschaot-t',
  'kvatzim-nosim',
];

/**
 * ביקורת אמת 09/08/2026: למשאבים האלה היה attribution שנגזר רק מכך שהם
 * הופיעו בתוך מסמך מקור רשמי. זו ראיית provenance, לא ראיית יוצר.
 * הם נשמרים בשלמותם במקור אך חוזרים ל-quarantine עד אימות עצמאי.
 */
export const PROVENANCE_ONLY_ATTRIBUTION_PENDING: readonly string[] = [
  'forum-facebook-chatb',
  'src-curriculum-b6608b4a72db',
  'src-curriculum-664df64180ed',
  'src-curriculum-012bc422a750',
  'src-curriculum-106460e3dbb7',
  'src-curriculum-a69849f5cece',
  'src-curriculum-433698c54bce',
  'src-curriculum-8854cf7a3fff',
  'src-curriculum-948028aeab70',
  'src-curriculum-49cdd7293889',
  'src-curriculum-57ceeac1ffe1',
  'src-curriculum-3c37ff462079',
  'src-curriculum-0b4b09cdce63',
  'src-curriculum-e2583f30eda8',
  'src-curriculum-fc0d096cc4bd',
  'src-curriculum-6c64b9167a39',
  'src-curriculum-ee20bc58b48f',
  'src-curriculum-fe13dbb77b28',
  'src-curriculum-6f44d59030f7',
  'src-curriculum-1e51225a3948',
  'src-game-z-a7ad3a34d489',
  'src-game-z-1fb342ad0a97',
  'src-game-z-b63873233827',
  'src-game-h-67ac155f019d',
  'src-game-h-5f1c6a2e5e03',
  'src-game-t-9fbb30cdc0e3',
  'src-game-t-ea21f3af58b3',
  'src-game-t-168e283baaa2',
  'src-game-t-c006d81e537d',
  'src-game-t-05373c5c4a26',
  'src-game-t-b2c647299984',
  'mishakim-prisot',
  'ruach-tochnit',
];

/**
 * כאן יש ייחוס חלקי אמיתי, אבל לא מספיק לפרסום מלא.
 * הכותרת של המשאב אומרת "אייל שלמה ושגית". אייל שלמה מזוהה, אבל אין
 * ראיה שמאפשרת לזהות בוודאות איזו "שגית" היא השותפה; לכן לא מנחשים.
 */
export const PARTIAL_ATTRIBUTION_PENDING: readonly string[] = [
  'src-curriculum-9ac235d75c82',
];

export const ATTRIBUTION_PENDING: readonly string[] = [
  ...ORIGINAL_PENDING,
  ...PROVENANCE_ONLY_ATTRIBUTION_PENDING,
  ...PARTIAL_ATTRIBUTION_PENDING,
];

/**
 * הראצ׳ט אופס ל-100 בביקורת האמת של 09/08/2026 משום ש-34 רשומות ציבוריות
 * הוחזרו להסגר לאחר שהתברר שהייחוס הקודם נשען על provenance בלבד או היה
 * חלקי. זו גדילה מתקנת שמסירה נתון לא מבוסס; מכאן הרשימה שוב מצטמצמת בלבד.
 */
export const ATTRIBUTION_PENDING_CEILING = 100;

const pending = new Set(ATTRIBUTION_PENDING);

/** האם המשאב ממתין לראיית ייחוס מלאה ולכן נמצא ב-quarantine. */
export const isAttributionPending = (resourceId: string): boolean => pending.has(resourceId);
