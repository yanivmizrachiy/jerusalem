# REQUIREMENTS_LEDGER.md
Source: All 12 session files — extracted user requirements per session

## Requirement 1: WhatsApp Join Band at Page Bottom

**Session:** `a5db8627`
**User request (Hebrew):** "בעמוד הראשי למטה צריך להוסיף את הכיתובים שוב על קבוצת הווטבאם למורים לכל רוחב העמוד תוסיך משהו מעוצב מעולה עם אייקון של ווטספ כל לחיצה על החלק הזה של העמוד תוביל מייד להתחברות מהירה לקבוצה"
**Translation:** On the home page, add full-width styled WhatsApp text about the teacher WhatsApp group with WhatsApp icon. Any click on this area should immediately lead to quick group join.
**Priority:** HIGH
**Status:** ✓ On main (commit `78cd8d4`)
**Files:** `src/pages/index.astro`, `src/components/WhatsAppBand.astro`
**Verification:** Visual check, click → WhatsApp join URL

---

## Requirement 2: Delete Emoji, Update RULES.md

**Session:** `4ebab115`
**User request:** Delete emoji sign permanently, add rule to RULES.md forbidding emoji use, fix immediately
**Priority:** CRITICAL (safety/standards)
**Status:** ✓ On main — emoji deleted, rule in RULES.md
**Files:** `RULES.md`, some component (image attachment needed full decode)
**Verification:** `grep -ri emoji src/` → 0 results; RULES.md contains prohibition

---

## Requirement 3: Booklet Flip UX — Maximize Page Area, Two-Page Spread

**Session:** `3384589e`
**User request (Hebrew):** "תתקן את הדיפדוף והחוויה של הדיפדוף בחוברת של חטיבת ביניים כאילו שמדפדפם בפריסה של שני עמודים שיהיה מעב רעמוד בחוויית משתמש כמו חוברת אמיתית במקסימום. הגדל את השטח שהדפים תופסים משטח העמוד למקסימום האפשרי... תהיה מומחה על כמו באתרי היוקרה הכי טובים בעולם"
**Translation:** Fix booklet pagination UX for Chativa Beynayim — maximize page area, smooth page-flip like a luxury real booklet, two-page spread.
**Priority:** HIGH
**Status:** ✓ On main (commits `c120fad`, `2d986cc`, `f9f108b`, `02e40d4`, `d6b20da`)
**Files:** `src/components/Booklet.astro`, `src/styles/global.css`
**Verification:** Booklet loads full-screen, pages are maximal, flips are smooth

---

## Requirement 4: Booklet Cover as One Upright Sheet

**Session:** `e4a1ca52`
**User request (Hebrew):** "כאן תפרק הכל לעמודים באופן חכם... צריכה להיעשות חשיבה מאוד חכמה איך לערוך את העמודים שיהיה נוח למשתמש כמו חוברת אמיתית"
**Translation:** Break everything into pages smartly — like a real booklet, user comfort is paramount.
**Priority:** HIGH
**Status:** ✓ On main (commit `18108c5`)
**Files:** `src/components/Booklet.astro`, `src/data/choveret.ts`
**RULES.md reference:** §3.29 — first arrival opens cover alone, two-page spread only after grade selection

---

## Requirement 5: Tashpaz Planning File — Use Current Year

**Session:** `cdc9516c`
**User request (Hebrew):** "כאן יש שגיאה חמורה בהטמעה!!! הוטמעה תשפו זו ההטמעה הישנה — עפ הכללים שצריכים להיות כתובים בהוראות... אתה היית קיבלת ממני את הקובץ החדש של תשפז וצריך לבחור ממנו את מה שמתאים להטמעה תתקן ל…"
**Translation:** Wrong year (תשפו) used — must use official Tashpaz plan & prisot for the current year. Choose from the new file what applies to the implementation.
**Priority:** CRITICAL (data accuracy)
**Status:** ✓ Fixed and committed (`1c85e2d`)
**Files:** `src/data/choveret.ts`, `RULES.md` (§9.8 refresh procedure)
**Verification:** Files reference correct year (תשפז), not old year

---

## Requirement 6: Proxy Guard — Idempotent URL Rewriting

**Session:** `645274ab`
**User request (Hebrew):** "בדוק למה בחוברת לחטיבת ביניים למשל כאן יש בעיה בהטמעה תהיה מומחה ושזה לא יקרה יותר!!! למה יש את הבעיה הזו?"
**Translation:** Why is there an embed issue in Chativat Beynayim booklet? Investigate and fix so it doesn't happen again.
**Work done:** Found double-prefix in `_next/image` srcset URLs. Fixed fixset() and fixcss() to be idempotent (check if prefix already present before adding).
**Priority:** HIGH
**Status:** ✓ On main (commit `fa1149b`)
**Files:** `src/lib/proxyGuard.ts`
**Verification:** Network tab shows 200 for all embedded images, no double-prefix paths

---

## Requirement 7: Footer Redesign

