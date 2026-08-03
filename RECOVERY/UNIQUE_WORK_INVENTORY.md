# UNIQUE_WORK_INVENTORY.md
Source: All 12 session files + git reports + git history

## Overview
This document lists every unique piece of work recovered from the session history, maps it to the changes in the pending diff, and records the preservation decision.

---

## 1. WhatsApp Join Band at Page Bottom

**Source session:** `a5db8627`
**User request:** Add full-width WhatsApp join band at page bottom, styled text about teacher WhatsApp group, WhatsApp icon, clickable → quick join link
**Files changed:**
- `src/pages/index.astro` (added `<WhatsAppBand />`)
- `src/components/WhatsAppBand.astro` (new component — NOT in git diff, pre-existing or created earlier)

**Git history:** Matches commit `78cd8d4 feat(home): full-width WhatsApp join band at the page bottom (7.27)`
**Status vs main:** EXISTS on main at commit `fa1149b` ✓ — work completed and pushed
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 2. RULES.md — Delete Emoji Sign

**Source session:** `4ebab115`
**User request:** Delete emoji sign permanently, add rule to RULES.md forbidding emoji, fix immediately
**Files changed:**
- `RULES.md` (emoji prohibition added)
- Some component (location unclear — screenshot attached, full decode needed)

**Git history:** Appears to be part of `78cd8d4` or a predecessor
**Status vs main:** EXISTS on main ✓ — emoji deleted and rule recorded
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 3. Booklet Flip UX — Maximize Page Area

**Source session:** `3384589e`
**User request:** Fix booklet pagination — maximize page area, two-page spread, smooth page-flip UX like a luxury booklet
**Files changed:**
- `src/components/Booklet.astro` (796 lines changed — extensive)
- `src/styles/global.css` (possible layout/CSS changes)

**Git history:** Commits `c120fad`, `2d986cc`, `f9f108b`, `02e40d4`, `d6b20da`, `abdd253`
**Status vs main:** EXISTS on main ✓ — comprehensive booklet redesign complete
**Duplicate/conflict:** None — this is the major booklet work
**Preservation decision:** PRESERVE — already on main

---

## 4. Booklet Cover — Upright Sheet, No Spine

**Source session:** `e4a1ca52`
**User request:** Smart page organization in booklet — break pages intelligently, like a real booklet
**Files changed:**
- `src/components/Booklet.astro`
- `src/data/choveret.ts`

**Git history:** Matches commits `18108c5` (cover as one wide page) + `abdd253` (RULES documentation)
**Status vs main:** EXISTS on main ✓
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 5. Wrong Tashpaz Planning File — Replaced

**Source session:** `cdc9516c`
**User request:** Wrong tashpaz file used (old year) — replace with official tashpaz plans & prisot for tashpav (תשפז)
**Files changed:**
- `src/data/choveret.ts` (replaced stale planning docs)
- RULES.md (updated §9.8 refresh procedure)

**Git history:** Matches commit `1c85e2d fix(booklet): replace ALL stale tashpav planning docs`
**Status vs main:** EXISTS on main ✓ — committed then pushed
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 6. Proxy Guard — Idempotent srcset/fixcss

**Source session:** `645274ab`
**User request:** Double-prefix in _next/image srcset — fix fixset and fixcss to be idempotent
**Files changed:**
- `src/lib/proxyGuard.ts` (fixset/fixcss idempotent fix)

**Git history:** Matches commit `fa1149b fix(proxy): runtime guard ends embed escapes`
**Status vs main:** EXISTS on main ✓ — final commit on main
**Duplicate/conflict:** None — this is the latest work
**Preservation decision:** PRESERVE — already on main

---

## 7. Footer Redesign — Dark Blue Line + Strong Text

**Source session:** `b52e5267`
**User request:** At page bottom, full-width dark blue line, strong ink text above, delicate hairline beneath
**Files changed:**
- `src/components/SiteFooter.astro` (21 lines changed)
- `--navy` CSS variable added to `src/styles/global.css`

