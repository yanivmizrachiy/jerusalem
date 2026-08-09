#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { cpus, freemem } from 'node:os';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

/**
 * ‏Windows: מ-Node 20.12/21.7 ואילך (CVE-2024-27980) אסור להריץ קובץ ‎.cmd‎
 * דרך spawn בלי shell, וההרצה נופלת ב-EINVAL. נמדד 09/08/2026 על
 * Node v24.11.1: הפקודה הקנונית `npm run quality` נעצרה מיד אחרי
 * repo-health עם "spawnSync npm.cmd EINVAL", כלומר שער האיכות לא היה
 * ניתן להרצה מקומית כלל. ‏npm ו-npx הם ‎.cmd‎ בפלטפורמה הזו ולכן מורצים
 * דרך shell; ‏Linux (ה-CI) אינו מושפע ואינו משנה התנהגות.
 */
const run = (command, args, options = {}) => {
  console.log(`\n=== ${[command, ...args].join(' ')} ===`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
    shell: command.endsWith('.cmd'),
    ...options,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
};

const freePort = () =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.once('error', reject);
    server.listen({ host: '127.0.0.1', port: 0 }, () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('לא נמצא פורט פנוי לבדיקות')));
        return;
      }
      const port = address.port;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });

run(process.execPath, ['scripts/repo-health.mjs']);
run(npm, ['run', 'check']);
run(npm, ['run', 'build']);

/**
 * מספר ה-workers נגזר מהזיכרון הפנוי ולא ממספר הליבות.
 *
 * נמדד 09/08/2026 על המכונה הזו: 16 ליבות אבל 4.9GB פנויים בלבד.
 * ‏Playwright בוחר כברירת מחדל חצי מהליבות — 8 workers, וכל worker של
 * Chromium צורך כ-0.5GB. התוצאה הייתה 23 כשלים שכולם "Test timeout of
 * 45000ms exceeded", בעוד אותן בדיקות עוברות כשמריצים אותן בנפרד. עם
 * retries=0 לחץ זיכרון נראה בדיוק כמו רגרסיה אמיתית.
 *
 * ‏CI אינו מושפע: שם Playwright כבר בוחר worker אחד לפי מכונת הריצה.
 */
// worker של Chromium בשיא: סריקת axe על עמוד עשיר מייצרת את הפסגה, ולא
// טעינת עמוד רגילה. הערכה נמוכה מדי החזירה קריסות רינדור (09/08/2026).
const WORKER_MEMORY_BYTES = 2 * 1024 * 1024 * 1024;
const RESERVED_BYTES = 1.5 * 1024 * 1024 * 1024; // מרווח למערכת, לשרת ול-build

const workerBudget = () => {
  if (process.env.CI) return null;
  const usable = Math.max(0, freemem() - RESERVED_BYTES);
  const byMemory = Math.floor(usable / WORKER_MEMORY_BYTES);
  const byCores = Math.max(1, Math.floor(cpus().length / 2));
  return Math.max(1, Math.min(byCores, byMemory, 4));
};

const port = await freePort();
const workers = workerBudget();
console.log(`\nPlaywright production server port: ${port}`);
if (workers) console.log(`Playwright workers: ${workers} (לפי הזיכרון הפנוי)`);

run(npx, ['playwright', 'test', '--retries=0', ...(workers ? [`--workers=${workers}`] : [])], {
  env: { ...process.env, PW_PORT: String(port) },
});

console.log('\nQUALITY PASSED: repo-health + check + build + Playwright (retries=0).');
