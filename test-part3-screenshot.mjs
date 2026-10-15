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
  await page.waitForTimeout(5000);

  // Screenshot before runtime
  await page.screenshot({ path: '/tmp/part3_design.png' });
  console.log('Design mode screenshot saved');

  // Click Runtime button
  await page.click('#btn-runtime');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: '/tmp/part3_runtime.png' });
  console.log('Runtime mode screenshot saved');

  // Check form title
  const title = await page.locator('.winform .title').first().textContent().catch(() => 'NOT FOUND');
  console.log('Form title:', title);

  // Check all winforms
  const forms = await page.locator('.winform').all();
  console.log('Winform count:', forms.length);

  // Check textboxes
  const textboxes = await page.locator('.control-textbox').all();
  console.log('Textbox count:', textboxes.length);
  if (textboxes.length > 0) {
    const val = await textboxes[0].inputValue().catch(() => 'no value');
    console.log('First textbox value:', val);
  }

  // Check status strip
  const status = await page.locator('.control-statusstrip').count();
  console.log('StatusStrip count:', status);

  // Check buttons
  const buttons = await page.locator('.control-button').all();
  console.log('Button texts:', await Promise.all(buttons.slice(0, 4).map(b => b.textContent().catch(() => ''))));

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
