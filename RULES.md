# RULES.md — מקור האמת ופרומפט־העל המחייב ל־Claude Code

## מצב הפרויקט

- שם האתר: **מחוז ירושלים**.
- הריפו הפעיל כעת: `yanivmizrachiy/lele`.
- שם הריפו המחייב לאחר שינוי שם מסודר: `jerusalem`.
- שלב נוכחי: **איסוף דרישות, מחקר, מיפוי ותכנון בלבד**.
- בענף `main` יישמר בשלב זה רק הקובץ `RULES.md`.
- אין ליצור אתר, קוד, נכסים, מסמכי תכנון נוספים או קבצי עזר לפני אישור מפורש של יניב להתחיל בבנייה.

---

# 0. חלוקת תפקידים מחייבת

0.1. **ChatGPT אינו בונה את האתר ואינו כותב את קוד האתר.**

0.2. תפקיד ChatGPT הוא רק:

- לחקור מקורות וקישורים.
- לבדוק סתירות, כפילויות, חוסרים ורלוונטיות.
- למפות כל תוכן למיקום המתאים באתר.
- לארגן את כל ההוראות בתוך `RULES.md`.
- לנסח פרומפט־על מדויק, מלא ומתוחכם ל־Claude Code.

0.3. **Claude Code הוא היוצר והמבצע היחיד של האתר.** הוא יתכנן ויבנה את האתר רק לאחר שיניב יודיע במפורש שכל ההוראות הושלמו ויאשר להתחיל בבנייה.

0.4. עד לאישור כזה אסור ליצור או לשנות:

- HTML, CSS, JavaScript או TypeScript.
- framework, package, API, מסד נתונים או workflow.
- UI, עמוד, רכיב, README, לוגו, תמונה או נכס אתר.
- קובץ חדש כלשהו בריפו.

0.5. אין להציג מחקר, מיפוי או פרומפט כאילו האתר כבר נבנה, פורסם או נבדק.

0.6. כל הוראה חדשה של יניב תשתלב בסעיף המתאים במסמך זה ולא תישמר כפתק מנותק.

---

# 1. כללי יסוד לבנייה העתידית

1.1. Claude Code יבנה אתר הפקה אמיתי ומוכן לפרסום — לא דמו, לא אב־טיפוס, לא מסכים מזויפים ולא כפתורים שאינם מחוברים.

1.2. כל רכיב, קישור, הטמעה, כפתור, שיתוף, הורדה, ניווט ואנימציה יעבדו בפועל במחשב ובטלפון.

1.3. האתר יהיה בעברית מלאה, RTL, נגיש, מהיר, מאובטח, רספונסיבי ועקבי חזותית.

1.4. יש להשתמש ביכולות התכנון, המחקר, הקידוד, הבדיקה והאוטומציה החזקות ביותר הזמינות ל־Claude Code.

1.5. יש לבחור טכנולוגיה יציבה, מהירה, מתקדמת וניתנת לתחזוקה. אין להוסיף מורכבות ללא תועלת, אך אין להתפשר על איכות, אבטחה, ביצועים, נגישות, SEO וחוויית משתמש.

1.6. יש לשמור 100% מהדרישות המפורשות במסמך. אין להשמיט דרישה בגלל אורך, קושי או מורכבות.

1.7. הוראה מפורשת ומאוחרת יותר של יניב גוברת על ניסוח ישן שסותר אותה.

1.8. אין להוסיף תוכן, תכונה או עמוד שאינם קשורים ישירות לאתר מחוז ירושלים.

1.9. אין למחוק תוכן ייחודי מהמקור הישן בלי שהוחלף במקור חדש או בלי הוראה מפורשת.

1.10. מקור חדש שמבצע בדיוק את תפקידו של מקור ישן מחליף אותו; אין להשאיר כפילות פעילה.

1.11. אין להמציא שם, תפקיד, טלפון, דוא״ל, קישור, קובץ או מידע שחסר.

1.12. כל קישור ישן וחדש ייבדק בפועל. קישור שבור, פרטי, מיושן, חסום או לא מאומת לא יוצג כאילו הוא תקין.

1.13. העיצוב יהיה נקי, יוקרתי, מודרני, צבעוני בעדינות ומסודר — ללא עומס וקישוט יתר.

1.14. אין להכריז על השלמה, הצלחה, חיבור, אינדוקס או פרסום לפני אימות בפועל.

---

# 2. תכנון חובה לפני כתיבת קוד

2.1. לפני יצירת קובץ אתר ראשון, Claude Code יפיק תוכנית ביצוע מלאה הכוללת:

- מטרות האתר וקבוצות המשתמשים.
- מפת אתר מלאה.
- חלוקה לחטיבת ביניים, חטיבה עליונה, הודעות, משאבים, קהילת מורים ומידע רשמי.
- מטריצת דרישות המקשרת כל מספר במסמך לרכיב, לעמוד ולבדיקת קבלה.
- מפת קישורים: מקור, יעד, נושא, קהל, שכבה, תחום, עמוד, מקטע, מצב תקינות, כפילות והחלפה.
- בדיקת סתירות, כפילויות וחוסרים.
- החלטת stack מנומקת.
- ארכיטקטורת רכיבים ומערכת עיצוב אחידה.
- תוכנית ניווט וגלילה לכל עמוד.
- אסטרטגיית הטמעות, fallback, שיתוף, הורדה, הדפסה ומסך מלא.
- אסטרטגיית ביצועים, נגישות, אבטחה, SEO ובדיקות.
- תוכנית מעבר מהמקורות הישנים לאתר החדש בלי אובדן תוכן ייחודי.

2.2. אין לפתור סתירה באמצעות מחיקה שקטה. יש להכריע לפי ההוראה המאוחרת והמפורשת יותר של יניב.

2.3. במהלך התכנון אין ליצור קובץ תכנון נוסף בריפו. `RULES.md` נשאר מקור האמת היחיד.

2.4. אתר המקור הראשי לעיון ולמיפוי בלבד:

`https://www.canva.com/design/DAGM0kdNDuo/XMHagjp_0NNUpPyAdoybCA/view?utm_content=DAGM0kdNDuo&utm_campaign=designshare&utm_medium=link&utm_source=viewer`

2.5. מקורות־שורש נוספים שיש למפות לעומק, כולל כל קישור פנימי נגיש:

