import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html?project=PhoneBookPart3');
  await page.waitForTimeout(4000);

  // Click Runtime button
  await page.click('#btn-runtime');
  await page.waitForTimeout(2500);

  // Check if MainForm loaded with data
  const lastName = await page.locator('[data-ctrl-name="LastNameTextBox"]').inputValue().catch(() => 'NOT FOUND');
  const name = await page.locator('[data-ctrl-name="NameTextBox"]').inputValue().catch(() => 'NOT FOUND');
  const status = await page.locator('[data-ctrl-name="NumberToolStripStatusLabel"]').textContent().catch(() => 'NOT FOUND');

  console.log('LastName:', lastName);
  console.log('Name:', name);
  console.log('Status (Number):', status);

  // Try clicking Next
  await page.click('[data-ctrl-name="NextButton"]');
  await page.waitForTimeout(500);
  const lastName2 = await page.locator('[data-ctrl-name="LastNameTextBox"]').inputValue().catch(() => 'NOT FOUND');
  console.log('LastName after Next:', lastName2);

  // Try opening AddForm
  await page.click('.control-menustrip .menu-top:has-text("Абонент")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("Добавить")');
  await page.waitForTimeout(2000);

  const forms = await page.locator('.winform').all();
  console.log('Form count:', forms.length);
  for (let i = 0; i < forms.length; i++) {
    const title = await forms[i].locator('.title').textContent().catch(() => '');
    console.log('Form', i, 'title:', title);
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
