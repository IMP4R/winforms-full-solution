import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(3000);
  await page.click('#btn-runtime');
  await page.waitForTimeout(2000);

  const statusStrip = await page.locator('.control-statusstrip').first();
  const count = await statusStrip.count();
  console.log('StatusStrip count:', count);
  if (count > 0) {
    const box = await statusStrip.boundingBox();
    const visible = await statusStrip.isVisible();
    console.log('StatusStrip bounding box:', box);
    console.log('StatusStrip visible:', visible);

    // Check if any part is clipped by parent
    const parentBox = await page.locator('.winform').first().boundingBox();
    console.log('MainForm bounding box:', parentBox);
  }

  // Also check menu items clickability
  const poisk = await page.locator('.menu-top', { hasText: /^Поиск$/ }).first();
  console.log('Поиск menu count:', await poisk.count());

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
