/**
 * יחידות הוראה — המלאי הקנוני מ־RULES §10, §13, §15 ו־§11.
 * כל הקישורים נבדקו בפועל ב־03/08/2026 (RULES 1.12):
 * YouTube דרך oEmbed (סרטון קיים), Drive/Docs ללא הפניית התחברות, השאר HTTP 200.
 * פריטי EXAM (§14) ו־MZ של משחקים והעשרה עברו לעמודי-קובץ בחוברת —
 * `choveret.ts`, לשונית "כללי" (הוראת יניב, 03/08/2026).
 */

export const LINKS_VERIFIED_ON = '3/8/26';

export type UnitKind = 'youtube' | 'drive' | 'gdoc' | 'gslides' | 'app' | 'form' | 'canva' | 'site';

export interface UnitResource {
  id: string;
  section: string;
  title: string;
  url: string;
  kind: UnitKind;
  /** true = נפתח במקור בלבד (עורכי Canva, כלים חיצוניים) — לא מוטמע */
  external?: boolean;  /** מקור הטמעה מדויק (למשל עותק מקומי חתוך לעמודים הנדרשים) — גובר על toEmbed */
  embedOverride?: string;
}

export interface Unit {
  slug: string;
  title: string;
  grade: string;
  domain: string;
  topic: string;
  path: string;
  accent: string;
  intro: string;
  resources: UnitResource[];
}

export const kindLabels: Record<UnitKind, string> = {
  youtube: 'סרטון',
  drive: 'קובץ',
  gdoc: 'מסמך',
  gslides: 'מצגת',
  app: 'יישומון',
  form: 'טופס',
  canva: 'Canva',
  site: 'אתר',
};

/** המרת קישור מקור לקישור הטמעה מתאים */
export const toEmbed = (r: UnitResource): string => {
  if (r.embedOverride) return r.embedOverride;
  if (r.kind === 'youtube') {
    const m = r.url.match(/(?:youtu\.be\/|v=)([\w-]{6,})/);
    return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : r.url;
  }
  if (r.kind === 'drive') {
    const m = r.url.match(/\/file\/d\/([\w-]+)/);
    return m ? `https://drive.google.com/file/d/${m[1]}/preview` : r.url;
  }
  if (r.kind === 'gdoc' || r.kind === 'gslides') {
    return r.url.replace(/\/edit.*$/, '/preview');
  }
  if (r.kind === 'canva' && /\/view/.test(r.url)) {
    return `${r.url}${r.url.includes('?') ? '&' : '?'}embed`;
  }
  return r.url;
};

const R = (id: string, section: string, title: string, url: string, external = false): UnitResource => {
  const kind: UnitKind = /youtu/.test(url)
    ? 'youtube'
    : /drive\.google\.com\/file/.test(url)
      ? 'drive'
      : /docs\.google\.com\/presentation/.test(url)
        ? 'gslides'
        : /docs\.google\.com\/document/.test(url)
          ? 'gdoc'
          : /learningapps/.test(url)
            ? 'app'
            : /forms\.gle|docs\.google\.com\/forms/.test(url)
              ? 'form'
              : /canva\.com\/design/.test(url)
                ? 'canva'
                : 'site';
  return { id, section, title, url, kind, external };
};