- חטיבת ביניים: `https://mamhishim.my.canva.site/mhozjerusalem`
- חטיבה עליונה: `https://www.canva.com/design/DAGNFOK0bBM/sXlKIUZ54XwlozaNnGSGBA/view`
- הודעות שוטפות: `https://www.canva.com/design/DAGM0sUT9PM/Xspl6Iv_-s5olzIg4QThHA/view`
- יחד ננצח תשפ״ד: `https://www.canva.com/design/DAFy1XJha9k/cNoorlOtbTEm3VR9zBlEQA/view`

2.6. אין להעתיק את עיצוב Canva בצורה עיוורת. יש ללמוד ממנו תוכן, מבנה וקישורים ולבנות מערכת מודרנית, אחידה וברמה גבוהה יותר.

---

# 3. מפת אתר ומפת הטמעה מחייבת

3.1. היררכיית־העל תהיה לפחות:

- עמוד ראשי.
- חטיבת ביניים.
- חטיבה עליונה.
- הודעות ועדכונים.
- קהילת מורים.
- מידע רשמי ומדיניות.
- תוכניות לימודים.
- בחינות והערכה.
- חומרי הוראה.
- פיתוח מקצועי.

3.2. העמוד הראשי מיועד לזהות המחוז, סרטון הפתיחה, צוות ההדרכה, אתר ההמחשות של איילת ושערי כניסה מרכזיים. אין להעמיס בו את כל מאגרי ההוראה.

3.3. אתר **איילת קריספין — אתר המחשות** יוצג כמשאב מרכזי בעמוד הראשי, עם הטמעה גדולה ודומיננטית.

3.4. קבוצת ה־WhatsApp תמוקם רק תחת:

**חטיבת ביניים → קהילת מורים ותקשורת**.

3.5. **מספרים מכוונים** ימוקם במסלול הקנוני:

**חטיבת ביניים → כיתה ז׳ → תחום מספרי → מספרים מכוונים**.

3.6. **הוראת משוואות ללא מספרים שליליים** תמוקם במסלול הקנוני:

**חטיבת ביניים → כיתה ז׳ → אלגברה → משוואות → הוראת משוואות ללא מספרים שליליים**.

3.7. היחידה בסעיף 3.6 תוכל לקבל קישור הקשרי מהנושא מספרים מכוונים, אך לא תוטמע פעמיים ולא תאבד את המסלול הקנוני שלה.

3.8. **אתר זוויות** ימוקם במסלול הקנוני:

**חטיבת ביניים → כיתה ז׳ → גאומטריה → יסודות הגאומטריה → זוויות**.

3.9. ניתן להציג קישור הקשרי לאתר זוויות גם בעמוד־על **חטיבת ביניים → גאומטריה**, אך ההטמעה המלאה תהיה פעם אחת בלבד.

3.10. **מערכת צירים — רביע ראשון** תמוקם במסלול הקנוני:

**חטיבת ביניים → כיתה ז׳ → מערכת צירים → רביע ראשון**.

3.11. ניתן לקשר למערכת הצירים מעמודי אלגברה וגאומטריה לפי ההקשר, אך אין לשכפל את סביבת ההטמעה.

3.12. **יחידת חפיפת משולשים** תמוקם במסלול הקנוני:

**חטיבת ביניים → כיתה ח׳ → גאומטריה → חפיפת משולשים**.

3.13. חומרי מבחנים לחטיבת הביניים ימוקמו תחת:

**חטיבת ביניים → בחינות והערכה**, ובתוך העמוד יחולקו לפי כיתה ז׳, ח׳ וט׳.

3.14. מיזם **AI וגאומטריה** ימוקם תחת:

**פיתוח מקצועי → בינה מלאכותית וחדשנות בהוראת המתמטיקה**.

3.15. ניתן להציג קישורי הקשר למיזם AI גם מחטיבת הביניים ומחטיבה עליונה, אך המקור הקנוני יישאר בפיתוח מקצועי.

3.16. **חוזר מפמ״ר** יוטמע פעם אחת בלבד תחת:

**חטיבה עליונה → מידע רשמי ומדיניות → חוזר מפמ״ר**.

3.17. בעמודי תוכניות לימודים, בחינות בגרות, המלצות הוראה ל־3/4/5 יח״ל, פיתוח מקצועי וחומרי הוראה יוצגו תקצירים וקישורי עומק לחוזר — לא הטמעה כפולה של ה־PDF.

3.18. מלאי חטיבה עליונה יחולק לפחות ל:

- תוכנית לימודים חדשה.
- בחינות בגרות והערכה.
- קמפוס IL וקורסי הכנה.
- המלצות הוראה לפי יחידות לימוד.
- חומרי הוראה.
- מעבר רמות ורשת ביטחון.
- תכנון שנתי.
- מאגרי אייל שלמה.
- מבוא לאנליזה.

3.19. הודעות ועדכונים יופיעו כפיד מסודר לפי תאריך וקטגוריה. חומרים תקופתיים, טפסים, מועדים, Meet וקישורי חירום לא יפורסמו אוטומטית ללא אימות עדכניות.

3.20. תוכן שאינו תלוי שנה יישמר גם אם הוא ישן, כל עוד הוא תקין ורלוונטי.

3.21. חוברת מחוז מרכז תוסר רק מהמיקום המדויק שבו היא מופיעה במקור הישן. אין לבצע מחיקה גורפת של חומרים חיצוניים או של מחוזות אחרים.

3.22. מקורות Canva שבסעיף 2 הם מקורות כרייה ומיפוי ולא עמודים קנוניים למשתמש, למעט משאב שאושר במפורש להצגה.

3.23. לכל משאב יהיה עמוד קנוני אחד. בעמודים אחרים מותר להציג כרטיס או קישור הקשרי בלבד.

3.24. בכל שכבה יש למיין משאבים לפי כיתה, תחום מתמטי, נושא וסוג משאב.

---

# 4. טכנולוגיה, ביצועים, אבטחה ונגישות

4.1. יש להשתמש ב־TypeScript ובארכיטקטורה מודרנית, מודולרית וניתנת לתחזוקה, אלא אם התכנון מוכיח פתרון טוב יותר.

4.2. יש להעדיף יצירה סטטית או היברידית, טעינה הדרגתית ו־code splitting.

4.3. יש לבצע lazy loading חכם להטמעות, סרטונים ותוכן כבד.

