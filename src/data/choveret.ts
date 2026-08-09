/**
 * מקור התוכן היחיד של חטיבת הביניים (RULES 3.29, הוראת יניב 05/08/2026):
 * החוברת המדפדפת בוטלה — החומרים מוצגים בעמודי אינטרנט אחידים: מסך
 * השלישים בשער, עמוד שכבה לכל כיתה, ועמוד משאב מחולק (הטמעה מול פעולות).
 * מבנה הנתונים נשאר כשהיה — שכבות, פרקים ופריטים — ואין רשימות חומרים
 * מקבילות בעמודי ה-astro; הכול נגזר מכאן.
 *
 * בנייה מאוחדת (2026-08-07):
 * - קטלוג המקור המנורמל שומר 146 רשומות קישור, 145 משאבי מקור קנוניים
 *   ושמונה שורות מקור ללא קישור, בלי להמציא כתובות חסרות.
 * - כל משאב מקור מוגדר פעם אחת ב-source-materials.ts ויכול לקבל כמה הצבות
 *   לפי שכבה, נושא ואוסף.
 * - פריטי קטלוג ישנים שלא נמצאו בחילוץ המבוקר נשמרים במפורש כ-needsReview
 *   במקום להימחק או לקבל שיוך מומצא.
 */
import { MAFMAR_URL, MAFMAR_LOCAL, mafmarSections } from './mafmar';
import {
  sourceCatalogConservation,
  sourceLinkLedger,
  sourceMaterialResources,
  sourceMaterialsForCollection,
  sourceMaterialsForTopic,
  sourceNeedsReviewResources,
  sourceNoLinkRows,
  sourceUpperSecondaryTransitionResources,
  type SourceDeliveryMode,
  type SourceGrade,
  type SourceMaterialResource,
  type SourcePedagogicalType,
} from './source-materials';

export type ItemKind = 'site' | 'doc' | 'drive' | 'pdf' | 'canva' | 'flip' | 'maf' | 'link';

export interface ChoveretItem {
  id: string;
  title: string;
  /** ההסבר הקצר בפאנל המידע של הקורא */
  note: string;
  /** הקישור הקנוני — זה שמועתק ומשותף */
  url: string;
  /** מקור הטמעה מאומת בלבד; בלעדיו הקורא מציג כרטיס פתיחה, לא iframe ריק */
  embed?: string;
  /** קישור הורדה אמיתי בלבד */
  download?: string;
  kind: ItemKind;
  /**
   * שדה היסטורי של רכיב החוברת הפרטי (RULES 4.14). אין להשתמש בו בפריטי
   * החומרים: כל משימה ברשימת המשימות חייבת להוביל לעמוד המשימה המחולק
   * (הוראת יניב, 06/08/2026). יעדים שאינם משימה — יחידות ועמודים ייעודיים —
   * חיים ב-`pages` של השכבה ולא בתוך הנושאים.
   */
  pageHref?: string;
  /** למקטעי חוזר: מזהה MAF */
  maf?: string;
  /**
   * ייחוס מקור אחיד ומחייב (RULES 9.3.21): כל פריט שנשאב מחוזר המפמ״ר נושא
   * את הנוסח "מתוך חוזר מפמ״ר תשפ״ז, עמ׳ N" — אותו נוסח בכל השכבות.
   */
  source?: string;
  /** סיווג פדגוגי מנורמל של משאבי המקור החדשים */
  resourceType?: SourcePedagogicalType;
  /** אופן המסירה: דיגיטלי, להדפסה או משולב */
  delivery?: SourceDeliveryMode;
  /** שכבות, נושאי מקור ואוספים — מידע לולידציה ולדוחות שימור */
  grades?: SourceGrade[];
  sourceTopicIds?: string[];
  collections?: string[];
  sourceRecordIds?: string[];
  needsReview?: boolean;
  reviewReason?: string;
}

export interface ChoveretChapter {
  id: string;
  title: string;
  /** צבע חזק לבאנר הפרק (טקסט גדול-מודגש לבן עליו) */
  color: string;
  /** גוון כהה של אותו צבע — לטקסט קטן על לבן (AA) */
  dark: string;
  items: ChoveretItem[];
  /** נושא לימודי, אוסף פדגוגי או פרק מנהלי שאינו מוצג בחומרים */
  kind?: 'topic' | 'collection' | 'administrative';
  /** `false` משמר את המשאבים והמסלולים אך מוציא את הפרק מ"חומרים להוראה" */
  materials?: boolean;
  /** יעד תאימות למסלול ישן של פרק שאינו מוצג עוד */
  redirectHref?: string;
}

/**
 * עמוד ייעודי של השכבה שאינו משימה — יחידת הוראה מלאה או שער לאזור אחר
 * באתר (הוראת יניב, 06/08/2026). יעדים כאלה סותרים את זרימת המשימות ולכן
 * הועברו לעמוד המבוא של השכבה; הם לא נמחקו ולא איבדו את עמודם הקנוני.
 */
export interface GradePage {
  title: string;
  note: string;
  href: string;
  /** מניין אמיתי בלבד — נגזר מהנתונים, לא מספר ידני */
  count?: number;
}

export interface ChoveretGrade {
  slug: string;
  letter: string;
  /** צבע השכבה — ייחודי לכל שכבה (3.29) */
  color: string;
  /** גוון כהה לטקסט קטן על לבן (AA) */
  dark: string;
  title: string;
  /**
   * מזהי התוכנית והפריסה הרשמיות **הראשיות** של השכבה (תשפ״ז). עמוד המבוא
   * מציג להן שני כפתורים ישירים, ולכן הזיהוי מפורש ולא לפי מיקום במערך.
   * בכיתה ט׳ אלה המסלול הראשי — המסלול המצומצם נשאר פריט רגיל בפרק.
   */
  mainPlan?: string;
  mainPrisa?: string;
  chapters: ChoveretChapter[];
  /** יחידות ועמודים ייעודיים — מוצגים בעמוד המבוא, מחוץ לרשימת הנושאים */
  pages?: GradePage[];
}

// ===== Factory functions for existing items =====

const docPreview = (id: string) => `https://docs.google.com/document/d/${id}/preview`;
const docExport = (id: string) => `https://docs.google.com/document/d/${id}/export?format=pdf`;
const docUrl = (id: string) => `https://docs.google.com/document/d/${id}/edit`;
const doc = (id: string, gid: string, title: string, note: string): ChoveretItem => ({
  id,
  title,
  note,
  url: docUrl(gid),
  embed: docPreview(gid),
  download: docExport(gid),
  kind: 'doc',
});
const canva = (id: string, url: string, title: string, note: string): ChoveretItem => {
  const view = url.replace(/\/edit.*$/, '/view');
  return { id, title, note, url: view, embed: `${view}?embed`, kind: 'canva' };
};
/**
 * פרמטרי התצוגה של כל PDF בחוברת (הוראת יניב, 05/08/2026):
 * `toolbar=0&navpanes=0` מסלקים את סרגל ה-PDF השחור של הדפדפן, כך שהמסגור
 * הנראה הוא מסגרת הזכוכית נייבי-זהב של האתר (8.26); `view=FitH` פורס את
 * המסמך על מלוא רוחב הדף.
 */
export const PDF_VIEW = '#toolbar=0&navpanes=0&view=FitH';