/** הוראת משוואות ללא מספרים שליליים (RULES §10) */
export const mishvaotUnit: Unit = {
  slug: 'mishvaot',
  title: 'הוראת משוואות ללא מספרים שליליים',
  grade: 'כיתה ז׳',
  domain: 'אלגברה',
  topic: 'משוואות',
  path: '/chativat-beynayim/mishvaot/',
  accent: 'var(--amber)',
  intro:
    'יחידה מלאה להוראת משוואות עוד לפני המספרים המכוונים: מהידע הקודם וההמחשות, דרך שקילות ופתרון, ועד דפי עבודה, חידות ומשחק.',
  resources: [
    R('EQ-001', 'ידע קודם', 'המחשה להצבה', 'https://youtu.be/0nSr1WCAny0'),
    R('EQ-002', 'ידע קודם', 'המחשה לכינוס איברים דומים', 'https://www.youtube.com/watch?v=UppwYNJ54eE'),
    R('EQ-003', 'ידע קודם', 'אביזרים לכינוס', 'https://drive.google.com/file/d/1dSnwiLoDV-wc-PrGhlwSOOfLRAqbTDHe/view'),
    R('EQ-004', 'ידע קודם', 'המחשה לחוק הפילוג', 'https://www.youtube.com/watch?v=YXZniDIq-fo'),
    R('EQ-017', 'פתיח', 'חידות בציורים', 'https://docs.google.com/presentation/d/1sExLrTu_MQh95wcbe7IBfnSmuhzs5-mq/edit'),
    R('EQ-018', 'פתיח', 'חידות סמלי צה״ל', 'https://drive.google.com/file/d/14tArAlzqxb1hHGXc5-hJ2NnZpQGVRpGQ/view'),
    R('EQ-005', 'פתיחת הנושא', 'המחשה למשוואות', 'https://www.youtube.com/watch?v=sG29G9L6ryA'),
    R('EQ-006', 'שקילות', 'תלמיד מסביר שקילות', 'https://drive.google.com/file/d/1qTY3a-vKH4ln74wv70P65bgRsyFxJrWv/view'),
    R('EQ-007', 'פתרון', 'המחשה לפתרון משוואות', 'https://www.youtube.com/watch?v=D4Oo38fhRRM'),
    R('EQ-008', 'אביזרים', 'אביזרים לאיקסים', 'https://drive.google.com/file/d/1fSJFOgP3v0UKqZSRrOA4pKMFLIhyqFT_/view'),
    R('EQ-009', 'אביזרים', 'עיגול חיובי', 'https://drive.google.com/file/d/1P16c2POHKsHuz_PDKeaTesNTw8kvo1pQ/view'),
    R('EQ-010', 'שברים', 'המחשה למשוואות עם שברים', 'https://www.youtube.com/watch?v=RdT305fkRfY'),
    R('EQ-011', 'שברים', 'אביזרים', 'https://drive.google.com/file/d/1qW3Q6kbg5FVHTfwpCSwT-lyKoyLrxJW8/view'),
    R('EQ-012', 'דפי עבודה', 'דף עבודה 1', 'https://drive.google.com/file/d/16CwU2fOhYh8lMNl0f75VWZoapUwT9k8b/view'),
    R('EQ-013', 'דפי עבודה', 'דף עבודה 2', 'https://drive.google.com/file/d/1blAZSnQOL3lQ4GegTUsxxfkW9fkvp2bn/view'),
    R('EQ-014', 'דפי עבודה', 'דף עבודה 3', 'https://drive.google.com/file/d/16T_I40rssYbQqNIN_K6RVbQOuUlsxfYW/view'),
    R('EQ-015', 'דפי עבודה', 'דף עבודה 4', 'https://drive.google.com/file/d/1VKNTBajl59PkI6EF0lAd2BwnohTqFkcc/view'),
    R('EQ-016', 'תרגול', 'משוואות פשוטות', 'https://drive.google.com/file/d/1MnFTC4YgkN3U3wkLya4qtdTmlOAL8lc3/view'),
    R('EQ-019', 'משחק', 'SET', 'https://docs.google.com/document/d/1qFR6gmvQZ_4N3eOII_WZzUr1ZE2dpjnY/edit'),
    R('MZ-27', 'המצגת המחוזית', 'המצגת המלאה — משוואות לפני מספרים מכוונים', 'https://www.canva.com/design/DAF40pw1Ca8/ZkuGwava0BeVmVfQF5oyCw/view'),
  ],
};

