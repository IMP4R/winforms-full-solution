import fs from 'fs';

const filePath = 'presets/phonebook.js';
const text = fs.readFileSync(filePath, 'utf-8');

const match = text.match(/export const PHONEBOOK_PRESET = (\{[\s\S]*\n\});/);
if (!match) throw new Error('Cannot parse preset');

const preset = JSON.parse(match[1]);

// 1. Update MainForm fields (ensure saveBehavior/openBehavior exist)
const mainForm = preset.forms.find(f => f.name === 'MainForm');
if (!mainForm.fields.some(f => f.name === 'saveBehavior')) {
  mainForm.fields.push({ type: 'ISave', name: 'saveBehavior' });
}
if (!mainForm.fields.some(f => f.name === 'openBehavior')) {
  mainForm.fields.push({ type: 'IOpen', name: 'openBehavior' });
}

// 2. Add new menu items to MainForm MenuStrip
const menuStrip = mainForm.children.find(c => c.type === 'MenuStrip');
if (menuStrip) {
  const fileMenu = menuStrip.items.find(i => i.Name === 'файлToolStripMenuItem');
  if (fileMenu) {
    const newItems = [
      { Name: 'открытьBinToolStripMenuItem', Text: 'Открыть бинарный файл', events: { Click: 'h_openBinClick' } },
      { Name: 'сохранитьBinToolStripMenuItem', Text: 'Сохранить бинарный файл', events: { Click: 'h_saveBinClick' } },
      { Name: 'открытьJsonToolStripMenuItem', Text: 'Открыть JSON', events: { Click: 'h_openJsonClick' } },
      { Name: 'сохранитьJsonToolStripMenuItem', Text: 'Сохранить JSON', events: { Click: 'h_saveJsonClick' } },
    ];
    for (const it of newItems) {
      if (!fileMenu.items.some(i => i.Name === it.Name)) {
        fileMenu.items.push(it);
      }
    }
  }
}

// 3. Add/Update handlers
const handlers = preset.handlers;

// Update existing open/save handlers to Strategy versions
handlers.h_openClick.body = `var r = await openFileDialog1.ShowDialog();\nif (r === 'OK') {\n  openBehavior = new OpenTxt();\n  state.PhoneNote = openBehavior.OpenFile(openFileDialog1.FileName);\n  if (state.PhoneNote.Count == 0)\n    state.current = -1;\n  else\n    state.current = 0;\n  state.changed = false;\n  await PrintElement();\n}`;

handlers.h_saveClick.body = `var r = await saveFileDialog1.ShowDialog();\nif (r === 'OK') {\n  saveBehavior = new SaveTxt();\n  saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n  state.changed = false;\n}`;

handlers.h_openXmlClick.body = `var r = await openFileDialog1.ShowDialog();\nif (r === 'OK') {\n  openBehavior = new OpenXml();\n  state.PhoneNote = openBehavior.OpenFile(openFileDialog1.FileName);\n  if (state.PhoneNote.Count == 0)\n    state.current = -1;\n  else\n    state.current = 0;\n  state.changed = false;\n  await PrintElement();\n}`;

handlers.h_saveXmlClick.body = `var r = await saveFileDialog1.ShowDialog();\nif (r === 'OK') {\n  saveBehavior = new SaveXml();\n  saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n  state.changed = false;\n}`;

// Update add-from-file handler to support dat/json
handlers.h_addFromFileClick.body = `var r = await openFileDialog1.ShowDialog();\nif (r === 'OK') {\n  var ext = Path.GetExtension(openFileDialog1.FileName).toLowerCase();\n  if (ext == ".txt")\n    openBehavior = new OpenTxt();\n  else if (ext == ".xml")\n    openBehavior = new OpenXml();\n  else if (ext == ".dat")\n    openBehavior = new DeserializeBin();\n  else if (ext == ".json")\n    openBehavior = new DeserializeJson();\n  else\n    return;\n  state.PhoneNote = openBehavior.AddFromFile(openFileDialog1.FileName, state.PhoneNote);\n  if (state.PhoneNote.Count > 0)\n    state.current = state.PhoneNote.Count - 1;\n  state.changed = true;\n  await PrintElement();\n}`;

// New handlers for binary / json
handlers.h_openBinClick = {
  label: 'открытьBinToolStripMenuItem_Click',
  eventType: 'Click',
  body: `var r = await openFileDialog1.ShowDialog();\nif (r === 'OK') {\n  openBehavior = new DeserializeBin();\n  state.PhoneNote = openBehavior.OpenFile(openFileDialog1.FileName);\n  if (state.PhoneNote.Count == 0)\n    state.current = -1;\n  else\n    state.current = 0;\n  state.changed = false;\n  await PrintElement();\n}`
};
handlers.h_saveBinClick = {
  label: 'сохранитьBinToolStripMenuItem_Click',
  eventType: 'Click',
  body: `var r = await saveFileDialog1.ShowDialog();\nif (r === 'OK') {\n  saveBehavior = new SerializeBin();\n  saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n  state.changed = false;\n}`
};
handlers.h_openJsonClick = {
  label: 'открытьJsonToolStripMenuItem_Click',
  eventType: 'Click',
  body: `var r = await openFileDialog1.ShowDialog();\nif (r === 'OK') {\n  openBehavior = new DeserializeJson();\n  state.PhoneNote = openBehavior.OpenFile(openFileDialog1.FileName);\n  if (state.PhoneNote.Count == 0)\n    state.current = -1;\n  else\n    state.current = 0;\n  state.changed = false;\n  await PrintElement();\n}`
};
handlers.h_saveJsonClick = {
  label: 'сохранитьJsonToolStripMenuItem_Click',
  eventType: 'Click',
  body: `var r = await saveFileDialog1.ShowDialog();\nif (r === 'OK') {\n  saveBehavior = new SerializeJson();\n  saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n  state.changed = false;\n}`
};

// Update formClosing handler to use Strategy
handlers.h_formClosing.body = `if (state.changed) {\n  var r = await MessageBox.Show("Сохранить изменения?", "Телефонный справочник", "YesNo");\n  if (r === DialogResult.Yes) {\n    var sr = await saveFileDialog1.ShowDialog();\n    if (sr === 'OK') {\n      saveBehavior = new SaveTxt();\n      saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n    }\n  }\n}`;

// 4. Update dialog filters in preset
for (const ctrl of mainForm.children) {
  if (ctrl.type === 'OpenFileDialog' || ctrl.type === 'SaveFileDialog') {
    ctrl.props.Filter = 'Текстовые файлы (*.txt)|*.txt|XML файлы (*.xml)|*.xml|Бинарные файлы (*.dat)|*.dat|JSON файлы (*.json)|*.json';
  }
}

const json = JSON.stringify(preset, null, 2);
const out = `export const PHONEBOOK_PRESET = ${json};\n`;
fs.writeFileSync(filePath, out);
console.log('Preset updated successfully');
