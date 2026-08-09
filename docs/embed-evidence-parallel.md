# Parallel embed evidence — 2026-08-09

This note records only evidence that can be acted on without guessing while the main integration work proceeds in parallel.

## Verified and implemented

- `tzirim` / `https://yanivmizrachiy.github.io/coordinate-first-quadrant/` — runtime investigation on PR #75 found no `X-Frame-Options` and no CSP frame restriction. The canonical presentation layer now supplies the same URL as the direct embed source through `src/data/embed-sources.ts`.
- Google Drive factories in `src/data/choveret.ts` already keep `/view` as the canonical source URL while using `/preview` for iframe embedding. No blanket rewrite is needed there.
- The historical landscape screenshot has now been recovered from the project library and matched unambiguously to `src-game-h-7a1e51bbee6f` (`משחק התאמות`), Grade 8 → `h-systems`. The screenshot shows the same description/creator context and the embedded Google Slides page `משחק בשני שלבים`; the source catalog points that canonical resource to presentation id `1wV1Wo6zCWIbw84-jyszG5iMW26eu5uszEtNDOaN1fZg`. Its visible slide is widescreen 16:9, so `embed-layout.ts` now gives this resource an explicit landscape 16:9 layout instead of the generic portrait-document fallback.

## Intentionally not changed

- `*.my.canva.site` — framing is blocked by verified XFO/CSP; keep external-open fallback.
- `sites.google.com` — framing is blocked by verified `X-Frame-Options: DENY`; keep external-open fallback.
- No other document receives a landscape override from provider/kind heuristics; unknown resources remain on the conservative default until their actual content is verified.
