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
  await page.click('#btn-runtime');
  await page.waitForTimeout(3000);

  // Click Поиск
  await page.click('.control-menustrip .menu-top:has-text("Поиск")');
  await page.waitForTimeout(1500);

  const forms = await page.locator('.winform').all();
  console.log('Forms after Поиск:', forms.length);
  for (let i = 0; i < forms.length; i++) {
    const title = await forms[i].locator('.title').textContent().catch(() => '');
    console.log('Form', i, 'title:', title);
  }

  if (forms.length > 1) {
    const searchForm = page.locator('.winform').nth(1);
    const searchTbs = await searchForm.locator('.control-textbox').all();
    console.log('Search form textboxes:', searchTbs.length);
    if (searchTbs.length >= 1) {
      await searchTbs[0].fill('Иванов');
    }
    const searchBtn = await searchForm.locator('.control-button').first();
    console.log('Search button count:', await searchBtn.count());
    if (await searchBtn.count() > 0) {
      await searchBtn.click();
      await page.waitForTimeout(1500);
    }
  }

  const formsAfter = await page.locator('.winform').count();
  console.log('Forms after search close:', formsAfter);
  const lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('Record after search:', lastName);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
