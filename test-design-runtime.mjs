import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForSelector('.designer-tab', { timeout: 5000 });

  // 1. Click on TextBox in design mode — should select it (show inspector)
  await page.click('[data-ctrl-name="LastNameTextBox"]');
  await page.waitForTimeout(300);

  const inspectorName = await page.$eval('.target-name', el => el.textContent).catch(() => null);
  if (inspectorName !== 'LastNameTextBox') {
    throw new Error('TextBox not selectable in design mode, got: ' + inspectorName);
  }
  console.log('TextBox selection in design mode: OK');

  // 2. Switch to runtime
  await page.click('#btn-runtime');
  await page.waitForTimeout(500);

  // Verify runtime class is set
  const isRuntime = await page.$eval('#designer', el => el.classList.contains('runtime'));
  if (!isRuntime) throw new Error('Not in runtime mode');

  // 3. Try to click a control wrapper in runtime — should NOT select it
  // Remember current selection
  await page.click('[data-ctrl-name="LastNameTextBox"]');
  await page.waitForTimeout(300);
  // In runtime mode click handler returns early, so nothing should be selected
  // (selection from design mode is still in memory but UI doesn't show selection frame)
  const hasSelection = await page.$eval('[data-ctrl-name="LastNameTextBox"]', el => el.classList.contains('selected'));
  if (hasSelection) {
    throw new Error('Control still selected in runtime mode');
  }
  console.log('Runtime mode no selection: OK');

  // 4. Switch back to design
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  const isDesign = await page.$eval('#designer', el => el.classList.contains('designer'));
  if (!isDesign) throw new Error('Not back in design mode');

  // 5. Click TextBox again — should select
  await page.click('[data-ctrl-name="LastNameTextBox"]');
  await page.waitForTimeout(300);
  const inspectorName2 = await page.$eval('.target-name', el => el.textContent).catch(() => null);
  if (inspectorName2 !== 'LastNameTextBox') {
    throw new Error('TextBox not selectable after returning from runtime, got: ' + inspectorName2);
  }
  console.log('TextBox selection after runtime→design: OK');

  console.log('TEST PASSED: design/runtime separation works');
  await browser.close();
})();
