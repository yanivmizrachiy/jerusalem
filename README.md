# מחוז ירושלים — הדרכת מתמטיקה

אתר המרכז המחוזי להוראת מתמטיקה במחוז ירושלים: סביבות המחשה, משאבים
קנוניים לחטיבת הביניים ולחטיבה העליונה, חוזר מפמ״ר,
לוח שנה חינוכי, צוות ההדרכה ועדכונים שוטפים.

**פרודקשן:** <https://jerusalem-virid.vercel.app> · **עברית, RTL מלא.**

## סטאק

- **[Astro](https://astro.build) 7** — אתר סטטי (`output: 'static'`) עם אדפטר Vercel;
  שני מסלולי שרת בלבד (`prerender = false`) — נקודות הפרוקסי.
- **Playwright** — סוללת קבלה מלאה (דסקטופ + מובייל) מול build הפקה אמיתי,
  כולל בדיקות נגישות (axe), רספונסיביות ואינטראקציות ליבה.
- **GitHub Actions** — שער איכות על כל push ו־PR: ‏`astro check` ‏→ build ‏→ הסוללה המלאה.
- **Vercel** — פריסה אוטומטית מ־main.

## פקודות

| פקודה | תיאור |
| --- | --- |
| `npm ci` | התקנת תלויות (דטרמיניסטית, לפי הלוקפייל) |
| `npm run dev` | שרת פיתוח (פורט 4322, או `PORT` מהסביבה) |
| `npm run build` | build הפקה אל `dist/` + ‏`.vercel/output/` |
| `npm run check` | ‏typecheck של כל קבצי ה־Astro |
| `npm test` | סוללת הקבלה המלאה (דורש build קודם; מגישה את הפלט הסטטי על פורט 4321) |

## מבנה

```
CLAUDE.md     קובץ bootstrap קצר ל-Claude Code; מפנה למקורות האמת ואינו מחליף אותם
docs/         מסמכי הקשר תפעוליים שאינם חלק ממסלולי האתר
src/
  pages/       כל המסלולים — עמוד הבית, חטיבות, חוזר מפמ״ר, לוח, reader/[grade]/[item]
  pages/api/   פרוקסי em/ ו-mam/ להטמעת האתרים הקנוניים (allowlist קשיח בלבד)
  components/  GradeIndex, ResourceSplit, SplashIntro, SiteHeader/Footer, HeroVideo, DateBar ועוד
               (Booklet.astro שמור ואינו מיובא בשום עמוד — RULES 4.14; אין למחוק)
  data/        התוכן כ-TypeScript מוקלד: משאבים, צוות, שכבות חט״ב, יחידות, הודעות
  layouts/     Base.astro — SEO, canonical, פונטים, RTL
  lib/         proxyGuard — משמר זמן-הריצה של ההטמעות
tests/         סוללת הקבלה: site, interactions, responsive, a11y
public/        מדיה, מסמכי PDF קנוניים, פונטים, robots.txt
RULES.md       חוקת הפרויקט — כל הדרישות הממוספרות; מחייבת כל שינוי
RECOVERY/      מסמכי ביקורת ושחזור
```

## מסמכי עבודה

- [`RULES.md`](./RULES.md) — מקור הדרישות היחיד והמחייב.
- [`CLAUDE.md`](./CLAUDE.md) — הוראות פתיחה קצרות ל־Claude Code וסדר קריאה קבוע.
- [`docs/PROJECT_CONTEXT.md`](./docs/PROJECT_CONTEXT.md) — מפת ארכיטקטורה, נקודות עריכה, זרימות מידע, סיכונים ופרוטוקול שינוי.
- [`RECOVERY/`](./RECOVERY/) — ביקורות ושחזור היסטוריים; אינם גוברים על `RULES.md` או על הקוד הפעיל.

## עקרונות עבודה

1. **RULES.md היא המקור המחייב** — כל שינוי חייב לכבד את הסעיפים הממוספרים,
   וסטייה מתועדת שם לפני המיזוג.
2. **אפס רגרסיות** — שער האיכות (`astro check`, ‏build וסוללת Playwright המלאה)
   חייב להיות ירוק לפני כל מיזוג ל־main; הבדיקות בודקות התנהגות אמיתית, לא הנחות.
3. **התוכן חי ב־`src/data/`** — עדכוני משאבים, צוות והודעות נעשים שם, לא ב־HTML.
4. **מסמכי ההקשר כפופים למקורות האמת** — `CLAUDE.md` ו־`docs/PROJECT_CONTEXT.md`
   מסייעים להתמצאות, אך אינם רשאים לסתור את `RULES.md`, את הקוד הפעיל או את הבדיקות.
