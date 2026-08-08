export const primaryResourceByChapter: Readonly<Record<string, string>> = {
  'z-coordinate-system': 'tzirim',
  'z-angles': 'zaviyot',
  'z-directed-numbers': 'misparim',
  'h-linear-function': 'kavit-flip',
};

export function primaryResourceId(chapterId: string): string | undefined {
  return primaryResourceByChapter[chapterId];
}
