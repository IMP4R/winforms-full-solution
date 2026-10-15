import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    if (window.boot && window.boot.setMode) window.boot.setMode('runtime');
  });
  await page.waitForTimeout(1500);

  const html = await page.evaluate(() => {
    const strip = document.querySelector('.control-menustrip');
    return strip ? strip.outerHTML : 'NOT FOUND';
  });
  console.log('MenuStrip HTML:', html.substring(0, 500));

  await browser.close();
}

main().catch(e => console.error(e));