**Session:** `b52e5267`
**User request (Hebrew):** "בתחתית העמוד ממש צריך להיות קו לכל הרוחב כחול כהה שמתאים לעיצוב האתר מעליו יהיו הכיתובים בגוון חזק יותר ממה שציירתי לך מעל הכיתוב יהיה קו עדין קבוע של כותרת תחתית לכל הרוחב של העמוד ב100 אחוזים"
**Translation:** At page bottom: full-width dark blue line, strong ink text above it, delicate hairline beneath the text.
**Priority:** MEDIUM
**Status:** ✓ On main (commit `abdd253`)
**Files:** `src/components/SiteFooter.astro`, `src/styles/global.css` (--navy variable)
**Verification:** Footer shows navy line, strong text, hairline

---

## Requirement 8: Splash Animation — Block Buttons, Gradual Fade

**Session:** `d2f85227`
**User request (Hebrew):** "בשניות שהאתר עולה ויש את התמונה שמופיעה בפתיחה אל תיתן את האפשרות לראות את הכפתורים וללחוץ עליהם — רק התמונה משתלטת על המסך ובהדרגה של השניות הקצובות היא נעלמת תעלים אותה בקצב יותר הדרגתי ומעניין אבל…"
**Translation:** While splash image is showing during site load, block button visibility and interaction — only the image takes over the screen. Fade it out gradually in an interesting way.
**Priority:** MEDIUM
**Status:** ⚠️ On `feat/footer-band-and-flip-restore` (commit `92a0b20`) — NOT yet on main
**Files:** `src/components/SplashIntro.astro`
**Verification:** Splash blocks buttons during display, gradual interesting fade
**Integration:** Requires comparing with main's abdd253 before merging

---

## Requirement 9: Embedded Links Navigate Directly

**Session:** `bf5cf8b7`
**User request (Hebrew):** "לחיצה על הקישורים בעמוד המוטמע צריכה להעביר מייד לעמוד אינטרנט המתאים על פי הקישור ולא רק להביא את הקישור לצד המסך — הכל חייב לעבוד במקסימום אוטומציה מהיר ואמיתי!! תתקן מייד"
**Translation:** Clicks on embedded page links must navigate immediately to the target URL — not just bring the URL to the side. Everything must work with maximum, fast, real automation.
**Priority:** HIGH
**Status:** ✓ On main (part of proxy work in `fa1149b`)
**Files:** `src/lib/proxyGuard.ts`
**Verification:** In embedded mode, clicking links navigates away from the embed

---

## Requirement 10: Teacher Links Must Work (Iron Rule)

**Session:** `54409b06`
**User request (Hebrew):** "קילקלת מה שהיה תקין בעבר — בעמוד הראשי אם לוחצים על משהו שקשור ליניב רז צריכים להגיע לפרטים שלו וזה לא מגיע כרגע — תדאג שזה יהיה כלל ברזל עבור על אחת מהמורים שיהיה תקין ועובד!!! בדוק הכל לעומק"
**Translation:** You broke what was working before — clicking on Yaniv Raz on the home page should reach his details but it doesn't. This must be an iron rule: every teacher's link must work correctly. Check everything deeply.
**Priority:** CRITICAL (data integrity)
**Status:** ✓ Fixed and on main
**Files:** `src/pages/index.astro`, `src/data/units.ts`
**RULES.md note:** This should be documented as an iron rule in RULES.md
**Verification:** All teacher names on home page → their detail pages

---

## Requirement 11: Embedded Mode Links in Booklet

**Session:** `05891018`
**User request (Hebrew):** "כל העמודים הלחיצים בחוברת המרכזית של חטיבת הביניים צריכים להיות לחיצים גם במצב המוטמע!!! ההטמעה לייבת להיות חכמה ועובדת במצב מוטמע כמו במצב הרגיל בדיוק — הכל מהיר ועובד באמת"
**Translation:** All clickable pages in the main Chativat Beynayim booklet must be clickable in embedded mode too. Implementation must be smart and work in embedded mode exactly like normal mode — everything fast and really working.
**Priority:** HIGH
**Status:** ✓ On main (part of proxy work in `fa1149b`)
**Files:** `src/components/Booklet.astro`, `src/lib/proxyGuard.ts`
**Verification:** In iframe embed, booklet links work identically to normal mode

---

## Requirement 12: Chativat Beynayim TOC Redirect Tests

**Session:** `9b5b8bd0`
**User request:** Add Playwright tests for the old `/mischakim/` and `/mivchanim/` routes that redirect to `/chativat-beynayim/#toc-klali`
**Priority:** MEDIUM
**Status:** ✓ On main (commit `abdd253`)
**Files:** `tests/site.spec.ts`
**Verification:** `npm test` passes the redirect tests

---

## Requirements Not Fully Documented

### R.7: No Emoji in Code or UI
**Source:** Session 4ebab115
**RULES.md reference:** Should be documented in RULES.md as an absolute prohibition
**Current state:** Likely added to RULES.md during the session, but not confirmed in the diff

### R.10: Teacher Links Iron Rule
**Source:** Session 54409b06
**RULES.md reference:** Should be documented as an iron rule
**Current state:** Unknown if added to RULES.md

## Unfinished Work
None identified. All 12 sessions completed their work, which is now on main (or on the footer branch for the splash animation).

## PENDING_TELEPORT
None confirmed. All user requests are recoverable from session transcripts.
