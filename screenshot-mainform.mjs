import { chromium } from 'playwright';
import path from 'path';

(async () => {
    const browser = await chromium.launch({
        executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        headless: true,
        args: ['--disable-features=OverlayScrollbar']
    });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();
    
    await page.goto('http://localhost:8824/winforms.html', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    
    // Click Runtime button
    await page.click('#btn-runtime');
    await page.waitForTimeout(2500);
    
    // Screenshot MainForm
    const mainForm = await page.locator('.winform').first();
    await mainForm.screenshot({ path: '/tmp/runtime_screenshots/MainForm_runtime.png' });
    console.log('MainForm screenshot done');
    
    await browser.close();
})();
