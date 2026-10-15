import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');

  // Wait for the designer to render the first form tab
  await page.waitForTimeout(3000);
  await page.waitForSelector('.designer-tab', { timeout: 10000 });

  // Check that the form title is rendered
  const title = await page.$eval('.winform-titlebar .title', el => el.textContent);
  console.log('Form title:', title);
  if (title !== 'Телефонный справочник') {
    throw new Error('Unexpected form title: ' + title);
  }

  // Switch to runtime mode by clicking the Runtime button
  await page.click('#btn-runtime');
  await page.waitForTimeout(500);

  // Verify runtime mode active
  const modeTag = await page.$eval('#mode-tag', el => el.textContent);
  console.log('Mode tag:', modeTag);
  if (modeTag !== 'Runtime') {
    throw new Error('Failed to switch to Runtime mode');
  }

  // In runtime, the form title should still be present
  const runtimeTitle = await page.$eval('.winform-titlebar .title', el => el.textContent);
  console.log('Runtime title:', runtimeTitle);
  if (runtimeTitle !== 'Телефонный справочник') {
    throw new Error('Runtime form title mismatch');
  }

  console.log('TEST PASSED: preset loaded, design and runtime render correctly');
  await browser.close();
})();
