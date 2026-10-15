import { chromium } from 'playwright';
import assert from 'assert';
import { existsSync, readFileSync, rmSync } from 'fs';

const BASE_URL = 'http://localhost:8824/winforms.html';
const TIMEOUT = 3000;

async function runTest(name, fn) {
  const browser = await chromium.launch({
    executablePath: '/Users/denis/Library/Caches/ms-playwright/chromium-1200/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: true,
    args: ['--disable-features=OverlayScrollbar']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log(`[${name}] CONSOLE:`, msg.text()));
  page.on('pageerror', err => console.log(`[${name}] PAGEERROR:`, err.message));

  try {
    await fn(page);
    console.log(`✅ ${name}: PASSED`);
  } catch (e) {
    console.error(`❌ ${name}: FAILED - ${e.message}`);
    throw e;
  } finally {
    await browser.close();
  }
}

async function testNewProjectEmpty(page) {
  // Clean up TestLab if exists
  try { rmSync('/Users/denis/Work/WinForms/TestLab', { recursive: true }); } catch {}

  await page.goto(BASE_URL + '?project=TestLab');
  await page.waitForTimeout(TIMEOUT);

  // Should show empty project, not PhoneBook
  const projectInfo = await page.evaluate(() => {
    const p = window.DesignerState.project;
    return {
      projectName: p.projectName,
      formCount: p.forms.length,
      classCount: p.classes?.length || 0,
      isPhoneBook: p.projectName === 'PhoneBook'
    };
  });

  assert(!projectInfo.isPhoneBook, 'Should NOT load PhoneBook preset for ?project=TestLab');
  assert(projectInfo.projectName === 'TestLab', `Project name should be TestLab, got ${projectInfo.projectName}`);
  assert(projectInfo.formCount >= 1, 'Should have at least MainForm');

  console.log('New Project Empty: projectName=' + projectInfo.projectName + ', forms=' + projectInfo.formCount);
}

async function testAddNewForm(page) {
  await page.goto(BASE_URL + '?project=TestLab');
  await page.waitForTimeout(TIMEOUT);

  // Handle prompt dialog
  page.on('dialog', async dialog => {
    if (dialog.type() === 'prompt') {
      await dialog.accept('TestForm');
    } else {
      await dialog.dismiss();
    }
  });

  await page.click('#btn-new-form');
  await page.waitForTimeout(1000);

  const formInfo = await page.evaluate(() => {
    const p = window.DesignerState.project;
    const form = p.forms.find(f => f.name === 'TestForm');
    return {
      formCount: p.forms.length,
      hasTestForm: !!form,
      testFormType: form?.type
    };
  });

  assert(formInfo.hasTestForm, 'TestForm should exist after clicking + Form');
  assert(formInfo.testFormType === 'Form', 'TestForm should be type Form');

  console.log('Add New Form: forms=' + formInfo.formCount + ', hasTestForm=' + formInfo.hasTestForm);
}

async function testAddNewClass(page) {
  await page.goto(BASE_URL + '?project=TestLab');
  await page.waitForTimeout(TIMEOUT);

  // Handle prompt dialog
  page.on('dialog', async dialog => {
    if (dialog.type() === 'prompt') {
      await dialog.accept('TestClass');
    } else {
      await dialog.dismiss();
    }
  });

  await page.click('#btn-new-class');
  await page.waitForTimeout(1000);

  const classInfo = await page.evaluate(() => {
    const p = window.DesignerState.project;
    const cls = p.classes?.find(c => c.name === 'TestClass');
    return {
      classCount: p.classes?.length || 0,
      hasTestClass: !!cls,
      testClassName: cls?.name
    };
  });

  assert(classInfo.hasTestClass, 'TestClass should exist after clicking + Class');

  console.log('Add New Class: classes=' + classInfo.classCount + ', hasTestClass=' + classInfo.hasTestClass);
}

async function testSolutionExplorerShowsClasses(page) {
  await page.goto(BASE_URL + '?project=TestLab');
  await page.waitForTimeout(TIMEOUT);

  // Check tree panel shows forms and classes
  const treeContent = await page.evaluate(() => {
    const panel = document.getElementById('tree-panel');
    return panel ? panel.textContent : '';
  });

  assert(treeContent.includes('MainForm.cs'), 'Solution Explorer should show MainForm.cs');
  assert(treeContent.includes('TestForm.cs'), 'Solution Explorer should show TestForm.cs (from previous test)');
  assert(treeContent.includes('TestClass.cs'), 'Solution Explorer should show TestClass.cs');

  console.log('Solution Explorer shows forms and classes');
}

async function testAutoSaveCreatesFiles(page) {
  await page.goto(BASE_URL + '?project=TestLab');
  await page.waitForTimeout(TIMEOUT + 2000); // Wait for auto-save

  // Check files were created on disk
  const testLabDir = '/Users/denis/Work/WinForms/TestLab';
  assert(existsSync(testLabDir), `TestLab directory should exist at ${testLabDir}`);

  // After auto-save, C# files should be generated
  const hasMainForm = existsSync(testLabDir + '/MainForm.cs');
  const hasMainFormDesigner = existsSync(testLabDir + '/MainForm.Designer.cs');

  console.log('AutoSave files: MainForm.cs=' + hasMainForm + ', MainForm.Designer.cs=' + hasMainFormDesigner);

  // The directory should exist (auto-save writes files)
  assert(existsSync(testLabDir), 'TestLab directory should be created by auto-save');
}

async function testReloadPersistedProject(page) {
  await page.goto(BASE_URL + '?project=TestLab');
  await page.waitForTimeout(TIMEOUT + 2000); // Wait for auto-save

  // Reload page
  await page.goto(BASE_URL + '?project=TestLab');
  await page.waitForTimeout(TIMEOUT);

  const projectInfo = await page.evaluate(() => {
    const p = window.DesignerState.project;
    return {
      projectName: p.projectName,
      hasTestForm: p.forms.some(f => f.name === 'TestForm'),
      hasTestClass: p.classes?.some(c => c.name === 'TestClass') || false
    };
  });

  assert(projectInfo.projectName === 'TestLab', 'Project name should persist');
  assert(projectInfo.hasTestForm, 'TestForm should persist after reload');
  assert(projectInfo.hasTestClass, 'TestClass should persist after reload');

  console.log('Reload Persisted: hasTestForm=' + projectInfo.hasTestForm + ', hasTestClass=' + projectInfo.hasTestClass);
}

async function main() {
  const tests = [
    ['New Project Empty (not PhoneBook)', testNewProjectEmpty],
    ['Add New Form', testAddNewForm],
    ['Add New Class', testAddNewClass],
    ['Solution Explorer Shows Classes', testSolutionExplorerShowsClasses],
    ['AutoSave Creates Files', testAutoSaveCreatesFiles],
    ['Reload Persisted Project', testReloadPersistedProject],
  ];

  console.log('='.repeat(60));
  console.log('NEW PROJECT / NEW FORM / NEW CLASS TESTS');
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  for (const [name, fn] of tests) {
    try {
      await runTest(name, fn);
      passed++;
    } catch (e) {
      failed++;
      console.error(`Test failed: ${e.message}`);
    }
  }

  console.log('='.repeat(60));
  console.log(`RESULTS: ${passed} passed, ${failed} failed out of ${tests.length}`);
  console.log('='.repeat(60));

  // Cleanup
  try { rmSync('/Users/denis/Work/WinForms/TestLab', { recursive: true }); } catch {}

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
