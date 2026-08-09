#!/usr/bin/env node

/**
 * External catalog health check (Issue #68).
 *
 * This is intentionally NOT part of the PR quality gate. External providers can
 * rate-limit GitHub-hosted runners, so this checker runs on a schedule/manual
 * workflow and produces an artifact with actionable diagnostics.
 *
 * It scans the canonical source-material catalog without importing TypeScript,
 * then probes canonical URLs and embed URLs with bounded concurrency/timeouts.
 * It reports dead/private links, timeouts, suspicious content types and embed
 * policies that would block framing on the Jerusalem site.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG = path.join(ROOT, 'src/data/source-materials.ts');
const OUT_DIR = path.join(ROOT, 'artifacts');
const JSON_OUT = path.join(OUT_DIR, 'external-catalog-health.json');
const MD_OUT = path.join(OUT_DIR, 'external-catalog-health.md');

const TIMEOUT_MS = Number(process.env.CATALOG_HEALTH_TIMEOUT_MS ?? 12_000);
const CONCURRENCY = Math.max(1, Math.min(12, Number(process.env.CATALOG_HEALTH_CONCURRENCY ?? 6)));
const MAX_URLS = Number(process.env.CATALOG_HEALTH_MAX_URLS ?? 0);
const USER_AGENT = 'Jerusalem-Math-Catalog-Health/1.0 (+https://jerusalem-virid.vercel.app)';

const source = await readFile(CATALOG, 'utf8');
const lines = source.split(/\r?\n/);
const entries = [];
let currentId = 'unknown';

const decodeString = (literal) => {
  try {
    return JSON.parse(literal);
  } catch {
    return null;
  }
};

for (const line of lines) {
  const idMatch = line.match(/^\s*"id"\s*:\s*("(?:\\.|[^"\\])*")/);
  if (idMatch) currentId = decodeString(idMatch[1]) ?? currentId;

  const fieldMatch = line.match(/^\s*"(url|embed)"\s*:\s*("(?:\\.|[^"\\])*")/);
  if (!fieldMatch) continue;
  const value = decodeString(fieldMatch[2]);
  if (!value || !/^https?:\/\//i.test(value)) continue;
  entries.push({ id: currentId, field: fieldMatch[1], url: value });
}

const unique = [...new Map(entries.map((entry) => [`${entry.field}\0${entry.url}`, entry])).values()];
const selected = MAX_URLS > 0 ? unique.slice(0, MAX_URLS) : unique;

const isAuthRedirect = (url) => {
  try {
    const parsed = new URL(url);
    return (
      /(^|\.)accounts\.google\.com$/i.test(parsed.hostname) ||
      /(^|\.)login\.microsoftonline\.com$/i.test(parsed.hostname) ||
      /\/ServiceLogin(?:[/?#]|$)/i.test(parsed.pathname)
    );
  } catch {
    return false;
  }
};

const isDirectPdf = (url) => {
  try {
    const parsed = new URL(url);
    return /\.pdf$/i.test(parsed.pathname) || /[?&](?:format|export)=pdf(?:&|$)/i.test(parsed.search);
  } catch {
    return false;
  }
};

const embedPolicyIssues = (headers) => {
  const issues = [];
  const xfo = (headers.get('x-frame-options') ?? '').trim().toLowerCase();
  if (xfo === 'deny' || xfo === 'sameorigin') issues.push(`x-frame-options:${xfo}`);

  const csp = (headers.get('content-security-policy') ?? '').toLowerCase();
  const frameAncestors = csp.match(/(?:^|;)\s*frame-ancestors\s+([^;]+)/)?.[1]?.trim() ?? '';
  if (frameAncestors) {
    if (/^'none'$/.test(frameAncestors)) issues.push("csp:frame-ancestors 'none'");
    else if (/^'self'$/.test(frameAncestors)) issues.push("csp:frame-ancestors 'self'");
  }
  return issues;
};

const requestOnce = async (entry) => {
  const started = Date.now();
  const response = await fetch(entry.url, {
    method: 'GET',
    redirect: 'follow',
    headers: {
      'user-agent': USER_AGENT,
      accept: '*/*',
      'cache-control': 'no-cache',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const finalUrl = response.url || entry.url;
  const contentType = (response.headers.get('content-type') ?? '').toLowerCase();
  const issues = [];

  if (response.status === 401 || response.status === 403) issues.push(`private-or-forbidden:${response.status}`);
  else if (response.status === 404 || response.status === 410) issues.push(`dead:${response.status}`);
  else if (response.status === 429) issues.push('rate-limited:429');
  else if (response.status >= 500) issues.push(`upstream:${response.status}`);
  else if (response.status >= 400) issues.push(`http:${response.status}`);

  if (isAuthRedirect(finalUrl)) issues.push('redirected-to-auth');

  if (isDirectPdf(entry.url) && response.ok && contentType) {
    const pdfLike = contentType.includes('application/pdf') || contentType.includes('application/octet-stream');
    if (!pdfLike) issues.push(`wrong-content-type:${contentType.split(';')[0]}`);
  }

  if (entry.field === 'embed' && response.ok) {
    issues.push(...embedPolicyIssues(response.headers));
  }

  try {
    await response.body?.cancel();
  } catch {
    // Headers/status are enough for this health check.
  }

  return {
    ...entry,
    ok: issues.length === 0,
    status: response.status,
    finalUrl,
    contentType: contentType.split(';')[0],
    issues,
    durationMs: Date.now() - started,
  };
};

