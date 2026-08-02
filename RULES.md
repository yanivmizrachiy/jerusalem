# RULES.md — פרומפט־על יחיד ומחייב ל־Claude Code

## הוראת־על

Claude Code נדרש **לתכנן תחילה ורק לאחר אישור מפורש של יניב לבנות** אתר הפקה מלא בשם **מחוז ירושלים**. מסמך זה הוא מקור האמת היחיד של הפרויקט. הוא כולל רק דרישות אתר, כללי ביצוע וקישורי תוכן הקשורים לאתר.

בשלב איסוף הדרישות מותר להחזיק בענף `main` רק את `RULES.md`. אין ליצור אתר, קוד, נכסים או מסמכים נוספים לפני שיניב מאשר במפורש להתחיל בבנייה.

שם הריפו המחייב הוא `jerusalem`.

---

# 1. כללי יסוד מחייבים

1.1. בנה אתר אמיתי ומוכן לפרסום — לא דמו, לא אב־טיפוס, לא מסכים מזויפים ולא כפתורים שאינם מחוברים.

1.2. כל רכיב, קישור, הטמעה, כפתור, שיתוף, הורדה, ניווט ואנימציה חייבים לעבוד בפועל במחשב ובטלפון.

1.3. האתר יהיה בעברית מלאה, RTL, נגיש, מהיר, מאובטח, רספונסיבי ועקבי מבחינה חזותית.

1.4. השתמש במלוא יכולות התכנון, המחקר, הקידוד, הבדיקה והאוטומציה הזמינות לך. אין להסתפק בפתרון שטחי כאשר ניתן לבנות פתרון חזק, אמין ומהיר יותר.

1.5. בחר לכל צורך את הטכנולוגיה היציבה, המהירה, המתקדמת והחזקה ביותר שאתה מסוגל ליישם ולתחזק בפועל. אל תוסיף מורכבות ללא תועלת, אך אל תתפשר על איכות, אבטחה, ביצועים, נגישות, SEO וחוויית משתמש.

1.6. שמור 100% מהדרישות המפורשות במסמך זה. אין להשמיט דרישה בגלל אורך, קושי או מורכבות.

1.7. לפני כל שלב ביצוע בצע בדיקת עקביות מול כל הדרישות הממוספרות. הוראה מפורשת ומאוחרת יותר של יניב גוברת על ניסוח ישן שסותר אותה.

1.8. אין להוסיף תוכן, תכונה או עמוד שאינם קשורים ישירות לאתר מחוז ירושלים.

1.9. אין למחוק תוכן ייחודי מהאתר המקורי בלי שהוא הוחלף במקור חדש או בלי הוראה מפורשת.

1.10. מקור חדש שמבצע בדיוק את תפקידו של מקור ישן מחליף אותו; אין להשאיר כפילות פעילה.

1.11. אין להמציא שם, תפקיד, טלפון, דוא״ל, קישור, קובץ או מידע שחסר.

1.12. כל הקישורים הישנים והחדשים ייבדקו בפועל. קישור שבור, פרטי, מיושן, חסום או לא מאומת לא יוצג כאילו הוא תקין.

1.13. העיצוב יהיה נקי, יוקרתי, מודרני, צבעוני בעדינות ומסודר — ללא עומס וקישוט יתר.

1.14. אין להכריז על השלמה, הצלחה, חיבור או פרסום לפני אימות בפועל.

---

# 2. שלב תכנון חובה לפני כתיבת קוד

2.1. לפני יצירת קובץ אתר ראשון, הפק תוכנית ביצוע מלאה הכוללת:

- מטרות האתר וקבוצות המשתמשים.
- מפת אתר מלאה.
- חלוקה לחט״ב, חט״ע, הודעות, משאבים, קהילת מורים ומידע רשמי.
- מטריצת דרישות המקשרת כל מספר במסמך לרכיב, לעמוד ולבדיקת קבלה.
- מפת כל הקישורים: מקור, יעד, נושא, קהל, עמוד, מקטע, מצב תקינות, כפילות והחלפה.
- בדיקת סתירות, כפילויות וחוסרים.
- החלטת stack מנומקת.
- ארכיטקטורת רכיבים ומערכת עיצוב אחידה.
- תוכנית ניווט וגלילה לכל עמוד.
- אסטרטגיית הטמעות, fallback, שיתוף, הורדה והדפסה.
- אסטרטגיית ביצועים, נגישות, אבטחה, SEO ובדיקות.
- תוכנית מעבר מהמקורות הישנים לאתר החדש בלי אובדן תוכן ייחודי.

