export interface ResourceCopyInput {
  id?: string;
  title: string;
  note?: string;
  source?: string;
}

const collapseSpace = (value: string) => value.replace(/\s+/g, ' ').trim();
const trimSeparators = (value: string) =>
  collapseSpace(value)
    .replace(/^[,;·|—–\-\s]+/u, '')
    .replace(/[,;·|—–\-\s]+$/u, '')
    .trim();

/**
 * כותרות מקור ידועות שבהן החילוץ חיבר כמה תאי טבלה/metadata לכותרת אחת.
 * אלה תיקונים מפורשים בלבד — אין כאן ניחוש אוטומטי לפי דמיון טקסטואלי.
 */
const verifiedTitleOverrides: Readonly<Record<string, string>> = {
  'src-game-z-c9ff7e0990e6': 'מלחמה אלגברית - הצבות — מלחמה',
  'src-game-z-2240924d847e': 'מלחמה אלגברית - הצבות — קלפים מוגדלים',
  'src-curriculum-5164db8ab8b5': 'שטח משולש במערכת צירים',
  'src-game-h-496135f41e40': 'הנחיות למשחק התאמות - פונקציה קווית',
  'src-game-h-807bccfd80e5': 'קלפים למשחק התאמות - פונקציה קווית',
  'src-game-t-f96bc54899bb': 'מחפשים את הדלתון — ערכת משחק',
  'src-game-t-ee9cbe3251c4': 'מחפשים את הדלתון — ערכת פתרונות',
  'src-game-t-4511fce03b20': 'דומינו חוק הפילוג המורחב',
  'src-game-t-13edad04d513': 'דומינו חוק הפילוג המורחב — דף פעילות',
  'src-game-t-38f83b261a02': 'בינגו זיהוי מקדמים של פונקציה ריבועית',
  'src-game-t-8253c1eb9506': 'בינגו זיהוי מקדמים של פונקציה ריבועית — כרטיסיות הגרלה',
  'src-game-t-6a25b23e0c4e': 'בינגו קודקוד הפרבולה — לוחות',
  'src-game-t-3b8a123059d1': 'בינגו קודקוד הפרבולה — גלגל הגרלה',
};

/** ניסוחים גלויים שאומתו ידנית ואינם צריכים תוויות טקסיות כמו "רשמי". */
const verifiedNoteOverrides: Readonly<Record<string, string>> = {
  'moodle-guide': 'מדריך למורה באתר המודל למתמטיקה.',
};

/**
 * `קרדיט:` הוא metadata ולא תיאור. משאירים רק את החלק התיאורי של note;
 * הייחוס עצמו עובר למערכת המחברים/מקור הקנונית.
 */
export function visibleResourceNote(item: ResourceCopyInput): string {
  if (item.id && verifiedNoteOverrides[item.id]) return verifiedNoteOverrides[item.id];

  const note = collapseSpace(item.note ?? '');
  if (!note) return '';
  const creditIndex = note.search(/\bקרדיט(?:ים)?\s*:/u);
  if (creditIndex === 0) return '';
  if (creditIndex > 0) return note.slice(0, creditIndex).trim().replace(/[·|—–-]+$/u, '').trim();
  return note;
}

/**
 * כותרת תצוגה שמרנית: קודם תיקון ידני מאומת, ואז רק כפילות מלאה X — X.
 * כותרות מורכבות אחרות דורשות reconciliation אנושי ולא ניקוי עיוור.
 */
export function visibleResourceTitle(item: ResourceCopyInput): string {
  if (item.id && verifiedTitleOverrides[item.id]) return verifiedTitleOverrides[item.id];

  const title = collapseSpace(item.title);
  const parts = title.split(/\s+[—–]\s+/u).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 2 && parts[0] === parts[1]) return parts[0];
  return title;
}

/**
 * מקור מוצג רק בדף המידע. כאשר היוצר כבר מוצג בייחוס הקנוני, מסירים
 * מתוך מקטע המקור רק את שם/כינוי היוצר שכבר מוצג. כך לדוגמה
 * `למידה זה שם המשחק-בתיה מירזאיב` נשאר `למידה זה שם המשחק`, ולא
 * משכפל את שם המחברת ולא מוחק את שם המיזם.
 */
export function visibleResourceSource(item: ResourceCopyInput, creatorAliases: readonly string[] = []): string {
  const source = collapseSpace(item.source ?? '');
  if (!source) return '';

  const aliases = [...new Set(creatorAliases.map(collapseSpace).filter(Boolean))]
    .sort((a, b) => b.length - a.length);
  if (aliases.length === 0) return source;

  const parts = source
    .split(/\s*[·|]\s*/u)
    .map((part) => collapseSpace(part.replace(/^קרדיט(?:ים)?\s*:\s*/u, '')))
    .map((part) => {
      let cleaned = part;
      for (const alias of aliases) cleaned = cleaned.split(alias).join(' ');
      return trimSeparators(cleaned);
    })
    .filter(Boolean);

  return [...new Set(parts)].join(' · ');
}
