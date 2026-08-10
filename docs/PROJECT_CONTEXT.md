# PROJECT_CONTEXT — מפת העבודה של אתר מחוז ירושלים

> מסמך הקשר תפעולי בלבד. הוא אינו מחליף את `RULES.md`, אינו מקור תוכן לפרודקשן ואינו אמור לשכפל את הקוד.
>
> **אימות ארכיטקטוני אחרון:** 10/08/2026. בכל משימה יש לבדוק מחדש את הענף הפעיל, את הקבצים הרלוונטיים ואת ה־CI.

## 1. מקורות אמת

- ריפו: `yanivmizrachiy/jerusalem`.
- ענף פרודקשן: `main`.
- אתר חי: `https://jerusalem-virid.vercel.app`.
- דרישות מחייבות: `RULES.md`.
- מבנה טכני ופקודות: `README.md`.
- קוד ותוכן פעיל: `src/`, `public/`, `tests/`.
- מסמכי ביקורת ושחזור: `RECOVERY/` — אינם מקור דרישות פעיל.

סדר אמינות: הוראה מפורשת ועדכנית של יניב → `RULES.md` → הקוד והבדיקות בענף הפעיל → `README.md` → מסמך זה → מקורות היסטוריים.

## 2. ארכיטקטורה בתמצית

- Astro 7, RTL מלא בעברית, אדפטר Vercel.
- האתר ברובו סטטי. מסלולי השרת המכוונים הם `/api/em/**` ו־`/api/mam/**` בלבד, לצורכי proxy מאושרים.
- נתוני חטיבת הביניים מתחילים ב־`src/data/choveret.ts`; שכבת התצוגה הקנונית היא `src/data/canonical-content.ts`.
- פרסום ציבורי עובר דרך `src/data/publishing.ts`; ייחוס דרך `authors.ts`, `author-assignments.ts` ו־`attribution.ts`.
- מיתוג משאב מפורש בלבד נמצא ב־`src/data/resource-branding.ts`.
- הודעות שוטפות נמצאות ב־`src/data/hodaot.ts`. `src/data/news.ts` הוסר ואין ליצור אותו מחדש.
- חוזר מפמ״ר ומצגתו נגזרים מ־`src/data/mafmar.ts`.
- redirects ישנים מנוהלים ממקור יחיד: `src/lib/legacyRedirects.mjs`.
- עיצוב גלובלי: `src/styles/global.css`; מעטפת/SEO: `src/layouts/Base.astro`.
- Playwright רץ על build אמיתי, בדסקטופ וב־Pixel 7, עם `retries=0`; Firefox/WebKit critical-smoke רצים ב־CI במקביל.

## 3. מפת עריכה

