/**
 * הספר המדפדף המרכזי (RULES 3.29, הוראת יניב 03/08/2026):
 * מקור אחד לכל חומרי השכבות — השער הוא עמוד הכפתורים, כל שכבה היא תוכן
 * עניינים צבעוני, וכל משאב נפתח בקורא מסך-מפוצל. אין רשימות חומרים
 * מקבילות בעמודי ה-astro; הכול נגזר מכאן.
 */
import { grade7Resources } from './resources';
import { MAFMAR_URL, MAFMAR_LOCAL, mafmarSections } from './mafmar';

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
  /** פריט שהוא עמוד פנימי — נפתח בעמוד שלו ולא בקורא */
  pageHref?: string;
  /** למקטעי חוזר: מזהה MAF */
  maf?: string;
}

export interface ChoveretChapter {
  id: string;
  title: string;
  /** צבע חזק לבאנר הפרק (טקסט גדול-מודגש לבן עליו) */
  color: string;
  /** גוון כהה של אותו צבע — לטקסט קטן על לבן (AA) */
  dark: string;
  items: ChoveretItem[];
}

export interface ChoveretGrade {
  slug: string;
  letter: string;
  /** צבע השכבה — ייחודי לכל שכבה (3.29) */
  color: string;
  /** גוון כהה לטקסט קטן על לבן (AA) */
  dark: string;
  title: string;
  chapters: ChoveretChapter[];
}

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
const pdf = (id: string, url: string, title: string, note: string): ChoveretItem => ({
  id,
  title,
  note,
  url,
  embed: url,
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
const gov = (id: string, remote: string, local: string, title: string, note: string): ChoveretItem => ({
  id,
  title,
  note,
  url: `${TASHPAZ}/${remote}`,
  embed: `${local}#view=FitH`,
  download: local,
  kind: 'pdf',
});
const maf = (id: string, sectionId: string, note: string): ChoveretItem => {
  const s = mafmarSections.find((x) => x.id === sectionId)!;
  return {
    id,
    title: s.title,
    note,
    url: MAFMAR_URL,
    embed: `${MAFMAR_LOCAL}#page=${s.startPage}&view=FitH`,
    download: MAFMAR_LOCAL,
    kind: 'maf',
    maf: sectionId,
  };
};
const hozerAnchor = (id: string, mafId: string, title: string): ChoveretItem => ({
  id,
  title,
  note: 'מקטע מאומת בתוך עמוד החוזר המלא.',
  url: `/hozer-mafmar/#${mafId}`,
  kind: 'link',
  pageHref: `/hozer-mafmar/#${mafId}`,
});

const siteItems: ChoveretItem[] = [...grade7Resources]
  .sort((a, b) => a.order - b.order)
  .map((r) => ({
    id: r.id,
    title: r.title,
    note: r.short,
    url: r.url,
    embed: r.embedUrl ?? r.url,
    kind: 'site' as const,
  }));

export const choveret: ChoveretGrade[] = [
  {
    slug: 'z',
    color: '#1d7ed8',
    dark: '#155fa8',
    letter: 'ז׳',
    title: 'מתמטיקה לכיתה ז׳',
    chapters: [
      {
        id: 'hozer',
        title: 'מהחוזר הרשמי',
        color: '#d90429',
        dark: '#b3001b',
        items: [maf('maf-02', 'MAF-02', '')],
      },
      {
        id: 'sites',
        title: 'האתרים החיים של השכבה',
        color: '#1d7ed8',
        dark: '#155fa8',
        items: siteItems,
      },
      {
        id: 'unit',
        title: 'יחידת הדגל',
        color: '#059669',
        dark: '#047857',
        items: [
          {
            id: 'mishvaot',
            title: 'הוראת משוואות ללא מספרים שליליים',
            note: '19 קבצים בנגן יחידה אחד — המחשות, שקילות, פתרון ומשחק.',
            url: '/chativat-beynayim/mishvaot/',
            kind: 'link',
            pageHref: '/chativat-beynayim/mishvaot/',
          },
        ],
      },
      {
        id: 'tichnun',
        title: 'תכנון והוראה',
        color: '#ea580c',
        dark: '#b45309',
        items: [
          gov('tochnit-z', 'plan_7.pdf', '/docs/plan-7-tashpaz.pdf', 'תוכנית הוראה ז׳', 'התוכנית הרשמית לתשפ״ז — חלוקת הנושאים והשעות לפי חודשים.'),
          gov('prisa-z', 'prisa_7.pdf', '/docs/prisa-7-tashpaz.pdf', 'פריסת הוראה ז׳', 'הפריסה הרשמית לתשפ״ז — פירוט הנושאים וחומרי הלמידה לאורך השנה.'),
          canva('ahuzim', 'https://www.canva.com/design/DAF9_Xrvh6Q/mVYOMINxUghHUcwfpt2-eg/view', 'הוראת אחוזים — מצגת', 'מצגת הוראה מלאה לנושא האחוזים.'),
          canva('pilug', 'https://www.canva.com/design/DAGPDbvr6iU/7he5iyBvtlJgsjic2Ucy4A/view', 'חוק הפילוג ושיטת הרשת', 'תבנית הוראה ויזואלית לחוק הפילוג.'),
          canva('mechuvanim-tavnit', 'https://www.canva.com/design/DAF4MgAMjRg/e6QN_h0zEVqOJPtRQjyJHw/edit', 'פעולות במספרים מכוונים — תבנית', 'תבנית עבודה לפעולות במספרים מכוונים.'),
        ],
      },
      {
        id: 'od',
        title: 'עוד בחוזר על ז׳ וחט״ב',
        color: '#7c3aed',
        dark: '#6d28d9',
        items: [
          gov('prisot-pdf', 'plan%26prisa.pdf', '/docs/plan-prisa-tashpaz.pdf', 'פריסות ההוראה תשפ״ז', 'טבלת התוכניות והפריסות הרשמית (החוזר, עמ׳ 3); פריסות עמ״ט יתווספו בה במהלך השנה.'),
          hozerAnchor('maf-05-z', 'MAF-05', 'אירועי הערכה ומבחנים בחט״ב'),
          hozerAnchor('maf-06-z', 'MAF-06', 'Moodle ולמידה דיגיטלית'),
          hozerAnchor('maf-08-z', 'MAF-08', 'חומרי למידה וספרי לימוד'),
        ],
      },
    ],
  },
  {
    slug: 'h',
    color: '#059669',
    dark: '#047857',
    letter: 'ח׳',
    title: 'מתמטיקה לכיתה ח׳',
    chapters: [
      {
        id: 'hozer',
        title: 'מהחוזר הרשמי',
        color: '#d90429',
        dark: '#b3001b',
        items: [maf('maf-03', 'MAF-03', '')],
      },
      {
        id: 'unit',
        title: 'יחידת הדגל',
        color: '#059669',
        dark: '#047857',
        items: [
          {
            id: 'hafifa',
            title: 'חפיפת משולשים',
            note: '26 קבצים — שלושת משפטי החפיפה, תרגול מדורג, הוכחות ובוחן מסכם.',
            url: '/chativat-beynayim/hafifat-meshulashim/',
            kind: 'link',
            pageHref: '/chativat-beynayim/hafifat-meshulashim/',
          },
        ],
      },
      {
        id: 'tichnun',
        title: 'תכנון והוראה',
        color: '#ea580c',
        dark: '#b45309',
        items: [
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
          {
            id: 'kavit-flip',
            title: 'חוברת פונקציה קווית',
            note: 'חוברת דפדוף אינטראקטיבית לנושא הפונקציה הקווית.',
            url: 'https://heyzine.com/flip-book/8a267e4232.html',
            embed: 'https://heyzine.com/flip-book/8a267e4232.html',
            kind: 'flip',
          },
          canva('kavit-tavnit', 'https://www.canva.com/design/DAFzg6Naayw/KeCuPV3438_wq4WHOOylwg/edit', 'הוראת פונקציה קווית — תבנית', 'תבנית הוראה ויזואלית לפונקציה הקווית.'),
          canva('dema', 'https://www.canva.com/design/DAGZcMbg0x8/WM5X1ydiUJ4XtX2Z9Sh9cA/view', 'מבחני דמה למהלך השנה', 'אוסף מבחני דמה מוכנים לשימוש.'),
        ],
      },
      {
        id: 'od',
        title: 'עוד בחוזר על ח׳ וחט״ב',
        color: '#7c3aed',
        dark: '#6d28d9',
        items: [
          gov('prisot-pdf-h', 'plan%26prisa.pdf', '/docs/plan-prisa-tashpaz.pdf', 'פריסות ההוראה תשפ״ז', 'טבלת התוכניות והפריסות הרשמית (החוזר, עמ׳ 3); פריסות עמ״ט יתווספו בה במהלך השנה.'),
          hozerAnchor('maf-05-h', 'MAF-05', 'אירועי הערכה ומבחני מפמ״ר'),
          hozerAnchor('maf-06-h', 'MAF-06', 'Moodle ולמידה דיגיטלית'),
          hozerAnchor('maf-09-h', 'MAF-09', 'חלוקה לרמות והדרכה'),
        ],
      },
    ],
  },
  {
    slug: 't',
    color: '#ea580c',
    dark: '#b45309',
    letter: 'ט׳',
    title: 'מתמטיקה לכיתה ט׳',
    chapters: [
      {
        id: 'hozer',
        title: 'מהחוזר הרשמי',
        color: '#d90429',
        dark: '#b3001b',
        items: [
          maf('maf-04', 'MAF-04', ''),
          maf('maf-10', 'MAF-10', ''),
        ],
      },
      {
        id: 'tichnun',
        title: 'תכנון והוראה',
        color: '#ea580c',
        dark: '#b45309',
        items: [
          gov('tochnit-t', 'plan_9A.pdf', '/docs/plan-9a-tashpaz.pdf', 'תוכנית הוראה ט׳', 'התוכנית הרשמית לתשפ״ז — חלוקת הנושאים והשעות לפי חודשים.'),
          gov('prisa-t', 'prisa_9A.pdf', '/docs/prisa-9a-tashpaz.pdf', 'פריסת הוראה ט׳', 'הפריסה הרשמית לתשפ״ז — עם דגשי ההכנה לרמת 4 יח״ל.'),
          gov('tochnit-t-m', 'plan_9B.pdf', '/docs/plan-9b-tashpaz.pdf', 'תוכנית ט׳ מצומצמת', 'המסלול המצומצם הרשמי לתשפ״ז (עד 25% מהשכבה; החוזר, עמ׳ 7).'),
          gov('prisa-t-m', 'prisa_9B.pdf', '/docs/prisa-9b-tashpaz.pdf', 'פריסת ט׳ מצומצמת', 'הפריסה הרשמית לתשפ״ז למסלול המצומצם — לקראת 3 יח״ל.'),
          doc('kdam-analiza', '1E4K9BLDyxieZkniWbBwNVV0TWNitIdkt', 'קדם־אנליזה — מגרף לתכונות', 'החומר המחוזי לקדם־אנליזה.'),
          doc('sheelot-t', '11Prx5DTCwHhYFqLTWduW6v3SOZH9jYTrOglg5HkDSck', 'שאלות קצרות ט׳', 'מאגר שאלות קצרות לתרגול שוטף.'),
        ],
      },
      {
        id: 'yahal4',
        title: 'הכנה ל־4 יח״ל',
        color: '#0d9488',
        dark: '#0f766e',
        items: [
          pdf('kdam-algebra', 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpah/algebraic%20profile%204%20unit.pdf', 'טכניקה אלגברית', 'פרופיל הטכניקה האלגברית הנדרש ל-4 יח״ל.'),
          pdf('kdam-functions', 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpah/functions%20profile%204%20unit.pdf', 'פונקציות', 'פרופיל הפונקציות הנדרש ל-4 יח״ל.'),
          pdf('kdam-geometry', 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpah/geometry%20profile%204%20units.pdf', 'גאומטריה', 'פרופיל הגאומטריה הנדרש ל-4 יח״ל.'),
          gov('prisot-pdf-t', 'plan%26prisa.pdf', '/docs/plan-prisa-tashpaz.pdf', 'פריסות ההוראה תשפ״ז', 'טבלת התוכניות והפריסות הרשמית (החוזר, עמ׳ 3); פריסות עמ״ט יתווספו בה במהלך השנה.'),
        ],
      },
      {
        id: 'hamshech',
        title: 'ממשיכים לחטיבה העליונה',
        color: '#7c3aed',
        dark: '#6d28d9',
        items: [
          {
            id: 'gate-elyona',
            title: 'שער החטיבה העליונה',
            note: 'כל חומרי החטיבה העליונה באתר.',
            url: '/chativa-elyona/',
            kind: 'link',
            pageHref: '/chativa-elyona/',
          },
          pdf('mifrat-tnufa', 'https://meyda.education.gov.il/files/Rama/Mifrat_Math_LangH_9_26.pdf', 'מפרט מבחן תנופה — ראמ״ה', 'המפרט הרשמי של מבחן תנופה ט׳ (25.11.26).'),
          {
            id: 'rama-page',
            title: 'עמוד תנופה באתר ראמ״ה',
            note: 'עמוד המבחן הרשמי — נפתח באתר ראמ״ה.',
            url: 'https://rama.edu.gov.il/assessments/tnufa-math-heb-9-2026',
            kind: 'link',
          },
          hozerAnchor('maf-05-t', 'MAF-05', 'מבחן תנופה והערכה בחט״ב'),
        ],
      },
    ],
  },
  {
    slug: 'klali',
    color: '#7c3aed',
    dark: '#6d28d9',
    letter: 'כללי',
    title: 'משותף לכל השכבות',
    chapters: [
      {
        id: 'noschaot',
        title: 'דפי הנוסחאות הרשמיים',
        color: '#be185d',
        dark: '#9d174d',
        items: [
          drive('noschaot-z', '1nJdVkTlZvnulYiabkeVZG0BT6ek1lU0c', 'דף נוסחאות כיתה ז׳', 'דף הנוסחאות הרשמי לכיתה ז׳ — לצפייה, להורדה ולהדפסה.'),
          drive('noschaot-h', '1hf30qH4SbS7UxRlkmrFiitDhdoDFt90B', 'דף נוסחאות כיתה ח׳', 'דף הנוסחאות הרשמי לכיתה ח׳ — לצפייה, להורדה ולהדפסה.'),
          drive('noschaot-t', '1UJJeoCAomVPNp4PN3FsBhCbfaqcSxL1G', 'דף נוסחאות כיתה ט׳', 'דף הנוסחאות הרשמי לכיתה ט׳ — לצפייה, להורדה ולהדפסה.'),
          doc('noschaot-copy', '1PS4B4VwdZQk5S5BfjUzC2RtQ-9WEexRp', 'נוסחאות ז׳–ח׳ — עותק לעריכה', 'גרסת מסמך של דפי הנוסחאות — פתיחה במקור מאפשרת ליצור עותק אישי לעריכה.'),
        ],
      },
      {
        id: 'meitzav',
        title: 'מבחן דמוי מיצ״ב והנחיות',
        color: '#c2410c',
        dark: '#9a3412',
        items: [
          doc('meitzav-demo', '1-F8gCF7V9X1afsr2D5vOLdgq8DC1OzlH', 'מבחן דמוי מיצ״ב', 'מבחן מלא במתכונת מיצ״ב — מוכן להדפסה ולהעברה בכיתה.'),
          doc('meitzav-machvan', '10eruHhJRK6HX3nvD17tAypCTqNoC83WD', 'מחוון למבחן דמוי מיצ״ב', 'המחוון המלא של המבחן — ניקוד מפורט לכל שאלה.'),
          drive('mivchanim-hanchayot', '19edSXZCMSSnFVFvD6B4I-VKRqyGVNwcK', 'הנחיות לכתיבת מבחנים', 'מסמך ההנחיות המחוזי לכתיבת מבחן תקין והוגן.'),
          drive('sadnat-hachana', '1SX6ta5BpyhlZhxjFMPPcVuQgLJXgxsMH', 'סדנת הכנה למבחן', 'סדנה מוכנה להכנת התלמידים לקראת מבחן.'),
          hozerAnchor('maf-05-klali', 'MAF-05', 'אירועי הערכה ומבחנים בחוזר'),
        ],
      },
      {
        id: 'mischakim',
        title: 'משחקים לאורך השנה',
        color: '#059669',
        dark: '#047857',
        items: [
          doc('mischakim-prisot', '1AQNue5voom-CuO3opIJMjQoIzy5Ryl1dXPLd-c8IW-M', 'משחקים הצמודים לפריסות ההוראה', 'לכל שלב בפריסת ההוראה — המשחק המתאים, מוכן לשיעור.'),
          {
            id: 'mischakim-tavnit',
            title: 'משחקים לכיתות ז׳–ח׳ — תבנית',
            note: 'מאגר משחקים לפי נושאים — זוויות, מלבן, חפיפה, משוואות ופונקציות — מאת שילת דדשי, מדריכה אזורית במחוז. פתיחה במקור מאפשרת ליצור עותק לעריכה.',
            url: 'https://www.canva.com/design/DAF3dEaqSG8/TPgg_h9hz37GX09p6A4rWQ/edit',
            embed: 'https://www.canva.com/design/DAF3dEaqSG8/TPgg_h9hz37GX09p6A4rWQ/view?embed',
            kind: 'canva',
          },
          drive('hanukka-choveret', '1DBXCKHarZAuBCQreKrvxKUwDLa3k4IHF', 'משחקי חנוכה — חוברת', 'חוברת משחקי חנוכה מרוכזת — להדפסה ולמשחק מיידי.'),
          folder('hanukka-z', '1CO-6MbihZaNkHT34kbYuB3YKliuOitgV', 'משחקי חנוכה לכיתה ז׳ — תיקייה', 'תיקיית Drive עם משחקי חנוכה לכיתה ז׳ — כל קובץ נפתח בלחיצה.'),
          folder('hanukka-h', '1Sv2iLXVFe_QYhe_3hEIAqCuN_YrlLM7A', 'משחקי חנוכה לכיתה ח׳ — תיקייה', 'תיקיית Drive עם משחקי חנוכה לכיתה ח׳ — כל קובץ נפתח בלחיצה.'),
        ],
      },
      {
        id: 'haashara',
        title: 'העשרה ואתרים',
        color: '#7c3aed',
        dark: '#6d28d9',
        items: [
          canva('parasha', 'https://www.canva.com/design/DAGa9tq_uLQ/WtXuSJ80nCM8Ow9p7Gd9Eg/view', 'מתמטיקה בפרשה שלי', 'חיבור שבועי בין פרשת השבוע לחשיבה מתמטית.'),
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
        ],
      },
      {
        id: 'rohav',
        title: 'משאבי רוחב ולמידה דיגיטלית',
        color: '#0d9488',
        dark: '#0f766e',
        items: [
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
          doc('ruach-tochnit', '1RYQQdKawSDPYYCDlUrm2MzcrNskv1SZQKHTNf8JJPuo', 'חומרים ברוח התוכנית החדשה', 'ריכוז חומרים מעודכנים ברוח התוכנית.'),
          doc('kvatzim-nosim', '1ILL7bpo4LLNmXfE0Kaz1ApoWmDIzk6ILDX3HpDeFd5o', 'לקראת מבחן תנופה — נושאים וקישורים', 'מאגר הנושאים והקישורים להכנה למבחן תנופה.'),
          canva('sheelot-chashiva', 'https://www.canva.com/design/DAGXwB1tskI/-SQYskyIRJmt8i4W8A806w/edit', 'שאלות חשיבה מסדר גבוה', 'אוסף שאלות חשיבה מוכן להוראה.'),
        ],
      },
    ],
  },
];

/** כל פריטי הקורא (בלי פריטי pageHref) — ל-getStaticPaths */
export const readerItems = choveret.flatMap((g) =>
  g.chapters.flatMap((ch) =>
    ch.items
      .filter((it) => !it.pageHref)
      .map((it) => ({ grade: g, chapter: ch, item: it }))
  )
);

/** מניין אמיתי לכרטיסי השער (3.27) — נגזר מהחוברת עצמה */
export const gradeCounts = Object.fromEntries(
  choveret.map((g) => [g.slug, g.chapters.reduce((n, c) => n + c.items.length, 0)])
) as Record<'z' | 'h' | 't', number>;
