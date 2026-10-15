import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(4000);

  const bootInfo = await page.evaluate(() => {
    const b = window.boot;
    if (!b) return { missing: true };
    return {
      keys: Object.keys(b),
      hasSetMode: !!b.setMode,
      hasProject: !!b.project,
      projectType: typeof b.project,
      hasForms: Array.isArray(b.project?.forms)
    };
  });
  console.log('Boot info:', JSON.stringify(bootInfo, null, 2));

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
