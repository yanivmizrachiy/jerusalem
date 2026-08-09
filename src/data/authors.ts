import { authorAssignments } from './author-assignments';

export { authorAssignments } from './author-assignments';

export type AuthorKind = 'person' | 'organization';

export interface AuthorRecord {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  kind: AuthorKind;
  pageEligible: boolean;
  role?: string;
}

/**
 * מקור אמת לישויות יוצרים/מחברים. מוסיפים לכאן רק ייחוס שניתן לאמת.
 * גופים יכולים להופיע כייחוס בלי לקבל עמוד מחבר אישי.
 */
export const authors: AuthorRecord[] = [
  {
    id: 'ministry-of-education',
    slug: 'misrad-hachinuch',
    name: 'משרד החינוך',
    aliases: ['משרד החינוך'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'weizmann-integrated-math',
    slug: 'weizmann-integrated-math',
    name: 'מתמטיקה משולבת — מכון ויצמן',
    aliases: ['מתמטיקה משולבת-מכון ויצמן', 'מתמטיקה משולבת — מכון ויצמן'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'national-primary-teachers-center',
    slug: 'national-primary-teachers-center',
    name: 'מרכז ארצי למורים יסודי',
    aliases: ['מרכז ארצי למורים יסודי'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'underground',
    slug: 'underground',
    name: 'underground',
    aliases: ['underground'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    // אומת ישירות על ידי בעל הפרויקט עבור moodle-guide / moodle-slides.
    // נשמר בדיוק כפי שנמסר; אין להרחיב alias כללי ל"צוות המודל" בלי ראיה
    // שמדובר באותה ישות שמופיעה בקרדיטים אחרים בקטלוג.
    id: 'model-team',
    slug: 'tzevet-model',
    name: 'צוות מודל — משרד החינוך',
    aliases: ['צוות מודל — משרד החינוך', 'צוות מודל - משרד החינוך'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'rama',
    slug: 'rama',
    name: 'ראמ״ה — הרשות הארצית למדידה והערכה בחינוך',
    aliases: ['ראמ״ה', 'ראמ"ה'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'haifa-teachers-center',
    slug: 'haifa-teachers-center',
    name: 'מרכז המורים למתמטיקה — אוניברסיטת חיפה',
    aliases: ['מרכז המורים למתמטיקה', 'מרכז מורים', 'מרכז המורים'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'maor-literate-math',
    slug: 'maor-literate-math',
    name: 'מאור — מתמטיקה אוריינית',
    aliases: ['מאור', 'מאור — מתמטיקה אוריינית'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    // הקרדיט במסמך המקור הוא "צוות המודל". לא מוסיפים "חטיבת הביניים"
    // ולא מאחדים עם model-team עד שתהיה ראיה מפורשת שמדובר באותה ישות.
    id: 'model-team-middle-school',
    slug: 'model-team-middle-school',
    name: 'צוות המודל',
    aliases: ['צוות המודל'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'national-math-guidance-team',
    slug: 'national-math-guidance-team',
    name: 'צוות ההדרכה הארצי במתמטיקה — חטיבת הביניים',
    aliases: ['צוות ההדרכה הארצי במתמטיקה חט"ב', 'צוות ההדרכה הארצי'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'achva-college',
    slug: 'achva-college',
    name: 'מכללת אחווה',
    aliases: ['מכללת אחווה'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'jerusalem-district-math',
    slug: 'jerusalem-district-math',
    name: 'הדרכת מתמטיקה — מחוז ירושלים',
    aliases: ['המצגת המחוזית', 'מסמך הפיקוח'],
    kind: 'organization',
    pageEligible: false,
  },
  {
    id: 'ayelet-crispin',
    slug: 'ayelet-crispin',
    name: 'איילת קריספין',
    aliases: ['איילת קריספין'],
    kind: 'person',
    pageEligible: true,
    role: 'מתכללת את תחום המתמטיקה בעל יסודי בעיר ירושלים ובמחוז ירושלים',
  },
  {
    id: 'michal-david',
    slug: 'michal-david',
    name: 'מיכל דוד',
    aliases: ['מיכל דוד'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'shilat-dadashi',
    slug: 'shilat-dadashi',
    name: 'שילת דדשי',
    aliases: ['שילת דדשי'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'semion-wiener',
    slug: 'semion-wiener',
    name: 'סמיון ויינר',
    aliases: ['סמיון ויינר', 'סמיון וינר'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'batya-mirzaev',
    slug: 'batya-mirzaev',
    name: 'בתיה מירזאיב',
    aliases: ['בתיה מירזאיב'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'sagit-rasouli',
    slug: 'sagit-rasouli',
    name: 'שגית רסולי',
    aliases: ['שגית רסולי'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'rasha-salameh',
    slug: 'rasha-salameh',
    name: 'רשא סלאמה',
    aliases: ['רשא סלאמה'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'atara-carballo',
    slug: 'atara-carballo',
    name: 'עטרה קרבלו',
    aliases: ['עטרה קרבלו'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'elizhar-levi',
    slug: 'elizhar-levi',
    name: 'אליזהר לוי',
    aliases: ['אליזהר לוי'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'elinor-levi',
    slug: 'elinor-levi',
    name: 'אלינור לוי',
    aliases: ['אלינור לוי'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'osnat-gabbay',
    slug: 'osnat-gabbay',
    name: 'אסנת גבאי',
    aliases: ['אסנת גבאי'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'merav-arbel',
    slug: 'merav-arbel',
    name: 'מירב ארבל',
    aliases: ['מירב ארבל'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'shiran-peretz',
    slug: 'shiran-peretz',
    name: 'שירן פרץ',
    aliases: ['שירן פרץ'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'regina-cholsky',
    slug: 'regina-cholsky',
    name: "רגינה צ'ולסקי",
    aliases: ["רגינה צ'ולסקי"],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'eyal-shlomo',
    slug: 'eyal-shlomo',
    name: 'אייל שלמה',
    aliases: ['אייל שלמה'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'dia-zaguri',
    slug: 'dia-zaguri',
    name: 'דיה זגורי',
    aliases: ['דיה זגורי'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'sarit-biton',
    slug: 'sarit-biton',
    name: 'שרית ביטון',
    aliases: ['שרית ביטון'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'maya-koren',
    slug: 'maya-koren',
    name: 'מיה קורן',
    aliases: ['מיה קורן'],
    kind: 'person',
    pageEligible: true,
  },
  {
    id: 'revital-izik',
    slug: 'revital-izik',
    name: 'ד״ר רויטל איזיק',
    aliases: ['ד״ר רויטל איזיק', 'ד"ר רויטל איזיק'],
    kind: 'person',
    pageEligible: true,
  },
];

const byId = new Map(authors.map((author) => [author.id, author]));
const bySlug = new Map(authors.map((author) => [author.slug, author]));

export function authorById(id: string): AuthorRecord | undefined {
  return byId.get(id);
}

export function authorBySlug(slug: string): AuthorRecord | undefined {
  return bySlug.get(slug);
}

export function authorsForResource(resourceId: string): AuthorRecord[] {
  return (authorAssignments[resourceId] ?? [])
    .map((id) => byId.get(id))
    .filter((author): author is AuthorRecord => Boolean(author));
}

export const pageAuthors = authors.filter((author) => author.pageEligible);
