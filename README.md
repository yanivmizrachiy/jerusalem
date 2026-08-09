# מחוז ירושלים — הדרכת מתמטיקה

אתר המרכז המחוזי להוראת מתמטיקה במחוז ירושלים: סביבות המחשה, משאבים
קנוניים לחטיבת הביניים ולחטיבה העליונה, חוזר מפמ״ר,
לוח שנה חינוכי, צוות ההדרכה ועדכונים שוטפים.

**פרודקשן:** <https://jerusalem-virid.vercel.app> · **עברית, RTL מלא.**

## סטאק

- **[Astro](https://astro.build) 7** — אתר סטטי (`output: 'static'`) עם אדפטר Vercel;
  שני מסלולי שרת בלבד (`prerender = false`) — נקודות הפרוקסי.
- **Playwright** — סוללת קבלה מלאה (דסקטופ + מובייל) מול build הפקה אמיתי,
  כולל בדיקות נגישות (axe), רספונסיביות ואינטראקציות ליבה; שער הקבלה רץ עם `retries=0`.
- **GitHub Actions** — שער איכות על כל push ו־PR דרך אותה פקודה מקומית: `npm run quality`.
- **Vercel** — פריסה אוטומטית מ־main; `verify:deploy` מאמת את הקומיט החי רק אחרי `quality` ירוק.

## פקודות

| פקודה | תיאור |
| --- | --- |
| `npm ci` | התקנת תלויות (דטרמיניסטית, לפי הלוקפייל) |
| `npm run dev` | שרת פיתוח (פורט 4322, או `PORT` מהסביבה) |
| `npm run build` | build הפקה אל `dist/` + ‏`.vercel/output/` |
| `npm run check` | ‏typecheck של כל קבצי ה־Astro |
| `npm test` | סוללת הקבלה המלאה מול build קיים, ללא retries |
| `npm run audit:repo` | סריקת זבל מנוהל, סודות, סמני conflict והתנגשויות נתיבים |
| `npm run quality` | שער סיום יחיד: repo-health → check → build → Playwright `retries=0`, עם פורט פנוי אוטומטי |
| `npm run verify:deploy` | אימות פרודקשן: commit, מסלולים קנוניים, redirects וסמנים חיים |

## מבנה

```
CLAUDE.md     קובץ bootstrap קצר ל-Claude Code; מפנה למקורות האמת ואינו מחליף אותם
docs/         מסמכי הקשר תפעוליים שאינם חלק ממסלולי האתר
src/
  pages/       כל המסלולים — עמוד הבית, חטיבות, חוזר מפמ״ר, לוח, reader/[grade]/[item]
  pages/api/   פרוקסי em/ ו-mam/ להטמעת האתרים הקנוניים (allowlist קשיח בלבד)
  components/  GradeIndex, ResourceSplit, SplashIntro, SiteHeader/Footer, HeroVideo, DateBar ועוד
               (Booklet.astro שמור ואינו מיובא בשום עמוד — RULES 4.14; אין למחוק)
  data/        התוכן כ-TypeScript מוקלד: משאבים, צוות, שכבות חט״ב, יחידות, הודעות,
               ייחוס יוצרים (authors, author-assignments, attribution — RULES 24)
  drafts/      תוכן שמור שאינו מסלול ציבורי (עמודי החטיבה העליונה); ראו src/drafts/README.md
  layouts/     Base.astro — SEO, canonical, פונטים, RTL
  lib/         proxyGuard — משמר זמן-הריצה של ההטמעות
               legacyRedirects — מקור יחיד למסלולי התאימות (301 אמיתי, RULES 24.3)
scripts/       שערי quality, repo-health ואימות פרודקשן
tests/         סוללת הקבלה: site, ux, interactions, responsive, a11y, product-contracts,
               author-coverage וחוזי הייחוס, catalog/resource contracts,
               embed-production-guards, grade-navigation-regression
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
2. **אפס רגרסיות** — `npm run quality` הוא חוזה הסיום המקומי וה־CI: repo-health,
   typecheck, build וסוללת Playwright מלאה עם `retries=0`. הוא חייב להיות ירוק לפני כל מיזוג ל־main.
3. **התוכן חי ב־`src/data/`** — עדכוני משאבים, צוות והודעות נעשים שם, לא ב־HTML.
4. **מסמכי ההקשר כפופים למקורות האמת** — `CLAUDE.md` ו־`docs/PROJECT_CONTEXT.md`
   מסייעים להתמצאות, אך אינם רשאים לסתור את `RULES.md`, את הקוד הפעיל או את הבדיקות.
