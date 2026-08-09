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
 * החטיבה העליונה מתכנסת בשלב זה לעמוד כניסה אחד (`/chativa-elyona/`,
 * "העמוד יתעדכן בהמשך"). חמש הכתובות הפנימיות מפנות אליו כאן — ולא נמחקות:
 * מקורות התוכן שלהן נשמרו במלואם ב-`src/drafts/chativa-elyona/`
 * (ראו `src/drafts/README.md`), ובנתונים `src/data/mafmar.ts` ו-`units.ts`.
 *
 * @type {Record<string, string>}
 */
export const LEGACY_REDIRECTS = {
  '/chativat-beynayim/misparim-mechuvanim/': '/chativat-beynayim/reader/z/misparim/',
  '/chativat-beynayim/zaviyot/': '/chativat-beynayim/reader/z/zaviyot/',
  '/chativat-beynayim/maarechet-tzirim/': '/chativat-beynayim/reader/z/tzirim/',
  '/chativat-beynayim/mischakim/': '/chativat-beynayim/nose/z/mischakim/',
  // יחידות ההוראה הישנות אינן עוד עמוד־נגן; חומריהן חיים בתוך הנושא הקנוני
  // (src/data/canonical-content.ts), והכתובת הישנה מפנה אליו בהפניה אמיתית.
  '/chativat-beynayim/mishvaot/': '/chativat-beynayim/nose/z/z-equations/',
  '/chativat-beynayim/hafifat-meshulashim/': '/chativat-beynayim/nose/h/h-congruent/',
  '/chativa-elyona/3-yahal/': '/chativa-elyona/',
  '/chativa-elyona/4-yahal/': '/chativa-elyona/',
  '/chativa-elyona/5-yahal/': '/chativa-elyona/',
  '/chativa-elyona/bchinot/': '/chativa-elyona/',
  '/chativa-elyona/homrei-horaa/': '/chativa-elyona/',
};

/** קוד ההפניה המחייב — קבוע, כדי שהבדיקה והפרודקשן ידברו על אותו מספר. */
export const LEGACY_REDIRECT_STATUS = 301;

/** הנתיבים הישנים כסט, לסינון ה-sitemap: הם אינם עמודים קנוניים. */
export const LEGACY_PATHS = new Set(Object.keys(LEGACY_REDIRECTS));

/** נירמול להשוואה: בלי לוכסן סופי, כדי ש-`/a/` ו-`/a` ייחשבו זהים. */
export const trimSlash = (path) => (path.length > 1 ? path.replace(/\/$/, '') : path);
