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
  title: string;
  intro: string;
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
    letter: 'ז׳',
    title: 'מתמטיקה לכיתה ז׳',
    intro: 'השכבה הראשונה בתוכנית המעודכנת — Moodle מחייבת, ספרים חדשים ופרויקט 720.',
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
        title: 'תכנון והוראה מחוזי',
        color: '#ea580c',
        dark: '#b45309',
        items: [
          doc('tochnit-z', '14KjhWbFLH_xACivC32ETs0jyN7CwWadX9Q0NzxkclwY', 'תוכנית הוראה ז׳', 'התוכנית המחוזית המלאה לשכבה.'),
          doc('prisa-z', '17bGFCtZjygxCWsj3Dya8la4trFfW2QYq', 'פריסת הוראה ז׳', 'פריסה שבועית מעשית לאורך השנה.'),
          doc('prisa-z-amat', '1Fyy98IMHRtDoex4RhrPbUWDgCxE3vzhM', 'פריסת ז׳ עמ״ט', 'הפריסה למסלול עתודה מדעית-טכנולוגית.'),
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
          pdf('prisot-pdf', 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/plan%26prisa.pdf', 'פריסות ההוראה תשפ״ז', 'קובץ הפריסות הרשמי של משרד החינוך (החוזר, עמ׳ 3).'),
          hozerAnchor('maf-05-z', 'MAF-05', 'אירועי הערכה ומבחנים בחט״ב'),
          hozerAnchor('maf-06-z', 'MAF-06', 'Moodle ולמידה דיגיטלית'),
          hozerAnchor('maf-08-z', 'MAF-08', 'חומרי למידה וספרי לימוד'),
        ],
      },
    ],
  },
  {
    slug: 'h',
    letter: 'ח׳',
    title: 'מתמטיקה לכיתה ח׳',
    intro: 'שנת התאמה: פריסה ארצית מיוחדת, Moodle מחייבת ומשימות הערכה — והנושאים יופיעו בתנופה ט׳ של תשפ״ח.',
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
        title: 'תכנון והוראה מחוזי',
        color: '#ea580c',
        dark: '#b45309',
        items: [
          doc('tochnit-h', '1X0eGs1fvFdvk6429mCfYcIvDQeuGGa1BzHAmxI4dQrg', 'תוכנית הוראה ח׳', 'התוכנית המחוזית המלאה לשכבה.'),
          doc('prisa-h', '1l40XxpILIZPGNqPBkCDAfUcJR5Njl1JP', 'פריסת הוראה ח׳', 'הפריסה הארצית המיוחדת של שנת ההתאמה.'),
          doc('prisa-h-amat', '1kFCQt_dIwtvRK4gjC3mVNEQmxENRCppC', 'פריסת ח׳ עמ״ט', 'הפריסה למסלול עתודה מדעית-טכנולוגית.'),
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
          pdf('prisot-pdf-h', 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/plan%26prisa.pdf', 'פריסות ההוראה תשפ״ז', 'קובץ הפריסות הרשמי של משרד החינוך (החוזר, עמ׳ 3).'),
          hozerAnchor('maf-05-h', 'MAF-05', 'אירועי הערכה ומבחני מפמ״ר'),
          hozerAnchor('maf-06-h', 'MAF-06', 'Moodle ולמידה דיגיטלית'),
          hozerAnchor('maf-09-h', 'MAF-09', 'חלוקה לרמות והדרכה'),
        ],
      },
    ],
  },
  {
    slug: 't',
    letter: 'ט׳',
    title: 'מתמטיקה לכיתה ט׳',
    intro: 'שתי פריסות — רגילה ומצומצמת, קדם־אנליזה, מבחן תנופה 25.11.26 והשיבוץ לרמות 3/4/5.',
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
        title: 'תכנון והוראה מחוזי',
        color: '#ea580c',
        dark: '#b45309',
        items: [
          doc('tochnit-t', '1M0xtCJTqiOZEyYsG4SOZIZU8FsbnO2X6iuqGeBB9_dA', 'תוכנית הוראה ט׳', 'התוכנית המחוזית המלאה לשכבה.'),
          doc('prisa-t', '1mLDtQqvYkOX3tQLdC9AcPVjeC36jodXJzzGP-gZ_0oI', 'פריסת הוראה ט׳', 'הפריסה הרגילה לאורך השנה.'),
          doc('tochnit-t-m', '1hVEXoMaz55Bh0TbCZlJBDIYs7T-MM-sRSHu1zbd2Qjk', 'תוכנית ט׳ מצומצמת', 'המסלול המצומצם הרשמי (עד 25% מהשכבה; החוזר, עמ׳ 7).'),
          doc('prisa-t-m', '1sjF0sQTi9xZeNpDaZ-gOzhqLP4KGRy1Fr5zeCcYC168', 'פריסת ט׳ מצומצמת', 'הפריסה למסלול המצומצם.'),
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
          pdf('prisot-pdf-t', 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpaz/plan%26prisa.pdf', 'פריסות ההוראה תשפ״ז', 'קובץ הפריסות הרשמי של משרד החינוך.'),
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
    letter: 'כללי',
    title: 'משותף לכל השכבות',
    intro: 'מבחנים והערכה, משחקים והעשרה ומשאבי הרוחב הדיגיטליים — לכל כיתות ז׳–ט׳.',
    chapters: [
      {
        id: 'mivchanim',
        title: 'מבחנים והערכה',
        color: '#be185d',
        dark: '#9d174d',
        items: [
          {
            id: 'mivchanim',
            title: 'בחינות והערכה — נוסחאות והנחיות',
            note: '7 קבצים — דפי הנוסחאות לכל שכבה, מבחן דמוי מיצ״ב עם מחוון והנחיות.',
            url: '/chativat-beynayim/mivchanim/',
            kind: 'link',
            pageHref: '/chativat-beynayim/mivchanim/',
          },
        ],
      },
      {
        id: 'mischakim',
        title: 'משחקים והעשרה',
        color: '#059669',
        dark: '#047857',
        items: [
          {
            id: 'mischakim',
            title: 'משחקים והעשרה',
            note: '8 קבצים — משחקים לפי הפריסות, חנוכה, מתמטיקה בפרשה ואתרי העשרה.',
            url: '/chativat-beynayim/mischakim/',
            kind: 'link',
            pageHref: '/chativat-beynayim/mischakim/',
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
          doc('amat-nosim', '1u98c3VxZYCvuy9LPV-MzZyLKzYB6vI1I', 'נושאי עמ״ט לפי שכבות', 'מיפוי נושאי עתודה מדעית-טכנולוגית.'),
          doc('tochen-chova', '1D4JdPdoOMc23XgMCbAv24D28tW7VkUyoK19U3ZVHAQE', 'תכני חובה לפי חודשים', 'פריסת תכני החובה על פני השנה.'),
          doc('kvatzim-nosim', '1ILL7bpo4LLNmXfE0Kaz1ApoWmDIzk6ILDX3HpDeFd5o', 'קבצים לפי נושאים', 'מאגר קבצים מסודר לפי נושא.'),
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