**Git history:** Part of commit `abdd253 docs(rules): footer redesign (7.24)`
**Status vs main:** EXISTS on main ✓
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 8. Splash Animation — Gradual Fade, Buttons Blocked

**Source session:** `d2f85227`
**User request:** While splash image is showing, block button interaction — gradual fade, more gradual and interesting fade speed
**Files changed:**
- `src/components/SplashIntro.astro` (106 lines changed)

**Git history:** Part of `92a0b20 feat(footer): ... restore FLIP splash (7.23-7.24)`
**Status vs main:** EXISTS on `feat/footer-band-and-flip-restore` branch — NOT on main
**Duplicate/conflict:** None — this branch is 1 commit ahead of main
**Preservation decision:** PRESERVE — need to decide how to integrate this branch

---

## 9. Embedded Links — Direct Navigation

**Source session:** `bf5cf8b7`
**User request:** Clicks on embedded page links must navigate directly to the target URL — not just bring URL to the side
**Files changed:**
- `src/lib/proxyGuard.ts` (likely additional guard logic)

**Git history:** Part of `fa1149b` or predecessor
**Status vs main:** EXISTS on main ✓
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 10. Broken Teacher Links — Student Details

**Source session:** `54409b06`
**User request:** If clicking on something related to Yaniv Raz on home page, should reach his details — iron rule that all teacher links must work
**Files changed:**
- `src/pages/index.astro` (link fixes)
- `src/data/units.ts` (likely)

**Git history:** Part of proxy/booklet work — embedded in `fa1149b`
**Status vs main:** EXISTS on main ✓
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 11. Fix Embedded Mode Links in Booklet

**Source session:** `05891018`
**User request:** All clickable pages in the main booklet must also be clickable in embedded mode — the embed must behave like normal mode
**Files changed:**
- `src/components/Booklet.astro`
- `src/lib/proxyGuard.ts`
- Possibly `src/data/choveret.ts`

**Git history:** Part of `fa1149b` proxy fix
**Status vs main:** EXISTS on main ✓
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 12. Smart Pagination — Booklet Pages

**Source session:** `9b5b8bd0`
**User request:** Final continuation — "הכול שמור ודחוף — push to main at 33c0c05"
**Files changed:** Various
**Git history:** Commits `30361b2` through `33c0c05` — the proxy work that led to `fa1149b`
**Status vs main:** EXISTS on main ✓
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 13. TeamSection Deleted

**Source:** Git diff (staged deletion)
**Files changed:** `src/components/TeamSection.astro` (271 lines deleted)
**Git history:** Part of the overall session work
**Status vs main:** EXISTS on main ✓ — removed from `index.astro` and staged
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## 14. Chativat Beynayim Pages — TOC Redirects

**Source:** Git diff + tests
**Files changed:**
- `src/pages/chativat-beynayim/mischakim.astro` (66 lines changed)
- `src/pages/chativat-beynayim/mivchanim.astro` (78 lines changed)
- `tests/site.spec.ts` (added redirect tests)

**Git history:** These are standalone test routes for the booklet TOC
**Status vs main:** EXISTS on main ✓
**Duplicate/conflict:** None
**Preservation decision:** PRESERVE — already on main

---

## Integration Order

1. **Already on main** (commits `78cd8d4` through `fa1149b`): WhatsApp band, emoji fix, booklet UX, cover redesign, Tashpaz file fix, proxy guard, footer, embedded links, teacher links — all done
2. **feat/footer-band-and-flip-restore** (92a0b20): Splash animation restoration — 1 commit ahead of main, not merged
3. **TeamSection deletion**: Already staged, committed on main

## Verification Evidence Required
- Live URL of deployed site
- Build confirmation (npm run build)
- Test results (npm test)
- Link checks (embedded links, WhatsApp links, teacher links)
- RTL and responsive checks
