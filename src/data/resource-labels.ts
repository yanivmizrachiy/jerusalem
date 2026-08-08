import type { SourceDeliveryMode, SourcePedagogicalType } from './source-materials';

export interface ResourceLabelInput {
  resourceType?: SourcePedagogicalType;
  delivery?: SourceDeliveryMode;
  kind?: string;
}

/**
 * תווית משתמש סמנטית: מהו המשאב ואיך משתמשים בו.
 * פורמט טכני (PDF/Drive/Doc) אינו התווית הראשית כאשר הסיווג הפדגוגי ידוע.
 */
export function resourceDisplayLabel(item: ResourceLabelInput): string {
  const { resourceType, delivery } = item;

  if (resourceType === 'game') {
    if (delivery === 'printable') return 'משחק להדפסה';
    if (delivery === 'digital') return 'משחק מתוקשב';
    if (delivery === 'hybrid') return 'משחק משולב';
    return 'משחק';
  }

  if (resourceType === 'worksheet') {
    if (delivery === 'printable') return 'דף עבודה להדפסה';
    if (delivery === 'digital') return 'דף עבודה מתוקשב';
    if (delivery === 'hybrid') return 'דף עבודה משולב';
    return 'דף עבודה';
  }

  if (resourceType === 'interactive-activity') return 'פעילות אינטראקטיבית';
  if (resourceType === 'test') return 'מבחן';
  if (resourceType === 'assessment-guide') return 'הנחיות והערכה';
  if (resourceType === 'summary-task') return 'משימת סיכום';
  if (resourceType === 'formula-sheet') return 'דף נוסחאות';
  if (resourceType === 'presentation') return 'מצגת';
  if (resourceType === 'teacher-guide') return 'מדריך למורה';
  if (resourceType === 'teaching-unit') return 'יחידת הוראה';
  if (resourceType === 'resource-repository') return 'מאגר משאבים';
  if (resourceType === 'multi-activity-collection') return 'אוסף פעילויות';

  // Legacy fallback: שימושי למשתמש, בלי להציג "קובץ"/PDF/Drive כמוצר.
  if (item.kind === 'site') return 'פעילות אינטראקטיבית';
  if (item.kind === 'canva') return 'מצגת או פעילות';
  if (item.kind === 'flip') return 'חוברת דפדוף';
  if (item.kind === 'maf') return 'חוזר מפמ״ר';
  return 'משאב לימודי';
}

/** ניסוח מונה ללא המונח הגנרי "משימות". */
export function resourceCountLabel(items: readonly ResourceLabelInput[]): string {
  const count = items.length;
  const hasGames = items.some((item) => item.resourceType === 'game');
  const hasTests = items.some((item) => item.resourceType === 'test');

  if (hasTests && items.every((item) => item.resourceType === 'test')) return `${count} מבחנים`;
  if (hasGames) return `${count} קבצים, קישורים ומשחקים`;
  return `${count} קבצים וקישורים`;
}
