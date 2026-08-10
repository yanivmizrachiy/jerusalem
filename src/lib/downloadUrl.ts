/**
 * קביעת same-origin אמיתית לכפתור ההורדה (RULES 8.18, 4.6): מאפיין
 * `download` אמין רק באותו origin, ולכן התווית וההתנהגות חייבות לומר
 * אמת — "הורדה" למקומי, "פתיחת קובץ" לחיצוני.
 *
 * ההכרעה נעשית ברזולוציית URL מלאה מול ה-origin הקנוני — לא בבדיקת
 * קידומת — כך שכל הצורות המקומיות מזוהות ('/x', 'docs/x', './x',
 * וכתובת מוחלטת על ה-origin שלנו), וכתובת protocol-relative
 * ('//cdn/…') או מוחלטת-חיצונית מזוהות כחיצוניות.
 */
export function isSameOriginUrl(
  value: string | undefined,
  base: URL | string | undefined
): boolean {
  if (!value || !base) return false;
  try {
    return new URL(value, base).origin === new URL(String(base)).origin;
  } catch {
    // ערך שאינו URL תקין אינו זוכה להבטחת הורדה
    return false;
  }
}
