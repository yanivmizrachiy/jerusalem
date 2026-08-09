#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const OUTPUT = 'public/media/brands/moodle-logo.png';
const originalBytes = readFileSync(OUTPUT);

const decode = async (bytes) => {
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
};

let rebuiltBytes;
try {
  const result = spawnSync(process.execPath, ['scripts/build-moodle-logo.mjs'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) {
    throw new Error(`ModEL logo rebuild failed:\n${result.stdout ?? ''}\n${result.stderr ?? ''}`);
  }
  rebuiltBytes = readFileSync(OUTPUT);

  const [expected, rebuilt] = await Promise.all([decode(originalBytes), decode(rebuiltBytes)]);
  if (
    expected.width !== rebuilt.width ||
    expected.height !== rebuilt.height ||
    expected.channels !== rebuilt.channels
  ) {
    throw new Error(
      `ModEL logo geometry changed: repo=${expected.width}x${expected.height}x${expected.channels}, ` +
        `rebuilt=${rebuilt.width}x${rebuilt.height}x${rebuilt.channels}`
    );
  }

  if (!expected.data.equals(rebuilt.data)) {
    let changedPixels = 0;
    let maxChannelDelta = 0;
    const samples = [];
    for (let i = 0; i < expected.data.length; i += expected.channels) {
      let pixelChanged = false;
      let pixelMaxDelta = 0;
      for (let channel = 0; channel < expected.channels; channel += 1) {
        const delta = Math.abs(expected.data[i + channel] - rebuilt.data[i + channel]);
        if (delta) pixelChanged = true;
        if (delta > pixelMaxDelta) pixelMaxDelta = delta;
        if (delta > maxChannelDelta) maxChannelDelta = delta;
      }
      if (!pixelChanged) continue;
      changedPixels += 1;
      if (samples.length < 8) {
        const pixel = i / expected.channels;
        const x = pixel % expected.width;
        const y = Math.floor(pixel / expected.width);
        samples.push(
          `(${x},${y}) repo=[${[...expected.data.subarray(i, i + expected.channels)].join(',')}] ` +
            `rebuilt=[${[...rebuilt.data.subarray(i, i + rebuilt.channels)].join(',')}] Δmax=${pixelMaxDelta}`
        );
      }
    }
    throw new Error(
      `ModEL logo rebuild changed visual pixels: ${changedPixels} pixels differ, max channel delta=${maxChannelDelta}.` +
        `\nSamples:\n${samples.join('\n')}`
    );
  }

  const byteStable = originalBytes.equals(rebuiltBytes);
  console.log(
    `ModEL logo rebuild verified: ${expected.width}x${expected.height}, RGBA pixels identical` +
      (byteStable ? ', PNG bytes identical.' : ', PNG encoding differs but visual content is identical.')
  );
} finally {
  // build-moodle-logo.mjs writes the tracked output in place. Quality verification must be read-only.
  writeFileSync(OUTPUT, originalBytes);
}
