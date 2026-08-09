/**
 * מקור יחיד למסלולי התאימות (RULES 5.17, 18, הוראת יניב — קישורים ששותפו
 * בעבר לא נשברים).
 *
 * הרקע (ממצא ריצה 09/08/2026): הכתובות הישנות מומשו כעמודי Astro שמחזירים
 * ‏200 ובתוכם `<meta http-equiv="refresh">`. זו אינה הפניה — מנועי חיפוש
 * רואים עמוד תוכן כפול, הדפדפן מוסיף רשומת היסטוריה, וקורא מסך מקריא עמוד
 * ביניים. כאן הן מוגדרות פעם אחת ומתורגמות להפניית HTTP אמיתית ב-
 * `astro.config.mjs`, לסינון ה-sitemap ולחוזי הבדיקה — בלי רשימה מקבילה.
 *
 * `/chativat-beynayim/mivchanim/` **אינו** ברשימה במכוון: המסלול הזה הופך
 * למאגר המבחנים המרכזי של חט״ב ונמצא באחריות ענף המוצר.
 *
 * @type {Record<string, string>}
 */
export const LEGACY_REDIRECTS = {
  '/chativat-beynayim/misparim-mechuvanim/': '/chativat-beynayim/reader/z/misparim/',
  '/chativat-beynayim/zaviyot/': '/chativat-beynayim/reader/z/zaviyot/',
  '/chativat-beynayim/maarechet-tzirim/': '/chativat-beynayim/reader/z/tzirim/',
  '/chativat-beynayim/mischakim/': '/chativat-beynayim/nose/z/mischakim/',
};

/** קוד ההפניה המחייב — קבוע, כדי שהבדיקה והפרודקשן ידברו על אותו מספר. */
export const LEGACY_REDIRECT_STATUS = 301;

/** הנתיבים הישנים כסט, לסינון ה-sitemap: הם אינם עמודים קנוניים. */
export const LEGACY_PATHS = new Set(Object.keys(LEGACY_REDIRECTS));

/** נירמול להשוואה: בלי לוכסן סופי, כדי ש-`/a/` ו-`/a` ייחשבו זהים. */
export const trimSlash = (path) => (path.length > 1 ? path.replace(/\/$/, '') : path);
