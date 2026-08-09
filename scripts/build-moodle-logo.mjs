/**
 * גזירת נכס הלוגו של המודל מהמקור שסיפק יניב (09/08/2026).
 *
 * המקור נשמר ללא שינוי (`moodle-logo-source.png`, RULES 7.6) והנגזרת מיוצרת
 * ממנו בלבד. אין יצירה מחדש, אין AI, אין תחליף ואין שינוי מיתוג — רק חיתוך,
 * הסרת רקע לבן, חידוד עדין וייצוא PNG נקי.
 *
 * 1. **חיתוך צמוד — לפי הדיו הנראה, לא לפי "לא-לבן".**
 *    בצילום המסך נותרה רצועה שחורה של 2px בקצה הימני (עמודות 510–511, שחור
 *    מלא לכל הגובה) — שארית ממסגרת החלון ולא חלק מהלוגו. היא נחתכת.
 *    אחריה, ה-bounding box נגזר מ**מפת האלפא הסופית** ולא מסף "לא-לבן":
 *    בשוליים יש רעש תת-נראה (למשל ‎rgb(245,255,255)) שסף נאיבי היה סופר
 *    כדיו, ומשאיר עמודות ריקות בתוך מה שאמור להיות חיתוך צמוד. נמדד: סף
 *    כזה השאיר 11 עמודות תת-נראות, ואחת מהן שקופה לגמרי.
 *
 * 2. **רקע שקוף בלי לפגוע בצבע המותג.** הנוסחה הנאיבית
 *    ‏`alpha = 255 - min(r,g,b)` שגויה כאן: הכתום של המודל הוא ‎~rgb(248,144,45)
 *    ולכן ערוץ המינימום שלו אינו 0 — הוא היה הופך ל-82% אטימות ומשתנה
 *    ל-‎(248,120,0). לכן:
 *      - ‏`alpha` נגזר מהמרחק מלבן, מנורמל כך ש**דיו מלא מגיע ל-255**;
 *      - היכן ש-`alpha === 255` ה-RGB **נשמר בדיוק** — צבע המותג לא זז;
 *      - רק בפיקסלי הקצה מבוצע unpremultiply שמסיר את תערובת הלבן, כדי
 *        שלא תיווצר הילה בהירה מעל רקע כהה.
 *
 * 3. **חידוד עדין** מוחל על הקצוות בלבד; פיקסל אטום שומר את צבע המותג כפי
 *    שהוא, ולכן החידוד אינו יכול להזיז את הכתום.
 *
 * 4. **פלט full-fidelity** (בלי פלטה): קידוד פלטה הצטמצם ל-256 צבעים ויצר
 *    קווצת banding בקצוות. איכות קודמת לחיסכון של כמה KB (הוראת יניב).
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

/**
 * ערוץ המינימום של הדיו המלא. הכתום הדומיננטי נמדד ‎rgb(248,144,45), ויש
 * גרדיאנט עד ‎~48. הסף נלקח מעט מעליו כדי שכל שטח הכתום יגיע לאטימות מלאה.
 */
const INK_MIN_CHANNEL = 50;
const NORMALISER = 255 - INK_MIN_CHANNEL;

/** רצפת אלפא — רעש צילום־מסך תת-נראה הוא רקע. */
const ALPHA_FLOOR = 12;

/**
 * סף הדיו לחישוב גבולות החיתוך בלבד (אינו מוחק פיקסלים — זה תפקיד
 * `ALPHA_FLOOR`). בשולי צילום המסך יש פיקסלים מפוזרים באלפא ‎12–30 שאינם
 * משיכת מכחול אלא רעש: בעמודה 3, למשל, נמדדו שני פיקסלים בלבד. הדיו האמיתי
 * קופץ ל-118 ומעלה. סף 64 מבטיח שגבולות החיתוך נקבעים על ידי הלוגו עצמו
 * ולא על ידי רעש, בלי לגעת בתוכן.
 */
const VISIBLE_ALPHA = 64;

const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));

const raw = async (input) => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, c: info.channels };
};

/** האלפא של פיקסל לפי מרחקו מלבן, מנורמל כך שדיו מלא = 255. */
const alphaAt = (buf, x, y) => {
  const i = (y * buf.w + x) * buf.c;
  const distance = 255 - Math.min(buf.data[i], buf.data[i + 1], buf.data[i + 2]);
  const value = clamp((distance * 255) / NORMALISER);
  return value < ALPHA_FLOOR ? 0 : value;
};

const src = await raw(SOURCE);
const usableWidth = src.w - ARTIFACT_COLUMNS;

