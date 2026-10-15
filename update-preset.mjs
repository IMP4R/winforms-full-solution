import fs from 'fs';

const filePath = 'presets/phonebook.js';
const text = fs.readFileSync(filePath, 'utf-8');

const match = text.match(/export const PHONEBOOK_PRESET = (\{[\s\S]*\n\});/);
if (!match) throw new Error('Cannot parse preset');

const preset = JSON.parse(match[1]);

// 1. Add fields to MainForm
const mainForm = preset.forms.find(f => f.name === 'MainForm');
if (!mainForm) throw new Error('MainForm not found');
mainForm.fields.push(
  { type: 'ISave', name: 'saveBehavior' },
  { type: 'IOpen', name: 'openBehavior' }
);

// 2. Add menu item to MainForm MenuStrip
const menuStrip = mainForm.children.find(c => c.type === 'MenuStrip');
if (menuStrip) {
  const fileMenu = menuStrip.items.find(i => i.Name === 'файлToolStripMenuItem');
  if (fileMenu) {
    fileMenu.items.push({
      Name: 'добавитьИзФайлаToolStripMenuItem',
      Text: 'Добавить из файла',
      events: { Click: 'h_addFromFileClick' }
    });
  }
}

// 3. Update handler bodies to Strategy versions
const handlers = preset.handlers;

handlers.h_openClick.body = `var r = await openFileDialog1.ShowDialog();
if (r === 'OK') {
  openBehavior = new OpenTxt();
  state.PhoneNote = openBehavior.OpenFile(openFileDialog1.FileName);
  if (state.PhoneNote.Count == 0)
    state.current = -1;
  else
    state.current = 0;
  state.changed = false;
  await PrintElement();
}`;

handlers.h_saveClick.body = `var r = await saveFileDialog1.ShowDialog();
if (r === 'OK') {
  saveBehavior = new SaveTxt();
  saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);
  state.changed = false;
}`;

handlers.h_openXmlClick.body = `var r = await openFileDialog1.ShowDialog();
if (r === 'OK') {
  openBehavior = new OpenXml();
  state.PhoneNote = openBehavior.OpenFile(openFileDialog1.FileName);
  if (state.PhoneNote.Count == 0)
    state.current = -1;
  else
    state.current = 0;
  state.changed = false;
  await PrintElement();
}`;

handlers.h_saveXmlClick.body = `var r = await saveFileDialog1.ShowDialog();
if (r === 'OK') {
  saveBehavior = new SaveXml();
  saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);
  state.changed = false;
}`;

// 4. Add new handler for "Добавить из файла"
preset.handlers.h_addFromFileClick = {
  label: 'добавитьИзФайлаToolStripMenuItem_Click',
  eventType: 'Click',
  body: `var r = await openFileDialog1.ShowDialog();
if (r === 'OK') {
  var ext = Path.GetExtension(openFileDialog1.FileName).toLowerCase();
  if (ext == ".txt")
    openBehavior = new OpenTxt();
  else if (ext == ".xml")
    openBehavior = new OpenXml();
  else
    return;
  state.PhoneNote = openBehavior.AddFromFile(openFileDialog1.FileName, state.PhoneNote);
  if (state.PhoneNote.Count > 0)
    state.current = state.PhoneNote.Count - 1;
  state.changed = true;
  await PrintElement();
}`
};

// 5. Update formClosing handler to use Strategy (optional, but good for consistency)
handlers.h_formClosing.body = `if (state.changed) {
  var r = await MessageBox.Show("Сохранить изменения?", "Телефонный справочник", "YesNo");
  if (r === DialogResult.Yes) {
    var sr = await saveFileDialog1.ShowDialog();
    if (sr === 'OK') {
      saveBehavior = new SaveTxt();
      saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);
    }
  }
}`;

const json = JSON.stringify(preset, null, 2);
const out = `export const PHONEBOOK_PRESET = ${json};\n`;
fs.writeFileSync(filePath, out);
console.log('Preset updated successfully');