/** יחידת חפיפת משולשים (RULES §15) */
export const hafifaUnit: Unit = {
  slug: 'hafifat-meshulashim',
  title: 'חפיפת משולשים',
  grade: 'כיתה ח׳',
  domain: 'גאומטריה',
  topic: 'חפיפת משולשים',
  path: '/chativat-beynayim/hafifat-meshulashim/',
  accent: 'var(--sky)',
  intro:
    'גאומטריה בכיתה ח׳: מהתוכנית והדגשים, דרך שלושת משפטי החפיפה, תרגול מדורג, הוכחות ואוריינות — ועד הקטעים המיוחדים במשולש והבוחן המסכם.',
  resources: [
    {
      ...R('TRI-001', 'תוכנית ומהלך', 'דגשים ותוכנית לימודים עמ׳ 65–67', 'https://drive.google.com/file/d/1XnfhK0QDM6zJ3gNjFwlejbytlp83m1yL/view'),
      // המסמך המלא הוא 158 עמודים — מוטמעים בדיוק שלושת העמודים הנדרשים,
      // מעותק מקומי שנחתך מהמקור (הוראת יניב, 03/08/2026)
      embedOverride: '/docs/hafifa-tochnit-65-67.pdf#view=FitH',
    },
    R('TRI-014', 'תוכנית ומהלך', 'מהלך יחידת הלימוד', 'https://docs.google.com/document/d/1vpVmsEgidK5XITyJn4m8RNfstdBqxGYC1GUE5w0g6eQ/edit'),
    R('TRI-005', 'שלושת משפטי החפיפה', 'משולשים חופפים — סרטון', 'https://www.youtube.com/watch?v=qcrpQtXeoNk'),
    R('TRI-008', 'שלושת משפטי החפיפה', 'שלושת משפטי החפיפה', 'https://drive.google.com/file/d/1FnNw0qBvpSNtSZOAWOliltb_y2qVMobo/view'),
    R('TRI-013', 'שלושת משפטי החפיפה', 'יישומון משפטי חפיפה', 'https://learningapps.org/watch?v=p6beyu7aj21'),
    R('TRI-016', 'שלושת משפטי החפיפה', 'מצגת שלושת משפטי החפיפה', 'https://docs.google.com/presentation/d/1aVZz3xpcZr6BfGJ71I5PyrIs-7_Hp2-w/edit'),
    R('TRI-009', 'תרגול והעמקה', 'השלמת נתונים', 'https://drive.google.com/file/d/1E8dPGfKEpoNXT8Mkqww2D90IktH0HdV_/view'),
    R('TRI-010', 'תרגול והעמקה', 'תרגול בסיסי נוסף', 'https://drive.google.com/file/d/1BUykzUUA5elFdrIb6T3RJK5vmMjpOYyW/view'),
    R('TRI-011', 'תרגול והעמקה', 'נתונים סמויים', 'https://drive.google.com/file/d/1rfSuEBuESiQ5bn0eG7lRcx5KEH9X1tFd/view'),
    R('TRI-012', 'תרגול והעמקה', 'דף עבודה נוסף', 'https://drive.google.com/file/d/160eY2ZC_b5RvVki1EUuqFzbCYAQ8xrlF/view'),
    R('TRI-006', 'תרגול והעמקה', 'שאלות מיצ״ב', 'https://drive.google.com/file/d/1U9MWkPTDskM9Jn1-cA5y2hMrF7Ij6Uvl/view'),
    R('TRI-015', 'תרגול והעמקה', 'חזרה למבחן — למידה מטעויות', 'https://drive.google.com/file/d/1jtuURm95G4A54B73WMYqmcVNSSWL5WUX/view'),
    R('TRI-004', 'הוכחות ואוריינות', 'הוכחות קלוז׳', 'https://drive.google.com/file/d/11FF7rD6J-rN1zWkdKPe3u_wH05DSkkAK/view'),
    R('TRI-007', 'הוכחות ואוריינות', 'שאלות אוריינות', 'https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3513-2022-09-21-13-52-32'),
    R('TRI-002', 'קטעים מיוחדים במשולש', 'קטעים מיוחדים במשולש', 'https://drive.google.com/file/d/1kNLWfMl9n6aDT7XvLPLm70zcsNXciSf7/view'),
    R('TRI-003', 'קטעים מיוחדים במשולש', 'תרגול גובה, חוצה ותיכון', 'https://drive.google.com/file/d/1_co8LL9f_tehRcvo3jf3b8h2zlsKnUxe/view'),
    R('TRI-019', 'קטעים מיוחדים במשולש', 'גובה במשולש', 'https://www.youtube.com/watch?v=LFi75RR0jeY'),
    R('TRI-020', 'קטעים מיוחדים במשולש', 'חוצה זווית', 'https://www.youtube.com/watch?v=qwHXtwJxc6s'),
    R('TRI-021', 'קטעים מיוחדים במשולש', 'תיכון במשולש', 'https://youtu.be/FyYHP0_hP5o'),
    R('TRI-022', 'משולש שווה־שוקיים ושקפים', 'יישומון משולש שווה־שוקיים', 'https://learningapps.org/watch?v=pit1urih223'),
    R('TRI-023', 'משולש שווה־שוקיים ושקפים', 'מצגת משולש שווה־שוקיים', 'https://drive.google.com/file/d/1hXV7TTOGdpTRoEO-GMLQ9U1Ytc0aFUyy/view'),
    R('TRI-017', 'משולש שווה־שוקיים ושקפים', 'משולשים לשקפים — תלמיד', 'https://drive.google.com/file/d/1xJCxI3f3NInPcX_sDE1AOq5xS_8aPOGe/view'),
    R('TRI-018', 'משולש שווה־שוקיים ושקפים', 'משולשים לשקפים — מורה', 'https://drive.google.com/file/d/19YuxUwvrCwEYTJJRaZgYdUxidIlJYdWo/view'),
    R('MZ-29', 'מצגות והרחבות', 'המצגת המחוזית — הוראת חפיפת משולשים', 'https://www.canva.com/design/DAF16LpV3vw/b3jkkgsWAyjYsVz-CMin_A/view'),
    R('MZ-30', 'מצגות והרחבות', 'קטעים מיוחדים במשולש ומשולש שווה־שוקיים', 'https://www.canva.com/design/DAF9UOtSUXE/YqgFLe9SPbYql0G96R9fYQ/view'),
    R('MZ-36', 'גאומטריה במערכת צירים ובוחן', 'שילוב גאומטריה במערכת הצירים — מסמך הפיקוח', 'https://docs.google.com/document/d/1CFHKPpCDTMj3DDr5r2-t94sxYjSWNxLZxEEpFmx-MI0/edit'),
    R('TRI-024', 'גאומטריה במערכת צירים ובוחן', 'גאומטריה במערכת צירים 1', 'https://docs.google.com/document/d/1YxrwU_YoHY1QxFN-fNkCGBYxpjw7Yi0T1CwlZvrPP2E/edit'),
    R('TRI-025', 'גאומטריה במערכת צירים ובוחן', 'גאומטריה במערכת צירים 2', 'https://docs.google.com/document/d/1xAIcMljEP47jDT-6ApRddcrgKYQm_N49szsaXTJF3jc/edit'),
    R('TRI-026', 'גאומטריה במערכת צירים ובוחן', 'בוחן מסכם', 'https://drive.google.com/file/d/1psPLnq6tncumtDhID3KAZZE0w7Ib8ma6/view'),
  ],
};

