# Jerusalem Workbook Studio

מערכת ניהול פרטית ונפרדת לעיצוב החוברת הדיגיטלית של חטיבת הביניים.

## עקרונות בטיחות

- האפליקציה נמצאת בתיקייה עצמאית ואינה מקושרת מהאתר הרגיל.
- הכניסה מותרת רק לחשבון GitHub שמזהה המשתמש שלו `203164631` ושם המשתמש שלו `yanivmizrachiy`.
- אין שמירה אוטומטית לריפו. טיוטה נשמרת מקומית בדפדפן; רק הכפתור **שמור בריפו** יוצר commit ב-`main`.
- כל שמירה משתמשת ב-SHA של הקובץ שנטען. אם `Booklet.astro` השתנה בינתיים, השמירה נחסמת עם HTTP 409 ואינה דורסת עבודה אחרת.
- העורך אינו מחליף את קובץ החוברת. הוא מנהל רק בלוק מסומן בין `WORKBOOK-STUDIO:START` ל-`WORKBOOK-STUDIO:END`.
- בלוק העיצוב נוצר רק בשמירה הראשונה של יניב.
- CSS אישי מוגבל לבוררים שמתחילים ב-`[data-book]` או `html.book-lock`.
- כל התגובות מקבלות `no-store`, וכל דפי הפרויקט מקבלים `noindex` ו-`nofollow`.

## פריסה כקישור נפרד ב-Vercel

1. צור פרויקט Vercel חדש מאותו ריפו `yanivmizrachiy/jerusalem`.
2. הגדר **Root Directory** ל-`workbook-studio` בלבד.
3. אל תחבר את כתובת הפרויקט לתפריטי האתר הרגיל.
4. העתק את משתני הסביבה מתוך `.env.example` והגדר ערכים אמיתיים.
5. צור GitHub OAuth App ייעודי לעורך:
   - Homepage URL: כתובת פרויקט הניהול הנפרד.
   - Authorization callback URL: `https://YOUR-PRIVATE-STUDIO.vercel.app/api?action=auth-callback`
6. שמור את Client ID ואת Client Secret במשתני Vercel.
7. צור `SESSION_SECRET` אקראי ארוך, לפחות 32 תווים.
8. פרוס את הפרויקט ופתח את הקישור הנפרד.

## הרשאות GitHub

תהליך OAuth מבקש `read:user public_repo`:

- `read:user` מאמת שזה החשבון המדויק של יניב.
- `public_repo` מאפשר לקרוא ולשמור את `src/components/Booklet.astro` בריפו הציבורי.

אסימון GitHub נשמר רק בתוך עוגיית HttpOnly מוצפנת AES-256-GCM, עם `Secure` ו-`SameSite=Lax`, ותוקפו 12 שעות.

## פעולות זמינות

- תצוגה חיה של החוברת בתוך סביבת העריכה.
- מצבי מחשב, טאבלט וטלפון.
- צבעים, גופנים, גדלים, ריווח, מסגרות, פינות, צללים, מרקמים, סרגל צד וכפתורי ניווט.
- מצבי נגישות וניטור יחס ניגודיות.
- ביטול וביצוע חוזר, קיצורי מקלדת וטיוטה מקומית.
- ערכות עיצוב מוכנות.
- ייבוא וייצוא JSON.
- CSS אישי מוגבל לחוברת.
- היסטוריית commits של קובץ החוברת.
- שמירה ישירה ל-`main`, שמפעילה את פריסת האתר הרגילה.

## קבצים שהמערכת קוראת וכותבת

ברירת המחדל:

- ריפו: `yanivmizrachiy/jerusalem`
- ענף: `main`
- קובץ: `src/components/Booklet.astro`
- תצוגה: `https://jerusalem-virid.vercel.app/chativat-beynayim/`

אפשר לשנות ערכים אלה באמצעות משתני הסביבה, בלי לשנות קוד.

## בדיקה מקומית

```powershell
Set-Location .\workbook-studio
node --check .\api\index.js
```

להפעלת OAuth מלאה נדרשת סביבת Vercel עם משתני הסביבה והכתובת שהוגדרה ב-GitHub OAuth App.
