export interface ResourceCopyInput {
  title: string;
  note?: string;
  source?: string;
}

const collapseSpace = (value: string) => value.replace(/\s+/g, ' ').trim();

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
 * כותרת תצוגה שמרנית: מתקנת רק כפילות מלאה מהצורה X — X.
 * כותרות מורכבות אחרות דורשות reconciliation אנושי ולא ניקוי עיוור.
 */
export function visibleResourceTitle(item: ResourceCopyInput): string {
  const title = collapseSpace(item.title);
  const parts = title.split(/\s+[—–]\s+/u).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 2 && parts[0] === parts[1]) return parts[0];
  return title;
}

/** מקור מוצג רק בדף המידע, לא בכרטיסי רשימה. */
export function visibleResourceSource(item: ResourceCopyInput): string {
  return collapseSpace(item.source ?? '');
}
