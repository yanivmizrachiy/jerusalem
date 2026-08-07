#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createServer } from 'node:net';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const run = (command, args, options = {}) => {
  console.log(`\n=== ${[command, ...args].join(' ')} ===`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
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

const port = await freePort();
console.log(`\nPlaywright production server port: ${port}`);
run(npx, ['playwright', 'test', '--retries=0'], {
  env: { ...process.env, PW_PORT: String(port) },
});

console.log('\nQUALITY PASSED: repo-health + check + build + Playwright (retries=0).');
