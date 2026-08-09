import type { ChoveretItem } from './choveret';

/**
 * משאבים שנוספו ישירות לדרישות המוצר לאחר בניית קטלוג המקור.
 * נשמרים בנפרד כדי לא לערבב אותם בנתוני החילוץ של מסמכי משרד החינוך.
 */
export const projectSupplementalItems: Readonly<Record<string, readonly ChoveretItem[]>> = {
  'z-angles': [
    {
      id: 'angle-canva-site',
      title: 'זוויות — פעילות אינטראקטיבית',
      note: 'פעילות נוספת בנושא זוויות לכיתה ז׳.',
      url: 'https://idanahvan.my.canva.site/angle',
      kind: 'site',
      resourceType: 'interactive-activity',
      delivery: 'digital',
      grades: ['z'],
      sourceTopicIds: ['z-angles'],
      collections: [],
      needsReview: false,
    },
  ],
};

export function supplementalItemsForChapter(chapterId: string): readonly ChoveretItem[] {
  return projectSupplementalItems[chapterId] ?? [];
}
