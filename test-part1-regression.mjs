import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR:', err.message));
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(4000);
  await page.click('#btn-runtime');
  await page.waitForTimeout(3000);

  // Check MainForm loaded
  const title = await page.locator('.winform .title').first().textContent().catch(() => 'NOT FOUND');
  console.log('MainForm title:', title);

  // Open AddForm and add two records first (needed for navigation)
  for (let i = 0; i < 2; i++) {
    await page.click('.control-menustrip .menu-top:has-text("Абонент")');
    await page.waitForTimeout(300);
    await page.click('.submenu-item:has-text("Добавить")');
    await page.waitForTimeout(1500);

    let forms = await page.locator('.winform').count();
    if (forms > 1) {
      const addForm = page.locator('.winform').nth(1);
      const tbs = await addForm.locator('.control-textbox').all();
      if (tbs.length >= 3) {
        await tbs[0].fill(i === 0 ? 'Тестов' : 'Второй');
        await tbs[1].fill(i === 0 ? 'Тест' : 'Втор');
        await tbs[2].fill(i === 0 ? 'Тестович' : 'Вторович');
      }
      await addForm.locator('.control-button:has-text("Добавить")').first().click();
      await page.waitForTimeout(1500);
    }

    // Dismiss any MessageBox that might appear (e.g. duplicate check)
    const msgboxOk = page.locator('.msgbox button[data-r="OK"]').first();
    if (await msgboxOk.isVisible().catch(() => false)) {
      await msgboxOk.click();
      await page.waitForTimeout(500);
    }
  }

  let lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('After Add:', lastName);

  // Navigate Prev/Next (from last record, Prev should work; then Next back)
  await page.locator('.control-button:has-text("<")').first().click();
  await page.waitForTimeout(500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('After Previous:', lastName);

  await page.locator('.control-button:has-text(">")').first().click();
  await page.waitForTimeout(500);
  lastName = await page.locator('.control-textbox').nth(0).inputValue().catch(() => '');
  console.log('After Next:', lastName);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
