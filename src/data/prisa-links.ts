import { prisaLinksContent } from './prisa-links.generated';

export interface PrisaSourceLink {
  readonly href: string;
  readonly occurrences: number;
}

interface PrisaLinkDocument {
  readonly occurrenceCount: number;
  readonly uniqueCount: number;
  readonly links: readonly PrisaSourceLink[];
}

const documents = prisaLinksContent.documents as unknown as Readonly<Record<string, PrisaLinkDocument>>;

export function prisaLinksFor(documentId: string): readonly PrisaSourceLink[] {
  return documents[documentId]?.links ?? [];
}

export function prisaLinkDocumentFor(documentId: string): PrisaLinkDocument | undefined {
  return documents[documentId];
}