2.2. אין לפתור סתירה באמצעות מחיקה שקטה. יש להכריע לפי ההוראה המאוחרת והמפורשת יותר של יניב ולשמור את התוצאה היחידה והברורה.

2.3. במהלך התכנון אין ליצור קובץ תכנון נוסף בריפו. התכנון יבוצע במסגרת העבודה של Claude Code, ו־`RULES.md` יישאר מקור האמת.

2.4. אתר המקור לעיון ולמיפוי בלבד:

`https://www.canva.com/design/DAGM0kdNDuo/XMHagjp_0NNUpPyAdoybCA/view?utm_content=DAGM0kdNDuo&utm_campaign=designshare&utm_medium=link&utm_source=viewer`

2.5. מקורות־שורש נוספים שיש למפות לעומק, כולל כל קישור פנימי נגיש:

- חט״ב: `https://mamhishim.my.canva.site/mhozjerusalem`
- חט״ע: `https://www.canva.com/design/DAGNFOK0bBM/sXlKIUZ54XwlozaNnGSGBA/view`
- הודעות שוטפות: `https://www.canva.com/design/DAGM0sUT9PM/Xspl6Iv_-s5olzIg4QThHA/view`
- יחד ננצח תשפ״ד: `https://www.canva.com/design/DAFy1XJha9k/cNoorlOtbTEm3VR9zBlEQA/view`

2.6. אין להעתיק את עיצוב Canva בצורה עיוורת. יש ללמוד ממנו תוכן, מבנה וקישורים ולבנות מערכת מודרנית, אחידה וברמה גבוהה יותר.

---

# 3. טכנולוגיה, ביצועים ואמינות

3.1. השתמש ב־TypeScript ובארכיטקטורה מודרנית, מודולרית וניתנת לתחזוקה, אלא אם התכנון הטכני מוכיח פתרון טוב יותר.

3.2. העדף יצירה סטטית או היברידית, טעינה הדרגתית ו־code splitting כדי שהאתר ייטען במהירות גם בטלפון וברשת חלשה.

3.3. בצע lazy loading חכם להטמעות, סרטונים ותוכן כבד, בלי לפגוע בתוכן שמעל לקפל.

3.4. בצע אופטימיזציה לתמונות ולווידאו, caching, preconnect למקורות חיצוניים וטיפול מסודר בשגיאות רשת.

3.5. אין שגיאות console, קישורים שבורים, hydration errors, גלילה אופקית לא רצויה או רכיבים שקופצים בזמן טעינה.

3.6. כל פעולה תציג משוב ברור בעברית: נטען, הועתק, נשלח, הורד, נחסם או נכשל.

3.7. האתר יתמוך במקלדת, קוראי מסך, מגע, הגדלת טקסט, ניגודיות ו־`prefers-reduced-motion`.

3.8. יעד האיכות הוא ציוני Lighthouse גבוהים מאוד בביצועים, נגישות, Best Practices ו־SEO, בלי לרמות את הבדיקה ובלי לפגוע בחוויית המשתמש.

3.9. כל הטמעה תשתמש בטכנולוגיה החזקה והמתאימה ביותר לסוג המקור: iframe מאובטח כאשר מותר, viewer ייעודי למסמכים ו־PDF, Web Share API לשיתוף, Clipboard API להעתקה, הורדה אמיתית לקבצים, ו־fallback איכותי כאשר המקור חוסם הטמעה.

3.10. אין ליצור שכפול סטטי מזויף של אתר חיצוני רק כדי להיראות כאילו ההטמעה עובדת.

---

# 4. שפה חזותית, ניווט, גלילה והנפשות

4.1. צור מערכת עיצוב אחת לכל האתר: צבעים, טיפוגרפיה, כרטיסים, כפתורים, מרווחים, אייקונים, מצבי hover, focus, loading ו־error ורכיבי הטמעה.

4.2. כל הכפתורים יהיו בעברית ברורה, גדולים ונוחים ללחיצה, עם אייקון וטקסט — לא אייקון לא מוסבר.

