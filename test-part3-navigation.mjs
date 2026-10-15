import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html?project=PhoneBookPart3');
  await page.waitForTimeout(4000);

  await page.click('#btn-runtime');
  await page.waitForTimeout(3000);

  // Read first record
  const lastName1 = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  const name1 = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('Record 1:', lastName1, name1);

  // Click Next
  await page.locator('.control-button:has-text(">")').first().click();
  await page.waitForTimeout(500);

  const lastName2 = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  const name2 = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('Record 2:', lastName2, name2);

  // Click Next again
  await page.locator('.control-button:has-text(">")').first().click();
  await page.waitForTimeout(500);

  const lastName3 = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  const name3 = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('Record 3:', lastName3, name3);

  // Check status
  const statusLabels = await page.locator('.control-statusstrip .status-label').allInnerTexts();
  console.log('Status labels:', statusLabels);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
