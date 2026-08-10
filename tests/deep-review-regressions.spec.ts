import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { canonicalGrades } from '../src/data/canonical-content';
import { publishableItems } from '../src/data/publishing';
import { gradeMaterialsHref, itemHref } from '../src/data/choveret';
import {
  PROXY_ROBOTS_POLICY,
  ProxyRequestError,
  copyResponseHeaders,
  upstreamInit,
} from '../src/lib/proxyHttp';

const MAX_BODY_BYTES = 1024 * 1024;

const expectProxyStatus = async (promise: Promise<unknown>, status: number) => {
  try {
    await promise;
    throw new Error(`expected proxy rejection ${status}`);
  } catch (error) {
    expect(error).toBeInstanceOf(ProxyRequestError);
    expect((error as ProxyRequestError).response.status).toBe(status);
  }
};

test('proxy responses and robots policy keep /api content out of the public index', async () => {
  const upstream = new Response('ok', {
    status: 200,
    headers: { etag: '"proxy-fixture"', 'cache-control': 'public, max-age=60' },
  });
  const headers = copyResponseHeaders(upstream, new Headers({ 'content-type': 'text/html' }));

  expect(headers.get('x-robots-tag')).toBe(PROXY_ROBOTS_POLICY);
  expect(headers.get('etag')).toBe('"proxy-fixture"');

  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');
  expect(robots).toMatch(/^Disallow: \/api\/$/m);
});

test('proxy rejects declared oversized POST before buffering the body', async () => {
  const request = new Request('https://proxy.test/', {
    method: 'POST',
    headers: {
      'content-length': String(MAX_BODY_BYTES + 1),
      'content-type': 'application/octet-stream',
    },
    body: new Uint8Array([1]),
  });

  // Regression guard: the old implementation called arrayBuffer() before the
  // size check. A declared oversize must now be rejected before that method can run.
  Object.defineProperty(request, 'arrayBuffer', {
    value: () => {
      throw new Error('oversized body was buffered');
    },
  });

  await expectProxyStatus(upstreamInit(request), 413);
});

test('proxy aborts an unbounded stream as soon as it crosses 1MiB', async () => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(700_000));
      controller.enqueue(new Uint8Array(400_000));
      controller.close();
    },
  });

  const request = new Request(
    'https://proxy.test/',
    {
      method: 'POST',
      body: stream,
      // Node/undici requires duplex for a streaming request body; browsers do not
      // expose it in RequestInit's DOM typing.
      duplex: 'half',
    } as RequestInit & { duplex: 'half' },
  );

  expect(request.headers.has('content-length')).toBe(false);
  await expectProxyStatus(upstreamInit(request), 413);
});

test('proxy still forwards a body exactly at the 1MiB boundary', async () => {
  const body = new Uint8Array(MAX_BODY_BYTES);
  body[0] = 7;
  body[MAX_BODY_BYTES - 1] = 9;

  const request = new Request('https://proxy.test/', { method: 'POST', body });
  const init = await upstreamInit(request);
  const forwarded = new Uint8Array(init.body as ArrayBuffer);

  expect(forwarded.byteLength).toBe(MAX_BODY_BYTES);
  expect(forwarded[0]).toBe(7);
  expect(forwarded[MAX_BODY_BYTES - 1]).toBe(9);
});

test('chapters emptied by quarantine do not produce public 200 topic pages', async ({ request }) => {
  const emptyTopics = canonicalGrades.flatMap((grade) =>
    grade.chapters
      .filter((chapter) => chapter.materials !== false && publishableItems(chapter.items).length === 0)
      .map((chapter) => ({ grade: grade.slug, chapter: chapter.id }))
  );

  expect(emptyTopics.length, 'the quarantine regression has at least one real fixture').toBeGreaterThan(0);

  for (const entry of emptyTopics) {
    const response = await request.get(`/chativat-beynayim/nose/${entry.grade}/${entry.chapter}/`, {
      maxRedirects: 0,
    });
    expect(response.status(), `${entry.grade}/${entry.chapter} must not be a public empty topic`).toBe(404);
  }
});

test('single-public-item resource back navigation cannot loop through its redirecting topic', async ({ page }) => {
  const singles = canonicalGrades.flatMap((grade) =>
    grade.chapters.flatMap((chapter) => {
      if (chapter.materials === false) return [];
      const items = publishableItems(chapter.items);
      return items.length === 1 ? [{ grade, chapter, item: items[0] }] : [];
    })
  );

  expect(singles.length, 'there are real single-item topics to protect').toBeGreaterThan(0);

  for (const { grade, chapter, item } of singles.slice(0, 4)) {
    const reader = itemHref(grade.slug, item);
    const safeBack = gradeMaterialsHref(grade.slug);
    await page.goto(reader);

    await expect(page.locator('.res-back'), `${chapter.id}: explicit back button`).toHaveAttribute('href', safeBack);
    await expect(page.locator('.res-eyebrow a').last(), `${chapter.id}: topic label link`).toHaveAttribute('href', safeBack);

    const backHref = await page.locator('.res-back').getAttribute('href');
    expect(backHref, `${chapter.id}: back target must differ from the reader`).not.toBe(reader);
  }
});