4.4. יש לבצע אופטימיזציה לתמונות ולווידאו, caching, preconnect וטיפול מסודר בשגיאות רשת.

4.5. אין שגיאות console, קישורים שבורים, hydration errors, גלילה אופקית לא רצויה או קפיצות layout.

4.6. כל פעולה תציג משוב ברור בעברית: נטען, הועתק, נשלח, הורד, נחסם או נכשל.

4.7. האתר יתמוך במקלדת, קוראי מסך, מגע, הגדלת טקסט, ניגודיות ו־`prefers-reduced-motion`.

4.8. יעד האיכות הוא ציוני Lighthouse גבוהים מאוד בביצועים, נגישות, Best Practices ו־SEO, בלי לרמות את הבדיקה.

4.9. כל הטמעה תשתמש בטכנולוגיה המתאימה ביותר: iframe מאובטח כאשר מותר, viewer ייעודי למסמכים ול־PDF, Web Share API לשיתוף, Clipboard API להעתקה, הורדה אמיתית לקבצים ו־fallback איכותי כאשר המקור חוסם הטמעה.

4.10. אין ליצור שכפול סטטי מזויף של אתר חיצוני כדי להיראות כאילו ההטמעה עובדת.

4.11. יש לבדוק `X-Frame-Options` ו־CSP, ולהגדיר `sandbox` ו־`allow` מצומצמים לפי הצורך.

---

# 5. שפה חזותית, ניווט, גלילה והנפשות

5.1. יש ליצור מערכת עיצוב אחת לכל האתר: צבעים, טיפוגרפיה, כרטיסים, כפתורים, מרווחים, אייקונים, hover, focus, loading, error ורכיבי הטמעה.

5.2. כל הכפתורים יהיו בעברית ברורה, גדולים ונוחים ללחיצה, עם אייקון וטקסט.

5.3. יש לבנות ניווט ראשי ברור, breadcrumbs, סימון עמוד פעיל, חזרה לעמוד הקודם וכפתור חזרה לראש העמוד.

5.4. בכל עמוד יהיו פעולות ייעודיות: נושא קודם/הבא, חזרה לקטגוריה, מעבר למקטעים מרכזיים וחזרה לעמוד הראשי.

5.5. פעולות חשובות לא יוסתרו בתפריט עמוק.

5.6. ההנפשות יהיו יוקרתיות, מהירות ובעלות משמעות: כניסות עדינות, מעבר בין עמודים, פתיחת הטמעות ומשוב למצבי כפתור.

5.7. אין להשתמש בהנפשות מוגזמות או כאלה שמאטות את האתר.

5.8. הגלילה תהיה חלקה ומדויקת, בלי scroll hijacking.

5.9. במובייל הניווט והפעולות החשובות יהיו נגישים לאגודל.

5.10. יש לשמור את מיקום המשתמש בעת חזרה ממשאב כאשר הדבר מועיל.

---

# 6. סרטון הפתיחה בעמוד הראשי

6.1. יניב יספק את קובץ הסרטון המוגמר. אין ליצור סרטון חדש ואין לערוך אותו בלי הוראה.

6.2. הסרטון יוצג בחלק העליון ביותר של העמוד הראשי בעת הכניסה.

6.3. הסרטון ינסה להתחיל אוטומטית עם שמע ויתנגן פעם אחת בלבד.

6.4. משך ההרצה המתוכנן הוא 7 שניות. אין loop.

6.5. בסיום הסרטון הוא ייעצר ויהפוך באנימציה חלקה ויוקרתית לפריים או רקע בהיר מאוד שעליו יוצג מלל ברור.

6.6. המצב הבהיר יישמר לאחר הסיום ולא יחזיר את הסרטון להתחלה.

6.7. אם הדפדפן חוסם autoplay עם שמע, יש להציג שכבת הפעלה איכותית בעברית בלחיצה אחת.

6.8. הסרטון יהיה מותאם למחשב ולטלפון, ללא חיתוך פוגעני, קפיצות layout או poster חסר.

---

# 7. העמוד הראשי ואנשי הצוות

7.1. איילת קריספין נשארת ומקבלת עדיפות חזותית: תמונה גדולה יותר, מיקום גבוה ומרכזי וכרטיס בולט יותר.

7.2. פרטי איילת:

- טלפון: `050-272-1656`
- דוא״ל: `ayeletk59@gmail.com`
- תפקיד: מדריכה מחוזית למתמטיקה על־יסודי, בהתאם למקור המאושר.

7.3. ויקטוריה צורי נשארת:

- טלפון: `050-564-6264`
- דוא״ל: `vikazury@gmail.com`
- תפקיד מדויק: **מדריכה מחוזית חט״ע מחוז ירושלים**

7.4. אביגיל ויקסלבוים תוסר לחלוטין.

7.5. ענבל כהן תוסר לחלוטין.

7.6. יניב רז מחליף את אביגיל:

- שם: **יניב רז**
- טלפון: `052-374-8115`
- דוא״ל: `yanivmiz77@gmail.com`
- תפקיד מדויק: **מדריך מחוזי לחטיבת הביניים בעיר ירושלים**

7.7. אורלי מחליפה את ענבל:

- שם להצגה בשלב זה: **אורלי**
- טלפון: `050-639-5257`
- תפקיד מדויק: **מדריכה מחוזית חט״ע מחוז ירושלים**
- אין להמציא שם משפחה או דוא״ל עד שיימסרו.

7.8. אין להשאיר כרטיסים ריקים, פרטי קשר ישנים או אזכור מוסתר של אביגיל וענבל.

7.9. כל כרטיס מדריך ייראה לחיץ ויכלול פעולות מהירות: **שליחת WhatsApp** ו־**שליחת דוא״ל** כאשר קיימת כתובת.

7.10. לחיצה על טלפון או WhatsApp תפתח שיחה למספר בפורמט בינלאומי תקין.

7.11. לחיצה על דוא״ל תפתח חלון כתיבה חדש ב־Gmail עם הנמען מוזן.

7.12. אין להפוך את כל הכרטיס לקישור יחיד שמונע בחירה בין WhatsApp לדוא״ל.

---

# 8. סביבת משאב אחידה

8.1. כל אתר, יישומון, מסמך, מצגת, PDF או משימה יוצגו בתוך רכיב אחיד ברמת מוצר.

8.2. במחשב ובמסך רחב:

