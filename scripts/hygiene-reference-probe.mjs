#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

for (const symbol of ['publishedGradeCount', 'kindLabel']) {
  let output = '';
  try {
    output = execFileSync('git', ['grep', '-n', '-w', symbol, '--', 'src', 'tests', 'scripts'], {
      encoding: 'utf8',
    }).trim();
  } catch (error) {
    if (error?.status !== 1) throw error;
  }
  const hits = output ? output.split('\n') : [];
  console.log(`REFERENCE_PROBE ${symbol} ${hits.length}`);
  for (const hit of hits) console.log(hit);
}
