import { planPrisaContent, type PlanPrisaContentKey } from './plan-prisa-content.generated';

export type PlanPrisaDocument = (typeof planPrisaContent.documents)[PlanPrisaContentKey];

/**
 * Same-origin source PDFs that must be presented as real web content rather than
 * embedded PDF viewers. The PDF stays available only as the verified download/source.
 */
const KEY_BY_PDF: Readonly<Record<string, PlanPrisaContentKey>> = {
  '/docs/plan-7-tashpaz.pdf': 'plan-7',
  '/docs/prisa-7-tashpaz.pdf': 'prisa-7',
  '/docs/plan-8-tashpaz.pdf': 'plan-8',
  '/docs/prisa-8-tashpaz.pdf': 'prisa-8',
  '/docs/plan-9a-tashpaz.pdf': 'plan-9a',
  '/docs/prisa-9a-tashpaz.pdf': 'prisa-9a',
  '/docs/plan-9b-tashpaz.pdf': 'plan-9b',
  '/docs/prisa-9b-tashpaz.pdf': 'prisa-9b',
};

export const PLAN_PRISA_WEB_PDFS = Object.freeze(Object.keys(KEY_BY_PDF));

export function planPrisaDocumentFor(download?: string): PlanPrisaDocument | undefined {
  if (!download) return undefined;
  const key = KEY_BY_PDF[download];
  return key ? planPrisaContent.documents[key] : undefined;
}
