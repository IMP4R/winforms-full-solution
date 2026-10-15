import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({
        executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8824/winforms.html', { waitUntil: 'load' });
    await page.waitForTimeout(3000);
    await page.click('#btn-runtime');
    await page.waitForTimeout(2000);
    
    // Get computed styles
    const styles = await page.evaluate(() => {
        const labels = document.querySelectorAll('.control-label');
        const textboxes = document.querySelectorAll('.control-textbox');
        const menu = document.querySelector('.control-menustrip');
        const status = document.querySelector('.control-statusstrip');
        
        return {
            label: labels[0] ? window.getComputedStyle(labels[0]).fontWeight : 'not found',
            textbox: textboxes[0] ? window.getComputedStyle(textboxes[0]).fontWeight : 'not found',
            menu: menu ? window.getComputedStyle(menu).fontWeight : 'not found',
            status: status ? window.getComputedStyle(status).fontWeight : 'not found'
        };
    });
    
    console.log('Computed styles:', JSON.stringify(styles, null, 2));
    await browser.close();
})();
