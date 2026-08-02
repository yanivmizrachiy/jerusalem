/** צוות ההדרכה המחוזי — הנתונים המאושרים בלבד (RULES §7). */
export interface TeamMember {
  /** שם תצוגה מלא */
  name: string;
  /** תפקיד מדויק כפי שנקבע */
  role: string;
  /** טלפון לתצוגה */
  phoneDisplay: string;
  /** טלפון בפורמט בינלאומי לקישורי שיחה/WhatsApp (7.17) */
  phoneIntl: string;
  /** דוא״ל — רק כאשר נמסר (7.14) */
  email?: string;
  /** איילת מקבלת בולטות חזותית (7.1) */
  featured?: boolean;
  /** אות למונוגרמה עד קליטת קובץ התמונה המקורי (7.21) */
  initial: string;
  /** גוון מזהה מתוך הפלטה (5.19) */
  accent: string;
}

export const team: TeamMember[] = [
  {
    name: 'איילת קריספין',
    role: 'מדריכה מחוזית למתמטיקה על־יסודי',
    phoneDisplay: '050-272-1656',
    phoneIntl: '972502721656',
    email: 'ayeletk59@gmail.com',
    featured: true,
    initial: 'א',
    accent: 'var(--gold)',
  },
  {
    name: 'ויקטוריה צורי',
    role: 'מדריכה מחוזית חט״ע מחוז ירושלים',
    phoneDisplay: '050-564-6264',
    phoneIntl: '972505646264',
    email: 'vikazury@gmail.com',
    initial: 'ו',
    accent: 'var(--sky)',
  },
  {
    name: 'אורלי',
    role: 'מדריכה מחוזית חט״ע מחוז ירושלים',
    phoneDisplay: '050-639-5257',
    phoneIntl: '972506395257',
    email: 'Olevin0809@gmail.com',
    initial: 'א',
    accent: 'var(--rose)',
  },
  {
    name: 'יניב רז',
    role: 'מדריך מחוזי לחטיבת הביניים בעיר ירושלים',
    phoneDisplay: '052-374-8115',
    phoneIntl: '972523748115',
    email: 'yanivmiz77@gmail.com',
    initial: 'י',
    accent: 'var(--olive)',
  },
];
