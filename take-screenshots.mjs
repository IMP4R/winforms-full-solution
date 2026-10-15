import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

async function screenshotForm(formName, outPath) {
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(1500);
  // Wait for the designer to load
  await page.waitForSelector('.winform', { timeout: 10000 });
  // Switch to runtime mode (only if not already active)
  const runtimeBtn = await page.locator('.mode-switch button:has-text("Runtime")');
  if (await runtimeBtn.count() > 0) {
    const isActive = await runtimeBtn.evaluate(el => el.classList.contains('active'));
    if (!isActive) {
      await runtimeBtn.click();
      await page.waitForTimeout(500);
    }
  }
  // Switch to the requested form tab if not already active
  const tab = await page.locator(`.designer-tab:has-text("${formName}")`);
  if (await tab.count() > 0) {
    const isActive = await tab.evaluate(el => el.classList.contains('active'));
    if (!isActive) {
      await tab.evaluate(el => { el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); el.click(); });
      await page.waitForTimeout(800);
    }
  }
  const form = await page.locator(`.winform`);
  await form.screenshot({ path: outPath });
  console.log(`Saved ${outPath}`);
}

await screenshotForm('MainForm', '/tmp/web_screenshots/mainform_runtime.png');
await screenshotForm('AddForm', '/tmp/web_screenshots/addform_runtime.png');
await screenshotForm('SearchNameForm', '/tmp/web_screenshots/searchnameform_runtime.png');

await browser.close();