/**
 * מיזם AI וגאומטריה (RULES §13) — מיקום קנוני: פיתוח מקצועי (3.14).
 * 17 קישורים נבדקו לעומק ב־03/08/2026: 16 תקינים ומפורסמים.
 * הוחרגו לפי הכללים: AI-003 (טופס הגשה — HTTP 401, אינו פעיל; 1.12)
 * ו־AI-018 (קישור Meet — לא מפורסם ללא אימות פעילות; 13.1).
 */
export const aiUnit: Unit = {
  slug: 'ai-geometria',
  title: 'מיזם AI וגאומטריה',
  grade: 'חט״ב וחט״ע',
  domain: 'פיתוח מקצועי',
  topic: 'בינה מלאכותית וחדשנות בהוראת המתמטיקה',
  path: '/pituach-miktzoi/ai-geometria/',
  accent: 'var(--lilac)',
  intro:
    'מיזם המחוז לשילוב בינה מלאכותית בהוראת הגאומטריה: מצגת והקלטת המפגש, מאגרי משפטים ותכונות, תבניות פרומפט, סדנאות לצוותים, אישורי הורים והנחיות משרד החינוך — לצד כלי היצירה עצמם.',
  resources: [
    R('AI-001', 'המפגש', 'מצגת המפגש', 'https://www.canva.com/design/DAGS_5y1S1Q/dlXqz9hNqBcmVUTw1jLVew/view'),
    R('AI-009', 'המפגש', 'הקלטת המפגש', 'https://drive.google.com/file/d/15CaDtBwic1wmVU-khR73LO31fHiT0YGL/view'),
    R('AI-002', 'מאגרים ותבניות', 'מאגר משפטים לחט״ב וחט״ע', 'https://docs.google.com/document/d/1hROVvxSZ5W_-e_IeyIp5wfFcZ7BQRTQYr8m5jgl8sTE/edit'),
    R('AI-008', 'מאגרים ותבניות', 'מאגר תכונות ליסודי', 'https://docs.google.com/document/d/14UQjaAkcT0i1RM83J5W9DZwNoPhNDnQc5JWtf8phXHY/edit'),
    R('AI-011', 'מאגרים ותבניות', 'תבנית למבנה פרומפט', 'https://www.canva.com/design/DAGTchEijyY/O8m11CGHBEMdHXoms8Q6ow/edit', true),
    R('AI-010', 'מאגרים ותבניות', 'אתרים לעזר לתלמידים', 'https://www.canva.com/design/DAGTci51edI/pE8mI4hCVHdsX-ieWX5BfQ/edit', true),
    R('AI-005', 'הצטרפות', 'טופס הרשמה למיזם', 'https://forms.gle/JeLj3GYJtEGF6o4QA'),
    R('AI-004', 'סדנאות והדרכה', 'סדנה לצוות בנושא AI', 'https://docs.google.com/document/d/1IVVogee2WtilgKINVJZiuazjufFJGS1I44qielWozCM/edit'),
    R('AI-006', 'סדנאות והדרכה', 'סרטוני הדרכה לכלי AI', 'https://www.canva.com/design/DAGTcgS715I/CNLgikXKBiuP1yrYVbAixg/edit', true),
    R('AI-007', 'הורים ואישורים', 'אישורי הורים AI', 'https://drive.google.com/file/d/19U0lwwda6WD0Wp1m-zzcRbxicPPHFaBf/view'),
    R('AI-012', 'הורים ואישורים', 'מדריך להורים — כיצד לאשר', 'https://drive.google.com/file/d/1QSZYOq-tAMMyDKqPCNn_ExiaWxg5Ebgx/view'),
    R('AI-014', 'מסמכים רשמיים', 'הנחיות משרד החינוך לשימוש ב־AI', 'https://meyda.education.gov.il/files/Mazkirut_Pedagogit/Ivrit/instructionsai.pdf'),
    R('AI-013', 'כלים ואתרים', 'עמוד המיזם באתר המחוז', 'https://sites.google.com/edujer.org.il/main/projects/GEOM?authuser=0'),
    R('AI-017', 'כלים ואתרים', 'אתר המקפצה', 'https://homework.lnet.org.il'),
    R('AI-015', 'כלים ואתרים', 'Copilot — מחולל תמונות', 'https://copilot.microsoft.com/images/create?cc=by&setlang=he', true),
    R('AI-016', 'כלים ואתרים', 'Canva', 'https://www.canva.com', true),
  ],
};

