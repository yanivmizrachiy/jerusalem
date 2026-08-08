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
 * מקור אמת לשמות יוצרים/מחברים. מוסיפים לכאן רק ייחוס שניתן לאמת.
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
    name: 'סמיון וינר',
    aliases: ['סמיון וינר', 'סמיון ויינר'],
    kind: 'person',
    pageEligible: true,
  },
];

const byId = new Map(authors.map((author) => [author.id, author]));
const bySlug = new Map(authors.map((author) => [author.slug, author]));

/**
 * מיפוי מפורש resource-id → author-id. אין parsing של note/source בזמן רינדור.
 * הרשימה תורחב במסגרת audit הייחוס; פריט לא מאומת אינו מקבל מחבר מומצא.
 */
export const authorAssignments: Readonly<Record<string, readonly string[]>> = {
  'mivchanim-hanchayot': ['ministry-of-education'],
  'kavit-flip': ['ayelet-crispin'],
  'al-haretzef': ['michal-david'],
  'mishakim-tavnit': ['shilat-dadashi'],
};

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
