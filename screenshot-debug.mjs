import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const OUT_DIR = '/tmp/runtime_screenshots';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true,
    args: ['--disable-features=OverlayScrollbar']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    if (window.boot && window.boot.setMode) window.boot.setMode('runtime');
  });
  await page.waitForTimeout(2000);

  // Debug: log all menu text
  const menuTexts = await page.evaluate(() => {
    const menus = document.querySelectorAll('.control-menustrip .menu-top');
    return Array.from(menus).map(m => ({
      text: m.textContent.trim(),
      html: m.outerHTML.substring(0, 200)
    }));
  });
  console.log('Menu tops:', JSON.stringify(menuTexts, null, 2));

  // Screenshot MainForm
  const mainForm = await page.locator('.winform').first();
  await mainForm.screenshot({ path: path.join(OUT_DIR, 'MainForm_runtime.png') });
  console.log('MainForm runtime done');

  // Try clicking Абонент menu via visible interaction
  const abonentMenu = await page.locator('.control-menustrip .menu-top', { hasText: /Абонент/ }).first();
  if (await abonentMenu.count() > 0) {
    await abonentMenu.click();
    await page.waitForTimeout(500);
    const addItem = await page.locator('.menu-item', { hasText: /Добавить/ }).first();
    if (await addItem.count() > 0) {
      await addItem.click();
      console.log('Clicked AddItem');
    } else {
      console.log('AddItem not found');
    }
  } else {
    console.log('Abonent menu not found');
  }
  await page.waitForTimeout(2000);

  const forms = await page.locator('.winform').all();
  console.log('Form count after Abonent click:', forms.length);
  for (let i = 0; i < forms.length; i++) {
    const title = await forms[i].locator('.title').textContent().catch(() => '');
    console.log('Form', i, 'title:', title);
    if (title.includes('Добавление')) {
      await forms[i].screenshot({ path: path.join(OUT_DIR, 'AddForm_runtime.png') });
      console.log('AddForm runtime saved');
    }
  }

  // Close all non-main forms
  await page.evaluate(() => {
    const forms = document.querySelectorAll('.winform');
    for (const f of forms) {
      const title = f.querySelector('.title')?.textContent || '';
      if (!title.includes('Телефонный справочник') && !title.includes('Главная')) {
        const closeBtn = f.querySelector('.close');
        if (closeBtn) closeBtn.click();
      }
    }
  });
  await page.waitForTimeout(800);

  // Click Поиск top-level
  const poiskMenu = await page.locator('.control-menustrip .menu-top', { hasText: /Поиск/ }).first();
  if (await poiskMenu.count() > 0) {
    await poiskMenu.click();
    console.log('Clicked Поиск menu');
  } else {
    console.log('Поиск menu not found');
  }
  await page.waitForTimeout(2000);

  const forms2 = await page.locator('.winform').all();
  console.log('Form count after Поиск click:', forms2.length);
  for (let i = 0; i < forms2.length; i++) {
    const title = await forms2[i].locator('.title').textContent().catch(() => '');
    console.log('Form2', i, 'title:', title);
    if (title.includes('Поиск')) {
      await forms2[i].screenshot({ path: path.join(OUT_DIR, 'SearchNameForm_runtime.png') });
      console.log('SearchNameForm runtime saved');
    }
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