/**
 * מאגרי החטיבה העליונה (RULES §11, מבנה לפי 3.18).
 * כל 22 הקישורים נבדקו ב־03/08/2026 — 22/22 נגישים. שניים מוחזקים
 * עריכתית עד הכרעת יניב (9.3.18): HS-005 (שאלות 582 — שאלון התוכנית
 * הישנה) ו־HS-013 (טבלת צירופים 2023 — הוחלפה בטבלה המעודכנת שב־MAF-20).
 */
export const hsUnit: Unit = {
  slug: 'homrei-horaa',
  title: 'חומרי הוראה ומאגרים — חטיבה עליונה',
  grade: 'י׳–י״ב',
  domain: 'חטיבה עליונה',
  topic: 'חומרי הוראה ומאגרים',
  path: '/chativa-elyona/homrei-horaa/',
  accent: 'var(--gold)',
  intro:
    'המאגרים המרכזיים לתוכנית החדשה: מסמכי התוכנית, קורסי קמפוס IL, חומרי מרכז המורים, תכנון שנתי, מאגרי אייל שלמה, רשת ביטחון ומבוא לאנליזה — כל קישור בדוק.',
  resources: [
    R('HS-001', 'תוכנית הלימודים החדשה', 'תוכנית הלימודים החדשה — הפורטל הרשמי', 'https://pop.education.gov.il/tchumey_daat/matmatika/chativa-elyona/teaching-mathematics/new-curriculum/', true),
    R('HS-002', 'תוכנית הלימודים החדשה', 'מתאם וניבוי — ספר סטטיסטיקה', 'https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/new-curriculum/correlation-prediction-12.pdf'),
    R('HS-003', 'תוכנית הלימודים החדשה', 'אוסף שאלות בגרות — התוכנית החדשה', 'https://drive.google.com/file/d/1RsGHTLn2SfpuUPNPtVSTHb4xEl6BDS70/view'),
    R('HS-006', 'קמפוס IL', 'קמפוס IL — הפורטל', 'https://campus.gov.il', true),
    R('HS-007', 'קמפוס IL', 'פירוט הקורסים במתמטיקה', 'https://pop.education.gov.il/tchumey_daat/matmatika/chativa-elyona/teaching-mathematics/preparatory-courses-for-matriculation/', true),
    R('HS-008', 'קמפוס IL', 'איך מצטרפים — מדריך', 'https://drive.google.com/file/d/1X__pL0hlNV55NkrDcIhKNjrfOEaIE_bd/view'),
    R('HS-009', 'קמפוס IL', 'סרטון הדרכה', 'https://www.youtube.com/watch?v=tt-xGW3Vb2g'),
    R('HS-017', 'חומרי הוראה', 'חומרים — מרכז המורים', 'https://newhighmath.haifa.ac.il/index.php/2015-05-31-10-59-23/2015-05-31-11-12-42'),
    R('HS-018', 'חומרי הוראה', 'חומרים תומכי הוראה', 'https://newhighmath.haifa.ac.il/index.php/2017-08-14-09-30-32'),
    R('HS-019', 'חומרי הוראה', 'משאבי הוראה — רשת עתיד', 'https://drive.google.com/file/d/1NdKxVSdRnkbWS0k9aZmV3kINAvlC1q6i/view'),
    R('HS-020', 'חומרי הוראה', 'משחקים — רשת עתיד', 'https://drive.google.com/file/d/1V1k-jZXw3ZC23jVuG5XO01Km0bbgi25s/view'),
    R('HS-022', 'תכנון שנתי', 'תכנון שנתי י׳–י״ב, 4–5 יח״ל', 'https://docs.google.com/document/d/1fIKdN4Z2P5m2qQ_ordySt8iYE_61fEDdykzIx3kPOKQ/edit'),
    R('HS-023', 'מאגרי אייל שלמה', 'כיתה י׳ — 4 יח״ל', 'https://docs.google.com/document/d/15Y-T9nA6JPPfrNR8ochfyh-vznx4JV6osz8YlJoAYrY'),
    R('HS-024', 'מאגרי אייל שלמה', 'כיתה י״א — 471', 'https://docs.google.com/document/d/1DX_XRBOuTmaW8K7kjlre6kmFig630yKVWK0PNC4NK6I/edit'),
    R('HS-025', 'מאגרי אייל שלמה', 'כיתה י״ב — 472', 'https://docs.google.com/document/d/1Q5X9z1kc2BFynRNuIyD5_RIujFS8RgdMI_1qsK3aYnI/edit'),
    R('HS-021', 'מעבר בין רמות', 'רשת ביטחון — המסמך', 'https://drive.google.com/file/d/1MxbkdfSrW83Qv0lRTELlSu1eBnV1Q5hs/view'),
    R('HS-026', 'מבוא לאנליזה', 'מבוא לאנליזה — מכון ויצמן', 'https://www.weizmann.ac.il/ScienceTeaching/sites/ScienceTeaching/files/uploads/mbv_lnlyzh.pdf'),
  ],
};
