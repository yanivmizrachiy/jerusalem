# ACCEPTANCE_TEST_MATRIX.md
Source: All session files + git reports + RULES.md requirements

## Test Categories

### Category 1: Core Functionality

| ID | Test | Source Session | Status | Evidence Required |
|---|---|---|---|---|
| T1.1 | WhatsApp join band visible at page bottom, full-width | a5db8627 | On main ✓ | Visual check, click → join link works |
| T1.2 | No emoji anywhere on site | 4ebab115 | On main ✓ | grep -r emoji src/ → 0 results |
| T1.3 | Teacher links on home page → student detail pages | 54409b06 | On main ✓ | Click each teacher name → correct page |
| T1.4 | Chativat Beynayim TOC redirects work | 9b5b8bd0 | On main ✓ | /mischakim/ → /#toc-klali redirect |
| T1.5 | Chativat Beynayim TOC redirects (tests) | 9b5b8bd0 | On main ✓ | npm test passes redirect tests |

### Category 2: Booklet

| ID | Test | Source Session | Status | Evidence Required |
|---|---|---|---|---|
| T2.1 | Booklet loads as full-screen takeover | 3384589e | On main ✓ | First interaction → full-screen |
| T2.2 | Two-page spread mode works | 3384589e | On main ✓ | Both pages visible side-by-side |
| T2.3 | Cover opens as one wide page on first arrival | e4a1ca52 | On main ✓ | /chativat-beynayim → single wide cover |
| T2.4 | Page flip is smooth and page-like | 3384589e | On main ✓ | Swipe/keyboard → smooth page flip |
| T2.5 | Booklet links work in embedded mode | 05891018 | On main ✓ | Iframe → links navigate within iframe |
| T2.6 | Smart pagination — pages break intelligently | e4a1ca52 | On main ✓ | Page breaks feel natural |
| T2.7 | Tashpaz files are current year (תשפז) | cdc9516c | On main ✓ | Files reference correct year |

### Category 3: Proxy Guard

| ID | Test | Source Session | Status | Evidence Required |
|---|---|---|---|---|
| T3.1 | Embedded links navigate directly to target | bf5cf8b7 | On main ✓ | Click → navigate away from embed |
| T3.2 | srcset images load without 404 (double-prefix fixed) | 645274ab | On main ✓ | Network tab → 200 for all images |
| T3.3 | Panorama/reveal/PDF load without 404 | 9b5b8bd0 | On main ✓ | Load each resource type → 200 |
| T3.4 | `_next/image` URLs load correctly | 645274ab | On main ✓ | Check image src attributes → valid paths |

### Category 4: Footer

| ID | Test | Source Session | Status | Evidence Required |
|---|---|---|---|---|
| T4.1 | Footer shows dark blue (navy) full-width line | b52e5267 | On main ✓ | Visual check — navy line visible |
| T4.2 | Footer text in strong ink color above navy line | b52e5267 | On main ✓ | Text is readable above line |
| T4.3 | Delicate hairline beneath footer text | b52e5267 | On main ✓ | Hairline separator visible |

### Category 5: Splash / Hero

| ID | Test | Source Session | Status | Evidence Required |
|---|---|---|---|---|
| T5.1 | Splash image blocks button interaction during display | d2f85227 | feat/footer branch | Cannot click buttons while splash visible |
| T5.2 | Splash fades gradually and interestingly | d2f85227 | feat/footer branch | Fade duration and curve feel natural |
| T5.3 | Splash animation is fast and non-blocking | d2f85227 | feat/footer branch | Site is usable within expected time |

### Category 6: Deleted Components

| ID | Test | Source Session | Status | Evidence Required |
|---|---|---|---|---|
| T6.1 | TeamSection not rendered on home page | git diff | On main ✓ | Home page source → no TeamSection |
| T6.2 | No broken references to TeamSection | git diff | On main ✓ | Build succeeds without TeamSection |

### Category 7: Cross-Cutting

| ID | Test | Source Session | Status | Evidence Required |
|---|---|---|---|---|
| T7.1 | Build succeeds | all | On main ✓ | npm run build → 0 |
| T7.2 | All tests pass | all | On main ✓ | npm test → 0 failures |
| T7.3 | Site loads without console errors | all | On main ✓ | Console → no errors |
| T7.4 | RTL rendering correct | all | On main ✓ | Hebrew text renders RTL |
| T7.5 | Mobile responsive | all | On main ✓ | 375px viewport → no horizontal scroll |
| T7.6 | All 5 gates accessible | all | On main ✓ | /chativat-beynayim, /chativa-elyona, etc. → 200 |

## Test Execution Order

### Pre-Flight (Before any changes)
1. Run `npm test` — baseline
2. Run `npm run build` — baseline
3. Note any existing failures

### After Branch Resolution (Step 1-3 of Integration Plan)
4. Run `npm run build` — verify no new failures
5. Run `npm test` — verify all pass

### After Deployment
6. Manual checks for T1.1, T4.1-T4.3, T7.4, T7.5
7. Console check for T7.3
8. Link check for T1.3, T1.4, T2.5, T3.1

## Test Tooling
- `npm test` — Playwright tests (tests/site.spec.ts)
- `npx playwright test` — same
- `npx astro check` — TypeScript type checking
- Browser console — manual or automated

## Known Gaps

1. **No automated test for embedded iframe navigation (T2.5, T3.1)** — requires manual testing with actual iframe embed
2. **No automated test for splash animation behavior (T5.1, T5.2)** — requires visual/manual verification
3. **No automated test for emoji presence (T1.2)** — run `grep -ri '😀\|🙂\|😃\|😄\|🙈' src/` instead
4. **No automated test for Tashpaz year (T2.7)** — manual verification of file contents

## Completion Evidence
All tests marked ✓ in the Evidence Required column must produce positive results before claiming completion.
