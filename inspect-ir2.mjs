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

  const project = await page.evaluate(() => window.boot?.project);
  console.log('Project keys:', Object.keys(project || {}));
  console.log('Forms count:', project?.forms?.length);
  const form0 = project?.forms?.[0];
  console.log('Form0 keys:', Object.keys(form0 || {}));
  console.log('Form0 controls count:', form0?.controls?.length);
  const menuStrip = form0?.controls?.find(c => c.type === 'MenuStrip');
  console.log('MenuStrip found:', !!menuStrip);
  if (menuStrip) {
    console.log('MenuStrip keys:', Object.keys(menuStrip));
    console.log('MenuStrip items:', JSON.stringify(menuStrip.items, null, 2));
  }

  // Also check handlers
  console.log('Handlers:', Object.keys(project?.handlers || {}).slice(0, 10));

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
