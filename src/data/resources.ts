/** משאבים קנוניים שאושרו ב־RULES §9, עם מסלול קנוני יחיד (3.23). */
export interface CanonicalResource {
  id: string;
  title: string;
  /** הכתובת הקנונית של המשאב עצמו */
  url: string;
  /** נתיב העמוד הקנוני באתר */
  path: string;
  grade: string;
  domain: string;
  topic: string;
  accent: string;
  short: string;
  purpose: string;
  usage: string;
  /** סדר פדגוגי לניווט קודם/הבא (5.12) */
  order: number;
}

export const grade7Resources: CanonicalResource[] = [
  {
    id: 'misparim',
    title: 'מספרים מכוונים',
    url: 'https://misparim.vercel.app/',
    path: '/chativat-beynayim/misparim-mechuvanim/',
    grade: 'כיתה ז׳',
    domain: 'תחום מספרי',
    topic: 'מספרים מכוונים',
    accent: 'var(--terracotta)',
    short: 'סביבה אינטראקטיבית להוראת מספרים מכוונים — מהצגת המושג ועד תרגול.',
    purpose:
      'בניית הבנה של מספרים חיוביים ושליליים, ציר המספרים, השוואה ופעולות — בעזרת המחשות ותרגול מקוון.',
    usage:
      'מתאים להקרנה בכיתה, לעבודה פרטנית של תלמידים ולשיעורי בית. אפשר לנווט בין היחידות ישירות בתוך הסביבה.',
    order: 1,
  },
  {
    id: 'zaviyot',
    title: 'אתר זוויות',
    url: 'https://zaviyot.vercel.app/',
    path: '/chativat-beynayim/zaviyot/',
    grade: 'כיתה ז׳',
    domain: 'גאומטריה',
    topic: 'יסודות הגאומטריה — זוויות',
    accent: 'var(--sky)',
    short: 'יחידה מלאה להוראת זוויות: מושגים, סוגי זוויות, מדידה ותרגול.',
    purpose:
      'היכרות עם מושג הזווית, סוגי הזוויות, מדידה במעלות ויחסים בין זוויות — בסביבה חזותית ומדויקת.',
    usage:
      'מומלץ ללוות את ההוראה הפרונטלית בהמחשות מתוך האתר, ולתת לתלמידים לתרגל בסביבה באופן עצמאי.',
    order: 2,
  },
  {
    id: 'tzirim',
    title: 'מערכת צירים — רביע ראשון',
    url: 'https://yanivmizrachiy.github.io/coordinate-first-quadrant/',
    path: '/chativat-beynayim/maarechet-tzirim/',
    grade: 'כיתה ז׳',
    domain: 'מערכת צירים',
    topic: 'רביע ראשון',
    accent: 'var(--lilac)',
    short: 'סביבה להיכרות ראשונה עם מערכת צירים — נקודות ושיעורים ברביע הראשון.',
    purpose:
      'פיתוח שליטה בקריאת נקודות וסימונן ברביע הראשון, כבסיס להרחבה לכל המישור ולקשר עם אלגברה וגאומטריה.',
    usage:
      'מתאים לפתיחת הנושא בכיתה ולתרגול אישי. הסביבה מגיבה למגע ולעכבר ומתאימה גם ללוח חכם.',
    order: 3,
  },
];

/** קבוצת ה־WhatsApp — קהילת מורים ותקשורת (9.2, 3.4) */
export const whatsappCommunity = {
  url: 'https://chat.whatsapp.com/L9P0Z6BFevZHzgdURMmfIK',
} as const;

/** אתר ההמחשות של איילת — משבצת מרכזית בעמוד הראשי (9.1, 3.3) */
export const hamchashot = {
  title: 'איילת קריספין — אתר המחשות',
  url: 'https://mamhishim.my.canva.site/',
} as const;
