// RECOVERY/EVIDENCE/capture.ts
// Phase 3 visual and behavioral evidence capture
// Run: npx tsx RECOVERY/EVIDENCE/capture.ts

import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const OUT = 'RECOVERY/EVIDENCE';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

async function capture(page: Page, label: string, opts?: Parameters<Page['screenshot']>[0]) {
  const file = `${OUT}/${label}.png`;
  await page.screenshot({ path: file, ...opts });
  console.log(`  ✓ ${label} → ${file}`);
  return file;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. RTL rendering + home page full ──────────────────────────────────
  console.log('\n[1] Home page — RTL + full desktop layout');
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  const htmlLang = await page.getAttribute('html', 'lang');
  const htmlDir = await page.getAttribute('html', 'dir');
  console.log(`  lang="${htmlLang}" dir="${htmlDir}"`);
  await capture(page, '01-home-desktop-rtl');

  // ── 2. Footer navy bar ─────────────────────────────────────────────────
  console.log('\n[2] Footer navy bar — desktop');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await capture(page, '02-footer-navy-desktop');

  // Get footer elements
  const footerNavy = await page.$('.footer-navy');
  const footerLine = await page.$('.footer-line');
  const footerBottom = await page.$('.footer-bottom');
  console.log(`  .footer-navy: ${footerNavy ? 'found' : 'MISSING'}`);
  console.log(`  .footer-line: ${footerLine ? 'found' : 'MISSING'}`);
  console.log(`  .footer-bottom: ${footerBottom ? 'found' : 'MISSING'}`);

  // ── 3. Footer at 375px (mobile) ───────────────────────────────────────
  console.log('\n[3] Footer navy bar — mobile 375px');
  await ctx.close();
  const ctxMobile = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const pageMobile = await ctxMobile.newPage();
  await pageMobile.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await pageMobile.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pageMobile.waitForTimeout(500);
  await capture(pageMobile, '03-footer-navy-mobile');
  await ctxMobile.close();

  // ── 4. FLIP splash — T=0 ─────────────────────────────────────────────
  console.log('\n[4] FLIP splash — T=0 (page load)');
  const ctxSplash = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageSplash = await ctxSplash.newPage();
  // Clear sessionStorage so splash fires
  await pageSplash.addInitScript(() => sessionStorage.clear());
  // Start navigation but capture immediately after domcontentloaded
  const navPromise = pageSplash.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await navPromise;
  await pageSplash.waitForTimeout(100); // just after load
  await capture(pageSplash, '04-splash-t0');
  const splashVisible = await pageSplash.$('.splash');
  const splashStyle = splashVisible
    ? await pageSplash.evaluate((el) => window.getComputedStyle(el).opacity, splashVisible)
    : 'N/A';
  console.log(`  .splash opacity at T=0: ${splashStyle}`);
  await ctxSplash.close();

  // ── 5. FLIP splash — T=1.5s ───────────────────────────────────────────
  console.log('\n[5] FLIP splash — T=1.5s');
  const ctxS2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageS2 = await ctxS2.newPage();
  await pageS2.addInitScript(() => sessionStorage.clear());
  await pageS2.goto('http://127.0.0.1:4321/');
  await pageS2.waitForTimeout(1500);
  await capture(pageS2, '05-splash-t1.5s');
  await ctxS2.close();

  // ── 6. FLIP splash — T=3s (should be gone) ───────────────────────────
  console.log('\n[6] FLIP splash — T=3s (should be gone)');
  const ctxS3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageS3 = await ctxS3.newPage();
  await pageS3.addInitScript(() => sessionStorage.clear());
  await pageS3.goto('http://127.0.0.1:4321/');
  await pageS3.waitForTimeout(3000);
  await capture(pageS3, '06-splash-t3s-gone');
  const splashAfter3 = await pageS3.$('.splash');
  const splashOpacity3 = splashAfter3
    ? await pageS3.evaluate((el) => window.getComputedStyle(el).opacity, splashAfter3)
    : 'removed';
  console.log(`  .splash after 3s: ${splashOpacity3}`);
  await ctxS3.close();

  // ── 7. Booklet page — desktop ──────────────────────────────────────────
  console.log('\n[7] Booklet page — desktop');
  const pageBook = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageBook.goto('http://127.0.0.1:4321/chativat-beynayim/', { waitUntil: 'networkidle' });
  await capture(pageBook, '07-booklet-desktop');
  await pageBook.close();

  // ── 8. Booklet page — mobile ──────────────────────────────────────────
  console.log('\n[8] Booklet page — mobile');
  const pageBookMob = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await pageBookMob.goto('http://127.0.0.1:4321/chativat-beynayim/', { waitUntil: 'networkidle' });
  await capture(pageBookMob, '08-booklet-mobile');
  await pageBookMob.close();

  // ── 9. Chativa Elyona page ────────────────────────────────────────────
  console.log('\n[9] Chativa Elyona page — desktop');
  const pageElyona = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageElyona.goto('http://127.0.0.1:4321/chativa-elyona/', { waitUntil: 'networkidle' });
  await capture(pageElyona, '09-chativa-elyona-desktop');
  await pageElyona.close();

  // ── 10. WhatsApp band ──────────────────────────────────────────────────
  console.log('\n[10] WhatsApp join band — desktop');
  const pageWa = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageWa.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  // Scroll to bottom
  await pageWa.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pageWa.waitForTimeout(500);
  const whatsappBand = await pageWa.$('[data-whatsapp-band], .whatsapp-band, .whatsapp, footer');
  console.log(`  WhatsApp band / footer: ${whatsappBand ? 'found' : 'MISSING'}`);
  await capture(pageWa, '10-whatsapp-band-desktop');
  await pageWa.close();

  // ── 11. Console errors on home page ────────────────────────────────────
  console.log('\n[11] Console errors on home page');
  const ctxErr = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageErr = await ctxErr.newPage();
  const errors: string[] = [];
  pageErr.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  pageErr.on('pageerror', (e) => errors.push(String(e)));
  await pageErr.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  if (errors.length === 0) {
    console.log('  0 console errors');
  } else {
    console.log(`  ${errors.length} console errors:`);
    errors.forEach((e) => console.log(`    - ${e}`));
  }
  await ctxErr.close();

  // ── 12. Chativat Beynayim footer ──────────────────────────────────────
  console.log('\n[12] Chativat Beynayim footer');
  const pageCB = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageCB.goto('http://127.0.0.1:4321/chativat-beynayim/', { waitUntil: 'networkidle' });
  await pageCB.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await pageCB.waitForTimeout(500);
  const cbNavy = await pageCB.$('.footer-navy');
  const cbLine = await pageCB.$('.footer-line');
  const cbBottom = await pageCB.$('.footer-bottom');
  console.log(`  .footer-navy: ${cbNavy ? 'found' : 'MISSING'}`);
  console.log(`  .footer-line: ${cbLine ? 'found' : 'MISSING'}`);
  console.log(`  .footer-bottom: ${cbBottom ? 'found' : 'MISSING'}`);
  await capture(pageCB, '12-chativat-beynayim-footer');
  await pageCB.close();

  // ── Summary ───────────────────────────────────────────────────────────
  console.log('\n[SUMMARY]');
  const summary = {
    rtl: { lang: htmlLang, dir: htmlDir },
    footerNavy: !!footerNavy,
    footerLine: !!footerLine,
    footerBottom: !!footerBottom,
    consoleErrors: errors.length,
    splashAtT0: splashStyle,
    splashAtT3: splashOpacity3,
  };
  console.log(JSON.stringify(summary, null, 2));
  fs.writeFileSync(`${OUT}/summary.json`, JSON.stringify(summary, null, 2));

  await browser.close();
  console.log('\nAll captures complete.');
}

main().catch(console.error);