const pdf = (id: string, url: string, title: string, note: string): ChoveretItem => ({
  id,
  title,
  note,
  url,
  embed: `${url}${PDF_VIEW}`,
  download: url,
  kind: 'pdf',
});
const drive = (id: string, fileId: string, title: string, note: string): ChoveretItem => ({
  id,
  title,
  note,
  url: `https://drive.google.com/file/d/${fileId}/view`,
  embed: `https://drive.google.com/file/d/${fileId}/preview`,
  download: `https://drive.google.com/uc?export=download&id=${fileId}`,
  kind: 'drive',
});
/** תיקיית Drive — מוטמעת חיה דרך embeddedfolderview (אומת: אין חסימת מסגרת) */
const folder = (id: string, folderId: string, title: string, note: string): ChoveretItem => ({
  id,
  title,
  note,
  url: `https://drive.google.com/drive/folders/${folderId}`,
  embed: `https://drive.google.com/embeddedfolderview?id=${folderId}#list`,
  kind: 'drive',
});
/**
 * תוכניות ופריסות תשפ״ז — הקובץ הרשמי plan&prisa.pdf (החוזר, עמ׳ 3) הוא המקור:
 * הקישור החי של משרד החינוך נשאר הקנוני (מועתק, משותף ונפתח במקור), וההטמעה
 * וההורדה מוגשות מעותק same-origin מאומת ב-/docs/ (RULES 8.26, 9.8).
 */
const TASHPAZ = 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz';
const gov = (
  id: string,
  remote: string,
  local: string,
  title: string,
  note: string,
  source = 'מתוך קובץ התוכניות והפריסות הרשמי שאליו מפנה חוזר מפמ״ר תשפ״ז, עמ׳ 3'
): ChoveretItem => ({
  id,
  title,
  note,
  url: `${TASHPAZ}/${remote}`,
  embed: `${local}${PDF_VIEW}`,
  download: local,
  kind: 'pdf',
  source,
});
/**
 * מקטע מאומת מתוך חוזר המפמ״ר כמשימה לכל דבר: העמודים של המקטע מוטמעים
 * בעמוד המשימה המחולק, ולוח הפעולות שלצדו נותן שיתוף, העתקה ופתיחה במקור
 * (הוראת יניב, 06/08/2026 — מחליף את קפיצת העוגן אל עמוד החוזר המלא).
 * `title` מאפשר לשמור את הכותרת המדויקת שהוצגה לשכבה.
 */
const maf = (id: string, sectionId: string, note: string, title?: string): ChoveretItem => {
  const s = mafmarSections.find((x) => x.id === sectionId)!;
  return {
    id,
    title: title ?? s.title,
    note,
    url: MAFMAR_URL,
    embed: `${MAFMAR_LOCAL}#page=${s.startPage}&toolbar=0&navpanes=0&view=FitH`,
    download: MAFMAR_LOCAL,
    kind: 'maf',
    maf: sectionId,
  };
};

/* ===== חומרי חוזר מפמ״ר תשפ״ז — נשאבו מהמסמך עצמו (RULES 9.3.21–9.3.24) =====
 * הקישורים חולצו מ-annotations של ה-PDF הרשמי (לא מטקסט מרונדר ולא מניחוש),
 * כל אחד שויך לעמוד ולעוגן שלו במסמך, וכולם נבדקו חיים ב-05/08/2026:
 * 200, סוג תוכן אמיתי, ומדיניות המסגור נבדקה לפני כל החלטת הטמעה. */

/** ייחוס אחיד — אותו נוסח בכל השכבות, עם עמוד המקור המדויק בחוזר */
const hz = (page: number) => `מתוך חוזר מפמ״ר תשפ״ז, עמ׳ ${page}`;

/** מסמך רשמי שהחוזר מקשר אליו — אומת: 200, %PDF אמיתי, בלי XFO/CSP חוסמים */
const hozerPdf = (id: string, url: string, title: string, note: string, page: number): ChoveretItem => ({
  id,
  title,
  note,
  url,
  embed: `${url}${PDF_VIEW}`,
  download: url,
  kind: 'pdf',
  source: hz(page),
});

/** אתר חי שהחוזר מקשר אליו ואומת כניתן להטמעה (בלי X-Frame-Options/CSP) */
const hozerSite = (id: string, url: string, title: string, note: string, page: number): ChoveretItem => ({
  id,
  title,
  note,
  url,
  embed: url,
  kind: 'site',
  source: hz(page),
});

/**
 * יעד שהחוזר מקשר אליו אך חוסם הטמעה (X-Frame-Options/CSP) — כרטיס פתיחה
 * אמיתי ולא מסגרת ריקה (RULES 8.8, 8.26).
 */
const hozerLink = (id: string, url: string, title: string, note: string, page: number): ChoveretItem => ({
  id,
  title,
  note,
  url,
  kind: 'link',
  source: hz(page),
});

const extractedDoc = (
  id: string,
  docId: string,
  title: string,
  note: string,
  source = 'מתוך מסמך משרד החינוך'
): ChoveretItem => ({
  id,
  title,
  note,
  url: `https://docs.google.com/document/d/${docId}/edit`,
  embed: `https://docs.google.com/document/d/${docId}/preview`,
  download: `https://docs.google.com/document/d/${docId}/export?format=pdf`,
  kind: 'doc',
  source,
});

// ===== Existing live-site items =====

/** שלושת האתרים שהיו בפרק `sites` — מפוצלים לפי התחום המתמטי שלהם.
 * misparim (מספרים מכוונים) → אלגברה.
 * tzirim (מערכת צירים) → אלגברה.
 * zaviyot (זוויות) → גאומטריה.
 * הכל מופיע רק פעם אחת בניווט, מסודר לפי תחום מתמטי, ללא קטגוריית "אתר חי". */
const misparimItem: ChoveretItem = {
  id: 'misparim',
  title: 'מספרים מכוונים',
  note: 'סביבה אינטראקטיבית להוראת מספרים מכוונים — מהצגת המושג ועד תרגול.',
  url: 'https://misparim.vercel.app/',
  embed: '/api/em/misparim/',
  kind: 'site',
};
const tzirimItem: ChoveretItem = {
  id: 'tzirim',
  title: 'מערכת צירים — רביע ראשון',
  note: 'סביבה להיכרות ראשונה עם מערכת צירים — נקודות ושיעורים ברביע הראשון.',
  url: 'https://yanivmizrachiy.github.io/coordinate-first-quadrant/',
  kind: 'site',
};
const zaviyotItem: ChoveretItem = {
  id: 'zaviyot',
  title: 'אתר זוויות',
  note: 'יחידה מלאה להוראת זוויות: מושגים, סוגים, מדידה ותרגול.',
  url: 'https://zaviyot.vercel.app/',
  embed: '/api/em/zaviyot/',
  kind: 'site',
};

// ===== Shared items used across multiple chapters =====

/* ===== חומרים משותפים לכל חט״ב (RULES 3.31, הוראת יניב 06/08/2026) =====
 * מה שמשרת באמת את שלוש הכיתות מוגדר פעם אחת כאן ומופיע בעמוד כל כיתה
 * מתאימה — לכן הוא נראה עד שלוש פעמים באתר, ואין עוד לשונית/עמוד "משותף
 * לכל השכבות" (klali). פריט המופיע בכמה כיתות נושא את אותו מזהה; כתובת
 * הקורא כוללת את השכבה (/reader/{שכבה}/{מזהה}) ולכן נשארת ייחודית. */

