import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = '/tmp/runtime_screenshots';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true,
    args: ['--disable-features=OverlayScrollbar']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(3000);

  // Screenshot MainForm in design mode
  await page.evaluate(() => {
    if (window.boot && window.boot.switchForm) window.boot.switchForm('f_mainform_01');
  });
  await page.waitForTimeout(1000);
  const workspace = await page.locator('#form-host').first();
  await workspace.screenshot({ path: path.join(OUT_DIR, 'MainForm_design.png') });
  console.log('MainForm design done');

  // Screenshot AddForm in design mode
  await page.evaluate(() => {
    if (window.boot && window.boot.switchForm) window.boot.switchForm('f_addform_01');
  });
  await page.waitForTimeout(1000);
  const workspace2 = await page.locator('#form-host').first();
  await workspace2.screenshot({ path: path.join(OUT_DIR, 'AddForm_design.png') });
  console.log('AddForm design done');

  // Screenshot SearchNameForm in design mode
  await page.evaluate(() => {
    if (window.boot && window.boot.switchForm) window.boot.switchForm('f_search_01');
  });
  await page.waitForTimeout(1000);
  const workspace3 = await page.locator('#form-host').first();
  await workspace3.screenshot({ path: path.join(OUT_DIR, 'SearchNameForm_design.png') });
  console.log('SearchNameForm design done');

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
