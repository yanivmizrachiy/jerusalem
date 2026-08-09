/**
 * גזירת נכס הלוגו של המודל מהמקור שסיפק יניב (09/08/2026).
 *
 * המקור נשמר ללא שינוי (`moodle-logo-source.png`, RULES 7.6) והנגזרת מיוצרת
 * ממנו בלבד. אין יצירה מחדש, אין AI, אין תחליף ואין שינוי מיתוג — רק חיתוך,
 * הסרת רקע לבן, חידוד עדין וייצוא PNG נקי.
 *
 * שלושת השלבים, וכל אחד מנומק:
 *
 * 1. **חיתוך.** בצילום המסך נותרה רצועה שחורה של 2px בקצה הימני (עמודות
 *    510–511, שחור מלא לכל הגובה) — שארית ממסגרת החלון ולא חלק מהלוגו.
 *    היא נחתכת, ואז נגזר bounding box צמוד של הדיו עצמו.
 *
 * 2. **רקע שקוף בלי לפגוע בצבע המותג.** הנוסחה הנאיבית
 *    ‏`alpha = 255 - min(r,g,b)` שגויה כאן: הכתום של המודל הוא ‎~rgb(248,144,45)
 *    ולכן ערוץ המינימום שלו אינו 0 — הוא היה הופך ל-82% אטימות ומשתנה
 *    ל-‎(248,120,0). לכן:
 *      - ‏`alpha` נגזר מהמרחק מלבן, מנורמל כך ש**דיו מלא מגיע ל-255**;
 *      - היכן ש-`alpha === 255` ה-RGB **נשמר בדיוק** — צבע המותג לא זז;
 *      - רק בפיקסלי הקצה (שקיפות חלקית) מבוצע unpremultiply שמסיר את
 *        תערובת הלבן, כדי שלא תיווצר הילה בהירה מעל רקע כהה.
 *
 * 3. **חידוד עדין** על ה-RGB בלבד ובעוצמה נמוכה, ואז החזרת הצבע המקורי
 *    בכל פיקסל אטום — כך שהחידוד משפר קצוות ואינו נוגע בצבע המותג.
 *
 * הרצה:  node scripts/build-moodle-logo.mjs
 */
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'public/media/brands/moodle-logo-source.png';
const OUTPUT = 'public/media/brands/moodle-logo.png';

/** רצועת השוליים השחורה בקצה הימני של צילום המסך — אינה חלק מהלוגו. */
const ARTIFACT_COLUMNS = 2;

/** פיקסל שכל ערוציו מעל הסף נחשב רקע לבן. */
const WHITE = 250;

/**
 * ערוץ המינימום של הדיו המלא. הכתום הדומיננטי נמדד ‎rgb(248,144,45), ויש
 * גרדיאנט עד ‎~48. הסף נלקח מעט מעליו כדי שכל שטח הכתום יגיע לאטימות מלאה.
 */
const INK_MIN_CHANNEL = 50;
const NORMALISER = 255 - INK_MIN_CHANNEL;

/**
 * רצפת אלפא. בצילום המסך יש רעש קל סביב הלוגו (למשל ‎rgb(249,255,255)), שהיה
 * הופך לפיקסלים בשקיפות ‎~3% — בלתי נראים, אך הם מנפחים את ה-PNG ומונעים
 * דחיסת פלטה. כל מה שמתחת לסף הוא רקע.
 */
const ALPHA_FLOOR = 12;

const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

const raw = async (input) => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, c: info.channels };
};

const src = await raw(SOURCE);
const usableWidth = src.w - ARTIFACT_COLUMNS;

// --- 1. bounding box צמוד של הדיו -------------------------------------------
const isInk = (x, y) => {
  const i = (y * src.w + x) * src.c;
  return !(src.data[i] >= WHITE && src.data[i + 1] >= WHITE && src.data[i + 2] >= WHITE);
};

let minX = Infinity;
let maxX = -1;
let minY = Infinity;
let maxY = -1;
for (let y = 0; y < src.h; y += 1) {
  for (let x = 0; x < usableWidth; x += 1) {
    if (!isInk(x, y)) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
const cropped = await sharp(SOURCE).extract(box).ensureAlpha().png().toBuffer();

// --- 2 + 3. חידוד עדין, ואז אלפא מהמקור הנקי --------------------------------
// האלפא נגזרת מהחיתוך ה**מקורי** ולא מהמחודד: חידוד יוצר overshoot סביב
// קצוות, ואלפא שנגזרת ממנו הייתה מקבלת טבעת. הצבע נלקח מהמחודד רק בקצוות.
const base = await raw(cropped);
const sharpened = await raw(
  await sharp(cropped).sharpen({ sigma: 0.6, m1: 0.3, m2: 0.7 }).png().toBuffer()
);

const out = Buffer.alloc(box.width * box.height * 4);
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));

for (let p = 0; p < box.width * box.height; p += 1) {
  const i = p * base.c;
  const r = base.data[i];
  const g = base.data[i + 1];
  const b = base.data[i + 2];

  const distanceFromWhite = 255 - Math.min(r, g, b);
  const raw = clamp((distanceFromWhite * 255) / NORMALISER);
  const alpha = raw < ALPHA_FLOOR ? 0 : raw;
  const o = p * 4;

  if (alpha === 0) {
    out[o] = 0;
    out[o + 1] = 0;
    out[o + 2] = 0;
    out[o + 3] = 0;
    continue;
  }

  if (alpha === 255) {
    // דיו מלא — צבע המותג נשמר בדיוק, בלי unpremultiply ובלי חידוד
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = 255;
    continue;
  }

  // קצה: מסירים את תערובת הלבן מהערך המחודד
  const white = 255 - alpha;
  const scale = 255 / alpha;
  out[o] = clamp((sharpened.data[i] - white) * scale);
  out[o + 1] = clamp((sharpened.data[i + 1] - white) * scale);
  out[o + 2] = clamp((sharpened.data[i + 2] - white) * scale);
  out[o + 3] = alpha;
}

const png = await sharp(out, { raw: { width: box.width, height: box.height, channels: 4 } })
  .png({ compressionLevel: 9, effort: 10, palette: true, quality: 100 })
  .toBuffer();
writeFileSync(OUTPUT, png);

// --- אימות נאמנות: הרכבה חזרה מעל לבן חייבת להחזיר את החיתוך המקורי --------
const composited = await raw(
  await sharp({
    create: { width: box.width, height: box.height, channels: 4, background: '#ffffff' },
  })
    .composite([{ input: png }])
    .png()
    .toBuffer()
);

let maxDelta = 0;
let sumDelta = 0;
for (let p = 0; p < box.width * box.height; p += 1) {
  for (let ch = 0; ch < 3; ch += 1) {
    const delta = Math.abs(composited.data[p * composited.c + ch] - base.data[p * base.c + ch]);
    if (delta > maxDelta) maxDelta = delta;
    sumDelta += delta;
  }
}

console.log(`source   ${src.w}x${src.h}  sha256=${sha(SOURCE)}`);
console.log(`crop     left=${box.left} top=${box.top} ${box.width}x${box.height}`);
console.log(`output   ${box.width}x${box.height}  aspect=${(box.width / box.height).toFixed(4)}  ${png.length} bytes`);
console.log(`         sha256=${sha(OUTPUT)}`);
console.log(
  `verify   round-trip over white vs source crop: max Δ=${maxDelta}, mean Δ=${(
    sumDelta /
    (box.width * box.height * 3)
  ).toFixed(3)}`
);
