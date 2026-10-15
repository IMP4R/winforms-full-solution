import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(3000);
  await page.click('#btn-runtime');
  await page.waitForTimeout(2000);

  const poiskMenu = await page.locator('.control-menustrip .menu-top', { hasText: /^Поиск$/ }).first();
  await poiskMenu.click();
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    const forms = document.querySelectorAll('.winform');
    for (const f of forms) {
      const title = f.querySelector('.title')?.textContent || '';
      if (title.includes('Поиск')) {
        const tb = f.querySelector('textarea.control-textbox');
        if (tb) {
          const style = getComputedStyle(tb);
          return {
            title,
            value: tb.value,
            valueLen: tb.value.length,
            scrollHeight: tb.scrollHeight,
            clientHeight: tb.clientHeight,
            offsetHeight: tb.offsetHeight,
            offsetWidth: tb.offsetWidth,
            clientWidth: tb.clientWidth,
            styleOverflow: tb.style.overflowY,
            computedOverflow: style.overflowY,
            scrollbarWidth: tb.offsetWidth - tb.clientWidth,
            paddingRight: style.paddingRight,
            borderRight: style.borderRightWidth,
          };
        }
        return { title, error: 'textarea not found' };
      }
    }
    return { error: 'Search form not found' };
  });

  console.log('ResultsTextBox info:', JSON.stringify(info, null, 2));

  // Also take a screenshot of just this element for manual inspection
  const forms = await page.locator('.winform').all();
  for (const form of forms) {
    const title = await form.locator('.title').textContent().catch(() => '');
    if (title.includes('Поиск')) {
      const tb = await form.locator('textarea.control-textbox').first();
      if (await tb.count() > 0) {
        await tb.screenshot({ path: '/tmp/runtime_screenshots/SearchNameForm_textbox_debug.png' });
        console.log('Screenshot saved to /tmp/runtime_screenshots/SearchNameForm_textbox_debug.png');
      }
    }
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
