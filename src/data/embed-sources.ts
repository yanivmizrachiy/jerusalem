import type { ChoveretItem } from './choveret';

/**
 * Overrides that are backed by runtime framing evidence rather than URL heuristics.
 * Keep this list intentionally small: an item belongs here only after its actual
 * framing policy has been verified. Unknown sources must keep their existing
 * fallback instead of being guessed into an iframe.
 */
const VERIFIED_EMBED_BY_RESOURCE_ID: Readonly<Record<string, string>> = {
  // Runtime verification (2026-08-09): no X-Frame-Options and no CSP frame restriction.
  tzirim: 'https://yanivmizrachiy.github.io/coordinate-first-quadrant/',
};

export function withVerifiedEmbedSource(item: ChoveretItem): ChoveretItem {
  const verifiedEmbed = VERIFIED_EMBED_BY_RESOURCE_ID[item.id];
  if (!verifiedEmbed || item.embed === verifiedEmbed) return item;
  return { ...item, embed: verifiedEmbed };
}

export function verifiedEmbedSourceFor(resourceId: string): string | undefined {
  return VERIFIED_EMBED_BY_RESOURCE_ID[resourceId];
}