- החצי הימני: המשאב המוטמע בפועל.
- החצי השמאלי: לוח פעולות אחיד בעברית.

8.3. המשתמש יוכל לצפות, לגלול, ללחוץ ולנווט במשאב לפני פתיחתו במקור.

8.4. לוח הפעולות יכלול לפי סוג המשאב:

- שליחה ב־WhatsApp.
- שיתוף באמצעות מנגנון המכשיר.
- העתקת קישור.
- הורדת קובץ אמיתי כאשר קיים.
- פתיחה במקור בכרטיסייה חדשה.
- הדפסה כאשר מתאים.
- מסך מלא כאשר מועיל ואפשרי.

8.5. אין להציג כפתור הורדה מזויף לאתר שאין לו קובץ להורדה.

8.6. במובייל הפריסה תהפוך לאנכית: ההטמעה תחילה ולוח הפעולות מיד אחריה או כפס פעולות נגיש.

8.7. ההטמעה תהיה גבוהה ונוחה לשימוש אמיתי, עם גלילה פנימית תקינה.

8.8. אם מקור חוסם iframe, אין להציג מסגרת שבורה. יש להציג fallback איכותי עם תצוגה מקדימה, הסבר קצר ופעולות מתאימות.

8.9. הטמעות כבדות ייטענו רק סמוך לאזור הצפייה ויציגו skeleton איכותי.

8.10. כל הטמעה תיבדק במחשב ובטלפון, כולל גלילה, לחיצות, ניווט פנימי, שינוי כיוון מסך וחזרה לעמוד.

---

# 9. משאבים קנוניים שאושרו

## 9.1. איילת קריספין — אתר המחשות

- שם מדויק: **איילת קריספין — אתר המחשות**
- קישור קנוני: `https://mamhishim.my.canva.site/`
- מיקום: עמוד ראשי, משבצת מרכזית ודומיננטית.
- יש להטמיע בסביבת המשאב האחידה.
- כפתור העתקת קישור יעתיק בדיוק את הכתובת הקנונית.

## 9.2. קבוצת WhatsApp לחטיבות הביניים

- כותרת מדויקת: **קבוצת WhatsApp למורי חטיבות הביניים בעיר ירושלים ובמחוז ירושלים**
- קישור: `https://chat.whatsapp.com/L9P0Z6BFevZHzgdURMmfIK`
- מיקום: **חטיבת ביניים → קהילת מורים ותקשורת**.
- יש להציג כפתור הצטרפות ברור ונגיש.

## 9.3. חוזר מפמ״ר

- שם תצוגה מדויק: **חוזר מפמ״ר**
- מקור רשמי קנוני: `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/mafmar/hozer-mafmar-tashpaz.pdf`
- אין להעתיק את ה־PDF לריפו.
- יש לנתח אותו עמוד־עמוד לפני המימוש ולבנות מפת תוכן.
- ה־PDF יוטמע פעם אחת בלבד תחת **חטיבה עליונה → מידע רשמי ומדיניות → חוזר מפמ״ר**.
- המקורות הישנים הבאים אסורים להצגה:
  - `https://drive.google.com/file/d/1bYWFDV0wPw-5BcawE6bCnnV9AmobaL-X/view`
  - `https://www.canva.com/design/DAGMyXpeCoo/jM082g4sTewQLQ5WcQjnbQ/edit`

## 9.4. מספרים מכוונים

- שם: **מספרים מכוונים**
- קישור: `https://misparim.vercel.app/`
- מיקום: **חטיבת ביניים → כיתה ז׳ → תחום מספרי → מספרים מכוונים**.
- היחידה החדשה מחליפה קישורים ישנים וכפולים שממלאים אותו תפקיד, אך לא חומר ייחודי.

## 9.5. אתר זוויות

- שם: **אתר זוויות**
- אתר חי: `https://zaviyot.vercel.app/`
- מקור קוד: `https://github.com/yanivmizrachiy/misparim/tree/main/zaviyot`
- מיקום קנוני: **חטיבת ביניים → כיתה ז׳ → גאומטריה → יסודות הגאומטריה → זוויות**.
- קישור GitHub הוא מקור טכני בלבד; המשתמש יקבל את האתר החי.

## 9.6. מערכת צירים — רביע ראשון

- שם: **מערכת צירים — רביע ראשון**
- אתר חי: `https://yanivmizrachiy.github.io/coordinate-first-quadrant/`
- ריפו מקור: `https://github.com/yanivmizrachiy/coordinate-first-quadrant`
- מיקום קנוני: **חטיבת ביניים → כיתה ז׳ → מערכת צירים → רביע ראשון**.

## 9.7. חוברת מחוז מרכז

- יש לאתר במקור הישן את החוברת היחידה המזוהה כחומר של מחוז מרכז ולהסיר רק אותה.
- לפני ההסרה יש לתעד בתוכנית ההגירה את הכותרת, הקישור והמיקום המדויק.

---

# 10. הוראת משוואות ללא מספרים שליליים

10.1. הכותרת המדויקת היא **הוראת משוואות ללא מספרים שליליים**.

10.2. הכותרת מחליפה בכל מקום את **משוואות לפני מספרים מכוונים**.

10.3. מיקום קנוני: **חטיבת ביניים → כיתה ז׳ → אלגברה → משוואות → הוראת משוואות ללא מספרים שליליים**.

