# PROJECT_CONTEXT — מפת עבודה עדכנית

> מסמך הקשר תפעולי קצר. הוא **לא** מחליף את `RULES.md`, לא משכפל את הקוד, ולא מהווה מקור תוכן לפרודקשן.
>
> **אימות ארכיטקטוני אחרון: 07/08/2026.** בכל משימה יש לבדוק מחדש את `main`, את הקבצים הרלוונטיים ואת תוצאת `npm run quality`.

## 1. מקורות אמת

1. הוראה מפורשת ועדכנית במשימה הנוכחית.
2. `RULES.md`.
3. הקוד והבדיקות ב־`main`.
4. `README.md`.
5. מסמך זה.

ריפו: `yanivmizrachiy/jerusalem`  
פרודקשן: `main` → Vercel  
אתר: `https://jerusalem-virid.vercel.app`

## 2. ארכיטקטורה פעילה

- Astro + TypeScript, RTL עברי.
- `src/layouts/Base.astro` — מעטפת, canonical, SEO, header/footer ו־bootstrap של hero.
- `src/styles/global.css` — מערכת העיצוב המשותפת.
- `src/data/choveret.ts` — מבנה השכבות, הפרקים והמשאבים הקנוניים.
- `src/data/source-materials.ts` — ledger ותוצרי מיגרציית חומרי המקור; אין לערוך ידנית בלי סיבה מוכחת.
- `src/data/publishing.ts` — גבול הפרסום: `needsReview` נשמר בדאטה אך אינו פומבי.
- `src/components/GradeIntro.astro` — עמוד מבוא שכבה.
- `src/components/GradeIndex.astro` — רשימת נושאי החומרים.
- `src/components/ChapterIndex.astro` — רשימת משימות בתוך נושא.
- `src/components/ResourceSplit.astro` — עמוד משאב מחולק.
- `src/components/ResourceContext.astro` — שומר הקשר של multi-placement בלי לשנות canonical URL.
- `src/pages/chativat-beynayim/reader/[grade]/[item].astro` — route reader פומבי למשאב.
- `src/pages/chativat-beynayim/nose/[grade]/[chapter].astro` — route נושא; פרק מנהלי מחזיר redirect.

## 3. חוזי חטיבת הביניים

- אין עוד אזור “משותף לכל השכבות”. חומרים משותפים משויכים בפועל לשכבות הרלוונטיות.
- `materials: false` פירושו פרק מנהלי שאינו נושא חומרים.
- `tichnun` שייך לעמוד המבוא ומפנה ל־`#ma-melamdim`; אין להחזיר אותו לרשימת החומרים.
- `needsReview: true` הוא quarantine: הרשומה נשמרת לצורכי ביקורת אך אינה מקבלת כרטיס או route reader פומבי.
- מונים פומביים סופרים רק משאבים שפורסמו.
- pager קודם/הבא משתמש רק במשאבים פומביים.
- משאב יכול להופיע בכמה נושאים. ה־URL הקנוני נשאר `/reader/<grade>/<item>/`; הקשר הנושא נשמר מקומית ומאומת מול הדאטה.
- כתובות legacy חייבות להיות HTTP `301` אמיתי ליעד קנוני — לא `200 + meta refresh`.

## 4. בדיקות ושער איכות

הפקודה היחידה לשער מלא:

```bash
npm run quality
```

היא מריצה:

1. `scripts/repo-health.mjs`
2. `astro check`
3. build הפקה
4. Playwright מול שרת הפקה בפורט פנוי אוטומטית
5. `--retries=0`

בדיקות קטלוג מרכזיות: `tests/catalog-integrity.spec.ts`.

הן חייבות לחסום לפחות:

- IDs כפולים.
- orphan placements.
- placement לשכבה/פרק לא קיימים.
- דליפת `needsReview` לפרודקשן.
- reader route של quarantine.
- מונים שמכלילים quarantine.
- pager שמפנה ל־quarantine.
- אובדן context במשאב שמופיע בכמה נושאים.

`tests/site.spec.ts` מבדיל בין דפי `200` קנוניים לבין legacy `301`, ובודק בנפרד כשלים של נכסי localhost כדי שכשל asset פנימי לא יוסתר כרעש של iframe חיצוני.

## 5. פרסום

זרימת העבודה המועדפת:

```text
branch מבודד מ-main
→ Draft PR
→ npm run quality ירוק
→ Ready
→ merge כשה-head המדויק לא השתנה
→ Vercel success
→ smoke/verify-production ממוקד
```

אין להניח שהגדרת GitHub החיצונית חוסמת bypass רק מפני שה־workflow ירוק; branch protection / rulesets הם הגדרת GitHub נפרדת ויש לאמת אותם דרך GitHub כשצריך.

## 6. עקרונות שינוי

- לא לבצע refactor רחב בזמן תיקון נקודתי.
- לא לשנות עיצוב כחלק מעבודת integrity/CI.
- לא למחוק חומר מקור כדי “להעלים” בעיה; חומר לא מאומת נשאר ב־quarantine.
- לא להוסיף retry כדי להסתיר flaky.
- לא להשתמש ב־`git add -A` בעץ עבודה מעורב.
- לא force-push ל־`main`.
- אם חוזה ישן סותר את הארכיטקטורה הנוכחית — מתקנים את החוזה והבדיקה, לא מחזירים את הבאג הישן.
- בבדיקות רשת חיצוניות להפריד monitoring מתוזמן מ־CI דטרמיניסטי של PR.

## 7. דברים שנשמרים בכוונה

- `Booklet.astro` יכול להישאר בריפו גם אם אינו מוצג כרגע; אין למחוק אותו רק מפני שאינו imported.
- פריטי `needsReview` נשמרים בנתונים לצורכי ביקורת.
- routes ישנים נשמרים רק כ־301 כאשר יש להם קישורים היסטוריים.

## 8. לפני שינוי נוסף

1. קרא `RULES.md` ואת הקובץ שאתה עומד לשנות.
2. בדוק אם כבר קיים helper/guard במקום ליצור מקור אמת שני.
3. שנה את המינימום הנדרש.
4. הוסף בדיקה שמוכיחה את הבאג ואת התיקון.
5. הרץ בדיקה ממוקדת בזמן העבודה ורק בסוף `npm run quality` מלא.
6. אל תמזג אם `quality` אינו ירוק עם `retries=0`.