// --- 1. bounding box צמוד לפי הדיו הנראה בפועל -------------------------------
let minX = Infinity;
let maxX = -1;
let minY = Infinity;
let maxY = -1;
for (let y = 0; y < src.h; y += 1) {
  for (let x = 0; x < usableWidth; x += 1) {
    if (alphaAt(src, x, y) < VISIBLE_ALPHA) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
const cropped = await sharp(SOURCE).extract(box).ensureAlpha().png().toBuffer();

// --- 2 + 3. אלפא מהמקור הנקי, צבע קצה מהמחודד --------------------------------
// האלפא נגזרת מהחיתוך ה**מקורי** ולא מהמחודד: חידוד יוצר overshoot סביב
// קצוות, ואלפא שנגזרת ממנו הייתה מקבלת טבעת.
const base = await raw(cropped);
const sharpened = await raw(
  await sharp(cropped).sharpen({ sigma: 0.6, m1: 0.3, m2: 0.7 }).png().toBuffer()
);

const out = Buffer.alloc(box.width * box.height * 4);
for (let p = 0; p < box.width * box.height; p += 1) {
  const i = p * base.c;
  const r = base.data[i];
  const g = base.data[i + 1];
  const b = base.data[i + 2];
  const alpha = alphaAt(base, p % box.width, Math.floor(p / box.width));
  const o = p * 4;

  if (alpha === 0) continue;

  if (alpha === 255) {
    // דיו מלא — צבע המותג נשמר בדיוק, בלי unpremultiply ובלי חידוד
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = 255;
    continue;
  }

  const white = 255 - alpha;
  const scale = 255 / alpha;
  out[o] = clamp((sharpened.data[i] - white) * scale);
  out[o + 1] = clamp((sharpened.data[i + 1] - white) * scale);
  out[o + 2] = clamp((sharpened.data[i + 2] - white) * scale);
  out[o + 3] = alpha;
}

// --- 4. פלט full-fidelity ----------------------------------------------------
const png = await sharp(out, { raw: { width: box.width, height: box.height, channels: 4 } })
  .png({ compressionLevel: 9, effort: 10, palette: false })
  .toBuffer();
writeFileSync(OUTPUT, png);

// --- אימות -------------------------------------------------------------------
// "חיתוך צמוד" = אין ריפוד בשוליים. חללים פנימיים בין אותיות הם חלק
// מהאמנות ואינם ריפוד, ולכן נמדדות רק השורות/עמודות בקצוות.
const final = await raw(png);
const colHasInk = (x) => {
  for (let y = 0; y < final.h; y += 1) if (final.data[(y * final.w + x) * final.c + 3] >= VISIBLE_ALPHA) return true;
  return false;
};
const rowHasInk = (y) => {
  for (let x = 0; x < final.w; x += 1) if (final.data[(y * final.w + x) * final.c + 3] >= VISIBLE_ALPHA) return true;
  return false;
};
let padLeft = 0;
while (padLeft < final.w && !colHasInk(padLeft)) padLeft += 1;
let padRight = 0;
while (padRight < final.w && !colHasInk(final.w - 1 - padRight)) padRight += 1;
let padTop = 0;
while (padTop < final.h && !rowHasInk(padTop)) padTop += 1;
let padBottom = 0;
while (padBottom < final.h && !rowHasInk(final.h - 1 - padBottom)) padBottom += 1;

const composited = await raw(
  await sharp({ create: { width: box.width, height: box.height, channels: 4, background: '#ffffff' } })
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

const colours = new Set();
for (let p = 0; p < final.w * final.h; p += 1) {
  const i = p * final.c;
  if (final.data[i + 3] === 255) colours.add(`${final.data[i]},${final.data[i + 1]},${final.data[i + 2]}`);
}

console.log(`source   ${src.w}x${src.h}  sha256=${sha(SOURCE)}`);
console.log(`crop     left=${box.left} top=${box.top} ${box.width}x${box.height}`);
console.log(`output   ${box.width}x${box.height}  aspect=${(box.width / box.height).toFixed(4)}  ${png.length} bytes`);
console.log(`         sha256=${sha(OUTPUT)}`);
console.log(`tight    padding L=${padLeft} R=${padRight} T=${padTop} B=${padBottom}  (must all be 0)`);
console.log(`fidelity round-trip over white: max Δ=${maxDelta}, mean Δ=${(sumDelta / (box.width * box.height * 3)).toFixed(3)}`);
console.log(`colours  ${colours.size} distinct opaque colours (no 256 palette cap)`);