| מזהה | מקטע | כותרת | קישור |
|---|---|---|---|
| EQ-001 | ידע קודם | המחשה להצבה | `https://youtu.be/0nSr1WCAny0` |
| EQ-002 | ידע קודם | המחשה לכינוס איברים דומים | `https://www.youtube.com/watch?v=UppwYNJ54eE` |
| EQ-003 | ידע קודם | אביזרים לכינוס | `https://drive.google.com/file/d/1dSnwiLoDV-wc-PrGhlwSOOfLRAqbTDHe/view` |
| EQ-004 | ידע קודם | המחשה לחוק הפילוג | `https://www.youtube.com/watch?v=YXZniDIq-fo` |
| EQ-005 | פתיחת הנושא | המחשה למשוואות | `https://www.youtube.com/watch?v=sG29G9L6ryA` |
| EQ-006 | שקילות | תלמיד מסביר שקילות | `https://drive.google.com/file/d/1qTY3a-vKH4ln74wv70P65bgRsyFxJrWv/view` |
| EQ-007 | פתרון | המחשה לפתרון משוואות | `https://www.youtube.com/watch?v=D4Oo38fhRRM` |
| EQ-008 | אביזרים | אביזרים לאיקסים | `https://drive.google.com/file/d/1fSJFOgP3v0UKqZSRrOA4pKMFLIhyqFT_/view` |
| EQ-009 | אביזרים | עיגול חיובי | `https://drive.google.com/file/d/1P16c2POHKsHuz_PDKeaTesNTw8kvo1pQ/view` |
| EQ-010 | שברים | המחשה למשוואות עם שברים | `https://www.youtube.com/watch?v=RdT305fkRfY` |
| EQ-011 | שברים | אביזרים | `https://drive.google.com/file/d/1qW3Q6kbg5FVHTfwpCSwT-lyKoyLrxJW8/view` |
| EQ-012 | דפי עבודה | דף עבודה 1 | `https://drive.google.com/file/d/16CwU2fOhYh8lMNl0f75VWZoapUwT9k8b/view` |
| EQ-013 | דפי עבודה | דף עבודה 2 | `https://drive.google.com/file/d/1blAZSnQOL3lQ4GegTUsxxfkW9fkvp2bn/view` |
| EQ-014 | דפי עבודה | דף עבודה 3 | `https://drive.google.com/file/d/16T_I40rssYbQqNIN_K6RVbQOuUlsxfYW/view` |
| EQ-015 | דפי עבודה | דף עבודה 4 | `https://drive.google.com/file/d/1VKNTBajl59PkI6EF0lAd2BwnohTqFkcc/view` |
| EQ-016 | תרגול | משוואות פשוטות | `https://drive.google.com/file/d/1MnFTC4YgkN3U3wkLya4qtdTmlOAL8lc3/view` |
| EQ-017 | פתיח | חידות בציורים | `https://docs.google.com/presentation/d/1sExLrTu_MQh95wcbe7IBfnSmuhzs5-mq/edit` |
| EQ-018 | פתיח | חידות סמלי צה״ל | `https://drive.google.com/file/d/14tArAlzqxb1hHGXc5-hJ2NnZpQGVRpGQ/view` |
| EQ-019 | משחק | SET | `https://docs.google.com/document/d/1qFR6gmvQZ_4N3eOII_WZzUr1ZE2dpjnY/edit` |

---

# 11. מלאי חטיבה עליונה

הקישורים חייבים להיבדק ולמפות. הם אינם מאושרים אוטומטית לפרסום אם הם מיושנים, כפולים או הוחלפו.

| מזהה | אזור | כותרת | קישור |
|---|---|---|---|
| HS-001 | תוכנית חדשה | תוכנית הלימודים החדשה | `https://pop.education.gov.il/tchumey_daat/matmatika/chativa-elyona/teaching-mathematics/new-curriculum/` |
| HS-002 | תוכנית חדשה | מתאם וניבוי — ספר סטטיסטיקה | `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/new-curriculum/correlation-prediction-12.pdf` |
| HS-003 | תוכנית חדשה | אוסף שאלות בגרות — תוכנית חדשה | `https://drive.google.com/file/d/1RsGHTLn2SfpuUPNPtVSTHb4xEl6BDS70/view` |
| HS-004 | בחינות | חוקי מענה תשפ״ו | `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/tashpav/strucure-points-time-tashpav.pdf` |
| HS-005 | בחינות | שאלות 582 לפי נושאים | `https://drive.google.com/file/d/1JRtyvYyvJ-W8JTbOpUf3YXqlFjJKaeIt/view` |
| HS-006 | קמפוס IL | קמפוס IL | `https://campus.gov.il` |
| HS-007 | קמפוס IL | פירוט הקורסים במתמטיקה | `https://pop.education.gov.il/tchumey_daat/matmatika/chativa-elyona/teaching-mathematics/preparatory-courses-for-matriculation/` |
| HS-008 | קמפוס IL | איך מצטרפים | `https://drive.google.com/file/d/1X__pL0hlNV55NkrDcIhKNjrfOEaIE_bd/view` |
| HS-009 | קמפוס IL | סרטון הדרכה | `https://www.youtube.com/watch?v=tt-xGW3Vb2g` |
| HS-010 | המלצות הוראה | 3 יח״ל תשפ״ו | `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/tashpav/Teaching_Recommendations-3units-tashpav.pdf` |
| HS-011 | המלצות הוראה | 4 יח״ל תשפ״ו | `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/tashpav/Teaching-Recommendations-4units-tashpav.pdf` |
| HS-012 | המלצות הוראה | 5 יח״ל תשפ״ו | `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/tashpav/Teaching-Recommendations-5units-tashpav.pdf` |
| HS-013 | בחינות | טבלת הצירופים | `https://meyda.education.gov.il/files/Exams/PossibleCombinationsMathExams2023.pdf` |
| HS-014 | בחינות | גמולי בגרות | `https://meyda.education.gov.il/files/Sherut/hozershe.pdf` |
| HS-015 | בחינות | שאלוני בגרות בשפות שונות | `https://meyda.education.gov.il/bagmgr/default.html#/` |
| HS-016 | בחינות | אגף בחינות הבגרות | `https://exams.education.gov.il` |
| HS-017 | חומרי הוראה | חומרים מרכז מורים | `https://newhighmath.haifa.ac.il/index.php/2015-05-31-10-59-23/2015-05-31-11-12-42` |
| HS-018 | חומרי הוראה | חומרים תומכי הוראה | `https://newhighmath.haifa.ac.il/index.php/2017-08-14-09-30-32` |
| HS-019 | חומרי הוראה | משאבי הוראה — רשת עתיד | `https://drive.google.com/file/d/1NdKxVSdRnkbWS0k9aZmV3kINAvlC1q6i/view` |
| HS-020 | חומרי הוראה | משחקים — רשת עתיד | `https://drive.google.com/file/d/1V1k-jZXw3ZC23jVuG5XO01Km0bbgi25s/view` |
| HS-021 | מעבר רמות | רשת ביטחון | `https://drive.google.com/file/d/1MxbkdfSrW83Qv0lRTELlSu1eBnV1Q5hs/view` |
| HS-022 | תכנון | תכנון שנתי י׳–י״ב 4–5 יח״ל | `https://docs.google.com/document/d/1fIKdN4Z2P5m2qQ_ordySt8iYE_61fEDdykzIx3kPOKQ/edit` |
| HS-023 | אייל שלמה | כיתה י׳ 4 יח״ל | `https://docs.google.com/document/d/15Y-T9nA6JPPfrNR8ochfyh-vznx4JV6osz8YlJoAYrY` |
| HS-024 | אייל שלמה | כיתה י״א 471 | `https://docs.google.com/document/d/1DX_XRBOuTmaW8K7kjlre6kmFig630yKVWK0PNC4NK6I/edit` |
| HS-025 | אייל שלמה | כיתה י״ב 472 | `https://docs.google.com/document/d/1Q5X9z1kc2BFynRNuIyD5_RIujFS8RgdMI_1qsK3aYnI/edit` |
| HS-026 | מבוא לאנליזה | מכון ויצמן | `https://www.weizmann.ac.il/ScienceTeaching/sites/ScienceTeaching/files/uploads/mbv_lnlyzh.pdf` |

