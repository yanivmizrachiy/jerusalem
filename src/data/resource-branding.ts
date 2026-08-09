/**
 * מיתוג משאב — לוגו של הסביבה שממנה המשאב מגיע (הוראת יניב, 09/08/2026).
 *
 * **המיפוי מפורש לפי מזהה משאב בלבד.** אסור לזהות סביבה לפי כותרת, לפי
 * `title.includes('מודל')`, לפי שם קובץ או לפי דומיין — הסקה כזו מדביקה לוגו
 * על משאבים שאינם שייכים לסביבה. בקטלוג יש היום שבעה משאבים ציבוריים
 * שכותרתם כוללת "מודל" (חומרי "צוות מודל" של מערכת צירים) והם **אינם**
 * משאבי סביבת המודל — הם בדיוק המקרה שהמיפוי המפורש מונע.
 *
 * הלוגו הוא **מיתוג**, לא ייחוס יוצר. הוא אינו מחליף `author-assignments.ts`
 * ואינו ראיה לפי 24.1.2 — משאב ממותג שאין לו ראיית ייחוס נשאר ב-quarantine.
 */

export interface ResourceBrand {
  /** מזהה הסביבה, לשימוש בבדיקות ובסימון ב-DOM. */
  id: string;
  /** נתיב הנכס בריפו. נגזר מהמקור שסיפק יניב דרך `scripts/build-moodle-logo.mjs`. */
  src: string;
  /** טקסט חלופי מחייב (הוראת יניב, 09/08/2026). */
  alt: string;
  /** מידות הנכס האמיתיות — שומרות יחס ומונעות קפיצת layout. */
  width: number;
  height: number;
}

/**
 * לוגו סביבת המודל. הנכס נגזר מהמקור שסיפק יניב ידנית ב-09/08/2026
 * (`public/media/brands/moodle-logo-source.png`) — חיתוך צמוד, רקע שקוף
 * וחידוד עדין בלבד. הצבע הכתום והכובע נשמרו כפי שהם; אין עיצוב מחדש,
 * אין תחליף ואין נכס שנוצר ב-AI.
 */
const moodleBrand: ResourceBrand = {
  id: 'moodle',
  src: '/media/brands/moodle-logo.png',
  alt: 'לוגו מודל מתמטיקה לחטיבת הביניים',
  width: 510,
  height: 130,
};

/** מיפוי מפורש. הרחבה נעשית כאן בלבד, מזהה־מזהה. */
const brandByResourceId: Readonly<Record<string, ResourceBrand>> = {
  'moodle-guide': moodleBrand,
  'moodle-slides': moodleBrand,
};

/** המיתוג של המשאב, או `undefined` כשאין לו מיתוג ממופה. */
export const brandForResource = (resourceId: string): ResourceBrand | undefined =>
  brandByResourceId[resourceId];

/** כל המזהים הממופים — מקור יחיד לבדיקות הרגרסיה. */
export const brandedResourceIds: readonly string[] = Object.keys(brandByResourceId);
