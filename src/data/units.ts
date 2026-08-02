/**
 * יחידות הוראה — המלאי הקנוני מ־RULES §10, §14, §15.
 * כל 52 הקישורים נבדקו בפועל ב־03/08/2026 (RULES 1.12):
 * YouTube דרך oEmbed (סרטון קיים), Drive/Docs ללא הפניית התחברות, השאר HTTP 200.
 */

export const LINKS_VERIFIED_ON = '3/8/26';

export type UnitKind = 'youtube' | 'drive' | 'gdoc' | 'gslides' | 'app' | 'site';

export interface UnitResource {
  id: string;
  section: string;
  title: string;
  url: string;
  kind: UnitKind;
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
  site: 'אתר',
};

/** המרת קישור מקור לקישור הטמעה מתאים */
export const toEmbed = (r: UnitResource): string => {
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
  return r.url;
};

const R = (id: string, section: string, title: string, url: string): UnitResource => {
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
            : 'site';
  return { id, section, title, url, kind };
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
    'יחידת הדגל של גאומטריית כיתה ח׳: מהתוכנית והדגשים, דרך שלושת משפטי החפיפה, תרגול מדורג, הוכחות ואוריינות — ועד הקטעים המיוחדים במשולש והבוחן המסכם.',
  resources: [
    R('TRI-001', 'תוכנית ומהלך', 'דגשים ותוכנית לימודים עמ׳ 65–67', 'https://drive.google.com/file/d/1XnfhK0QDM6zJ3gNjFwlejbytlp83m1yL/view'),
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
    R('TRI-024', 'גאומטריה במערכת צירים ובוחן', 'גאומטריה במערכת צירים 1', 'https://docs.google.com/document/d/1YxrwU_YoHY1QxFN-fNkCGBYxpjw7Yi0T1CwlZvrPP2E/edit'),
    R('TRI-025', 'גאומטריה במערכת צירים ובוחן', 'גאומטריה במערכת צירים 2', 'https://docs.google.com/document/d/1xAIcMljEP47jDT-6ApRddcrgKYQm_N49szsaXTJF3jc/edit'),
    R('TRI-026', 'גאומטריה במערכת צירים ובוחן', 'בוחן מסכם', 'https://drive.google.com/file/d/1psPLnq6tncumtDhID3KAZZE0w7Ib8ma6/view'),
  ],
};

/** הנחיות מבחנים ונוסחאות לחטיבת הביניים (RULES §14, מיקום לפי 3.13) */
export const mivchanimUnit: Unit = {
  slug: 'mivchanim',
  title: 'בחינות והערכה — נוסחאות והנחיות',
  grade: 'כיתות ז׳–ט׳',
  domain: 'בחינות והערכה',
  topic: 'נוסחאות והנחיות מבחנים',
  path: '/chativat-beynayim/mivchanim/',
  accent: 'var(--lilac)',
  intro:
    'דפי הנוסחאות הרשמיים לכל שכבה, מבחן דמוי מיצ״ב עם מחוון, והנחיות לכתיבת מבחנים — מרוכזים במקום אחד.',
  resources: [
    R('EXAM-002', 'נוסחאות — כיתה ז׳', 'דף נוסחאות כיתה ז׳', 'https://drive.google.com/file/d/1nJdVkTlZvnulYiabkeVZG0BT6ek1lU0c/view'),
    R('EXAM-003', 'נוסחאות — כיתה ח׳', 'דף נוסחאות כיתה ח׳', 'https://drive.google.com/file/d/1hf30qH4SbS7UxRlkmrFiitDhdoDFt90B/view'),
    R('EXAM-005', 'נוסחאות — כיתה ח׳', 'יצירת עותק נוסחאות ז׳–ח׳', 'https://docs.google.com/document/d/1PS4B4VwdZQk5S5BfjUzC2RtQ-9WEexRp/edit'),
    R('EXAM-004', 'נוסחאות — כיתה ט׳', 'דף נוסחאות כיתה ט׳', 'https://drive.google.com/file/d/1UJJeoCAomVPNp4PN3FsBhCbfaqcSxL1G/view'),
    R('EXAM-006', 'מבחן דמוי מיצ״ב', 'מבחן דמוי מיצ״ב', 'https://docs.google.com/document/d/1-F8gCF7V9X1afsr2D5vOLdgq8DC1OzlH/edit'),
    R('EXAM-007', 'מבחן דמוי מיצ״ב', 'מחוון למבחן דמוי מיצ״ב', 'https://docs.google.com/document/d/10eruHhJRK6HX3nvD17tAypCTqNoC83WD/edit'),
    R('EXAM-001', 'הנחיות', 'מסמך הנחיות לכתיבת מבחנים', 'https://drive.google.com/file/d/19edSXZCMSSnFVFvD6B4I-VKRqyGVNwcK/view'),
  ],
};
