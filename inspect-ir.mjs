import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(3000);
  await page.evaluate(() => { if (window.boot?.setMode) window.boot.setMode('runtime'); });
  await page.waitForTimeout(2000);

  const items = await page.evaluate(() => {
    const form = window.boot?.project?.forms?.[0];
    return form?.controls?.find(c => c.type === 'MenuStrip')?.items?.map(i => ({
      name: i.Name,
      text: i.Text,
      events: i.events,
      hasItems: !!i.items?.length
    }));
  });
  console.log('MenuStrip IR items:', JSON.stringify(items, null, 2));

  // Check if click handler is wired on DOM
  const domInfo = await page.evaluate(() => {
    const tops = document.querySelectorAll('.control-menustrip .menu-top');
    return Array.from(tops).map(t => ({
      text: t.textContent.trim().substring(0, 20),
      onclick: !!t.onclick,
      itemName: t.dataset.itemName
    }));
  });
  console.log('DOM onclick wired:', JSON.stringify(domInfo, null, 2));

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