4.3. בנה ניווט ראשי חכם וברור, breadcrumbs, סימון עמוד פעיל, חזרה לעמוד הקודם וכפתור חזרה לראש העמוד.

4.4. בכל עמוד ועמוד תכנן כפתורי ניווט ייעודיים המתאימים לתוכן העמוד: מעבר לנושא הקודם והבא, חזרה לקטגוריה, מעבר למקטעים מרכזיים וחזרה לעמוד הראשי.

4.5. כפתורי הניווט יהיו בולטים, מועילים, מהירים, עקביים ונגישים. אין להסתיר פעולות חשובות בתפריט עמוק.

4.6. לכל עמוד יהיו הנפשות מעבר המתאימות לאופי התוכן שלו, תוך שמירה על שפה חזותית אחידה בכל האתר.

4.7. ההנפשות יהיו ברמה הגבוהה ביותר שאתה מסוגל לבצע: כניסות עדינות, מעבר בין עמודים, פתיחת הטמעות, שינוי מצבי כפתור ומשוב לפעולות. הן יהיו יוקרתיות, מהירות ובעלות משמעות — לא מוגזמות ולא מאטות את האתר.

4.8. הגלילה תהיה חלקה ומדויקת, עם קפיצה חכמה למקטעים, בלי לנעול את המשתמש ובלי scroll hijacking מעיק.

4.9. ניווט באמצעות מקלדת, מגע וקורא מסך חייב להיות מלא וברור.

4.10. בכל מסך נייד הניווט והפעולות החשובות יהיו נגישים לאגודל, בלי כפתורים זעירים ובלי תפריטים שנחתכים.

4.11. שמור את מיקום המשתמש בעת חזרה מעמוד משאב או מסך מוטמע, כאשר הדבר מועיל ואינו מבלבל.

---

# 5. סרטון הפתיחה בעמוד הראשי

5.1. יניב יספק את קובץ הסרטון המוגמר. אין ליצור סרטון חדש ואין לערוך את התוכן שלו בלי הוראה.

5.2. הסרטון יוצג מיד בחלק העליון ביותר של העמוד הראשי בעת הכניסה.

5.3. הסרטון יתחיל אוטומטית, עם שמע, ויתנגן פעם אחת בלבד.

5.4. משך ההרצה המתוכנן הוא 7 שניות. אין loop ואין הפעלה חוזרת אוטומטית לאחר הסיום.

5.5. בסיום ההרצה הסרטון ייעצר, ובאנימציה מיוחדת, חלקה ויוקרתית, יהפוך לפריים או תמונת רקע בהירה מאוד שעליה יוצג מלל ברור.

5.6. המעבר לרקע הבהיר יישמר לאחר סיום הסרטון ולא יחזיר את הסרטון להתחלה.

5.7. עקב מגבלות autoplay של דפדפנים, יש לנסות הפעלה אוטומטית עם שמע בכל מקום שבו הדפדפן מאפשר זאת. אם הדפדפן חוסם שמע אוטומטי, הצג מיד שכבת הפעלה איכותית בעברית בלחיצה אחת; אסור להציג מסך שבור או סרטון שלא ברור כיצד להפעילו.

5.8. הסרטון יהיה מותאם למחשב ולטלפון, ללא חיתוך פוגעני, ללא קפיצות layout ועם poster תקין בזמן טעינה.

---

# 6. העמוד הראשי ואנשי הצוות

6.1. איילת קריספין נשארת בתפקידה ומקבלת עדיפות חזותית ברורה: תמונה גדולה יותר, מיקום גבוה ומרכזי יותר וכרטיס בולט יותר מכל יתר המדריכים.

6.2. פרטי איילת:

- טלפון: `050-272-1656`
- דוא״ל: `ayeletk59@gmail.com`
- תפקיד: מדריכה מחוזית למתמטיקה על־יסודי, בהתאם למקור המאושר.

6.3. ויקטוריה צורי נשארת בעמוד הראשי:

- טלפון: `050-564-6264`
- דוא״ל: `vikazury@gmail.com`
- תפקיד מדויק להצגה: **מדריכה מחוזית חט״ע מחוז ירושלים**

6.4. אביגיל ויקסלבוים תוסר לחלוטין מהעמוד הראשי.

6.5. ענבל כהן תוסר לחלוטין מהעמוד הראשי.

