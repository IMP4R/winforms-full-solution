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

  // Check initial data
  let lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  let name = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('Initial record:', lastName, name);

  // Test Next
  await page.locator('.control-button:has-text(">")').first().click();
  await page.waitForTimeout(500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  name = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('After Next:', lastName, name);

  // Test Previous
  await page.locator('.control-button:has-text("<")').first().click();
  await page.waitForTimeout(500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  name = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('After Previous:', lastName, name);

  // Test Add
  await page.click('.control-menustrip .menu-top:has-text("Абонент")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("Добавить")');
  await page.waitForTimeout(1500);
  const addForm = page.locator('.winform').nth(1);
  const tbs = await addForm.locator('.control-textbox').all();
  if (tbs.length >= 3) {
    await tbs[0].fill('Новый');
    await tbs[1].fill('Нов');
    await tbs[2].fill('Нович');
  }
  await addForm.locator('.control-button:has-text("Добавить")').first().click();
  await page.waitForTimeout(1500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  name = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('After Add:', lastName, name);

  // Test Search
  await page.click('.control-menustrip .menu-top:has-text("Поиск")');
  await page.waitForTimeout(500);
  const searchForm = page.locator('.winform').nth(1);
  const searchTbs = await searchForm.locator('.control-textbox').all();
  if (searchTbs.length >= 1) await searchTbs[0].fill('Иванов');
  await searchForm.locator('.control-button').first().click();
  await page.waitForTimeout(1500);

  const formsAfterSearch = await page.locator('.winform').count();
  console.log('Forms after search close:', formsAfterSearch);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('Record after search:', lastName);

  // Test Sort by Lastname
  await page.click('.control-menustrip .menu-top:has-text("Сортировка")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("фамилии")');
  await page.waitForTimeout(500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('After sort by lastname:', lastName);

  // Test Sort by Flat
  await page.click('.control-menustrip .menu-top:has-text("Сортировка")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("квартире")');
  await page.waitForTimeout(500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('After sort by flat:', lastName);

  // Test Edit (current record should be at index 0 after sort)
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('Before edit:', lastName);
  await page.click('.control-menustrip .menu-top:has-text("Абонент")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("Изменить")');
  await page.waitForTimeout(1500);
  const editForm = page.locator('.winform').nth(1);
  const editTbs = await editForm.locator('.control-textbox').all();
  if (editTbs.length >= 3) {
    await editTbs[0].fill('ИвановChanged');
    await editTbs[1].fill('ИванChanged');
  }
  // Click the Add/Edit button (same button text "Добавить" in AddForm)
  await editForm.locator('.control-button').first().click();
  await page.waitForTimeout(1500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  name = await page.locator('.control-textbox').nth(1).inputValue().catch(() => '');
  console.log('After edit:', lastName, name);

  // Test Delete
  // We should still be on the edited record. Note current count from status strip.
  const statusText = await page.locator('.control-statusstrip').first().textContent().catch(() => '');
  console.log('Status before delete:', statusText);
  await page.click('.control-menustrip .menu-top:has-text("Абонент")');
  await page.waitForTimeout(300);
  await page.click('.submenu-item:has-text("Удалить")');
  await page.waitForTimeout(1000);
  // Handle Yes/No message box - click Yes
  const msgboxBtn = page.locator('.msgbox button[data-r="Yes"]').first();
  if (await msgboxBtn.isVisible().catch(() => false)) {
    await msgboxBtn.click();
    await page.waitForTimeout(1000);
  }
  const statusAfterDelete = await page.locator('.control-statusstrip').first().textContent().catch(() => '');
  console.log('Status after delete:', statusAfterDelete);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('Record after delete:', lastName);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