/** חומרי החוזר הכלליים לחט״ב (עמ׳ 9, 17) — מצורפים לפרק "מהחוזר הרשמי" בכל שכבה */
const sharedHozer: ChoveretItem[] = [
  hozerPdf(
    'amat-tashpaz',
    'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/amat.pdf',
    'התוכנית הייעודית עמ״ט ז׳–ט׳',
    'מסמך התוכנית הייעודית והפריסה לתלמידי ז׳–ט׳ בעתודה מדעית-טכנולוגית, מעודכן לשנת הלימודים תשפ״ז.',
    17
  ),
  hozerPdf(
    'hadracha-chatb',
    'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/contact.pdf',
    'צוות ההדרכה במתמטיקה חט״ב',
    'רשימת צוות ההדרכה הארצי והמחוזי במתמטיקה לחטיבת הביניים ודרכי ההתקשרות אליו.',
    9
  ),
  hozerSite(
    'merchav-chatb',
    'https://pop.education.gov.il/tchumey_daat/matmatika/chativat-beynayim/noseem_nilmadim/',
    'המרחב הפדגוגי — מתמטיקה חט״ב',
    'אתר המתמטיקה הארצי לחטיבת הביניים: מידע שוטף, פריסות הוראה וחומרי למידה.',
    9
  ),
  hozerLink(
    'merkaz-morim',
    'https://newhighmath.haifa.ac.il/index.php/home',
    'מרכז המורים למתמטיקה — אוניברסיטת חיפה',
    'מאגר עשיר של חומרים תומכי הוראה, בהתאם לדגשים של הפיקוח על הוראת המתמטיקה.',
    9
  ),
  hozerLink(
    'merkaz-morim-zt',
    'https://newhighmath.haifa.ac.il/index.php/2015-05-31-10-59-23/2015-05-31-11-11-57',
    'חומרי מרכז המורים לכיתות ז׳–ט׳',
    'החומרים של מרכז המורים בנושאים מגוונים, מסודרים לכיתות חטיבת הביניים.',
    9
  ),
  hozerLink(
    'merkaz-morim-peiluyot',
    'https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3277-2019-11-06-13-45-6',
    'פעילויות לחטיבת הביניים',
    'פעילויות שפותחו לכיתות חטיבת הביניים ומודגשים בהן קישורים בין תחומים במתמטיקה ומשלבות אוריינות מתמטית.',
    9
  ),
  hozerSite(
    'maor',
    'https://maor.haifa.ac.il/',
    'מאור — מתמטיקה אוריינית',
    'חומרי תוכנית מתמטיקה אוריינית המשולבים בקהילות עדכון תוכנית הלימודים, ותומכים בהטמעתה בכיתות ז׳–ט׳.',
    9
  ),
  hozerLink(
    'forum-facebook-chatb',
    'https://facebook.com/groups/324706402455298/',
    'פורום מורי המתמטיקה בחט״ב',
    'קבוצת הפייסבוק של הפיקוח — מקום לשאול שאלות בפורום מורים למתמטיקה של חטיבת הביניים.',
    9
  ),
];

/** דף נוסחאות ז׳–ח׳ — עותק לעריכה (מופיע בז׳ ובח׳) */
const noschaotCopy = doc(
  'noschaot-copy',
  '1PS4B4VwdZQk5S5BfjUzC2RtQ-9WEexRp',
  'נוסחאות ז׳–ח׳ — עותק לעריכה',
  'גרסת מסמך של דפי הנוסחאות — פתיחה במקור מאפשרת ליצור עותק אישי לעריכה.'
);

/** הנחיות מבחנים כלליות (בכל שכבה) */
const mivchanimHanchayot = drive(
  'mivchanim-hanchayot',
  '19edSXZCMSSnFVFvD6B4I-VKRqyGVNwcK',
  'הנחיות לכתיבת מבחנים',
  'מסמך ההנחיות המחוזי לכתיבת מבחן תקין והוגן.'
);
const sadnatHachana = drive(
  'sadnat-hachana',
  '1SX6ta5BpyhlZhxjFMPPcVuQgLJXgxsMH',
  'סדנת הכנה למבחן',
  'סדנה מוכנה להכנת התלמידים לקראת מבחן.'
);

/** משחקים משותפים (בכל שכבה) — משמשים גם כפריטים בפרקי המשחקים החדשים */
const mishakimSharedDocs: ChoveretItem[] = [
  extractedDoc(
    'mishakim-prisot',
    '1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M',
    'משחקים הצמודים לפריסות ההוראה',
    'לכל שלב בפריסת ההוראה — המשחק המתאים, מוכן לשיעור.',
    'מתוך משחקים מתמטיקה — משרד החינוך, תשפ״ז'
  ),
];
const mishakimTavnit: ChoveretItem = {
  id: 'mishakim-tavnit',
  title: 'משחקים לכיתות ז׳–ח׳ — תבנית',
  note: 'מאגר משחקים לפי נושאים — זוויות, מלבן, חפיפה, משוואות ופונקציות — מאת שילת דדשי, מדריכה אזורית במחוז. פתיחה במקור מאפשרת ליצור עותק לעריכה.',
  url: 'https://www.canva.com/design/DAF3dEaqSG8/TPgg_h9hz37GX09p6A4rWQ/edit',
  embed: 'https://www.canva.com/design/DAF3dEaqSG8/TPgg_h9hz37GX09p6A4rWQ/view?embed',
  kind: 'canva',
};
const hanukkaChoveret = drive(
  'hanukka-choveret',
  '1DBXCKHarZAuBCQreKrvxKUwDLa3k4IHF',
  'משחקי חנוכה — חוברת',
  'חוברת משחקי חנוכה מרוכזת — להדפסה ולמשחק מיידי.'
);

/** העשרה ואתרים (בכל שכבה) */
const haasharaItems: ChoveretItem[] = [
  canva(
    'parasha',
    'https://www.canva.com/design/DAGa9tq_uLQ/WtXuSJ80nCM8Ow9p7Gd9Eg/view',
    'מתמטיקה בפרשה שלי',
    'חיבור שבועי בין פרשת השבוע לחשיבה מתמטית.'
  ),
  {
    id: 'chinuch-meyuchad',
    title: 'אתר החינוך המיוחד המחוזי',
    note: 'סביבת ההעשרה האינטראקטיבית של החינוך המיוחד במחוז.',
    url: 'https://view.genially.com/652ba55030c0f100115d551e/interactive-content-',
    embed: 'https://view.genially.com/652ba55030c0f100115d551e',
    kind: 'site',
  },
  {
    id: 'al-haretzef',
    title: 'מתמטיקה על הרצף — מיכל דוד',
    note: 'אתר ההעשרה של מיכל דוד למתמטיקה על הרצף.',
    url: 'https://mathonthespectrum.my.canva.site/',
    kind: 'site',
  },
];

/** משאבי רוחב ולמידה דיגיטלית (בכל שכבה) */
const rohavShared: ChoveretItem[] = [
  {
    id: 'moodle-guide',
    title: 'אתר המודל — מדריך למורה',
    note: 'המדריך הרשמי למורה באתר המודל למתמטיקה.',
    url: 'https://sites.google.com/view/moodlemath/%D7%9E%D7%95%D7%A8%D7%99%D7%9D-%D7%95%D7%A6%D7%95%D7%95%D7%AA/%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%9C%D7%9E%D7%95%D7%A8%D7%94',
    kind: 'link',
  },
  {
    id: 'moodle-slides',
    title: 'מצגות מהמודל לפי נושאים',
    note: 'גיליון מרכז של כל המצגות לפי נושא.',
    url: 'https://docs.google.com/spreadsheets/d/1l8-7V7DMQSMkWNCFj3Y1OTnrJmaoOuRPWFkIP0a0_OE/edit',
    embed: 'https://docs.google.com/spreadsheets/d/1l8-7V7DMQSMkWNCFj3Y1OTnrJmaoOuRPWFkIP0a0_OE/preview',
    kind: 'doc',
  },
  extractedDoc(
    'ruach-tochnit',
    '1RYQQdKawSDPYYCDlUrm2MzcrNskv1SZQKHTNf8JJPuo',
    'חומרים ברוח התוכנית החדשה',
    'ריכוז חומרים מעודכנים ברוח התוכנית.',
    'מתוך חומרים לחטב ברוח תכנית הלימודים החדשה'
  ),
  canva(
    'sheelot-chashiva',
    'https://www.canva.com/design/DAGXwB1tskI/-SQYskyIRJmt8i4W8A806w/edit',
    'שאלות חשיבה מסדר גבוה',
    'אוסף שאלות חשיבה מוכן להוראה.'
  ),
];
/** לקראת מבחן תנופה — נושאים וקישורים (כיתה ט׳; תנופה נבחן בט׳) */
const kvatzimNosim = doc(
  'kvatzim-nosim',
  '1ILL7bpo4LLNmXfE0Kaz1ApoWmDIzk6ILDX3HpDeFd5o',
  'לקראת מבחן תנופה — נושאים וקישורים',
  'מאגר הנושאים והקישורים להכנה למבחן תנופה.'
);