6.6. יניב רז מחליף את אביגיל:

- שם: **יניב רז**
- טלפון: `052-374-8115`
- דוא״ל: `yanivmiz77@gmail.com`
- תפקיד מדויק להצגה: **מדריך מחוזי חט״ב מחוז ירושלים**

6.7. אורלי מחליפה את ענבל:

- שם להצגה בשלב זה: **אורלי**
- טלפון: `050-639-5257`
- תפקיד מדויק להצגה: **מדריכה מחוזית חט״ע מחוז ירושלים**
- אין להמציא שם משפחה או דוא״ל עד שיימסרו.

6.8. אין להשאיר כרטיסים ריקים, פרטי קשר ישנים או אזכור מוסתר של אביגיל וענבל.

6.9. כל כרטיס מדריך יהיה לחיץ וברור כאינטראקטיבי. במעבר עכבר, focus או מגע הוא יקבל הדגשה, התרוממות או אנימציה עדינה שמבהירה שניתן לפעול ממנו.

6.10. בכל כרטיס יוצגו פעולות מהירות ובולטות: **שליחת WhatsApp** ו־**שליחת דוא״ל** כאשר קיימת כתובת.

6.11. הגישה ל־WhatsApp ולדוא״ל תהיה בלחיצה אחת, ללא מסך ביניים וללא ניווט מיותר.

6.12. לחיצה על מספר טלפון או כפתור WhatsApp תפתח שיחה למספר בפורמט בינלאומי תקין.

6.13. לחיצה על דוא״ל תפתח חלון כתיבה חדש ב־Gmail עם הנמען מוזן.

6.14. בטלפון הכפתורים יהיו גדולים, מרווחים ונגישים לאגודל.

6.15. אין להפוך את כל הכרטיס לקישור יחיד שמונע בחירה בין WhatsApp לדוא״ל; הפעולות יהיו מובחנות וברורות.

---

# 7. סביבת משאב אחידה — חצי הטמעה וחצי פעולות

7.1. כל אתר, יישומון, מסמך, מצגת, PDF או משימה מוטמעת יוצגו בתוך רכיב אחיד ברמת מוצר.

7.2. במחשב נייד ובמסך רחב, סביבת המשאב תחולק לשני חצאים ברורים:

- **החצי הימני:** המשימה או המשאב המוטמע בפועל.
- **החצי השמאלי:** לוח פעולות אחיד בעברית.

7.3. בחצי הימני המשתמש יוכל לצפות, לגלול, ללחוץ, לנווט ולהשתמש במשימה המוטמעת לפני שיחליט לפתוח או להוריד אותה.

7.4. לוח הפעולות יכלול, בהתאם לסוג המשאב:

- **שליחה ב־WhatsApp**
- **שיתוף** באמצעות מנגנון השיתוף של המכשיר כאשר נתמך
- **העתקת קישור**
- **הורדת הקובץ** כאשר קיים קובץ אמיתי שניתן להורדה
- **פתיחה במקור** בכרטיסייה חדשה
- **הדפסה** כאשר הפעולה מתאימה למסמך
- **מסך מלא** כאשר הוא מועיל ואפשרי

7.5. אין להציג כפתור הורדה מזויף לאתר שאין לו קובץ להורדה. במקרה כזה הכפתור יוסתר או יוחלף בפעולה המתאימה.

7.6. כל הכפתורים יהיו מחוברים, נבדקים, בעברית, גדולים, נגישים ואחידים בכל האתר.

7.7. בטלפון, שני החצאים יהפכו לפריסה אנכית חכמה: ההטמעה תחילה ולוח הפעולות מיד אחריה או כפס פעולות נגיש, בלי לפגוע בגודל המשימה.

7.8. ההטמעה תהיה גבוהה ונוחה מספיק לשימוש אמיתי, עם גלילה פנימית תקינה ואפשרות מסך מלא כאשר הדבר מועיל.

7.9. יש לבדוק `X-Frame-Options` ו־CSP. אם מקור חוסם iframe, לעולם אין להציג מסגרת שבורה; הצג fallback איכותי עם תצוגה מקדימה, הסבר קצר וכפתורי פתיחה, העתקה, שיתוף והורדה כאשר אפשר.