---

# 12. מלאי הודעות ועדכונים

| מזהה | כותרת | קישור | הוראת טיפול |
|---|---|---|---|
| NEWS-001 | חוזר מפמ״ר ישן | `https://drive.google.com/file/d/1bYWFDV0wPw-5BcawE6bCnnV9AmobaL-X/view` | להסיר; הוחלף בתשפ״ז |
| NEWS-002 | מצגת חוזר מפמ״ר תשפ״ו | `https://www.canva.com/design/DAGMyXpeCoo/jM082g4sTewQLQ5WcQjnbQ/edit` | להסיר; הוחלף בתשפ״ז |
| NEWS-003 | מיזם המחוז AI | `https://www.canva.com/design/DAGXfTc1quE/1PcfhEqh7l9rJk7AdLqi2Q/view` | לבדוק ולמפות |
| NEWS-004 | הנחיות לכתיבת מבחני בגרות | `https://drive.google.com/file/d/19edSXZCMSSnFVFvD6B4I-VKRqyGVNwcK/view` | לבדוק רלוונטיות |
| NEWS-005 | הנחיות מותאמות לחטיבה | `https://www.canva.com/design/DAGgNE8sRTg/a5P1Vsf4ClH1fv2S1YvwGA/view` | מקור חט״ב |
| NEWS-006 | יום הזיכרון לשואה ולגבורה | `https://drive.google.com/file/d/1OF2zYl9y6tS1tdM-z5Nq_uv2ocKoDan1/view` | חומר תקופתי |
| NEWS-007 | היגדים לתעודה | `https://docs.google.com/document/d/1pumOgbN_yjA2eLzkmOGNgHponWeqWjsX_x29zl9gq4/edit` | לבדוק ולמפות |
| NEWS-008 | זוכי המיזם | `https://www.canva.com/design/DAGovHDha5Y/i7UHi1dRl8r2_tMVbcwACw/view` | לבדוק פרטיות |
| NEWS-009 | כל ההגשות למיזם | `https://www.canva.com/design/DAGnPGxY1s4/8m_6u9es3t6JYNhidJuwcg/view` | לבדוק פרטיות והרשאות |
| NEWS-010 | מבחן תנופה ט׳ | `https://rama.edu.gov.il/assessments/tnufa-math-9-2026` | מקור רשמי |
| NEWS-011 | אבני דרך לרכז | `https://www.canva.com/design/DAGrur1PocA/7qKMknADGZHkefhort-_TQ/view` | לבדוק ולמפות |
| NEWS-012 | תוכנית הלימודים ז׳–ח׳ | `https://pop.education.gov.il/tchumey_daat/matmatika/chativat-beynayim/teaching-mathematics/tohnit-limudim/` | מקור רשמי |
| NEWS-013 | פריסה חט״ב — שאגת הארי | `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativat-Beynayim/tashpav/idkunari.pdf` | לבדוק תוקף |
| NEWS-014 | חוקי מענה — כולל מותאמים | `https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/lions-roar.pdf` | לבדוק תוקף |
| NEWS-015 | פורטל תלמידים — בגרות | `https://meyda.education.gov.il/files/portal_talmidim/maane_2026/math_2026.pdf` | לבדוק עדכניות |
| NEWS-016 | חוזר עדכון — שאגת הארי | `https://meyda.education.gov.il/files/Exams/MoreNewDetailsSumExams2026.pdf` | לבדוק תוקף |

---

# 13. מיזם AI וגאומטריה

| מזהה | כותרת | קישור |
|---|---|---|
| AI-001 | מצגת המפגש | `https://www.canva.com/design/DAGS_5y1S1Q/dlXqz9hNqBcmVUTw1jLVew/view` |
| AI-002 | מאגר משפטים לחט״ב וחט״ע | `https://docs.google.com/document/d/1hROVvxSZ5W_-e_IeyIp5wfFcZ7BQRTQYr8m5jgl8sTE/edit` |
| AI-003 | טופס הגשה | `https://forms.gle/J5EWjZdzjeeFbiwy5` |
| AI-004 | סדנה לצוות בנושא AI | `https://docs.google.com/document/d/1IVVogee2WtilgKINVJZiuazjufFJGS1I44qielWozCM/edit` |
| AI-005 | טופס הרשמה | `https://forms.gle/JeLj3GYJtEGF6o4QA` |
| AI-006 | סרטוני הדרכה לכלי AI | `https://www.canva.com/design/DAGTcgS715I/CNLgikXKBiuP1yrYVbAixg/edit` |
| AI-007 | אישורי הורים AI | `https://drive.google.com/file/d/19U0lwwda6WD0Wp1m-zzcRbxicPPHFaBf/view` |
| AI-008 | מאגר תכונות ליסודי | `https://docs.google.com/document/d/14UQjaAkcT0i1RM83J5W9DZwNoPhNDnQc5JWtf8phXHY/edit` |
| AI-009 | הקלטת המפגש | `https://drive.google.com/file/d/15CaDtBwic1wmVU-khR73LO31fHiT0YGL/view` |
| AI-010 | אתרים לעזר לתלמידים | `https://www.canva.com/design/DAGTci51edI/pE8mI4hCVHdsX-ieWX5BfQ/edit` |
| AI-011 | תבנית למבנה פרומפט | `https://www.canva.com/design/DAGTchEijyY/O8m11CGHBEMdHXoms8Q6ow/edit` |
| AI-012 | מדריך להורים כיצד לאשר | `https://drive.google.com/file/d/1QSZYOq-tAMMyDKqPCNn_ExiaWxg5Ebgx/view` |
| AI-013 | עמוד המיזם באתר המחוז | `https://sites.google.com/edujer.org.il/main/projects/GEOM?authuser=0` |
| AI-014 | הנחיות משרד החינוך לשימוש ב־AI | `https://meyda.education.gov.il/files/Mazkirut_Pedagogit/Ivrit/instructionsai.pdf` |
| AI-015 | Copilot Image Creator | `https://copilot.microsoft.com/images/create?cc=by&setlang=he` |
| AI-016 | Canva | `https://www.canva.com` |
| AI-017 | אתר המקפצה | `https://homework.lnet.org.il` |
| AI-018 | מפגשי Meet | `https://meet.google.com/bnk-ccan-uqo` |

