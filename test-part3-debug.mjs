import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));

  await page.goto('http://localhost:8824/winforms.html?project=PhoneBookPart3');
  await page.waitForTimeout(4000);

  // Click Runtime button
  await page.click('#btn-runtime');
  await page.waitForTimeout(2000);

  // Check for message box
  const msgboxBody = await page.locator('.msgbox-body').textContent().catch(() => null);
  if (msgboxBody) {
    console.log('MSGBOX:', msgboxBody);
    // Close message box
    await page.click('.msgbox-buttons button');
    await page.waitForTimeout(500);
  }

  // Check form fields using control type selectors
  const lastName = await page.locator('.control-textbox').first().inputValue().catch(() => 'NOT FOUND');
  console.log('First textbox value:', lastName);

  // Check winform title
  const title = await page.locator('.winform .title').first().textContent().catch(() => 'NOT FOUND');
  console.log('Form title:', title);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
