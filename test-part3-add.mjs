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

  // Click Абонент > Добавить
  await page.click('.control-menustrip .menu-top:has-text("Абонент")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("Добавить")');
  await page.waitForTimeout(2000);

  const forms = await page.locator('.winform').all();
  console.log('Form count after Add:', forms.length);
  for (let i = 0; i < forms.length; i++) {
    const title = await forms[i].locator('.title').textContent().catch(() => '');
    console.log('Form', i, 'title:', title);
  }

  // Fill in AddForm
  const textboxes = await page.locator('.winform').nth(1).locator('.control-textbox').all();
  if (textboxes.length >= 3) {
    await textboxes[0].fill('Тестов');
    await textboxes[1].fill('Тест');
    await textboxes[2].fill('Тестович');
  }

  // Click AddButton
  const addBtn = await page.locator('.winform').nth(1).locator('.control-button:has-text("Добавить")').first();
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await page.waitForTimeout(1000);
  }

  // Check if back to MainForm with new record
  const mainForms = await page.locator('.winform').all();
  console.log('Form count after close:', mainForms.length);
  const lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  const name = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('Final record:', lastName, name);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
