#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const OUTPUT = 'public/media/brands/moodle-logo.png';
const originalBytes = readFileSync(OUTPUT);

// נמדד בין הנכס שנוצר במקור לבין sharp/libvips בלינוקס: שני פיקסלי קצה בלבד,
// alpha=21 זהה, עם Δ גולמי 12 בערוץ צבע אחד. אחרי source-over השינוי הנראה
// הוא 12*21/255 < 1. זהו tolerance צר ל-cross-platform rasterisation, לא
// ריכוך חזותי: שינוי בפיקסל אטום, ב-alpha, ביותר משני פיקסלים או ביותר
// מיחידת צבע נראית אחת עדיין מפיל את השער.
const MAX_EDGE_PIXELS = 2;
const MAX_EDGE_ALPHA = 24;
const MAX_VISIBLE_CHANNEL_DELTA = 1;

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

  let changedPixels = 0;
  let maxVisibleDelta = 0;
  const samples = [];
  for (let i = 0; i < expected.data.length; i += expected.channels) {
    const expectedPixel = expected.data.subarray(i, i + expected.channels);
    const rebuiltPixel = rebuilt.data.subarray(i, i + rebuilt.channels);
    if (Buffer.from(expectedPixel).equals(Buffer.from(rebuiltPixel))) continue;

    changedPixels += 1;
    const expectedAlpha = expectedPixel[3];
    const rebuiltAlpha = rebuiltPixel[3];
    if (expectedAlpha !== rebuiltAlpha) {
      throw new Error(`ModEL logo rebuild changed alpha at pixel ${i / expected.channels}: ${expectedAlpha} -> ${rebuiltAlpha}.`);
    }
    if (expectedAlpha > MAX_EDGE_ALPHA) {
      throw new Error(`ModEL logo rebuild changed a non-edge pixel at pixel ${i / expected.channels}: alpha=${expectedAlpha}.`);
    }

    let pixelVisibleDelta = 0;
    for (let channel = 0; channel < 3; channel += 1) {
      const rawDelta = Math.abs(expectedPixel[channel] - rebuiltPixel[channel]);
      const visibleDelta = (rawDelta * expectedAlpha) / 255;
      if (visibleDelta > pixelVisibleDelta) pixelVisibleDelta = visibleDelta;
      if (visibleDelta > maxVisibleDelta) maxVisibleDelta = visibleDelta;
    }

    if (samples.length < 8) {
      const pixel = i / expected.channels;
      const x = pixel % expected.width;
      const y = Math.floor(pixel / expected.width);
      samples.push(
        `(${x},${y}) repo=[${[...expectedPixel].join(',')}] rebuilt=[${[...rebuiltPixel].join(',')}] ` +
          `visibleΔ=${pixelVisibleDelta.toFixed(3)}`
      );
    }
  }

  if (changedPixels > MAX_EDGE_PIXELS || maxVisibleDelta > MAX_VISIBLE_CHANNEL_DELTA) {
    throw new Error(
      `ModEL logo rebuild exceeds cross-platform edge tolerance: ${changedPixels} pixels differ, ` +
        `max visible channel delta=${maxVisibleDelta.toFixed(3)}.\nSamples:\n${samples.join('\n')}`
    );
  }

  const byteStable = originalBytes.equals(rebuiltBytes);
  if (changedPixels === 0) {
    console.log(
      `ModEL logo rebuild verified: ${expected.width}x${expected.height}, RGBA pixels identical` +
        (byteStable ? ', PNG bytes identical.' : ', PNG encoding differs only.')
    );
  } else {
    console.log(
      `ModEL logo rebuild verified: ${expected.width}x${expected.height}; ${changedPixels} low-alpha edge pixels differ, ` +
        `max visible channel delta=${maxVisibleDelta.toFixed(3)} <= ${MAX_VISIBLE_CHANNEL_DELTA}.`
    );
    console.log(samples.join('\n'));
  }
} finally {
  // build-moodle-logo.mjs writes the tracked output in place. Quality verification must be read-only.
  writeFileSync(OUTPUT, originalBytes);
}
