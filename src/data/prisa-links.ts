import { prisaLinkCellMap } from './prisa-link-cells.generated';
import { prisaLinksContent } from './prisa-links.generated';

export interface PrisaSourceLink {
  readonly href: string;
  readonly occurrences: number;
}

export interface PrisaCellLink {
  readonly href: string;
  readonly annotationIndex: number;
}

interface PrisaLinkDocument {
  readonly occurrenceCount: number;
  readonly uniqueCount: number;
  readonly links: readonly PrisaSourceLink[];
}

const documents = prisaLinksContent.documents as unknown as Readonly<Record<string, PrisaLinkDocument>>;

const cellIndex = new Map<string, PrisaCellLink[]>();

const cellKey = (
  documentId: string,
  page: number,
  rowIndex: number,
  cellIndexValue: number,
) => `${documentId}:${page}:${rowIndex}:${cellIndexValue}`;

for (const link of prisaLinkCellMap) {
  const key = cellKey(link.document, link.page, link.rowIndex, link.cellIndex);
  const existing = cellIndex.get(key) ?? [];
  existing.push({
    href: link.href,
    annotationIndex: link.annotationIndex,
  });
  cellIndex.set(key, existing);
}

export function prisaLinksFor(documentId: string): readonly PrisaSourceLink[] {
  return documents[documentId]?.links ?? [];
}

export function prisaLinkDocumentFor(documentId: string): PrisaLinkDocument | undefined {
  return documents[documentId];
}

export function prisaLinksAt(
  documentId: string,
  page: number,
  rowIndex: number,
  cellIndexValue: number,
): readonly PrisaCellLink[] {
  return cellIndex.get(cellKey(documentId, page, rowIndex, cellIndexValue)) ?? [];
}
