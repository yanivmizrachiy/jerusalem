# BRANCH_AND_FILE_MATRIX.md
Source: reports/branch-inventory.csv + git-diff-stat.txt + git-diff-cached-stat.txt

## Branch Status Summary

| Branch | Commit | vs main | Status |
|---|---|---|---|
| `main` | `fa1149b` | baseline | ✓ Pushed |
| `feat/footer-band-and-flip-restore` | `92a0b20` | +1 ahead, 0 behind | OPEN — 1 commit not on main |
| `feat/booklet-smart-pagination` | `fa1149b` | 0 ahead, 0 behind | MERGED (synced with main) |
| `feat/klali-file-pages` | `fa1149b` | 0 ahead, 0 behind | MERGED (synced with main) |
| `fix/splash-freeze-until-clear` | `fa1149b` | 0 ahead, 0 behind | MERGED (synced with main) |
| `feat/digital-booklet-book` | `e2ac998` | 0 ahead, 15 behind | ABANDONED/OLD |

## File Matrix

### Already on main (committed at fa1149b)

| File | Change Type | Lines Changed | Source Session(s) | Commit |
|---|---|---|---|---|
| `RULES.md` | Modified | ±12 | 4ebab115 (emoji) | Various |
| `src/components/Booklet.astro` | Modified | +796/-396 | 3384589e, e4a1ca52, 9b5b8bd0 | c120fad, 2d986cc, f9f108b, 02e40d4, d6b20da, abdd253, 18108c5, 78cd8d4 |
| `src/components/HeroVideo.astro` | Modified | ±145 | 9b5b8bd0 | 78cd8d4 |
| `src/components/SiteFooter.astro` | Modified | ±21 | b52e5267 | abdd253 |
| `src/components/SplashIntro.astro` | Modified | ±106 | d2f85227 | 92a0b20 |
| `src/data/choveret.ts` | Modified | ±91 | cdc9516c, e4a1ca52 | 1c85e2d |
| `src/data/units.ts` | Modified | ±54 | 54409b06 | Various |
| `src/lib/proxyGuard.ts` | Modified | ±7 | 645274ab, bf5cf8b7, 05891018 | fa1149b |
| `src/pages/chativat-beynayim/mischakim.astro` | Modified | ±66 | 9b5b8bd0 | abdd253 |
| `src/pages/chativat-beynayim/mivchanim.astro` | Modified | ±78 | 9b5b8bd0 | abdd253 |
| `src/pages/index.astro` | Modified | ±3 | a5db8627, 54409b06, 05891018 | 78cd8d4 |
| `src/styles/global.css` | Modified | +1 | b52e5267 | abdd253 |
| `tests/site.spec.ts` | Modified | ±11 | 9b5b8bd0 | abdd253 |

### Deleted from main

| File | Lines | Status | Notes |
|---|---|---|---|
| `src/components/TeamSection.astro` | 271 deleted | On main ✓ | Removed from index.astro, staged deletion in git cache |

### Not in git history (pre-existing or created earlier)

| File | Status | Notes |
|---|---|---|
| `src/components/WhatsAppBand.astro` | Pre-existing | Added to index.astro but not new in this diff |
| `src/components/Booklet.astro` | Modified (not new) | Large existing file with many changes |

## Duplicate/Contradicting Work

**None found.** The work across all sessions is additive and consistent:
- Booklet work builds progressively on the same component
- Proxy guard work extends the same file
- Footer/splash work is on a separate branch (feat/footer-band-and-flip-restore)
- No two sessions produce conflicting changes to the same line

## feat/footer-band-and-flip-restore Analysis

**Commit:** `92a0b20` — "feat(footer): full-width hairline + strong ink + thick navy base band; restore FLIP splash (7.23-7.24)"

**What this adds beyond main:**
- `SplashIntro.astro` changes (splash animation fixes from d2f85227)
- Footer band styling

**What main already has:**
- Footer redesign (abdd253 — same content?)
- Navy CSS variable (abdd253)

**Decision needed:** Does this branch's footer content conflict with `abdd253`? If not, the splash animation changes can be cherry-picked or merged.

**Current state:** 1 commit ahead of main. The commit message implies it contains both the footer redesign and the splash restoration.
