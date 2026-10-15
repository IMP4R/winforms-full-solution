import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForSelector('.designer-tab', { timeout: 5000 });

  // Add a ListBox from toolbox onto the existing form body
  const listboxItem = await page.locator('.toolbox-item:has-text("ListBox")').first();
  const formBody = await page.locator('.winform-body').first();
  await listboxItem.dragTo(formBody);
  await page.waitForTimeout(300);

  // Verify ListBox rendered
  const lb = await page.locator('.control-listbox').first();
  if (!lb) throw new Error('ListBox not rendered');

  // Add a GroupBox from toolbox
  const gbItem = await page.locator('.toolbox-item:has-text("GroupBox")').first();
  await gbItem.dragTo(formBody);
  await page.waitForTimeout(300);

  // Verify GroupBox rendered
  const gb = await page.locator('.control-groupbox').first();
  if (!gb) throw new Error('GroupBox not rendered');

  console.log('TEST PASSED: ListBox and GroupBox render in designer');
  await browser.close();
})();
