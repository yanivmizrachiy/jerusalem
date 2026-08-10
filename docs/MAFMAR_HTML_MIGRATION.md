# הגירת חוזר מפמ״ר תשפ״ז ל־HTML — מקור אמת

עודכן: 11/08/2026

## מטרת־על

לבטל לחלוטין הצגת חוזר מפמ״ר כ־PDF מוטמע ולהציג את מלוא 18 עמודי
המסמך כתוכן HTML מקומי, נגיש, responsive ולחיץ, תוך שימור מלא של
המלל, המבנה והקישורים.

## מקור מאומת

- PDF מקומי: public/docs/hozer-mafmar-tashpaz.pdf
- SHA-256 בזמן פתיחת המהלך: d188ce53916ab41e22db7dfbb8d8dc05ef127c823e02a2ae4d778fa47e17087a
- commit הבסיס של origin/main: 3c087281dcfd5c5541e0e7ed293c1abc54d6c3ca
- מספר עמודים ידוע ומאומת: 18
- manifest קיים: src/data/mafmar.ts
- 23 מקטעים קיימים: MAF-01–MAF-23

## עבודה קיימת שאסור לבצע מחדש

### commit 86a898c6e28b7c5b8e30084a9fd93f26d2434f15

כבר בוצע:
- חילוץ annotations מתוך ה-PDF הרשמי.
- 58 page-link pairs.
- 23 מסמכי תשפ״ז רשמיים.
- אימות reachability למסמכים.
- שילוב provenance לפי עמוד.

### commit fa0502414bbbd6537171e67f4ba79f851a289216

כבר בוצע:
- מיפוי חומרי החוזר לפי שכבות.
- שיוך עמודי מקור.
- זיהוי anchor/context.
- כללי RULES 9.3.21–9.3.25 בנושא קישורים, provenance ושיבוץ.

## מה חסר בתחילת המהלך

- [ ] גוף מלא של 18 העמודים כ־HTML.
- [ ] שימור כל מבנה התוכן והטבלאות.
- [ ] הצבת כל קישור בתוך המיקום ההגיוני המתאים ב־HTML.
- [ ] ביטול iframe של חוזר מפמ״ר ב-/hozer-mafmar/.
- [ ] ביטול iframe של החוזר ב-/hodaot/.
- [ ] החלפת MafmarRange/PDF-range בתוכן HTML מקומי.
- [ ] 23 עוגני MAF מפנים ל־HTML ולא לעמודי PDF.
- [ ] בדיקות conservation ואנטי־רגרסיה.
- [ ] verify-deploy marker חדש data-mafmar-web.
- [ ] אימות CI.
- [ ] אימות production בנפרד.

## כללי ביצוע

1. אין דמו.
2. אין paraphrase במקום העתקה.
3. אין חילוץ חוזר של מחקר שכבר קיים ללא צורך מוכח.
4. PDF נשמר כמקור/הורדה בלבד.
5. כל שינוי נבנה בענף מבודד.
6. אין נגיעה ב-stash jerusalem-safe-backup-20260810-215811.
7. אין נגיעה ב-worktree אחר או בענף recovery.
8. אין merge או deployment לפני quality green ואימות conservation.
9. אין לסמן דרישה DONE על בסיס build בלבד.
10. כל השלמה חייבת לכלול ראיה: קובץ, בדיקה, commit וסטטוס deployment.

## יומן ביצוע

- 11/08/2026 — נפתחה הגירה מבודדת מ-origin/main 3c087281dcfd5c5541e0e7ed293c1abc54d6c3ca.
- 11/08/2026 — נשמרו ראיות היסטוריות מ-86a898c ומ-fa05024.
- 11/08/2026 — ננעל חוזה HTML-only ב-RULES 9.3.26.
- 11/08/2026 — SHA-256 מקור: d188ce53916ab41e22db7dfbb8d8dc05ef127c823e02a2ae4d778fa47e17087a.
## מימוש HTML — שלב ליבה

- [x] נוצר scripts/extract-mafmar-content.py.
- [x] נוצר src/data/mafmar-content.generated.ts.
- [x] אומתו 18/18 עמודי PDF.
- [x] נדרש חוזה שימור של 58 מופעי URI.
- [x] כל occurrence ממופה לשורת HTML עם confidence מחייב >= 0.35.
- [x] נוצר src/components/MafmarWeb.astro.
- [x] MafmarRange.astro הוסב מתצוגת PDF לתוכן HTML מקומי תוך שמירת ה-consumers.
- [x] /hozer-mafmar/ הוסב לתוכן HTML מלא.
- [x] /hodaot/ אינו מטמיע עוד את PDF המפמ״ר.
- [x] המצגת הנייטיבית MafmarPresentation נשמרה.
- [x] נוסף marker data-mafmar-web ל-verify-deploy.
- [x] נוספה 	ests/mafmar-web.spec.ts.
- [ ] יש לעדכן חוזי בדיקות ישנים נוספים שעדיין מצפים ל-PDF viewer, אם יימצאו בשער האיכות המלא.
- [ ] CI.
- [ ] main.
- [ ] production.
## אימות סופי מקומי — HTML

- [x] 18/18 עמודים כתוכן HTML מקומי.
- [x] 25,931 תווי מקור.
- [x] 212 annotations גולמיים → 58 קישורים לוגיים.
- [x] 56 URLs ייחודיים.
- [x] LOW_CONFIDENCE=0.
- [x] אפס PDF iframe/embed/object של חוזר המפמ״ר.
- [x] PDF נשמר כמקור/הורדה בלבד.
- [x] MafmarRange מציג HTML מקומי.
- [x] /hodaot/ מציג preview HTML ומצגת נייטיבית.
- [x] 23 עוגני MAF ו-4 עוגני חלקים.
- [x] ניגודיות AA עברה על build טרי.
- [x] npm run quality עבר.
- [ ] CI מרוחק.
- [ ] merge ל-main.
- [ ] production verification.
