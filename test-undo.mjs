import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForSelector('.designer-tab', { timeout: 5000 });

  // 1. Select lblLastName and remember original text
  await page.click('[data-ctrl-name="lblLastName"]');
  await page.waitForTimeout(300);
  const originalText = await page.$eval('[data-ctrl-name="lblLastName"]', el => el.textContent);

  // 2. Change Text property
  const textInput = await page.locator('.prop-row:has(.key:has-text("Text")) input').first();
  await textInput.fill('NewLabelText');
  await textInput.press('Tab');
  await page.waitForTimeout(500);

  // Verify DOM updated
  const labelText = await page.$eval('[data-ctrl-name="lblLastName"]', el => el.textContent);
  if (labelText !== 'NewLabelText') {
    throw new Error('Label text not updated: ' + labelText);
  }
  console.log('Property change OK');

  // 3. Undo (Ctrl+Z)
  await page.keyboard.press('Control+z');
  await page.waitForTimeout(500);

  const labelTextAfterUndo = await page.$eval('[data-ctrl-name="lblLastName"]', el => el.textContent);
  if (labelTextAfterUndo !== originalText) {
    throw new Error('Undo failed, expected ' + originalText + ' got: ' + labelTextAfterUndo);
  }
  console.log('Undo OK');

  // 4. Redo (Ctrl+Shift+Z)
  await page.keyboard.press('Control+Shift+z');
  await page.waitForTimeout(500);

  const labelTextAfterRedo = await page.$eval('[data-ctrl-name="lblLastName"]', el => el.textContent);
  if (labelTextAfterRedo !== 'NewLabelText') {
    throw new Error('Redo failed, got: ' + labelTextAfterRedo);
  }
  console.log('Redo OK');

  // 5. Delete control + undo
  await page.keyboard.press('Delete');
  await page.waitForTimeout(500);
  const deleted = await page.$('[data-ctrl-name="lblLastName"]') === null;
  if (!deleted) throw new Error('Delete failed');
  console.log('Delete OK');

  await page.keyboard.press('Control+z');
  await page.waitForTimeout(500);
  const restored = await page.$('[data-ctrl-name="lblLastName"]') !== null;
  if (!restored) throw new Error('Undo delete failed');
  console.log('Undo delete OK');

  console.log('TEST PASSED: undo/redo works');
  await browser.close();
})();
