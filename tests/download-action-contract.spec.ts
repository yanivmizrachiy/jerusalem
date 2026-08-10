import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { isSameOriginUrl } from '../src/lib/downloadUrl';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const SITE = 'https://jerusalem-virid.vercel.app';

test('same-origin download determination proves every URL shape', () => {
  // מקומי — בכל הצורות, לא רק root-relative
  expect(isSameOriginUrl('/file.pdf', SITE)).toBe(true);
  expect(isSameOriginUrl('docs/file.pdf', SITE)).toBe(true);
  expect(isSameOriginUrl('./file.pdf', SITE)).toBe(true);
  expect(isSameOriginUrl(`${SITE}/docs/file.pdf`, SITE)).toBe(true);

  // חיצוני — protocol-relative ומוחלט
  expect(isSameOriginUrl('//drive.google.com/file.pdf', SITE)).toBe(false);
  expect(isSameOriginUrl('https://drive.google.com/file.pdf', SITE)).toBe(false);

  // אין ערך או ערך שאינו URL — אין הבטחת הורדה
  expect(isSameOriginUrl(undefined, SITE)).toBe(false);
  expect(isSameOriginUrl('https://', SITE)).toBe(false);
  expect(isSameOriginUrl('/file.pdf', undefined)).toBe(false);

  // בסיס כ-URL (כמו Astro.site) שקול לבסיס כמחרוזת
  expect(isSameOriginUrl('docs/file.pdf', new URL(SITE))).toBe(true);
});

test('download action is truthful about same-origin versus external files', async () => {
  const actions = await source('src/components/ResourceActions.astro');

  // Browser `download` is not a reliable cross-origin contract. The component
  // must derive localDownload from real URL resolution against the canonical
  // origin — not from prefix sniffing.
  expect(actions).toContain("import { isSameOriginUrl } from '../lib/downloadUrl'");
  expect(actions).toContain('const localDownload = isSameOriginUrl(downloadUrl, Astro.site ?? Astro.url)');
  expect(actions).not.toContain("downloadUrl?.startsWith('/')");
  expect(actions).toContain("const downloadLabel = localDownload ? 'הורדה' : 'פתיחת קובץ'");
  expect(actions).toContain('download={localDownload ? true : undefined}');
  expect(actions).toContain("data-download-mode={localDownload ? 'download' : 'open'}");
  expect(actions).toContain('aria-label={`${downloadLabel}: ${shareTitle}`}');
  expect(actions).not.toMatch(/\sdownload\s+data-action="download"/);
});
