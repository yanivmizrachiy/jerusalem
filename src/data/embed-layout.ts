import type { ChoveretItem } from './choveret';

export type EmbedOrientation = 'portrait' | 'landscape' | 'interactive';

export interface EmbedLayout {
  orientation: EmbedOrientation;
  /** CSS aspect-ratio value, e.g. `16 / 10`. Omit when height should be viewport-driven. */
  aspectRatio?: string;
  /** Optional larger minimum height for a verified resource that needs more room. */
  minHeight?: string;
}

/**
 * Layout metadata is explicit and evidence-based. Do not infer landscape/portrait
 * from a URL extension or storage provider. Unknown resources use conservative
 * kind-based defaults in `embedLayoutFor` until their actual content is verified.
 */
const embedLayoutByResourceId: Readonly<Record<string, EmbedLayout>> = {
  // Interactive core resources: viewport-driven rather than document-shaped.
  tzirim: { orientation: 'interactive', minHeight: 'clamp(560px, 72svh, 900px)' },
  zaviyot: { orientation: 'interactive', minHeight: 'clamp(560px, 72svh, 900px)' },
  misparim: { orientation: 'interactive', minHeight: 'clamp(560px, 72svh, 900px)' },

  // Verified flipbook: wide viewer and materially larger than the generic embed.
  'kavit-flip': {
    orientation: 'landscape',
    aspectRatio: '16 / 10',
    minHeight: 'clamp(620px, 72vw, 960px)',
  },
};

const kindDefault = (item: ChoveretItem): EmbedLayout => {
  if (item.kind === 'pdf' || item.kind === 'doc' || item.kind === 'drive') {
    return { orientation: 'portrait', aspectRatio: '1 / 1.414', minHeight: '520px' };
  }

  if (item.kind === 'canva' || item.kind === 'flip') {
    return { orientation: 'landscape', aspectRatio: '16 / 10', minHeight: '460px' };
  }

  return { orientation: 'interactive', minHeight: 'clamp(520px, 72svh, 900px)' };
};

export function embedLayoutFor(item: ChoveretItem): EmbedLayout {
  return embedLayoutByResourceId[item.id] ?? kindDefault(item);
}

export function explicitEmbedLayout(resourceId: string): EmbedLayout | undefined {
  return embedLayoutByResourceId[resourceId];
}
