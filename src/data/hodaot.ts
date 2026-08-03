/**
 * הודעות ועדכונים (RULES 3.19, §12): פיד לפי תאריך וקטגוריה.
 * רק פריטים שאומתו בפועל; פריטים שנתיים ישנים, פרטיות והגשות — מוחזקים
 * (NEWS-006/008/009/013/014/015/16) עד הכרעת יניב. נבדק: 03/08/2026.
 */

export interface FeedItem {
  /** תאריך אמיתי כאשר ידוע; ריק = הודעה עומדת (ללא תאריך פרסום מקורי) */
  date?: string;
  category: string;
  accent: string;
  title: string;
  desc: string;
  href: string;
  external?: boolean;
}

export const feedDated: FeedItem[] = [
  {
    date: '3/8/26',
    category: 'האתר',
    accent: 'var(--gold)',
    title: 'אתר המחוז החדש עלה לאוויר',
    desc: 'הבית החדש של קהילת המתמטיקה: חוזר מפמ״ר מנווט, יחידות הוראה בדוקות, צוות ההדרכה ועדכונים — והאתר ממשיך להתרחב.',
    href: '/',
  },
  {
    date: '3/8/26',
    category: 'מדיניות',
    accent: 'var(--sky)',
    title: 'חוזר מפמ״ר תשפ״ז — הטמעה מלאה עם ניווט מדויק',
    desc: 'כל 18 עמודי החוזר עם קפיצה ישירה לכל אחד מ־23 המקטעים, כולל מה שהתבטל מהשנה שעברה.',
    href: '/hozer-mafmar/',
  },
  {
    date: '25/11/26',
    category: 'הערכה',
    accent: 'var(--terracotta)',
    title: 'מבחן תנופה לכיתות ט׳ — 25.11.2026',
    desc: 'המבחן הארצי של ראמ״ה. המפרט הרשמי והקישורים המלאים בעמוד כיתה ט׳.',
    href: '/chativat-beynayim/kita-t/',
  },
];

export const feedStanding: FeedItem[] = [
  {
    category: 'תוכנית לימודים',
    accent: 'var(--olive)',
    title: 'עדכון תוכנית הלימודים לכיתות ז׳–ח׳',
    desc: 'העדכון הרשמי במרחב הפדגוגי של משרד החינוך.',
    href: 'https://pop.education.gov.il/tchumey_daat/matmatika/chativat-beynayim/teaching-mathematics/tohnit-limudim/',
    external: true,
  },
  {
    category: 'הערכה',
    accent: 'var(--terracotta)',
    title: 'הנחיות מותאמות לכתיבת מבחנים בחט״ב',
    desc: 'מצגת ההנחיות המחוזית למורי חטיבות הביניים.',
    href: 'https://www.canva.com/design/DAGgNE8sRTg/a5P1Vsf4ClH1fv2S1YvwGA/view',
    external: true,
  },
  {
    category: 'הערכה',
    accent: 'var(--terracotta)',
    title: 'היגדים לתעודה',
    desc: 'מאגר ההיגדים המחוזי לכתיבת תעודות.',
    href: 'https://docs.google.com/document/d/1pumOgbN_yjA2eLz7kmOGNgHponWeqWjsX_x29zl9gq4/edit',
    external: true,
  },
  {
    category: 'רכזים',
    accent: 'var(--lilac)',
    title: 'אבני דרך לרכז המקצוע',
    desc: 'מפת הדרכים המחוזית לרכזי המתמטיקה — ליצירת עותק אישי.',
    href: 'https://www.canva.com/design/DAGrur1PocA/7qKMknADGZHkefhort-_TQ/view',
    external: true,
  },
  {
    category: 'פיתוח מקצועי',
    accent: 'var(--lilac)',
    title: 'מיזם AI וגאומטריה — ההרשמה פתוחה',
    desc: 'כל משאבי המיזם וטופס ההרשמה החי — בעמוד המיזם.',
    href: '/pituach-miktzoi/ai-geometria/',
  },
  {
    category: 'קהילה',
    accent: 'var(--whatsapp)',
    title: 'קבוצת ה־WhatsApp המחוזית פעילה',
    desc: 'הערוץ השוטף של מורי חטיבות הביניים בעיר ובמחוז.',
    href: '/chativat-beynayim/kehilat-morim/',
  },
];
