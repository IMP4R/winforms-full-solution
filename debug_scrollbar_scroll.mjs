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

  // Try scrolling the textarea by 1px before screenshot
  await page.evaluate(() => {
    const forms = document.querySelectorAll('.winform');
    for (const f of forms) {
      const title = f.querySelector('.title')?.textContent || '';
      if (title.includes('Поиск')) {
        const tb = f.querySelector('textarea.control-textbox');
        if (tb) {
          tb.scrollTop = 1;
          console.log('Scrolled to', tb.scrollTop);
        }
      }
    }
  });
  await page.waitForTimeout(500);

  const forms = await page.locator('.winform').all();
  for (const form of forms) {
    const title = await form.locator('.title').textContent().catch(() => '');
    if (title.includes('Поиск')) {
      const tb = await form.locator('textarea.control-textbox').first();
      if (await tb.count() > 0) {
        await tb.screenshot({ path: '/tmp/runtime_screenshots/SearchNameForm_textbox_scrolled.png' });
        console.log('Screenshot saved');
      }
    }
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
