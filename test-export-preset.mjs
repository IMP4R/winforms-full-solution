import { chromium } from 'playwright';
import { readFileSync } from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:8824/winforms.html');
  await page.waitForSelector('.designer-tab', { timeout: 5000 });

  // Trigger C# export via page evaluate to get the generated files object
  const exportedFiles = await page.evaluate(() => {
    return new Promise(resolve => {
      const files = exportProjectToCSharp(DesignerState.project);
      resolve(files);
    });
  });

  // Check expected files exist
  const expected = [
    'PhoneBook.csproj',
    'Program.cs',
    'Note.cs',
    'MainForm.cs',
    'MainForm.Designer.cs',
    'MainForm.resx',
    'AddForm.cs',
    'AddForm.Designer.cs',
    'AddForm.resx',
    'SearchNameForm.cs',
    'SearchNameForm.Designer.cs',
    'SearchNameForm.resx'
  ];
  for (const f of expected) {
    if (!exportedFiles[f]) {
      throw new Error('Missing exported file: ' + f);
    }
    console.log('Exported:', f, '—', exportedFiles[f].length, 'chars');
  }

  // Basic sanity: MainForm.Designer.cs should contain our controls
  const dcs = exportedFiles['MainForm.Designer.cs'];
  const checks = [
    'private System.Windows.Forms.MenuStrip menuStrip1;',
    'private System.Windows.Forms.StatusStrip statusStrip1;',
    'private System.Windows.Forms.OpenFileDialog openFileDialog1;',
    'private System.Windows.Forms.SaveFileDialog saveFileDialog1;',
    'this.MainMenuStrip = this.menuStrip1;',
    'private void InitializeComponent()'
  ];
  for (const c of checks) {
    if (!dcs.includes(c)) {
      throw new Error('MainForm.Designer.cs missing: ' + c);
    }
  }

  // MainForm.cs should contain handlers
  const mcs = exportedFiles['MainForm.cs'];
  const handlerChecks = [
    'private void PrintElement()',
    'private void добавитьToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void изменитьToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void удалитьToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void PreviousButton_Click(object sender, EventArgs e)',
    'private void NextButton_Click(object sender, EventArgs e)',
    'private void сохранитьToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void открытьToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void поискПоФИОToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void поискПоАдресуToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void поискПоТелефонуToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void сортироватьПоФамилииToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void сортироватьПоКвартиреToolStripMenuItem_Click(object sender, EventArgs e)',
    'private void сортироватьПоФамилииDescToolStripMenuItem_Click(object sender, EventArgs e)',
    'PhoneNote.Sort((x, y) => x.LastName.CompareTo(y.LastName));',
    'PhoneNote.Sort((x, y) => x.Flat - y.Flat);',
    'Сохранить изменения?',
    'MessageBoxButtons.YesNoCancel'
  ];
  for (const c of handlerChecks) {
    if (!mcs.includes(c)) {
      throw new Error('MainForm.cs missing: ' + c);
    }
  }

  console.log('TEST PASSED: export contains all expected files and constructs');
  await browser.close();
})();
