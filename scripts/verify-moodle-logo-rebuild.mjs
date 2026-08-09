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
    for (let i = 0; i < expected.data.length; i += expected.channels) {
      let pixelChanged = false;
      for (let channel = 0; channel < expected.channels; channel += 1) {
        const delta = Math.abs(expected.data[i + channel] - rebuilt.data[i + channel]);
        if (delta) pixelChanged = true;
        if (delta > maxChannelDelta) maxChannelDelta = delta;
      }
      if (pixelChanged) changedPixels += 1;
    }
    throw new Error(
      `ModEL logo rebuild changed visual pixels: ${changedPixels} pixels differ, max channel delta=${maxChannelDelta}.`
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
