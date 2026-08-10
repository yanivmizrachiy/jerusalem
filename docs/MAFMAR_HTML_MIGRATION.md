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
