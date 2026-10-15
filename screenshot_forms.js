import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = '/tmp/web_screenshots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://localhost:8824/winforms.html');
await page.waitForSelector('.designer-tab', { timeout: 10000 });

async function screenshotForm(formName, filename, mode = 'runtime') {
  await page.click('#btn-design').catch(() => {});
  await page.waitForTimeout(200);
  
  const tabs = await page.$$('.designer-tab');
  for (const tab of tabs) {
    const text = await tab.textContent();
    if (text && text.includes(formName)) {
      await tab.click();
      await page.waitForTimeout(300);
      break;
    }
  }
  
  if (mode === 'runtime') {
    await page.click('#btn-runtime');
    await page.waitForTimeout(800);
  } else {
    await page.click('#btn-design');
    await page.waitForTimeout(300);
  }
  
  // Screenshot full page (with designer chrome)
  await page.screenshot({ path: path.join(outDir, filename), fullPage: false });
  console.log(`Saved ${filename}`);
}

await screenshotForm('MainForm', 'mainform_design.png', 'design');
await screenshotForm('MainForm', 'mainform_runtime.png', 'runtime');
await screenshotForm('AddForm', 'addform_design.png', 'design');
await screenshotForm('AddForm', 'addform_runtime.png', 'runtime');
await screenshotForm('SearchNameForm', 'searchnameform_design.png', 'design');
await screenshotForm('SearchNameForm', 'searchnameform_runtime.png', 'runtime');

await browser.close();
console.log('Done');
