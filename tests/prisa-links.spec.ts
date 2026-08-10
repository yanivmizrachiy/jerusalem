import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { prisaLinkCellMap } from '../src/data/prisa-link-cells.generated';
import { prisaLinksContent } from '../src/data/prisa-links.generated';
import { planPrisaContent } from '../src/data/plan-prisa-content.generated';

const CASES = [
  { id: 'prisa-7', route: '/chativat-beynayim/reader/z/prisa-z/' },
  { id: 'prisa-8', route: '/chativat-beynayim/reader/h/prisa-h/' },
  { id: 'prisa-9a', route: '/chativat-beynayim/reader/t/prisa-t/' },
  { id: 'prisa-9b', route: '/chativat-beynayim/reader/t/prisa-t-b/' },
] as const;

const unescapePdf = (value: string) =>
  value
    .replace(/\\([\\()])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\(\d{1,3})/g, (_, octal: string) => String.fromCharCode(Number.parseInt(octal, 8)));

const sourceUris = (pdf: string) => {
  const raw = readFileSync(path.join(process.cwd(), 'public', pdf.replace(/^\//, ''))).toString('latin1');
  const links: string[] = [];
  const pattern = /\/URI\s*(?:\(((?:\\.|[^\\)])*)\)|<([0-9A-Fa-f]+)>)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw))) {
    const href = match[1]
      ? unescapePdf(match[1])
      : Buffer.from(match[2], 'hex').toString('utf8');
    if (/^https?:\/\//i.test(href)) links.push(href);
  }
  return links;
};

test('כל 186 אנוטציות הקישור מארבע הפריסות נשמרו ללא יעד שהומצא', () => {
  expect(prisaLinksContent.totalOccurrences).toBe(186);
  expect(prisaLinksContent.uniqueAcrossDocuments).toBe(95);
  expect(prisaLinkCellMap).toHaveLength(186);

  for (const link of prisaLinkCellMap) {
    const document = planPrisaContent.documents[link.document];
    const page = document.pages.find((candidate) => candidate.page === link.page);
    expect(page, `${link.document}: page ${link.page}`).toBeDefined();
    const row = page?.rows[link.rowIndex];
    expect(row, `${link.document}: row ${link.rowIndex}`).toBeDefined();
    expect(
      row?.cells[link.cellIndex],
      `${link.document}: cell ${link.cellIndex}`,
    ).toBeDefined();
  }

  for (const entry of CASES) {
    const document = prisaLinksContent.documents[entry.id];
    const source = sourceUris(document.pdf);
    const counts = new Map<string, number>();
    for (const href of source) counts.set(href, (counts.get(href) ?? 0) + 1);

    expect(document.occurrenceCount, `${entry.id}: כל המופעים`).toBe(source.length);
    expect(document.uniqueCount, `${entry.id}: כל היעדים הייחודיים`).toBe(counts.size);
    expect(document.links.map((link) => [link.href, link.occurrences])).toEqual([...counts]);
    expect(document.links.every((link) => /^https?:\/\//.test(link.href))).toBe(true);
  }
});

test('כל 186 מופעי הקישור מוצגים בתוך התא המדויק שלהם וללא iframe', async ({ page }) => {
  for (const entry of CASES) {
    const document = prisaLinksContent.documents[entry.id];
    const expected = prisaLinkCellMap
      .filter((link) => link.document === entry.id)
      .map((link) => ({
        href: link.href,
        page: link.page,
        rowIndex: link.rowIndex,
        cellIndex: link.cellIndex,
      }));

    expect(expected).toHaveLength(document.occurrenceCount);

    const source = sourceUris(document.pdf);
    const sourceCounts = new Map<string, number>();
    const mappedCounts = new Map<string, number>();

    for (const href of source) {
      sourceCounts.set(href, (sourceCounts.get(href) ?? 0) + 1);
    }

    for (const link of expected) {
      mappedCounts.set(link.href, (mappedCounts.get(link.href) ?? 0) + 1);
    }

    expect([...mappedCounts.entries()].sort()).toEqual(
      [...sourceCounts.entries()].sort(),
    );

    await page.goto(entry.route);

    const links = page.locator('a[data-prisa-cell-link]');
    await expect(links).toHaveCount(document.occurrenceCount);
    await expect(page.locator('[data-prisa-links]')).toHaveCount(0);
    await expect(page.locator('.res-view iframe')).toHaveCount(0);

    const rendered = await links.evaluateAll((nodes) =>
      nodes.map((node) => ({
        href: node.getAttribute('href'),
        page: Number(node.getAttribute('data-prisa-page')),
        rowIndex: Number(node.getAttribute('data-prisa-row')),
        cellIndex: Number(node.getAttribute('data-prisa-cell')),
        target: (node as HTMLAnchorElement).target,
        rel: (node as HTMLAnchorElement).rel,
        decoration: getComputedStyle(node).textDecorationLine,
        weight: Number.parseInt(getComputedStyle(node).fontWeight, 10),
      }))
    );

    expect(
      rendered.map(({ href, page, rowIndex, cellIndex }) => ({
        href,
        page,
        rowIndex,
        cellIndex,
      })),
    ).toEqual(expected);

    for (const link of rendered) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('noreferrer');
      expect(link.decoration).toContain('underline');
      expect(link.weight).toBeGreaterThanOrEqual(700);
    }
  }
});

test('עמוד הפריסות המרכזי וכפתור הודעות שוטפות מובילים לארבע תצוגות האינטרנט', async ({ page }) => {
  await page.goto('/chativat-beynayim/prisot/');
  const index = page.locator('[data-prisa-index]');
  await expect(index).toBeVisible();
  await expect(index.locator('.prisa-card')).toHaveCount(4);
  await expect(page.locator('iframe')).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.goto('/hodaot/');
  const button = page.locator('a[href="/chativat-beynayim/prisot/"]');
  await expect(button).toHaveCount(1);
  await expect(button).toContainText('פריסות הוראה');
});
