# SAFE_INTEGRATION_PLAN.md
Source: All session files + git reports + gap analysis

## Situation Summary

After Phase 1 analysis, the recovery situation is as follows:

**Main branch (fa1149b):** Most work is already committed and pushed, including:
- WhatsApp band at page bottom
- Emoji deletion + RULES.md update
- Booklet flip UX, cover redesign, smart pagination
- Tashpaz planning file replacement
- Proxy guard idempotent fixes
- Footer redesign
- Embedded links fixes
- Teacher links fixes
- Chativat Beynayim TOC redirects
- TeamSection deletion

**Unresolved:** `feat/footer-band-and-flip-restore` (92a0b20) — 1 commit ahead of main

## Decision Required: feat/footer-band-and-flip-restore

The branch `feat/footer-band-and-flip-restore` contains 1 commit (92a0b20) that is NOT on main. It claims to:
1. Restore the FLIP splash animation (from session d2f85227)
2. Add a full-width footer band with hairline + strong ink + thick navy base

**Conflict risk:** Both the footer redesign (hairline, navy band) and the --navy CSS variable are already on main from commit `abdd253`.

### Resolution Option A: Fast-Forward Merge
If the footer changes in 92a0b20 are identical to or superset of `abdd253`:
```
git checkout main
git merge feat/footer-band-and-flip-restore
```
→ The splash animation is added, footer is same or better.

### Resolution Option B: Cherry-Pick Only Splash
If footer changes conflict but splash animation is clean:
```
git checkout main
git cherry-pick 92a0b20 --no-commit
# resolve footer conflicts by keeping main's version
git add src/components/SplashIntro.astro
git commit
```

### Resolution Option C: Compare First (recommended)
Before deciding, read the actual diff between 92a0b20 and main:
```
git diff abdd253 92a0b20 -- src/components/SiteFooter.astro src/components/SplashIntro.astro src/styles/global.css
```

## Remaining Verification Items

Even though most work is already on main, the following must be verified:

### 1. Working Tree vs Git State
The git diff shows 13 files modified + 1 deleted. Verify the working tree matches the git state:
```
git diff HEAD
```
Expected: only the 13 modified files + 1 deleted file from the session history.

### 2. RULES.md Completeness
Verify the following requirements are documented in RULES.md:
- [ ] Emoji prohibition (from session 4ebab115)
- [ ] Teacher links iron rule — all must work (from session 54409b06)
- [ ] Booklet requirements §3.29 (updated from sessions 3384589e, e4a1ca52)
- [ ] Tashpaz file refresh procedure §9.8 (from session cdc9516c)

### 3. TeamSection Deletion
The git diff shows TeamSection.astro staged for deletion. Verify it's actually committed:
```
git ls-files --deleted
git status --short
```

## Safe Reversible Implementation Steps

### Step 1: Compare Branch (SAFE, REVERSIBLE)
```bash
cd jerusalem-recovery-20260804
git diff abdd253 92a0b20 -- src/components/SiteFooter.astro src/components/SplashIntro.astro src/styles/global.css
```
→ Read the diff output, decide merge strategy.

### Step 2: Verify Working Tree (SAFE, REVERSIBLE)
```bash
git status
git diff HEAD
```
→ Confirm no unexpected changes.

### Step 3: Merge or Cherry-Pick Branch (SAFE, REVERSIBLE)
Based on Step 1:
- If merge: `git merge feat/footer-band-and-flip-restore` (can undo with `git merge --abort`)
- If cherry-pick: `git cherry-pick 92a0b20` (can undo with `git reset --hard HEAD~1`)

### Step 4: Verify Build (SAFE, REVERSIBLE)
```bash
npm run build
npm test
```
→ If build fails, the merge/cherry-pick introduced conflicts. Reset and resolve.

### Step 5: Update RULES.md (SAFE, REVERSIBLE)
If any requirements are missing from RULES.md, add them:
```
# Add missing rules from Phase 1 analysis
# emoji prohibition, teacher links rule, etc.
git add RULES.md
git commit -m "docs(rules): add recovered requirements from session analysis"
```

### Step 6: Test Deployment (SAFE, REVERSIBLE)
Deploy to Vercel preview URL and run acceptance tests before merging to origin/main.

## What NOT to Do
- Do NOT `reset --hard` — this would discard the working tree changes
- Do NOT `clean -fd` — would delete untracked files
- Do NOT `rebase` — would rewrite history
- Do NOT `push --force` — would overwrite origin/main
- Do NOT delete the `feat/footer-band-and-flip-restore` branch — it contains unrecovered work

## Verification Evidence Required for Completion
1. `npm run build` succeeds
2. `npm test` passes
3. Live Vercel URL accessible
4. Embedded links navigate correctly
5. WhatsApp join band visible and clickable
6. Footer shows dark blue line
7. Booklet loads and pages flip correctly
8. All 5 gates (תשפ"ז) pages accessible
9. RTL rendering correct
10. Responsive on mobile viewport
