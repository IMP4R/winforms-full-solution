import { chromium } from 'playwright';
import { writeFileSync, readFileSync, mkdirSync, rmSync } from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForSelector('.designer-tab', { timeout: 5000 });

  // Load phonebook preset if not already loaded
  await page.evaluate(async () => {
    if (window.DesignerState.project.forms.length === 0) {
      const mod = await import('./presets/phonebook.js');
      window.DesignerState.project = JSON.parse(JSON.stringify(mod.PHONEBOOK_PRESET));
    }
  });
  await page.waitForTimeout(500);

  const files = await page.evaluate(() => exportProjectToCSharp(DesignerState.project));

  const dir = 'PhoneBook-exported';
  try { rmSync(dir, { recursive: true }); } catch {}
  mkdirSync(dir, { recursive: true });

  for (const [name, content] of Object.entries(files)) {
    writeFileSync(`${dir}/${name}`, content);
  }


  console.log('Exported to', dir);
  await browser.close();
})();