// ===== Chapter builders and normalized source integration =====

const uniqueItems = (items: ChoveretItem[]): ChoveretItem[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const sourceToItem = (resource: SourceMaterialResource): ChoveretItem => ({
  id: resource.id,
  title: resource.title,
  note: resource.note,
  url: resource.url,
  embed: resource.embed,
  download: resource.download,
  kind: resource.kind,
  source: resource.source,
  resourceType: resource.resourceType,
  delivery: resource.delivery,
  grades: resource.grades,
  sourceTopicIds: resource.sourceTopicIds,
  collections: resource.collections,
  sourceRecordIds: resource.sourceRecordIds,
  needsReview: resource.needsReview,
  reviewReason: resource.reviewReason,
});

const sourceTopicItems = (grade: SourceGrade, chapterId: string) =>
  sourceMaterialsForTopic(grade, chapterId).map(sourceToItem);

const sourceCollectionItems = (grade: SourceGrade, chapterId: string) =>
  sourceMaterialsForCollection(grade, chapterId).map(sourceToItem);

/**
 * ארבעה יעדים שהופיעו בקטלוג העבודה המקומי אך אינם קיימים ב-146 רשומות
 * החילוץ המבוקר. הם נשמרים, מקבלים שכבה ונושא מפורשים לפי מיקומם ההיסטורי,
 * ומסומנים לבדיקה במקום להימחק או להיות מוצגים כמשאב מאומת.
 */
const legacyNeedsReview = (
  id: string,
  fileId: string,
  title: string,
  note: string,
  sourceTopicId: string
): ChoveretItem => ({
  id,
  title,
  note,
  url: `https://drive.google.com/file/d/${fileId}/view`,
  embed: `https://drive.google.com/file/d/${fileId}/preview`,
  download: `https://drive.google.com/uc?export=download&id=${fileId}`,
  kind: 'drive',
  source: 'נשמר מהקטלוג המקומי שקדם למיזוג המקורות',
  resourceType: 'game',
  delivery: 'printable',
  grades: ['z'],
  sourceTopicIds: [sourceTopicId],
  collections: ['mischakim'],
  needsReview: true,
  reviewReason: 'היעד הופיע בקטלוג המקומי אך לא נמצא במסמכי המקור שחולצו; יש לאמת את תוכן הקובץ ואת הכותרת לפני הסרת סימון הבדיקה.',
});

const legacyDistributionWar = legacyNeedsReview(
  'legacy-distribution-war',
  '0B58MLTJub4KV2xIZjJMTXZxR05sZ2t5QjV2bGx5T2t6OUFN',
  'מלחמה אלגברית — חוק הפילוג',
  'קלפים מוגדלים למלחמה אלגברית בנושא חוק הפילוג.',
  'z-expressions'
);
const legacyTrianglesRectangles = legacyNeedsReview(
  'legacy-triangles-rectangles',
  '1Hygy1Ar3pH9OBUrMLl4v8m2mY8vP3eXjR',
  'סביב משולשים ומלבנים',
  'משאב ותיק שסווג במערכת צירים; התוכן והשיוך המדויק דורשים אימות.',
  'z-coordinate-system'
);
const legacyEquationsPuzzle = legacyNeedsReview(
  'legacy-equations-puzzle',
  '0B58MLTJub4KS2xIZjJMTXZxR05sZ2t5QjV2bGx5T2t6OUFN',
  'משחק משוואות — פאזל',
  'פאזל לתרגול משוואות.',
  'z-equations'
);
const legacyEquationsCards = legacyNeedsReview(
  'legacy-equations-cards',
  '0B58MLTJub4KMGxfT2xHVzREVFBMcEk0elBoRE4yU212OFh3',
  'תרגילי משוואות — קלפים',
  'קלפים לתרגול משוואות.',
  'z-equations'
);

export const legacyNeedsReviewItems: ChoveretItem[] = [
  legacyDistributionWar,
  legacyTrianglesRectangles,
  legacyEquationsPuzzle,
  legacyEquationsCards,
];

const topicChapter = (
  id: string,
  title: string,
  color: string,
  dark: string,
  items: ChoveretItem[]
): ChoveretChapter => ({
  id,
  title,
  color,
  dark,
  kind: 'topic',
  items: uniqueItems(items),
});

const collectionChapter = (
  id: string,
  title: string,
  color: string,
  dark: string,
  items: ChoveretItem[]
): ChoveretChapter => ({
  id,
  title,
  color,
  dark,
  kind: 'collection',
  items: uniqueItems(items),
});

const administrativeChapter = (
  id: string,
  title: string,
  redirectHref: string,
  items: ChoveretItem[]
): ChoveretChapter => ({
  id,
  title,
  color: '#64748b',
  dark: '#475569',
  kind: 'administrative',
  materials: false,
  redirectHref,
  items: uniqueItems(items),
});

const noschaotChapter = (letter: string, items: ChoveretItem[]) =>
  collectionChapter('noschaot', `דפי נוסחאות לכיתה ${letter}`, '#be185d', '#9d174d', items);

const mivchanimChapter = (letter: string, items: ChoveretItem[]) =>
  collectionChapter('mivchanim', `מבחנים לכיתה ${letter}`, '#c2410c', '#9a3412', items);

const sikumimChapter = (grade: SourceGrade, letter: string) =>
  collectionChapter(
    'sikumim',
    `משימות סיכום לשכבת ${letter}`,
    '#2563eb',
    '#1d4ed8',
    sourceCollectionItems(grade, 'sikumim')
  );

const mishakimChapter = (grade: SourceGrade, letter: string, items: ChoveretItem[]) =>
  collectionChapter(
    'mischakim',
    `משחקים לכיתה ${letter}`,
    '#059669',
    '#047857',
    [...items, ...sourceCollectionItems(grade, 'mischakim')]
  );

const haasharaChapter = (grade: SourceGrade, letter: string) =>
  collectionChapter(
    'haashara',
    `העשרה מתמטית לכיתה ${letter}`,
    '#7c3aed',
    '#6d28d9',
    [...haasharaItems, ...sourceCollectionItems(grade, 'haashara')]
  );

const maagarimChapter = (grade: SourceGrade, letter: string, items: ChoveretItem[]) =>
  collectionChapter(
    'maagarim',
    `מאגרי הוראה לכיתה ${letter}`,
    '#0d9488',
    '#0f766e',
    [...items, ...sourceCollectionItems(grade, 'maagarim')]
  );

// ===== Existing topic resources retained from the pre-migration catalog =====

const mechuvanimTavnit = canva(
  'mechuvanim-tavnit',
  'https://www.canva.com/design/DAF4MgAMjRg/e6QN_h0zEVqOJPtRQjyJHw/edit',
  'פעולות במספרים מכוונים — תבנית',
  'תבנית עבודה לפעולות במספרים מכוונים.'
);
const pilug = canva(
  'pilug',
  'https://www.canva.com/design/DAGPDbvr6iU/7he5iyBvtlJgsjic2Ucy4A/view',
  'חוק הפילוג ושיטת הרשת',
  'תבנית הוראה ויזואלית לחוק הפילוג.'
);
const ahuzim = canva(
  'ahuzim',
  'https://www.canva.com/design/DAF9_Xrvh6Q/mVYOMINxUghHUcwfpt2-eg/view',
  'הוראת אחוזים — מצגת',
  'מצגת ויזואלית להוראת אחוזים.'
);
const kavitFlip: ChoveretItem = {
  id: 'kavit-flip',
  title: 'חוברת פונקציה קווית',
  note: 'חוברת דפדוף אינטראקטיבית לנושא הפונקציה הקווית.',
  url: 'https://heyzine.com/flip-book/8a267e4232.html',
  embed: 'https://heyzine.com/flip-book/8a267e4232.html',
  kind: 'flip',
};
const kavitTavnit = canva(
  'kavit-tavnit',
  'https://www.canva.com/design/DAFzg6Naayw/KeCuPV3438_wq4WHOOylwg/edit',
  'הוראת פונקציה קווית — תבנית',
  'תבנית הוראה ויזואלית לפונקציה הקווית.'
);
const dema = canva(
  'dema',
  'https://www.canva.com/design/DAGZcMbg0x8/WM5X1ydiUJ4XtX2Z9Sh9cA/view',
  'מבחני דמה למהלך השנה',
  'אוסף מבחני דמה מוכנים לשימוש.'
);
const kdamAnaliza = doc(
  'kdam-analiza',
  '1E4K9BLDyxieZkniWbBwNVV0TWNitIdkt',
  'קדם־אנליזה — מגרף לתכונות',
  'משימות לפיתוח חוש לפונקציות ולקריאת תכונות מתוך גרף.'
);
const sheelotT = doc(
  'sheelot-t',
  '11Prx5DTCwHhYFqLTWduW6v3SOZH9jYTrOglg5HkDSck',
  'שאלות קצרות ט׳',
  'מאגר שאלות קצרות לתרגול שוטף.'
);

// ===== Exact top-level topic index required for Grades 7–9 =====

const Z_A = '#dc2626', Z_A_D = '#b91c1c';
const Z_G = '#0891b2', Z_G_D = '#0e7490';

const z_directed_numbers = topicChapter(
  'z-directed-numbers',
  'מספרים מכוונים',
  Z_A,
  Z_A_D,
  [misparimItem, ...sourceTopicItems('z', 'z-directed-numbers')]
);
const z_coordinate_system = topicChapter(
  'z-coordinate-system',
  'מערכת צירים',
  Z_A,
  Z_A_D,
  [tzirimItem, legacyTrianglesRectangles, ...sourceTopicItems('z', 'z-coordinate-system')]
);
const z_expressions = topicChapter(
  'z-expressions',
  'ביטויים אלגבריים וחוק הפילוג',
  Z_A,
  Z_A_D,
  [mechuvanimTavnit, pilug, legacyDistributionWar, ...sourceTopicItems('z', 'z-expressions')]
);
const z_equations = topicChapter(
  'z-equations',
  'משוואות',
  Z_A,
  Z_A_D,
  [legacyEquationsPuzzle, legacyEquationsCards, ...sourceTopicItems('z', 'z-equations')]
);
const z_percentages = topicChapter(
  'z-percentages',
  'אחוזים',
  Z_A,
  Z_A_D,
  [ahuzim, ...sourceTopicItems('z', 'z-percentages')]
);
const z_order = topicChapter(
  'z-order-operations',
  'סדר פעולות חשבון',
  Z_A,
  Z_A_D,
  sourceTopicItems('z', 'z-order-operations')
);
const z_angles = topicChapter(
  'z-angles',
  'זוויות',
  Z_G,
  Z_G_D,
  [zaviyotItem, ...sourceTopicItems('z', 'z-angles')]
);
const z_areas = topicChapter(
  'z-areas-perimeters',
  'שטחים והיקפים',
  Z_G,
  Z_G_D,
  sourceTopicItems('z', 'z-areas-perimeters')
);
const z_box = topicChapter('z-box-cube', 'תיבה וקובייה', Z_G, Z_G_D, sourceTopicItems('z', 'z-box-cube'));
const z_circle = topicChapter('z-circle', 'מעגל', Z_G, Z_G_D, sourceTopicItems('z', 'z-circle'));

const H_A = '#059669', H_A_D = '#047857';
const H_G = '#0891b2', H_G_D = '#0e7490';

const h_linear = topicChapter(
  'h-linear-function',
  'פונקציה קווית',
  H_A,
  H_A_D,
  [kavitFlip, kavitTavnit, dema, ...sourceTopicItems('h', 'h-linear-function')]
);
const h_equations = topicChapter('h-equations', 'משוואות', H_A, H_A_D, sourceTopicItems('h', 'h-equations'));
const h_systems = topicChapter('h-systems', 'מערכת משוואות', H_A, H_A_D, sourceTopicItems('h', 'h-systems'));
const h_percentages = topicChapter(
  'h-percentages',
  'אחוזים ושאלות מילוליות',
  H_A,
  H_A_D,
  sourceTopicItems('h', 'h-percentages')
);
const h_inequalities = topicChapter(
  'h-inequalities',
  'אי־שוויונות',
  H_A,
  H_A_D,
  sourceTopicItems('h', 'h-inequalities')
);
const h_stats = topicChapter(
  'h-statistics',
  'סטטיסטיקה וקריאת גרפים',
  H_A,
  H_A_D,
  sourceTopicItems('h', 'h-statistics')
);
const h_congruent = topicChapter(
  'h-congruent',
  'חפיפת משולשים',
  H_G,
  H_G_D,
  sourceTopicItems('h', 'h-congruent')
);
const h_similar = topicChapter(
  'h-similar',
  'דמיון משולשים',
  H_G,
  H_G_D,
  sourceTopicItems('h', 'h-similar')
);
const h_parallel = topicChapter(
  'h-parallel',
  'ישרים מקבילים',
  H_G,
  H_G_D,
  sourceTopicItems('h', 'h-parallel')
);
const h_pythagoras = topicChapter(
  'h-areas-pythagoras',
  'שטחים, היקפים ומשפט פיתגורס',
  H_G,
  H_G_D,
  sourceTopicItems('h', 'h-areas-pythagoras')
);
const h_coordinate_geometry = topicChapter(
  'h-coordinate-geometry',
  'גאומטריה במערכת צירים',
  H_G,
  H_G_D,
  sourceTopicItems('h', 'h-coordinate-geometry')
);
const h_angles = topicChapter('h-angles', 'זוויות', H_G, H_G_D, sourceTopicItems('h', 'h-angles'));

const T_A = '#ea580c', T_A_D = '#b45309';
const T_G = '#7c3aed', T_G_D = '#6d28d9';

const t_technique = topicChapter(
  't-technique',
  'טכניקה אלגברית',
  T_A,
  T_A_D,
  sourceTopicItems('t', 't-technique')
);
const t_preanalysis = topicChapter(
  't-preanalysis',
  'פונקציות וקדם־אנליזה',
  T_A,
  T_A_D,
  [kdamAnaliza, ...sourceTopicItems('t', 't-preanalysis')]
);
const t_quadratic = topicChapter(
  't-quadratic',
  'פונקציה ריבועית',
  T_A,
  T_A_D,
  sourceTopicItems('t', 't-quadratic')
);
const t_literacy = topicChapter(
  't-literacy',
  'קריאת גרפים ומשימות אורייניות',
  T_A,
  T_A_D,
  [sheelotT, ...sourceTopicItems('t', 't-literacy')]
);
const t_quadrilaterals = topicChapter(
  't-quadrilaterals',
  'מרובעים',
  T_G,
  T_G_D,
  sourceTopicItems('t', 't-quadrilaterals')
);
const t_kite = topicChapter('t-kite', 'דלתון', T_G, T_G_D, sourceTopicItems('t', 't-kite'));
const t_trapezoid = topicChapter('t-trapezoid', 'טרפז', T_G, T_G_D, sourceTopicItems('t', 't-trapezoid'));
const t_parallelogram = topicChapter(
  't-parallelogram',
  'מקבילית',
  T_G,
  T_G_D,
  sourceTopicItems('t', 't-parallelogram')
);
const t_rect_rhomb = topicChapter(
  't-rectangle-rhombus',
  'מלבן ומעוין',
  T_G,
  T_G_D,
  sourceTopicItems('t', 't-rectangle-rhombus')
);
const t_coordinate_geometry = topicChapter(
  't-coordinate-geometry',
  'גאומטריה במערכת צירים',
  T_G,
  T_G_D,
  sourceTopicItems('t', 't-coordinate-geometry')
);
const t_simi_pyt = topicChapter(
  't-similarity-pythagoras',
  'דמיון משולשים ומשפט פיתגורס',
  T_G,
  T_G_D,
  sourceTopicItems('t', 't-similarity-pythagoras')
);
const t_proofs = topicChapter(
  't-proofs',
  'משפטים והוכחות בגאומטריה',
  T_G,
  T_G_D,
  sourceTopicItems('t', 't-proofs')
);

// ===== Resources intentionally kept outside Grade 9 Teaching Materials =====

const kdamAlgebra = hozerPdf(
  'kdam-algebra',
  'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpah/algebraic%20profile%204%20unit.pdf',
  'טכניקה אלגברית — הכנה ל־4 יח״ל',
  'דרישות המינימום בטכניקה אלגברית לקראת לימודי 4 יח״ל בחטיבה העליונה.',
  8
);
const kdamFunctions = hozerPdf(
  'kdam-functions',
  'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpah/functions%20profile%204%20unit.pdf',
  'פונקציות — הכנה ל־4 יח״ל',
  'דרישות המינימום בפונקציות לקראת לימודי 4 יח״ל בחטיבה העליונה.',
  8
);
const kdamGeometry = hozerPdf(
  'kdam-geometry',
  'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpah/geometry%20profile%204%20units.pdf',
  'גאומטריה — הכנה ל־4 יח״ל',
  'דרישות המינימום בגאומטריה לקראת לימודי 4 יח״ל בחטיבה העליונה.',
  8
);
const graphTeacher = hozerPdf(
  'graph-teacher',
  'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpav/graph-teacher.pdf',
  'מתכונות לגרף ובחזרה — מדריך למורה',
  'חומר מעבר בקדם־אנליזה לקראת החטיבה העליונה.',
  8
);

export const upperSecondaryTransitionItems: ChoveretItem[] = uniqueItems([
  kdamAlgebra,
  kdamFunctions,
  kdamGeometry,
  graphTeacher,
  ...sourceUpperSecondaryTransitionResources.map(sourceToItem),
]);

const mifratTnufa = pdf(
  'mifrat-tnufa',
  'https://meyda.education.gov.il/files/Rama/Mifrat_Math_LangH_9_26.pdf',
  'מפרט מבחן תנופה — ראמ״ה',
  'המפרט הרשמי של מבחן תנופה ט׳ (25.11.26).'
);
const tnufaRama = hozerLink(
  'tnufa-rama',
  'https://rama.edu.gov.il/assessments/tnufa-math-9-2026',
  'עמוד מבחן תנופה באתר ראמ״ה',
  'העמוד הרשמי של מבחן תנופה במתמטיקה לכיתה ט׳.',
  8
);
const tnufaMankal = hozerLink(
  'tnufa-mankal',
  'https://apps.education.gov.il/Mankal/horaa.aspx?siduri=589#_Toc256000008',
  'מבחן תנופה — חוזר מנכ״ל',
  'הפרטים המלאים על מבחן תנופה בחוזר מנכ״ל.',
  8
);

// ===== Final catalog =====

export const choveret: ChoveretGrade[] = [
  {
    slug: 'z',
    mainPlan: 'tochnit-z',
    mainPrisa: 'prisa-z',
    color: '#1d7ed8',
    dark: '#155fa8',
    letter: 'ז׳',
    title: 'מתמטיקה לכיתה ז׳',
    // יחידת "הוראת משוואות ללא מספרים שליליים" אינה עוד כרטיס ייעודי כאן:
    // כל חומריה חיים בתוך הנושא הקנוני `z-equations` (canonical-content.ts),
    // והכתובת הישנה מפנה אליו ב-301 (src/lib/legacyRedirects.mjs).
    chapters: [
      administrativeChapter('hozer', 'מהחוזר הרשמי', '/hozer-mafmar/', [
        maf('maf-02', 'MAF-02', ''),
        hozerLink(
          'tochnit-limudim-z',
          'https://pop.education.gov.il/tchumey_daat/matmatika/chativat-beynayim/teaching-mathematics/tohnit-limudim/',
          'תוכנית הלימודים המעודכנת ז׳–ח׳',
          'עדכון תוכנית הלימודים לכיתות ז׳ ו-ח׳ פורסם במרחב הפדגוגי; בתשפ״ז כל תלמידי ז׳ לומדים לפיו.',
          3
        ),
        gov(
          'prisot-pdf',
          'plan%26prisa.pdf',
          '/docs/plan-prisa-tashpaz.pdf',
          'פריסות ההוראה תשפ״ז',
          'טבלת התוכניות והפריסות הרשמית לכל שכבות ז׳–ט׳.',
          hz(3)
        ),
        maf('maf-05-z', 'MAF-05', '', 'משימות הערכה ומבחן מפמ״ר ז׳'),
        maf('maf-06-z', 'MAF-06', '', 'Moodle — הפלטפורמה המחייבת בז׳'),
        maf('maf-08-z', 'MAF-08', '', 'ספרי הלימוד החדשים'),
        ...sharedHozer,
      ]),
      z_directed_numbers,
      z_coordinate_system,
      z_expressions,
      z_equations,
      z_percentages,
      z_order,
      z_angles,
      z_areas,
      z_box,
      z_circle,
      administrativeChapter('tichnun', 'תכנון והוראה', '/chativat-beynayim/kita-z/#ma-melamdim', [
        gov('tochnit-z', 'plan_7.pdf', '/docs/plan-7-tashpaz.pdf', 'תוכנית הוראה ז׳', 'התוכנית הרשמית לתשפ״ז — חלוקת הנושאים והשעות לפי חודשים.'),
        gov('prisa-z', 'prisa_7.pdf', '/docs/prisa-7-tashpaz.pdf', 'פריסת הוראה ז׳', 'הפריסה הרשמית לתשפ״ז — פירוט הנושאים וחומרי הלמידה לאורך השנה.'),
      ]),
      noschaotChapter('ז׳', [
        drive('noschaot-z', '1nJdVkTlZvnulYiabkeVZG0BT6ek1lU0c', 'דף נוסחאות כיתה ז׳', 'דף הנוסחאות הרשמי לכיתה ז׳ — לצפייה, להורדה ולהדפסה.'),
        noschaotCopy,
      ]),
      mivchanimChapter('ז׳', [mivchanimHanchayot, sadnatHachana]),
      sikumimChapter('z', 'ז׳'),
      mishakimChapter('z', 'ז׳', [
        ...mishakimSharedDocs,
        mishakimTavnit,
        hanukkaChoveret,
        ...legacyNeedsReviewItems,
        folder('hanukka-z', '1CO-6MbihZaNkHT34kbYuB3YKliuOitgV', 'משחקי חנוכה לכיתה ז׳ — תיקייה', 'תיקיית Drive עם משחקי חנוכה לכיתה ז׳.'),
      ]),
      haasharaChapter('z', 'ז׳'),
      maagarimChapter('z', 'ז׳', [...rohavShared]),
    ],
  },
  {
    slug: 'h',
    mainPlan: 'tochnit-h',
    mainPrisa: 'prisa-h',
    color: '#059669',
    dark: '#047857',
    letter: 'ח׳',
    title: 'מתמטיקה לכיתה ח׳',
    // יחידת "חפיפת משולשים" אינה עוד כרטיס ייעודי כאן: כל חומריה חיים בתוך
    // הנושא הקנוני `h-congruent`, והכתובת הישנה מפנה אליו ב-301.
    chapters: [
      administrativeChapter('hozer', 'מהחוזר הרשמי', '/hozer-mafmar/', [
        maf('maf-03', 'MAF-03', ''),
        hozerLink(
          'tochnit-limudim-h',
          'https://pop.education.gov.il/tchumey_daat/matmatika/chativat-beynayim/teaching-mathematics/tohnit-limudim/',
          'תוכנית הלימודים המעודכנת ז׳–ח׳',
          'עדכון תוכנית הלימודים לכיתות ז׳ ו-ח׳ פורסם במרחב הפדגוגי.',
          3
        ),
        gov(
          'prisot-pdf-h',
          'plan%26prisa.pdf',
          '/docs/plan-prisa-tashpaz.pdf',
          'פריסות ההוראה תשפ״ז',
          'טבלת התוכניות והפריסות הרשמית לכל שכבות ז׳–ט׳.',
          hz(3)
        ),
        maf('maf-05-h', 'MAF-05', '', 'משימות הערכה ומבחן מפמ״ר ח׳'),
        maf('maf-06-h', 'MAF-06', '', 'Moodle — הפלטפורמה המחייבת בח׳'),
        maf('maf-09-h', 'MAF-09', '', 'חלוקה לרמות והדרכה'),
        ...sharedHozer,
      ]),
      h_linear,
      h_equations,
      h_systems,
      h_percentages,
      h_inequalities,
      h_stats,
      h_congruent,
      h_similar,
      h_parallel,
      h_pythagoras,
      h_coordinate_geometry,
      h_angles,
      administrativeChapter('tichnun', 'תכנון והוראה', '/chativat-beynayim/kita-h/#ma-melamdim', [
        gov('tochnit-h', 'plan_8.pdf', '/docs/plan-8-tashpaz.pdf', 'תוכנית הוראה ח׳', 'התוכנית הרשמית לתשפ״ז — מותאמת לתוכנית המעודכנת שנלמדה בכיתה ז׳.'),
        gov('prisa-h', 'prisa_8.pdf', '/docs/prisa-8-tashpaz.pdf', 'פריסת הוראה ח׳', 'הפריסה הרשמית לתשפ״ז — שנת המעבר בין התוכנית הקיימת למעודכנת.'),
        {
          id: 'ishi-plus',
          title: 'תוכנית אישי פלוס',
          note: 'קובץ התוכנית המלא מכונן Drive.',
          url: 'https://drive.google.com/file/d/11qeHERvoqEVXI2G8L0FxME6rHHw4w_KC/view',
          embed: 'https://drive.google.com/file/d/11qeHERvoqEVXI2G8L0FxME6rHHw4w_KC/preview',
          download: 'https://drive.google.com/uc?export=download&id=11qeHERvoqEVXI2G8L0FxME6rHHw4w_KC',
          kind: 'drive',
        },
      ]),
      noschaotChapter('ח׳', [
        drive('noschaot-h', '1hf30qH4SbS7UxRlkmrFiitDhdoDFt90B', 'דף נוסחאות כיתה ח׳', 'דף הנוסחאות הרשמי לכיתה ח׳ — לצפייה, להורדה ולהדפסה.'),
        noschaotCopy,
      ]),
      mivchanimChapter('ח׳', [
        doc('meitzav-demo', '1-F8gCF7V9X1afsr2D5vOLdgq8DC1OzlH', 'מבחן דמוי מיצ״ב', 'מבחן מלא במתכונת מיצ״ב — מוכן להדפסה ולהעברה בכיתה.'),
        doc('meitzav-machvan', '10eruHhJRK6HX3nvD17tAypCTqNoC83WD', 'מחוון למבחן דמוי מיצ״ב', 'המחוון המלא של המבחן — ניקוד מפורט לכל שאלה.'),
        mivchanimHanchayot,
        sadnatHachana,
      ]),
      sikumimChapter('h', 'ח׳'),
      mishakimChapter('h', 'ח׳', [
        ...mishakimSharedDocs,
        mishakimTavnit,
        hanukkaChoveret,
      ]),
      haasharaChapter('h', 'ח׳'),
      maagarimChapter('h', 'ח׳', [...rohavShared]),
    ],
  },
  {
    slug: 't',
    mainPlan: 'tochnit-t',
    mainPrisa: 'prisa-t',
    color: '#ea580c',
    dark: '#b45309',
    letter: 'ט׳',
    title: 'מתמטיקה לכיתה ט׳',
    pages: [
      {
        title: 'הכנה למעבר ל־4 יח״ל',
        note: 'חומרי המעבר נשמרו באזור נפרד ואינם מופיעים בתוך חומרי כיתה ט׳.',
        href: '/chativat-beynayim/maavar-4-yahal/',
        count: upperSecondaryTransitionItems.length,
      },
      {
        title: 'שער החטיבה העליונה',
        // בשלב זה עמוד הכניסה לחטיבה העליונה הוא עמוד המתנה; הניסוח כאן
        // אומר את המצב כפי שהוא ואינו מבטיח תוכן שאינו על המסך (4.6, 8.25)
        note: 'ההמשך הטבעי של כיתה ט׳. עמוד הכניסה לחטיבה העליונה יתעדכן בהמשך.',
        href: '/chativa-elyona/',
      },
    ],
    chapters: [
      administrativeChapter('hozer', 'מהחוזר הרשמי', '/hozer-mafmar/', [
        maf('maf-04', 'MAF-04', ''),
        maf('maf-10', 'MAF-10', ''),
        hozerPdf(
          'tochnit-limudim-t',
          'https://meyda.education.gov.il/files/Curriculum/math_7_9.pdf',
          'תוכנית הלימודים ז׳–ט׳ (לפני העדכון)',
          'בתשפ״ז תלמידי כיתה ט׳ לומדים על פי תוכנית הלימודים שלפני העדכון.',
          3
        ),
        gov(
          'prisot-pdf-t',
          'plan%26prisa.pdf',
          '/docs/plan-prisa-tashpaz.pdf',
          'פריסות ההוראה תשפ״ז',
          'טבלת התוכניות והפריסות הרשמית לכל שכבות ז׳–ט׳.',
          hz(3)
        ),
        gov('tochnit-t', 'plan_9A.pdf', '/docs/plan-9a-tashpaz.pdf', 'תוכנית הוראה ט׳', 'התוכנית הרשמית לתשפ״ז — מותאמת לכיתה ט׳ לפני העדכון.'),
        gov('prisa-t', 'prisa_9A.pdf', '/docs/prisa-9a-tashpaz.pdf', 'פריסת הוראה ט׳', 'הפריסה הרשמית לתשפ״ז — פירוט הנושאים וחומרי הלמידה לאורך השנה.'),
        maf('maf-05-t', 'MAF-05', '', 'מבחן תנופה והערכה בחט״ב'),
        maf('maf-06-t', 'MAF-06', '', 'Moodle — שני מרחבים בכיתה ט׳'),
        ...sharedHozer,
      ]),
      t_technique,
      t_preanalysis,
      t_quadratic,
      t_literacy,
      t_quadrilaterals,
      t_kite,
      t_trapezoid,
      t_parallelogram,
      t_rect_rhomb,
      t_coordinate_geometry,
      t_simi_pyt,
      t_proofs,
      administrativeChapter('yahal4', 'הכנה ל־4 יח״ל', '/chativat-beynayim/maavar-4-yahal/', upperSecondaryTransitionItems),
      administrativeChapter('hamshech', 'מבחן תנופה והמעבר לחטיבה העליונה', '/chativat-beynayim/nose/t/mivchanim/', []),
      noschaotChapter('ט׳', [
        drive('noschaot-t', '1UJJeoCAomVPNp4PN3FsBhCbfaqcSxL1G', 'דף נוסחאות כיתה ט׳', 'דף הנוסחאות הרשמי לכיתה ט׳ — לצפייה, להורדה ולהדפסה.'),
      ]),
      mivchanimChapter('ט׳', [
        mifratTnufa,
        tnufaRama,
        tnufaMankal,
        kvatzimNosim,
        mivchanimHanchayot,
        sadnatHachana,
      ]),
      sikumimChapter('t', 'ט׳'),
      mishakimChapter('t', 'ט׳', [...mishakimSharedDocs, hanukkaChoveret]),
      haasharaChapter('t', 'ט׳'),
      maagarimChapter('t', 'ט׳', [...rohavShared]),
    ],
  },
];

/** הפרקים המוצגים ב"חומרים להוראה" — ללא חוזר, תכנון או שער מעבר */
export const materialChapters = (grade: ChoveretGrade) =>
  grade.chapters.filter((chapter) => chapter.materials !== false);

const uniqueEntriesByItemId = (
  entries: { grade: ChoveretGrade; chapter: ChoveretChapter; item: ChoveretItem }[]
) => {
  const seen = new Set<string>();
  return entries.filter(({ grade, item }) => {
    const key = `${grade.slug}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/** כל פריטי הקורא, כולל פרקים מנהליים מוסתרים — מסלול קנוני אחד לכל פריט ושכבה */
export const readerItems = uniqueEntriesByItemId(
  choveret.flatMap((grade) =>
    grade.chapters.flatMap((chapter) =>
      chapter.items
        .filter((item) => !item.pageHref)
        .map((item) => ({ grade, chapter, item }))
    )
  )
);

/** מניין משאבים קנוניים שמוצגים בחומרי כל שכבה — ללא ספירת הצבה כפולה */
export const gradeCounts = Object.fromEntries(
  choveret.map((grade) => [
    grade.slug,
    new Set(materialChapters(grade).flatMap((chapter) => chapter.items.map((item) => item.id))).size,
  ])
) as Record<string, number>;

/** הכתובת הקנונית של עמוד השכבה */
export const gradeHref = (slug: string) => `/chativat-beynayim/kita-${slug}/`;

/** הכתובת הקנונית של פריט: עמוד פנימי אם יש, אחרת עמוד המשאב */
export const itemHref = (gradeSlug: string, item: ChoveretItem) =>
  item.pageHref ?? `/chativat-beynayim/reader/${gradeSlug}/${item.id}/`;

/** התווית הגלויה של השכבה — "כיתה ז׳" */
export const gradeLabel = (grade: ChoveretGrade) => `כיתה ${grade.letter}`;

export const gradeBySlug = (slug: string) => choveret.find((grade) => grade.slug === slug);

/** תצוגת החומרים של השכבה — מסלול-בן של עמוד המבוא */
export const gradeMaterialsHref = (slug: string) => `/chativat-beynayim/kita-${slug}/chomarim/`;

/** עמוד נושא או אוסף */
export const chapterHref = (gradeSlug: string, chapterId: string) =>
  `/chativat-beynayim/nose/${gradeSlug}/${chapterId}/`;

/**
 * כל צמדי שכבה־פרק: גם פרקים מנהליים נבנים כדי שמסלולים ישנים יפנו
 * ב־301 ליעד הנכון במקום להפוך ל־404.
 */
export const chapterPaths = choveret.flatMap((grade) =>
  grade.chapters.map((chapter) => ({ grade, chapter }))
);

/** הנושא/האוסף הקודם והבא בתוך תצוגת החומרים בלבד */
export function chapterNeighbours(grade: ChoveretGrade, chapterId: string) {
  const chapters = materialChapters(grade);
  const index = chapters.findIndex((chapter) => chapter.id === chapterId);
  return {
    prev: index > 0 ? chapters[index - 1] : undefined,
    next: index >= 0 && index < chapters.length - 1 ? chapters[index + 1] : undefined,
  };
}

/** התוכנית והפריסה הראשיות של השכבה — גם כשהן בפרק מנהלי מוסתר */
export function gradeMainDocs(grade: ChoveretGrade) {
  const all = grade.chapters.flatMap((chapter) => chapter.items.map((item) => ({ chapter, item })));
  const byId = (id?: string) => (id ? all.find((entry) => entry.item.id === id) : undefined);
  return { plan: byId(grade.mainPlan), prisa: byId(grade.mainPrisa) };
}

/** סדר קריאה פדגוגי: רק המשאבים המוצגים בחומרים, ללא כפילויות אוסף/נושא */
export const gradeReading = (grade: ChoveretGrade) => {
  const entries = materialChapters(grade).flatMap((chapter) =>
    chapter.items
      .filter((item) => !item.pageHref)
      .map((item) => ({ grade, chapter, item }))
  );
  return uniqueEntriesByItemId(entries);
};

/** השכן הקודם והבא של פריט בתוך השכבה */
export function itemNeighbours(grade: ChoveretGrade, itemId: string) {
  const list = gradeReading(grade);
  const index = list.findIndex((entry) => entry.item.id === itemId);
  return {
    prev: index > 0 ? list[index - 1] : undefined,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
  };
}

/** דוח שימור בר־בדיקה, נגזר מן הקטלוג ולא ממספר ידני */
const finalCanonicalIds = new Set([
  ...choveret.flatMap((grade) => grade.chapters.flatMap((chapter) => chapter.items.map((item) => item.id))),
  ...sourceNeedsReviewResources.map((resource) => resource.id),
  ...legacyNeedsReviewItems.map((item) => item.id),
]);

export const materialsConservationReport = {
  ...sourceCatalogConservation,
  sourceLinkLedgerRecords: sourceLinkLedger.length,
  sourceNoLinkRows: sourceNoLinkRows.length,
  existingCanonicalResources: [...finalCanonicalIds].filter(
    (id) => !id.startsWith('src-') && !legacyNeedsReviewItems.some((item) => item.id === id)
  ).length,
  sourceCanonicalResources: sourceMaterialResources.length,
  retainedLegacyReviewResources: legacyNeedsReviewItems.length,
  finalCanonicalResourcesIncludingReview: finalCanonicalIds.size,
  visibleCanonicalByGrade: gradeCounts,
  unresolvedReviewResources: [
    ...sourceNeedsReviewResources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      reason: resource.reviewReason,
    })),
    ...legacyNeedsReviewItems.map((item) => ({
      id: item.id,
      title: item.title,
      reason: item.reviewReason,
    })),
  ],
  equation:
    'existing canonical resources + canonical source resources + retained legacy review resources = final canonical resources; source duplicate merge, exclusions and unresolved evidence are recorded explicitly',
} as const;

export const kindLabel: Record<ItemKind, string> = {
  site: 'פעילות אינטראקטיבית',
  doc: 'מסמך',
  drive: 'קובץ',
  pdf: 'PDF',
  canva: 'מצגת',
  flip: 'חוברת דפדוף',
  maf: 'מתוך החוזר',
  link: 'קישור',
};