13.1. טפסים, Meet, מועדים ואירועים לא יפורסמו לפני אימות שהם עדיין פעילים ורלוונטיים.

13.2. לפני הצגת תוצרי תלמידים או הגשות יש לבדוק פרטיות, הרשאות וזכויות שימוש.

---

# 14. הנחיות מבחנים לחטיבת הביניים

| מזהה | כותרת | קישור |
|---|---|---|
| EXAM-001 | מסמך הנחיות לבגרות | `https://drive.google.com/file/d/19edSXZCMSSnFVFvD6B4I-VKRqyGVNwcK/view` |
| EXAM-002 | דף נוסחאות כיתה ז׳ | `https://drive.google.com/file/d/1nJdVkTlZvnulYiabkeVZG0BT6ek1lU0c/view` |
| EXAM-003 | דף נוסחאות כיתה ח׳ | `https://drive.google.com/file/d/1hf30qH4SbS7UxRlkmrFiitDhdoDFt90B/view` |
| EXAM-004 | דף נוסחאות כיתה ט׳ | `https://drive.google.com/file/d/1UJJeoCAomVPNp4PN3FsBhCbfaqcSxL1G/view` |
| EXAM-005 | יצירת עותק נוסחאות ז׳–ח׳ | `https://docs.google.com/document/d/1PS4B4VwdZQk5S5BfjUzC2RtQ-9WEexRp/edit` |
| EXAM-006 | מבחן דמוי מיצ״ב | `https://docs.google.com/document/d/1-F8gCF7V9X1afsr2D5vOLdgq8DC1OzlH/edit` |
| EXAM-007 | מחוון למבחן דמוי מיצ״ב | `https://docs.google.com/document/d/10eruHhJRK6HX3nvD17tAypCTqNoC83WD/edit` |

---

# 15. יחידת חפיפת משולשים

מיקום קנוני: **חטיבת ביניים → כיתה ח׳ → גאומטריה → חפיפת משולשים**.

| מזהה | כותרת | קישור |
|---|---|---|
| TRI-001 | דגשים ותוכנית לימודים עמ׳ 65–67 | `https://drive.google.com/file/d/1XnfhK0QDM6zJ3gNjFwlejbytlp83m1yL/view` |
| TRI-002 | קטעים מיוחדים במשולש | `https://drive.google.com/file/d/1kNLWfMl9n6aDT7XvLPLm70zcsNXciSf7/view` |
| TRI-003 | תרגול גובה, חוצה ותיכון | `https://drive.google.com/file/d/1_co8LL9f_tehRcvo3jf3b8h2zlsKnUxe/view` |
| TRI-004 | הוכחות קלוז׳ | `https://drive.google.com/file/d/11FF7rD6J-rN1zWkdKPe3u_wH05DSkkAK/view` |
| TRI-005 | משולשים חופפים — סרטון | `https://www.youtube.com/watch?v=qcrpQtXeoNk` |
| TRI-006 | שאלות מיצ״ב | `https://drive.google.com/file/d/1U9MWkPTDskM9Jn1-cA5y2hMrF7Ij6Uvl/view` |
| TRI-007 | שאלות אוריינות | `https://newhighmath.haifa.ac.il/index.php/2-uncategorised/3513-2022-09-21-13-52-32` |
| TRI-008 | שלושת משפטי החפיפה | `https://drive.google.com/file/d/1FnNw0qBvpSNtSZOAWOliltb_y2qVMobo/view` |
| TRI-009 | השלמת נתונים | `https://drive.google.com/file/d/1E8dPGfKEpoNXT8Mkqww2D90IktH0HdV_/view` |
| TRI-010 | תרגול בסיסי נוסף | `https://drive.google.com/file/d/1BUykzUUA5elFdrIb6T3RJK5vmMjpOYyW/view` |
| TRI-011 | נתונים סמויים | `https://drive.google.com/file/d/1rfSuEBuESiQ5bn0eG7lRcx5KEH9X1tFd/view` |
| TRI-012 | דף עבודה נוסף | `https://drive.google.com/file/d/160eY2ZC_b5RvVki1EUuqFzbCYAQ8xrlF/view` |
| TRI-013 | יישומון משפטי חפיפה | `https://learningapps.org/watch?v=p6beyu7aj21` |
| TRI-014 | מהלך יחידת הלימוד | `https://docs.google.com/document/d/1vpVmsEgidK5XITyJn4m8RNfstdBqxGYC1GUE5w0g6eQ/edit` |
| TRI-015 | חזרה למבחן — למידה מטעויות | `https://drive.google.com/file/d/1jtuURm95G4A54B73WMYqmcVNSSWL5WUX/view` |
| TRI-016 | מצגת שלושת משפטי החפיפה | `https://docs.google.com/presentation/d/1aVZz3xpcZr6BfGJ71I5PyrIs-7_Hp2-w/edit` |
| TRI-017 | משולשים לשקפים — תלמיד | `https://drive.google.com/file/d/1xJCxI3f3NInPcX_sDE1AOq5xS_8aPOGe/view` |
| TRI-018 | משולשים לשקפים — מורה | `https://drive.google.com/file/d/19YuxUwvrCwEYTJJRaZgYdUxidIlJYdWo/view` |
| TRI-019 | גובה במשולש | `https://www.youtube.com/watch?v=LFi75RR0jeY` |
| TRI-020 | חוצה זווית | `https://www.youtube.com/watch?v=qwHXtwJxc6s` |
| TRI-021 | תיכון במשולש | `https://youtu.be/FyYHP0_hP5o` |
| TRI-022 | יישומון משולש שווה־שוקיים | `https://learningapps.org/watch?v=pit1urih223` |
| TRI-023 | מצגת משולש שווה־שוקיים | `https://drive.google.com/file/d/1hXV7TTOGdpTRoEO-GMLQ9U1Ytc0aFUyy/view` |
| TRI-024 | גאומטריה במערכת צירים 1 | `https://docs.google.com/document/d/1YxrwU_YoHY1QxFN-fNkCGBYxpjw7Yi0T1CwlZvrPP2E/edit` |
| TRI-025 | גאומטריה במערכת צירים 2 | `https://docs.google.com/document/d/1xAIcMljEP47jDT-6ApRddcrgKYQm_N49szsaXTJF3jc/edit` |
| TRI-026 | בוחן מסכם | `https://drive.google.com/file/d/1psPLnq6tncumtDhID3KAZZE0w7Ib8ma6/view` |

