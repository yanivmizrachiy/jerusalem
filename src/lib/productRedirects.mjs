/**
 * חוזה ניתוב מוצרי שמופרד מתשתית ה-HTTP של PR #75.
 *
 * כל עוד חטיבה עליונה מחוץ להיקף הציבורי, עמודי התוכן נשמרים בריפו לעבודה
 * עתידית אבל כל נקודת כניסה ציבורית אליהם מתכנסת לעמוד המציין שהאזור יתעדכן.
 * ענף האינטגרציה צריך למזג את המפה הזו אל מנגנון ה-301 היחיד, בלי ליצור
 * meta-refresh ובלי למחוק את קובצי המקור.
 */
export const UPPER_SECONDARY_PLACEHOLDER = '/chativa-elyona/';

/** @type {Record<string, string>} */
export const UPPER_SECONDARY_PUBLIC_REDIRECTS = {
  '/chativa-elyona/3-yahal/': UPPER_SECONDARY_PLACEHOLDER,
  '/chativa-elyona/4-yahal/': UPPER_SECONDARY_PLACEHOLDER,
  '/chativa-elyona/5-yahal/': UPPER_SECONDARY_PLACEHOLDER,
  '/chativa-elyona/bchinot/': UPPER_SECONDARY_PLACEHOLDER,
  '/chativa-elyona/homrei-horaa/': UPPER_SECONDARY_PLACEHOLDER,
};

/**
 * מסלולים שחייבים להישאר עמודים אמיתיים ואסור שייכנסו בטעות למפת ההפניות.
 */
export const PRODUCT_ROUTE_EXCLUSIONS = new Set([
  '/chativa-elyona/',
  '/chativat-beynayim/mivchanim/',
]);
