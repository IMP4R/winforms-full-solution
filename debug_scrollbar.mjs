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

  // Open SearchNameForm
  const poiskMenu = await page.locator('.control-menustrip .menu-top', { hasText: /^Поиск$/ }).first();
  await poiskMenu.click();
  await page.waitForTimeout(2000);

  // Inspect ResultsTextBox textarea
  const info = await page.evaluate(() => {
    const forms = document.querySelectorAll('.winform');
    for (const f of forms) {
      const title = f.querySelector('.title')?.textContent || '';
      if (title.includes('Поиск')) {
        const tb = f.querySelector('textarea.control-textbox');
        if (tb) {
          return {
            title,
            value: tb.value,
            valueLen: tb.value.length,
            scrollHeight: tb.scrollHeight,
            clientHeight: tb.clientHeight,
            offsetHeight: tb.offsetHeight,
            styleOverflow: tb.style.overflowY,
            computedOverflow: getComputedStyle(tb).overflowY,
            className: tb.className,
          };
        }
        return { title, error: 'textarea not found' };
      }
    }
    return { error: 'Search form not found' };
  });

  console.log('ResultsTextBox info:', JSON.stringify(info, null, 2));
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