| בקשה | מקור העריכה הראשון | חוזה מרכזי |
| --- | --- | --- |
| הודעה/עדכון שוטף | `src/data/hodaot.ts` | תאריך, קטגוריה, קישור ואמת התוכן; אין `news.ts` מקביל |
| צוות ופרטי קשר | `src/data/team.ts` | WhatsApp, `mailto`, `tel`, תמונה ועוגן |
| משאב ציבורי חדש בחט״ב | `src/data/choveret.ts` + `src/data/author-assignments.ts` | יוצר מאומת חובה; ללא ראיה המשאב נשמר אך אינו ציבורי |
| שינוי שיוך/פרסום | `src/data/attribution.ts`, `src/data/publishing.ts` | `ATTRIBUTION_PENDING` הוא quarantine, לא פטור ציבורי |
| שינוי מיתוג משאב | `src/data/resource-branding.ts` | מיפוי לפי resource ID בלבד; מיתוג אינו ייחוס |
| משוואות/חפיפה | `src/data/units.ts` + `canonical-content.ts` | מוזגות לנושאים `z-equations` / `h-congruent`; routes ישנים הם 301 |
| מסלול תאימות | `src/lib/legacyRedirects.mjs` | מקור יחיד ל־redirect, sitemap, tests ו־verify-deploy |
| חטיבה עליונה | `src/drafts/chativa-elyona/` | כרגע הציבור מתכנס ל־`/chativa-elyona/`; חומר עתידי נשמר מחוץ ל־pages |
| חוזר מפמ״ר | `src/data/mafmar.ts` + `public/docs/` | מקור רשמי, טווחי MAF, עמודים, hash ועותק מקומי |
| עמוד שכבה — חומרים | `src/components/GradeIndex.astro` | טבלת הנושאים (`.luxt` מ-global.css, RULES 3.30); מונים נגזרים מהקטלוג הקנוני ובניסוח פדגוגי, לא `משימות` גנרי; ה-ul נשאר `class="topics"` והשורה `class="topic"` — needles של verify-deploy |
| עמוד נושא — משימות | `src/components/ChapterIndex.astro` | משאב מרכזי מעל טבלת המשימות (`.luxt`); צבע שורה לפי `resourceType`; השורה נשארת `class="rcard"` — needle של verify-deploy |
| עיצוב הטבלאות | `src/styles/global.css` — בלוק `.luxt` | מקור יחיד לשתי הטבלאות (RULES 3.30, 10/08/2026): כותרות דביקות, זברה, פס צבע, גלולות; שיבוץ אזורים ורוחבי עמודות ברכיבים |
| עמוד משאב | `src/components/ResourceSplit.astro` | embed אמיתי/fallback, `ResourceActions` למשאבים רגילים בלבד (`showActions`), attribution, RTL, mobile |
| פעולות משאב רגיל | `src/components/ResourceActions.astro` + `src/components/PrintController.astro` | פעולות משאב משותפות + הדפסה אמיתית עם בחירת צבע/שחור־לבן; אין מערכת `.res-actions` מקבילה |
| Mafmar / plan-prisa — ניווט בלי לוח פעולות | `src/components/MafmarRange.astro`, `src/pages/hozer-mafmar.astro`, `src/components/PlanPrisaWeb.astro` | אין `ResourceActions`/`.orbs`; רק ניווט עמודים/חלקים/מקטעים; ה-PDF המקורי של plan/prisa נשאר זמין כקישור פשוט (`.ppw-source`) |
| סרטון פתיחה | `src/components/HeroVideo.astro` + `public/media/hero-*` | נכסי hero קנוניים בלבד; אין לשמור renders חלופיים ללא consumer |
| לוגו ModEL | `src/data/resource-branding.ts` + `public/media/brands/` | mapping מפורש; המקור שסיפק יניב בלבד; `moodle-guide`/`moodle-slides` מיוחסים ל״צוות מודל — משרד החינוך״ |
| proxy | `src/lib/proxyGuard.ts`, `src/lib/proxyHttp.ts`, `src/lib/proxyResponse.ts` | allowlist, redirect-origin validation, timeout, methods/headers בטוחים, noindex/framing/error policy |
| SEO | `Base.astro`, `astro.config.mjs`, `public/robots.txt` | canonical, sitemap, metadata, Open Graph ו־WebSite JSON-LD בעמוד הבית בלבד |

## 4. חטיבת הביניים — חוזים פעילים

- שער חטיבת הביניים (10/08): המסך הראשון הוא רצועה רחבה — כותרת + טבלת הקישורים מימין וההטמעה הקומפקטית של ההמחשות (`HamchashotEmbed compact`) משמאל, כולה בתוך המסך הראשון; מתחתיו ניווט `grade-shortcuts` יחיד עם בדיוק ארבעה כפתורי `gs-btn` — שלוש השכבות (מ־`choveret`/`gradeHref`) ומאגר המבחנים, הקישור היחיד בעמוד ל־`/chativat-beynayim/mivchanim/` (RULES 3.26–3.27). מסך השלישים, המונים על הכפתורים וה־CTA הרוחבי בוטלו; `grade-shortcuts` ו־`gs-btn` הם needles של verify-deploy. אין עוד הטמעת המחשות בתחתית השער; בעמודי המבוא של השכבות ההטמעה הגבוהה נשארת.
- `/chativat-beynayim/mivchanim/` הוא hub מבחנים אמיתי; אסור להפנות אותו לכיתה ח׳.
- עמוד החומרים של שכבה מציג נושאים/אוספים. המונה של כל נושא נגזר מן המשאבים **הקנוניים והציבוריים** שלו ומשתמש ב־`resourceCountLabel()`.
- נושא עם משאב ציבורי אחד עובר ישירות לעמוד המשאב; 2+ נשארים בעמוד נושא.
- משאב ללא ייחוס יוצר מאומת נשמר בנתונים אך אינו נבנה כעמוד ציבורי ואינו נספר במונים.
- Grade 9 היא חטיבת ביניים; חומר שמסומן כחטיבה עליונה אינו מוזרק אליה אוטומטית.

## 5. הטמעות

