# Parallel embed evidence — 2026-08-09

This note records only evidence that can be acted on without guessing while the main integration work proceeds in parallel.

## Verified and implemented

- `tzirim` / `https://yanivmizrachiy.github.io/coordinate-first-quadrant/` — runtime investigation on PR #75 found no `X-Frame-Options` and no CSP frame restriction. The canonical presentation layer now supplies the same URL as the direct embed source through `src/data/embed-sources.ts`.
- Google Drive factories in `src/data/choveret.ts` already keep `/view` as the canonical source URL while using `/preview` for iframe embedding. No blanket rewrite is needed there.

## Intentionally not changed

- `*.my.canva.site` — framing is blocked by verified XFO/CSP; keep external-open fallback.
- `sites.google.com` — framing is blocked by verified `X-Frame-Options: DENY`; keep external-open fallback.
- The historical screenshot requirement saying a specific file is landscape still cannot be mapped to one canonical resource ID with sufficient evidence. Existing orientation infrastructure remains ready for an explicit mapping once that identity is proven; do not guess.
