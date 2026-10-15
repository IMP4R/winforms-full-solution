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

  // Click Абонент > Добавить
  await page.click('.control-menustrip .menu-top:has-text("Абонент")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("Добавить")');
  await page.waitForTimeout(2000);

  console.log('Forms after Add menu:', await page.locator('.winform').count());

  // Fill in AddForm
  const addForm = page.locator('.winform').nth(1);
  const textboxes = await addForm.locator('.control-textbox').all();
  console.log('Textboxes in AddForm:', textboxes.length);
  if (textboxes.length >= 3) {
    await textboxes[0].fill('Тестов');
    await textboxes[1].fill('Тест');
    await textboxes[2].fill('Тестович');
  }

  // Click AddButton and log what happens
  const addBtn = await addForm.locator('.control-button:has-text("Добавить")').first();
  console.log('AddButton count:', await addBtn.count());
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await page.waitForTimeout(2000);
  }

  console.log('Forms after Add button click:', await page.locator('.winform').count());

  // Take screenshot
  await page.screenshot({ path: '/tmp/part3_after_add.png' });

  const lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  const name = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('Final record:', lastName, name);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
