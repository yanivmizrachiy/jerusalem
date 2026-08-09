export interface ResourceCopyInput {
  id?: string;
  title: string;
  note?: string;
  source?: string;
}

const collapseSpace = (value: string) => value.replace(/\s+/g, ' ').trim();

/**
 * כותרות מקור ידועות שבהן החילוץ חיבר כמה תאי טבלה/metadata לכותרת אחת.
 * אלה תיקונים מפורשים בלבד — אין כאן ניחוש אוטומטי לפי דמיון טקסטואלי.
 */
const verifiedTitleOverrides: Readonly<Record<string, string>> = {
  'src-game-z-c9ff7e0990e6': 'מלחמה אלגברית - הצבות — מלחמה',
  'src-game-z-2240924d847e': 'מלחמה אלגברית - הצבות — קלפים מוגדלים',
  'src-curriculum-5164db8ab8b5': 'שטח משולש במערכת צירים',
};

/**
 * `קרדיט:` הוא metadata ולא תיאור. משאירים רק את החלק התיאורי של note;
 * הייחוס עצמו עובר למערכת המחברים/מקור הקנונית.
 */
export function visibleResourceNote(item: ResourceCopyInput): string {
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
 * מהמחרוזת רק מקטע מקור שזהה לשם/כינוי שלו; מידע מקור אחר נשמר.
 */
export function visibleResourceSource(item: ResourceCopyInput, creatorAliases: readonly string[] = []): string {
  const source = collapseSpace(item.source ?? '');
  if (!source) return '';

  const aliases = new Set(creatorAliases.map(collapseSpace).filter(Boolean));
  if (aliases.size === 0) return source;

  const parts = source
    .split(/\s*[·|]\s*/u)
    .map(collapseSpace)
    .filter(Boolean)
    .filter((part) => {
      const withoutCredit = collapseSpace(part.replace(/^קרדיט(?:ים)?\s*:\s*/u, ''));
      return !aliases.has(part) && !aliases.has(withoutCredit);
    });

  return parts.join(' · ');
}
