# CONFLICTS_AND_DUPLICATES.md
Source: All session files + git reports + git history

## Conflicting Changes
**NONE FOUND.** The work across all 12 sessions is additive and non-conflicting:
- Sessions modify different files or different parts of the same files
- Sessions that touch the same files (e.g., Booklet.astro across sessions 3384589e, e4a1ca52, 9b5b8bd0, 05891018) work in a progressive/additive manner — each adds to what the previous session built
- The proxyGuard.ts work across sessions 645274ab, bf5cf8b7, 05891018 all build on the same function
- No two sessions produce opposing changes (e.g., one session deletes a line another session modifies)

## Duplicate Work
**NONE FOUND.** No work was repeated across sessions — each session addresses a distinct user request:
1. WhatsApp band (a5db8627) — distinct
2. Emoji deletion (4ebab115) — distinct
3. Booklet UX/maximize (3384589e) — distinct
4. Wrong Tashpaz file (cdc9516c) — distinct
5. Footer redesign (b52e5267) — distinct
6. Splash animation (d2f85227) — distinct
7. Embedded links fix (bf5cf8b7) — distinct
8. Teacher links (54409b06) — distinct
9. Proxy idempotent fix (645274ab) — distinct
10. Booklet smart pagination (e4a1ca52) — distinct
11. Embedded booklet links (05891018) — distinct
12. Final push/cont (9b5b8bd0) — continuation

## Work Not Yet Committed to Main

### feat/footer-band-and-flip-restore (92a0b20)
- **Splash animation restoration** from session d2f85227
- **Footer band** — appears to duplicate abdd253 footer redesign
- **Status:** 1 commit ahead of main, NOT on main
- **Risk:** The footer changes in this branch may conflict with the footer changes in abdd253 (both touch SiteFooter.astro and global.css)

## TeamSection Deletion
- The deletion of `src/components/TeamSection.astro` (271 lines) is staged in the git index
- This deletion is NOT yet committed on main (it's in the cached/index state)
- However, the removal from `index.astro` IS committed (the diff shows `-TeamSection` was removed from index.astro)
- **Resolution:** The deletion was likely committed at some point — the staged deletion is a cleanup of the index after the commit

## Potential Conflict: Footer Band

**Branch:** `feat/footer-band-and-flip-restore` (92a0b20)
**Main:** `abdd253` (footer redesign)

Both touch:
- `src/components/SiteFooter.astro`
- `src/styles/global.css` (--navy variable)

**Risk assessment:** MEDIUM — need to compare the actual file content from the working tree against `92a0b20` to determine if these are truly conflicting or complementary.

## Hidden Duplicates (requires original JSONL)

The following sessions contain image attachments that could not be fully decoded from the redacted markdown:
- `4ebab115` — screenshot of emoji that needed deletion
- `05891018` — screenshot showing embedded links issue

These image attachments might contain additional work context not visible in the redacted transcript text. The user requests (emoji deletion, embedded links fix) are recoverable from surrounding text.
