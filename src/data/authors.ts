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

/**
 * מיפוי מפורש resource-id → author-id. אין parsing של note/source בזמן רינדור.
 * הרשימה תורחב במסגרת audit הייחוס; פריט לא מאומת אינו מקבל מחבר מומצא.
 */
export const authorAssignments: Readonly<Record<string, readonly string[]>> = {
  'mivchanim-hanchayot': ['ministry-of-education'],
  'kavit-flip': ['ayelet-crispin'],
  'al-haretzef': ['michal-david'],
  'mishakim-tavnit': ['shilat-dadashi'],

  // סמיון ויינר.
  'src-game-z-78f405097bb9': ['semion-wiener'],
  'src-game-z-9927455e10df': ['semion-wiener'],
  'src-game-z-c6276f21e166': ['semion-wiener'],
  'src-game-z-9d2549a4296f': ['semion-wiener'],
  'src-game-z-02b2223a8bfd': ['semion-wiener'],
  'src-game-z-f42791d62bf0': ['semion-wiener'],
  'src-game-z-ba0b5e482c5f': ['semion-wiener'],
  'src-game-z-3e926d886ff2': ['semion-wiener'],

  // בתיה מירזאיב — 42 משאבים שבהם הייחוס מופיע במפורש בקטלוג המקור.
  'src-game-z-9345687178d9': ['batya-mirzaev'],
  'src-game-z-6d10346fe069': ['batya-mirzaev'],
  'src-game-z-37b4e8418036': ['batya-mirzaev'],
  'src-game-z-5e82a6f250e8': ['batya-mirzaev'],
  'src-game-z-60363fb6650a': ['batya-mirzaev'],
  'src-game-z-6821aaaaa55c': ['batya-mirzaev'],
  'src-game-z-f12830e08dc1': ['batya-mirzaev'],
  'src-game-z-ceb0b551eb94': ['batya-mirzaev'],
  'src-game-z-012df6acfa6c': ['batya-mirzaev'],
  'src-game-z-31c69d9825d3': ['batya-mirzaev'],
  'src-game-z-19d5dcec2194': ['batya-mirzaev'],
  'src-game-z-62287bbdf55d': ['batya-mirzaev'],
  'src-game-z-f7c4b5d53e29': ['batya-mirzaev'],
  'src-game-z-4f0b4eca7eb2': ['batya-mirzaev'],
  'src-game-z-602b96061488': ['batya-mirzaev'],
  'src-game-z-21f195d851f1': ['batya-mirzaev'],
  'src-game-z-e31795fef3c2': ['batya-mirzaev'],
  'src-game-z-fbae9c9dcc77': ['batya-mirzaev'],
  'src-game-h-6cbeef0c951a': ['batya-mirzaev'],
  'src-game-h-a050967f185b': ['batya-mirzaev'],
  'src-game-h-a4bd43f4ebf3': ['batya-mirzaev'],
  'src-game-h-f3a21b552630': ['batya-mirzaev'],
  'src-game-h-58cc4f488e83': ['batya-mirzaev'],
  'src-game-h-fe374680a0bb': ['batya-mirzaev'],
  'src-game-h-266e772cc1d9': ['batya-mirzaev'],
  'src-game-h-3d3adea92f4d': ['batya-mirzaev'],
  'src-game-h-7c9e1de73af8': ['batya-mirzaev'],
  'src-game-h-79f1eccd96f9': ['batya-mirzaev'],
  'src-game-h-9f82314057a2': ['batya-mirzaev'],
  'src-game-h-e9d5af06be0e': ['batya-mirzaev'],
  'src-game-h-5c715a3e0e8d': ['batya-mirzaev'],
  'src-game-h-3daa1d1692a2': ['batya-mirzaev'],
  'src-game-h-f2730e69ef22': ['batya-mirzaev'],
  'src-game-h-6b5c3f25c553': ['batya-mirzaev'],
  'src-game-h-15fa15fef39c': ['batya-mirzaev'],
  'src-game-t-4511fce03b20': ['batya-mirzaev'],
  'src-game-t-13edad04d513': ['batya-mirzaev'],
  'src-game-t-38f83b261a02': ['batya-mirzaev'],
  'src-game-t-8253c1eb9506': ['batya-mirzaev'],
  'src-game-t-84a73f3b5de9': ['batya-mirzaev'],
  'src-game-t-6a25b23e0c4e': ['batya-mirzaev'],
  'src-game-t-3b8a123059d1': ['batya-mirzaev'],

  // מחברים נוספים שאומתו במפורש בקטלוג המקור.
  'src-game-z-3ae158381dbe': ['sagit-rasouli'],
  'src-game-h-7a1e51bbee6f': ['sagit-rasouli'],
  'src-game-t-76669b599f22': ['sagit-rasouli'],
  'src-curriculum-71f88b7ed752': ['sagit-rasouli'],
  'src-curriculum-b3e599064912': ['sagit-rasouli'],
  'src-curriculum-f3d7f73d5789': ['sagit-rasouli'],
  'src-curriculum-ba33882d0751': ['sagit-rasouli'],
  'src-game-z-101d82415598': ['rasha-salameh'],
  'src-game-h-b928fe90f53f': ['atara-carballo'],
  'src-game-h-a6b435cade25': ['atara-carballo'],
  'src-game-z-463d12bf9544': ['elizhar-levi'],
  'src-game-z-65da3d977eff': ['elinor-levi'],
  'src-game-t-f96bc54899bb': ['osnat-gabbay', 'merav-arbel', 'shiran-peretz'],
  'src-game-t-ee9cbe3251c4': ['osnat-gabbay', 'merav-arbel', 'shiran-peretz'],
  'src-game-t-d0d5af728b47': ['regina-cholsky', 'revital-izik'],
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
