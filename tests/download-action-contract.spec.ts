import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('download action is truthful about same-origin versus external files', async () => {
  const actions = await source('src/components/ResourceActions.astro');

  // Browser `download` is not a reliable cross-origin contract. The component
  // must only emit the attribute for a local URL and must label external URLs
  // as opening a file rather than promising a download it cannot enforce.
  expect(actions).toContain("const localDownload = Boolean(downloadUrl?.startsWith('/'))");
  expect(actions).toContain("const downloadLabel = localDownload ? 'הורדה' : 'פתיחת קובץ'");
  expect(actions).toContain('download={localDownload ? true : undefined}');
  expect(actions).toContain("data-download-mode={localDownload ? 'download' : 'open'}");
  expect(actions).toContain('aria-label={`${downloadLabel}: ${shareTitle}`}');
  expect(actions).not.toMatch(/\sdownload\s+data-action="download"/);
});