7.10. Claude Code יבחר לכל מקור את מנגנון ההטמעה החזק, הבטוח והמהיר ביותר שהוא מסוגל ליישם בפועל.

7.11. יש לטעון הטמעות כבדות רק כאשר הן מתקרבות לאזור הצפייה, תוך הצגת skeleton או מצב טעינה איכותי.

7.12. יש לבודד הטמעות חיצוניות מבחינת אבטחה והרשאות באמצעות sandbox ו־allow מצומצמים לפי הצורך, בלי לשבור פונקציונליות נחוצה.

7.13. כל הטמעה תיבדק במחשב ובטלפון, כולל גלילה, לחיצות, ניווט פנימי, שינוי כיוון מסך וחזרה לעמוד.

---

# 8. אתר ההמחשות של איילת

8.1. שם התצוגה המדויק: **איילת קריספין — אתר המחשות**.

8.2. קישור קנוני:

`https://mamhishim.my.canva.site/`

8.3. המשאב יוצג בעמוד הראשי כמשבצת מרכזית שמפעילה סביבת הטמעה גדולה לפי מבנה חצי־חצי שבסעיף 7.

8.4. המשתמש יישאר בתוך אתר מחוז ירושלים בעת השימוש הרגיל, ככל שמדיניות המקור מאפשרת.

8.5. כפתור **העתקת קישור** יעתיק בדיוק את הכתובת הקנונית ויציג אישור נגיש בעברית.

---

# 9. קבוצת WhatsApp לחטיבות הביניים

9.1. כותרת מדויקת:

**קבוצת WhatsApp למורי חטיבות הביניים בעיר ירושלים ובמחוז ירושלים**

9.2. קישור:

`https://chat.whatsapp.com/L9P0Z6BFevZHzgdURMmfIK`

9.3. מיקום: **חטיבת ביניים → קהילת מורים ותקשורת**.

9.4. הצג כפתור הצטרפות ברור ונגיש.

---

# 10. חוזר מפמ״ר תשפ״ז

10.1. שם התצוגה: **חוזר מפמ״ר**.

10.2. המקור הרשמי והקנוני:

`https://meyda.education.gov.il/files/Pop/0files/matmatika/Chativa-Elyona/mafmar/hozer-mafmar-tashpaz.pdf`

10.3. המקור החדש מחליף את שני המקורות הישנים הבאים, שאסור להציג באתר החדש:

- `https://drive.google.com/file/d/1bYWFDV0wPw-5BcawE6bCnnV9AmobaL-X/view`
- `https://www.canva.com/design/DAGMyXpeCoo/jM082g4sTewQLQ5WcQjnbQ/edit`

10.4. אין להעתיק את ה־PDF לריפו ואין ליצור גרסה מזויפת שלו. השתמש במקור הרשמי החי.

10.5. לפני המימוש, נתח את החוזר עמוד־עמוד ובנה מפת תוכן: נושא, קהל, שכבה, סוג מידע, עמוד יעד, תוכן ישן שמוחלף ודרך ההצגה.

10.6. ה־PDF המלא יוטמע פעם אחת בלבד ב־**חטיבה עליונה → מידע רשמי ומדיניות → חוזר מפמ״ר**.

10.7. בעמודים האחרים הצג הפניות נושאיות חכמות בלבד, בלי הטמעה כפולה:

- תוכניות לימודים
- בחינות בגרות, שאלונים, מועדים, חוקי מענה והתאמות
- המלצות הוראה ל־3, 4 ו־5 יח״ל
- פיתוח מקצועי והשתלמויות
- חומרי הוראה

10.8. אין להעתיק פסקאות ארוכות מהחוזר; הצג תקצירי ניווט והפניה למקור הרשמי.

---

# 11. מספרים מכוונים

11.1. שם: **מספרים מכוונים**.

11.2. קישור קנוני:

`https://misparim.vercel.app/`

11.3. מיקום מדויק:

**חטיבת ביניים → כיתה ז׳ → תחום מספרי → מספרים מכוונים**

11.4. היחידה החדשה מחליפה קישורים ישנים וכפולים שממלאים את אותו תפקיד. אין למחוק חומר ייחודי שאינו קיים ביחידה החדשה.

11.5. הצג את היחידה בסביבת ההטמעה האחידה שבסעיף 7.

---

# 12. הוראת משוואות ללא מספרים שליליים