const check = async (entry) => {
  let lastError = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = await requestOnce(entry);
      const retryable = result.status === 429 || result.status >= 500;
      if (!retryable || attempt === 2) return { ...result, attempts: attempt };
    } catch (error) {
      lastError = error;
      if (attempt === 2) break;
    }
    await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
  }

  const name = lastError?.name === 'TimeoutError' ? 'timeout' : 'network-error';
  return {
    ...entry,
    ok: false,
    status: null,
    finalUrl: entry.url,
    contentType: '',
    issues: [`${name}:${lastError?.message ?? 'unknown'}`],
    durationMs: TIMEOUT_MS,
    attempts: 2,
  };
};

const results = new Array(selected.length);
let cursor = 0;
const worker = async () => {
  while (true) {
    const index = cursor;
    cursor += 1;
    if (index >= selected.length) return;
    results[index] = await check(selected[index]);
  }
};
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, selected.length || 1) }, () => worker()));

const unhealthy = results.filter((result) => !result.ok);
const summary = {
  checkedAt: new Date().toISOString(),
  catalogFile: path.relative(ROOT, CATALOG),
  checked: results.length,
  healthy: results.length - unhealthy.length,
  unhealthy: unhealthy.length,
  canonicalUrls: results.filter((result) => result.field === 'url').length,
  embedUrls: results.filter((result) => result.field === 'embed').length,
  timeoutMs: TIMEOUT_MS,
  concurrency: CONCURRENCY,
};

await mkdir(OUT_DIR, { recursive: true });
await writeFile(JSON_OUT, `${JSON.stringify({ summary, results }, null, 2)}\n`, 'utf8');

const md = [
  '# External catalog health',
  '',
  `- Checked: **${summary.checked}**`,
  `- Healthy: **${summary.healthy}**`,
  `- Needs attention: **${summary.unhealthy}**`,
  `- Canonical URLs: **${summary.canonicalUrls}**`,
  `- Embed URLs: **${summary.embedUrls}**`,
  `- Checked at: ${summary.checkedAt}`,
  '',
  ...(unhealthy.length
    ? [
        '## Needs attention',
        '',
        '| Resource | Field | Status | Issue | URL |',
        '| --- | --- | ---: | --- | --- |',
        ...unhealthy.slice(0, 100).map((item) =>
          `| ${String(item.id).replaceAll('|', '\\|')} | ${item.field} | ${item.status ?? '—'} | ${item.issues.join(', ').replaceAll('|', '\\|')} | ${item.url.replaceAll('|', '%7C')} |`,
        ),
        ...(unhealthy.length > 100 ? ['', `_Report truncated here; JSON artifact contains all ${unhealthy.length} findings._`] : []),
      ]
    : ['## Result', '', 'All checked external catalog endpoints passed.']),
  '',
].join('\n');
await writeFile(MD_OUT, md, 'utf8');

console.log(`External catalog health: ${summary.healthy}/${summary.checked} healthy; ${summary.unhealthy} need attention.`);
for (const item of unhealthy.slice(0, 30)) {
  console.log(`- ${item.id} [${item.field}] ${item.status ?? 'ERR'} ${item.issues.join(', ')} ${item.url}`);
}
if (unhealthy.length > 30) console.log(`- … ${unhealthy.length - 30} more findings in ${path.relative(ROOT, JSON_OUT)}`);

if (unhealthy.length > 0) process.exitCode = 1;
