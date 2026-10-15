import { chromium } from 'playwright';
import * as fs from 'fs';

(async () => {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();

  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForSelector('.designer-tab', { timeout: 5000 });

  // Verify it loaded from server (should show PhoneBook title)
  const title = await page.$eval('.winform-titlebar .title', el => el.textContent);
  console.log('Title:', title);
  if (title !== 'Телефонный справочник') {
    throw new Error('Did not load from server, title=' + title);
  }

  // Save original Designer.cs before any modifications
  const originalDesignerCs = fs.readFileSync('PhoneBook/MainForm.Designer.cs', 'utf8');

  // Edit a control property (e.g., change a label text)
  const uniqueText = 'Фамилия_' + Date.now() + ':';
  await page.click('[data-ctrl-name="lblLastName"]'); // click lblLastName
  await page.waitForTimeout(300);
  // The inspector should show. Find the Text input by label row.
  const textInput = await page.locator('.prop-row:has(.key:has-text("Text")) input').first();
  if (!textInput) {
    throw new Error('Could not find Text input in inspector');
  }
  await textInput.fill(uniqueText);
  await textInput.press('Tab');
  await page.waitForTimeout(3000); // wait for auto-save

  // Verify server updated the .Designer.cs
  const designerCs = fs.readFileSync('PhoneBook/MainForm.Designer.cs', 'utf8');
  if (!designerCs.includes(uniqueText)) {
    throw new Error('Auto-save did not update MainForm.Designer.cs');
  }
  console.log('Auto-save OK: MainForm.Designer.cs updated');

  // Restore original label text so test doesn't leave permanent Designer.cs changes
  const restoredDesignerCs = designerCs.replace(uniqueText, 'Фамилия');
  fs.writeFileSync('PhoneBook/MainForm.Designer.cs', restoredDesignerCs);

  // Now simulate external edit: modify MainForm.cs
  const originalCs = fs.readFileSync('PhoneBook/MainForm.cs', 'utf8');
  const modifiedCs = originalCs.replace('private void PrintElement()', 'private void PrintElement2()');
  // Wait a bit then write
  await new Promise(r => setTimeout(r, 100));
  fs.writeFileSync('PhoneBook/MainForm.cs', modifiedCs);

  // Wait for watch interval
  await page.waitForTimeout(4000);

  // Look for toast about external changes
  const toastText = await page.$eval('.toast', el => el.textContent).catch(() => null);
  console.log('Toast:', toastText);
  if (!toastText || !toastText.includes('Files changed externally')) {
    throw new Error('External change toast not shown: ' + toastText);
  }

  // Press F5 to reload
  await page.keyboard.press('F5');
  await page.waitForTimeout(2000);

  // After reload, the handler name in IR should be updated
  const serverIr = await (await fetch('http://localhost:8824/api/project')).json();
  const mainForm = serverIr.forms.find(f => f.name === 'MainForm');
  const hasPrintElement2 = mainForm.helperMethods.some(m => m.name === 'PrintElement2');
  if (!hasPrintElement2) {
    throw new Error('Reload did not pick up external change to PrintElement name');
  }
  console.log('Round-trip OK: external edit detected and reloaded');

  // Wait for any pending auto-save from F5 reload to settle, then stop server and restore
  await page.waitForTimeout(3000);
  try {
    require('child_process').execSync('kill $(lsof -t -i :8824) 2>/dev/null || true');
  } catch {}
  await new Promise(r => setTimeout(r, 1000));

  // Restore original MainForm.cs only (Designer.cs already restored above)
  fs.writeFileSync('PhoneBook/MainForm.cs', originalCs);

  await browser.close();
})();