12.1. הכותרת המדויקת היא **הוראת משוואות ללא מספרים שליליים**.

12.2. הכותרת מחליפה בכל מקום את **משוואות לפני מספרים מכוונים**.

12.3. הקישורים הבאים הם מלאי תוכן של היחידה וחייבים להיבדק, למפות ולשמר כל עוד לא נמצאו כפולים, שבורים או מוחלפים:

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

# 13. אתר זוויות

13.1. שם: **אתר זוויות**.

13.2. קישור ציבורי קנוני:

`https://zaviyot.vercel.app/`

13.3. מקור הקוד והתיעוד:

`https://github.com/yanivmizrachiy/misparim/tree/main/zaviyot`

13.4. שיוך פדגוגי: **חטיבת ביניים → גאומטריה → זוויות**.

13.5. קישור GitHub הוא מקור טכני בלבד; המשתמשים יקבלו את כתובת האתר הציבורי.

13.6. הצג בסביבת ההטמעה האחידה שבסעיף 7.

---

# 14. מערכת צירים — רביע ראשון

14.1. שם: **מערכת צירים — רביע ראשון**.

14.2. קישור קנוני לאתר החי:

`https://yanivmizrachiy.github.io/coordinate-first-quadrant/`

14.3. ריפו מקור:

`https://github.com/yanivmizrachiy/coordinate-first-quadrant`

14.4. שיוך פדגוגי: **חטיבת ביניים → מערכת צירים → רביע ראשון**.

14.5. הצג בסביבת ההטמעה האחידה שבסעיף 7.

---

# 15. חוברת מחוז מרכז

15.1. אתר את החוברת היחידה במקור הישן המזוהה כחומר של מחוז מרכז והסר רק אותה.

15.2. אין למחוק באופן גורף חומרים של מחוזות אחרים או חומרים חיצוניים מועילים.

15.3. לפני המחיקה תעד בתוכנית ההגירה את הכותרת, הקישור והמיקום המדויק של החוברת.

---

# 16. מבנה התוכן והעברת החומרים

16.1. בנה היררכיה ברורה לפחות עבור:

- עמוד ראשי
- חטיבת ביניים
- חטיבה עליונה
- הודעות ועדכונים
- קהילת מורים
- מידע רשמי ומדיניות
- תוכניות לימודים
- בחינות והערכה
- חומרי הוראה
- פיתוח מקצועי

16.2. בכל שכבה מיין משאבים לפי כיתה, תחום מתמטי, נושא וסוג משאב.

16.3. חלץ באופן רקורסיבי את כל הקישורים ממקורות־השורש שבסעיף 2, כולל קישורים בתוך מסמכים ומצגות ככל שניתן לגשת אליהם.

16.4. לכל קישור קבע סטטוס פנימי: תקין, מיושן, כפול, חסום, פרטי, דורש החלפה או מאושר לפרסום.

16.5. מסמכים שנתיים מתשפ״ו, אירועים, טפסים, Meet וקישורי חירום לא יועברו אוטומטית; אמת את הרלוונטיות שלהם לשנת תשפ״ז לפני פרסום.

16.6. משאבי הוראה שאינם תלויי שנה לא יימחקו רק בגלל גילם.

16.7. קישורי `edit` של Google או Canva יומרו לקישורי צפייה בטוחים כאשר ניתן, בלי לשבור הרשאות.

16.8. לפני פרסום תוצרי תלמידים או מאגרי הגשות, בדוק פרטיות, הרשאות, שמות וזכויות שימוש.

---

# 17. מלאי קישורי חטיבה עליונה

הקישורים הבאים קשורים לאתר וחייבים להיבדק ולמפות. הם אינם מאושרים אוטומטית לפרסום אם הם מיושנים, כפולים או הוחלפו:

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

# 18. מלאי הודעות ועדכונים

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

# 19. מיזם AI וגאומטריה

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

19.1. טפסים, Meet, מועדים ואירועים לא יפורסמו לפני אימות שהם עדיין פעילים ורלוונטיים.

19.2. לפני הצגת תוצרי תלמידים או הגשות, בדוק פרטיות, הרשאות וזכויות שימוש.

---

# 20. הנחיות מבחנים לחטיבת הביניים

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

# 21. יחידת חפיפת משולשים

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

