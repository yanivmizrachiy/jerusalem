# Phase 4 — ביקורת עומק וסגירת קצוות פתוחים

**תאריך:** 2026-08-04 · **ענף:** `claude/phase-4-audit-1l8bxs` · **בסיס:** `main@6aa346b`

---

## 1. מה היה פתוח — ומה נסגר

| פריט | מצב שנמצא | פעולה |
| --- | --- | --- |
| **PR ‎#2** — עיצוב שורת התחתית + שחזור FLIP (7.23–7.24) | פתוח, CI ירוק, מבוסס על ראש main | **מוזג ל־main** (‏`6aa346b`). CI על main אחרי המיזוג — ירוק (ריצה ‎#52) |
| **`noop-temp`** | ענף רימוט **ריק לחלוטין** (אפס קבצים), היסטוריה מנותקת מ־main | למחיקה — ראו §4 (מחיקת ענפים חסומה מסשן זה) |
| **`agent/mafmar-placement-map`** | מכיל רק RULES.md ישן; היסטוריה מנותקת; התוכן נבלע ב־RULES.md הקנוני | למחיקה — ראו §4 |
| **`feat/footer-band-and-flip-restore`** | מוזג כעת | למחיקה — ראו §4 |
| **ענף `recovery/jerusalem-sync-20260804`** מסשן הטרמינל | **מעולם לא נדחף לרימוט** — הקומיטים (כולל ac2efa0) ומסמך ה־audit הקודם קיימים רק על המחשב המקומי | ביקורת זו מחליפה אותו; אם הענף עוד קיים מקומית — אפשר לדחוף או למחוק |
| Issues פתוחים | אין | — |

## 2. בריאות הריפו — אומת בפועל

- **`npx astro check`** — ‏0 שגיאות. שתי אזהרות `ts(6133)` (ייבוא ללא שימוש) — **תוקנו** בביקורת זו.
- **`npm run build`** — עובר; כל ‎60+ המסלולים נבנים, sitemap נוצר.
- **`npx playwright test`** — **103/103 עוברים** (דסקטופ + מובייל, ‏1.2 דק׳) מול build הפקה.
- שכבת ה־proxy (`/api/em`, `/api/mam`, `proxyGuard`) — allowlist קשיח, ‏502 מסודר, משמר זמן־ריצה; תקינה.
- אין TODO/FIXME/console.log בקוד; עץ העבודה נקי; `public/` מסודר (19MB מדיה).

הערה: בסביבות מקומיות ייתכן שהסוללה תיכשל מיידית (3–4ms לכל טסט) עם
"Executable doesn't exist" — זו אי־התאמת גרסת דפדפן של Playwright לסביבה,
לא תקלה באתר. הפתרון: `npx playwright install chromium`.

## 3. תיקונים שבוצעו בביקורת זו

1. **`package-lock.json` סונכרן מחדש** — הלוקפייל סטה מ־package.json עד ש־`npm ci` נכשל; ה־CI השתמש ב־`npm install` שהסתיר זאת (התקנה לא דטרמיניסטית).
2. **CI עבר ל־`npm ci`** — התקנה קשיחה לפי הלוקפייל + ‏`concurrency` לביטול ריצות מיושנות.
3. **`npm test`** — נוסף סקריפט סטנדרטי (מריץ `playwright test`, כמו ב־CI).
4. ניקוי כל ההצהרות ללא שימוש: `MAFMAR_URL` ‏(hozer-mafmar), ‏`hamchashot` ‏(index), ‏`between` ‏(luach), ‏`chapter` ‏(reader) — ‏`astro check` נקי לחלוטין.
5. הסרת כפילות `.vercel` ב־`.gitignore`.
6. **נוסף `README.md`** — לא היה כלל: תיאור הפרויקט, הסטאק, הפקודות, מפת המבנה ועקרונות העבודה.
7. נוסף `engines.node >= 22.12.0` ל־package.json (דרישת Astro 7, תואם ל־CI).

## 4. נותר לביצוע ידני (מחיקת ענפים חסומה מסשן זה)

```bash
git push origin --delete noop-temp agent/mafmar-placement-map feat/footer-band-and-flip-restore
```

(אופציונלי, לפני המחיקה — שימור ההיסטוריה המנותקת כתגית ארכיון:
`git fetch origin agent/mafmar-placement-map && git tag archive/mafmar-map FETCH_HEAD && git push origin archive/mafmar-map`)