- `tzirim`: direct embed מאומת.
- `misparim`, `zaviyot`: דרך proxy בגלל `X-Frame-Options: SAMEORIGIN` במקור.
- Google Drive: source קנוני יכול להיות `/view`; iframe משתמש ב־`/preview` כשנבדק כבטוח.
- Canva Sites ו־Google Sites: אין iframe שבור; fallback לפתיחה חיצונית כאשר framing חסום.
- `src-game-h-7a1e51bbee6f`: layout רוחבי מפורש 16:9.
- הצלחת iframe נקבעת רק מ־load אמיתי, לא מטיימר שמדמה הצלחה.

## 6. ייחוס ומיתוג

- לכל משאב ציבורי בחט״ב חייב להיות creator מאומת — אדם או ארגון.
- אין לנחש אדם מדומיין, filename, URL או כותרת.
- `ATTRIBUTION_PENDING` היא רשימת quarantine שמותר לה רק להצטמצם; הראצ׳ט הנוכחי הוא **100**. בביקורת 09/08 הוחזרו להסגר 34 רשומות provenance-only/partial; 34 אינו גודל הרשימה הכולל.
- יוצר מוצג פעם אחת. אין טקסט גלוי `קרדיט:` / `קרדיטים:`.
- משרד החינוך וארגונים דומים אינם מקבלים עמוד מחבר אישי.
- ModEL: `moodle-guide` ו־`moodle-slides` מיוחסים לארגון **צוות מודל — משרד החינוך**. הלוגו ממופה לפי ID בלבד.

## 7. חריגי שימור

- `src/components/Booklet.astro` נשמר בכוונה ואינו public route. אין למחוק אותו או את `page-flip` כ־dead code.
- `workbook-studio/` הוא placeholder מעבר בלבד; מחיקה דורשת הוכחה שה־deployment הפרטי כבר הוסב.
- `src/drafts/chativa-elyona/` אינו dead code; זה חומר שמור מחוץ ל־public pages עד החלטת מוצר.

## 8. איכות, CI ופרודקשן

- `npm run quality` הוא שער הקוד הקנוני: repo-health → hygiene-dead-code → אימות בניית לוגו Moodle → Astro check → strict Playwright TypeScript gate (`typecheck:tests`) → build → Playwright Chromium/Pixel 7, `retries=0`.
- CI מוסיף parallel critical-smoke ב־Firefox וב־WebKit.
- Critical production dependency audit חוסם; High מדווח ואינו חוסם.
- אחרי push ל־`main`, `verify-production` מאמת שהפרודקשן מגיש את אותו SHA ואת חוזי הליבה.
- כשל Vercel מסוג `api-deployments-free-per-day` הוא חסם תשתיתי; אין לדחוף empty commit כדי לעקוף אותו.

## 9. ניקוי ושינויים

1. לפני מחיקה: search מלא ל-consumers, imports, routes, tests, workflows ו־RULES.
2. אל תסיק ש־0 imports פירושו dead code כאשר RULES מגדיר חריג שימור.
3. אל תבצע major upgrade ללא advisory/צורך מוכח.
4. אל תשאיר source/provenance מיותר תחת `public/` אם הוא נדרש לריפו אך לא אמור להיות מוגש — העבר אותו לתיקיית מקור לא־ציבורית ועדכן את כלי הגזירה.
5. אחרי מחיקה: `check` → `build` → tests ממוקדים → `quality` מלא.

## 10. סיכונים ידועים

- קישורי Drive, Canva, YouTube ואתרי ממשלה עלולים להשתנות או להיחסם.
- עותקי PDF מקומיים עלולים לסטות מהמסמך הרשמי; שינוי עמודים יכול לשבור טווחי MAF.
- iframe חיצוני יכול לשנות XFO/CSP; fallback חייב להישאר אמיתי.
- סרטוני hero ו־PDF גדולים הם מוקדי משקל; נכס חדש דורש consumer ברור ואופטימיזציה.
- הריפו ציבורי: אין credentials, כלי ניהול אישיים או חומרי Drive פרטיים.
- מסמך זה עצמו יכול להתיישן; עדכון ארכיטקטוני צריך לשנות כאן רק את מפת העבודה הקבועה, לא להעתיק DOM/CSS או היסטוריית debugging.

## 11. פתיחת סשן משמעותי

```bash
git status --short --branch
git fetch --prune
git log -5 --oneline
node --version
npm --version
```

לאחר מכן קרא את `RULES.md`, `README.md`, מסמך זה ואת הקבצים הספציפיים למשימה. אל תניח ש־PR, SHA, CI או deployment מהסשן הקודם עדיין עדכניים.