# 22. הלוגו

22.1. בשלב הבנייה אתר את הלוגו בריפו של יניב המכונה **מספרים שלי**.

22.2. אמת שזהו הלוגו הנכון לפני שילובו.

22.3. אל תיצור לוגו חלופי ואל תשתמש בקובץ לא מאומת.

---

# 23. SEO וגוגל

23.1. הכן את האתר לאינדוקס אמיתי באמצעות:

- Google Search Console
- `sitemap.xml`
- `robots.txt`
- canonical URLs
- metadata מלא בעברית
- Open Graph
- structured data במקומות המתאימים
- היררכיית כותרות תקינה
- כתובות URL קריאות

23.2. אל תטען שהאתר מאונדקס עד שהדבר אומת בפועל.

---

# 24. בדיקות קבלה מחייבות

24.1. צור טבלת התאמה סופית שבה כל דרישה ממוספרת במסמך מסומנת כמיושמת ונבדקת.

24.2. בדוק את האתר בפועל במחשב נייד ובטלפון נייד, במסכי רוחב שונים ובדפדפנים מרכזיים.

24.3. אמת שכל כפתור מבצע את הפעולה הכתובה עליו.

24.4. אמת שכפתורי הניווט בכל עמוד בולטים, מהירים, מועילים ומובילים ליעד הנכון.

24.5. אמת שכל מספר טלפון וכפתור WhatsApp פותחים שיחה נכונה וכל דוא״ל פותח Gmail לנמען הנכון.

24.6. אמת שכרטיסי המדריכים נראים לחיצים ומאפשרים גישה בלחיצה אחת לפעולות הקשר.

24.7. אמת שכל כפתור העתקה מעתיק את הכתובת המדויקת ומציג משוב בעברית.

24.8. אמת שכל שיתוף והורדה עובדים בפועל ואינם כפתורי דמה.

24.9. אמת שכל הטמעה ניתנת לגלילה ולשימוש, או מציגה fallback תקין כאשר ההטמעה חסומה.

24.10. אמת שסרטון הפתיחה מתחיל לפי מדיניות הדפדפן, רץ פעם אחת במשך 7 שניות, נעצר והופך לרקע בהיר באנימציה שנקבעה.

24.11. אמת שאיילת מוצגת גדולה ומרכזית יותר, ויקטוריה ואורלי מוצגות בתפקיד **מדריכה מחוזית חט״ע מחוז ירושלים**, ויניב מוצג בתפקיד **מדריך מחוזי חט״ב מחוז ירושלים**.

24.12. אמת שאביגיל וענבל אינן מופיעות בשום מקום פעיל.

24.13. אמת שחוזר מפמ״ר תשפ״ז הוא המקור הפעיל היחיד וששני המקורות הישנים אינם מוצגים.

24.14. אמת שאין כפילויות, תוכן לא קשור, placeholder, קישור שבור, רכיב ריק או מידע מומצא.

24.15. בצע בדיקת רגרסיה לאחר כל שינוי משמעותי כדי לוודא שדרישה קיימת לא נשברה.

24.16. אל תכריז שהאתר הושלם לפני שכל בדיקות הקבלה עברו בפועל.

---

# 25. בריאות דף הכללים וכלל הכרעה

25.1. `RULES.md` חייב להישאר מסמך אחד, בריא, מסודר, ממוספר וללא סתירות.

25.2. כל דרישה חדשה של יניב תשולב בסעיף המתאים ולא תתווסף כפתק מנותק בסוף המסמך.

25.3. אין לשמור בדף יומני עבודה, שגיאות התחברות, פקודות מסוף, ניסיונות טכניים או תוכן שאינו דרישת אתר או קישור הקשור לאתר.

25.4. אין למחוק דרישה פעילה כדי לקצר את המסמך.

25.5. כאשר קישור ישן נשמר לצורכי מיפוי אך אסור לפרסום, יש לסמן זאת במפורש.

25.6. כאשר חסר מידע, השאר סימון ברור בתוכנית העבודה ואל תנחש.

25.7. כאשר קיימת מגבלה טכנית של דפדפן או אתר חיצוני, מיישמים את החוויה הקרובה ביותר לדרישה עם fallback איכותי ומדווחים במדויק על המגבלה — לא מסתירים אותה ולא מציגים יכולת מזויפת.