---

# 16. העברת תוכן, בדיקת קישורים ופרטיות

16.1. יש לחלץ באופן רקורסיבי את כל הקישורים ממקורות־השורש, כולל קישורים בתוך מסמכים ומצגות ככל שניתן לגשת אליהם.

16.2. לכל קישור ייקבע סטטוס פנימי: תקין, מיושן, כפול, חסום, פרטי, דורש החלפה או מאושר לפרסום.

16.3. מסמכים שנתיים מתשפ״ו, אירועים, טפסים, Meet וקישורי חירום לא יועברו אוטומטית; יש לאמת רלוונטיות לתשפ״ז.

16.4. משאבי הוראה שאינם תלויי שנה לא יימחקו רק בגלל גילם.

16.5. קישורי `edit` של Google או Canva יומרו לקישורי צפייה בטוחים כאשר ניתן, בלי לשבור הרשאות.

16.6. לפני פרסום תוצרי תלמידים או מאגרי הגשות יש לבדוק פרטיות, הרשאות, שמות וזכויות שימוש.

16.7. אין להעתיק פסקאות ארוכות ממסמכים רשמיים; יש להציג תקצירי ניווט והפניה למקור.

---

# 17. הלוגו

17.1. רק לאחר תחילת הבנייה, Claude Code יאתר את הלוגו בריפו של יניב המכונה **מספרים שלי**.

17.2. יש לאמת שזהו הלוגו הנכון לפני שילובו.

17.3. אין ליצור לוגו חלופי ואין להשתמש בקובץ לא מאומת.

---

# 18. SEO וגוגל

18.1. יש להכין את האתר לאינדוקס אמיתי באמצעות:

- Google Search Console.
- `sitemap.xml`.
- `robots.txt`.
- canonical URLs.
- metadata מלא בעברית.
- Open Graph.
- structured data במקומות המתאימים.
- היררכיית כותרות תקינה.
- כתובות URL קריאות.

18.2. אין לטעון שהאתר מאונדקס עד שהדבר אומת בפועל.

---

# 19. בדיקות קבלה מחייבות

19.1. יש ליצור טבלת התאמה סופית שבה כל דרישה ממוספרת מסומנת כמיושמת ונבדקת.

19.2. יש לבדוק את האתר בפועל במחשב נייד ובטלפון, במסכי רוחב שונים ובדפדפנים מרכזיים.

19.3. כל כפתור חייב לבצע את הפעולה הכתובה עליו.

19.4. כפתורי הניווט בכל עמוד יהיו בולטים, מהירים, מועילים ויובילו ליעד הנכון.

19.5. כל טלפון וכפתור WhatsApp יפתחו שיחה נכונה וכל דוא״ל יפתח Gmail לנמען הנכון.

19.6. כרטיסי המדריכים ייראו לחיצים ויאפשרו גישה בלחיצה אחת לפעולות הקשר.

19.7. כל כפתור העתקה יעתיק את הכתובת המדויקת ויציג משוב בעברית.

19.8. כל שיתוף והורדה יעבדו בפועל ולא יהיו כפתורי דמה.

19.9. כל הטמעה תהיה ניתנת לגלילה ולשימוש, או תציג fallback תקין.

19.10. סרטון הפתיחה יפעל לפי מדיניות הדפדפן, ירוץ פעם אחת במשך 7 שניות, ייעצר ויהפוך לרקע בהיר באנימציה שנקבעה.

19.11. איילת תוצג גדולה ומרכזית יותר; ויקטוריה ואורלי בתפקיד **מדריכה מחוזית חט״ע מחוז ירושלים**; יניב בתפקיד **מדריך מחוזי לחטיבת הביניים בעיר ירושלים**.

19.12. אביגיל וענבל לא יופיעו בשום מקום פעיל.

19.13. חוזר מפמ״ר תשפ״ז יהיה המקור הפעיל היחיד ושני המקורות הישנים לא יוצגו.

19.14. לא יהיו כפילויות, תוכן לא קשור, placeholder, קישור שבור, רכיב ריק או מידע מומצא.

19.15. תבוצע בדיקת רגרסיה לאחר כל שינוי משמעותי.

19.16. אין להכריז שהאתר הושלם לפני שכל בדיקות הקבלה עברו בפועל.

---

# 20. בריאות הקובץ וכלל הכרעה

20.1. `RULES.md` הוא מקור האמת היחיד וחייב להישאר מסמך אחד, בריא, מסודר, ממוספר וללא סתירות.

20.2. כל דרישה חדשה של יניב תשולב בסעיף המתאים ולא תתווסף כפתק מנותק.

20.3. אין לשמור כאן יומני עבודה, שגיאות התחברות, פקודות מסוף, ניסיונות טכניים או תוכן שאינו דרישת אתר או קישור הקשור לאתר.

20.4. אין למחוק דרישה פעילה כדי לקצר את המסמך.

20.5. קישור ישן שנשמר לצורכי מיפוי אך אסור לפרסום יסומן במפורש.

20.6. כאשר חסר מידע, יש להשאיר סימון ברור ולא לנחש.

20.7. כאשר קיימת מגבלה טכנית של דפדפן או אתר חיצוני, יש ליישם את החוויה הקרובה ביותר עם fallback איכותי ולדווח במדויק על המגבלה.

20.8. כל שינוי במסמך יישמר ב־commit ברור, ולאחריו יש לקרוא שוב את הקובץ ולאמת שהשינוי נשמר ללא אובדן תוכן.
