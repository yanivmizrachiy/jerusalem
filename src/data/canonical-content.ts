import { choveret, materialChapters, type ChoveretChapter, type ChoveretGrade, type ChoveretItem, type ItemKind } from './choveret';
import { hafifaUnit, mishvaotUnit, toEmbed, type Unit, type UnitResource } from './units';
import { isPublishableMaterial } from './publishing';
import { supplementalItemsForChapter } from './project-supplements';

const unitKindToItemKind = (resource: UnitResource): ItemKind => {
  if (resource.kind === 'drive') return 'drive';
  if (resource.kind === 'gdoc') return 'doc';
  if (resource.kind === 'gslides' || resource.kind === 'canva') return 'canva';
  return 'site';
};

const unitResourceToItem = (unit: Unit, resource: UnitResource): ChoveretItem => ({
  id: resource.id,
  title: resource.title,
  note: resource.section ? `${resource.section} · ${unit.title}` : unit.title,
  url: resource.url,
  embed: resource.external ? undefined : toEmbed(resource),
  kind: unitKindToItemKind(resource),
});

const legacyUnitItems = {
  'z-equations': mishvaotUnit.resources.map((resource) => unitResourceToItem(mishvaotUnit, resource)),
  'h-congruent': hafifaUnit.resources.map((resource) => unitResourceToItem(hafifaUnit, resource)),
} satisfies Record<string, ChoveretItem[]>;

const uniqueById = (items: readonly ChoveretItem[]): ChoveretItem[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

/**
 * מקור התצוגה הקנוני לנושא. יחידות legacy ששייכות לנושא רגיל ומשאבי מוצר
 * שנוספו לאחר בניית קטלוג המקור מוזגים כאן, בלי לגעת בנתוני החילוץ עצמם.
 */
export function canonicalChapterItems(chapter: ChoveretChapter): ChoveretItem[] {
  const legacy = legacyUnitItems[chapter.id as keyof typeof legacyUnitItems] ?? [];
  const supplemental = supplementalItemsForChapter(chapter.id);
  return uniqueById([...chapter.items, ...legacy, ...supplemental]);
}

export function canonicalChapter(chapter: ChoveretChapter): ChoveretChapter {
  return { ...chapter, items: canonicalChapterItems(chapter) };
}

export function canonicalGrade(grade: ChoveretGrade): ChoveretGrade {
  return {
    ...grade,
    chapters: grade.chapters.map(canonicalChapter),
  };
}

export const canonicalGrades = choveret.map(canonicalGrade);

export const canonicalReaderItems = canonicalGrades.flatMap((grade) => {
  const seen = new Set<string>();
  return grade.chapters.flatMap((chapter) =>
    chapter.items
      .filter((item) => !item.pageHref && isPublishableMaterial(item))
      .filter((item) => {
        const key = `${grade.slug}:${item.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((item) => ({ grade, chapter, item }))
  );
});

export function canonicalPublishedGradeCount(grade: ChoveretGrade): number {
  const normalized = canonicalGrade(grade);
  const ids = new Set<string>();
  for (const chapter of materialChapters(normalized)) {
    for (const item of chapter.items) {
      if (isPublishableMaterial(item)) ids.add(item.id);
    }
  }
  return ids.size;
}
