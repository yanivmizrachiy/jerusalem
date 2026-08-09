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
