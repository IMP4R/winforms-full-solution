import fs from 'fs';

const filePath = 'presets/phonebook.js';
const text = fs.readFileSync(filePath, 'utf-8');

const match = text.match(/export const PHONEBOOK_PRESET = (\{[\s\S]*\n\});/);
if (!match) throw new Error('Cannot parse preset');

const preset = JSON.parse(match[1]);

function reorderFormChildren(form, prefix) {
  const children = form.children;
  // Find the index range of the 7 labels + 7 controls
  const labelIds = ['lbl_ln','lbl_n','lbl_pat','lbl_str','lbl_house','lbl_flat','lbl_phone'];
  const controlIds = ['tb_ln','tb_n','tb_pat','tb_str','nud_house','nud_flat','mtb_phone'];
  const fullIds = [...labelIds, ...controlIds].map(s => prefix + s);

  const indices = fullIds.map(id => children.findIndex(c => c.id === id)).filter(i => i !== -1);
  if (indices.length !== 14) {
    console.log(`Form ${form.name}: found only ${indices.length}/14 elements, skipping`);
    return;
  }
  const start = Math.min(...indices);
  const end = Math.max(...indices);
  const chunk = children.splice(start, end - start + 1);

  // Desired order
  const desired = [...labelIds, ...controlIds].map(s => prefix + s);
  const orderMap = Object.fromEntries(desired.map((id, i) => [id, i]));
  chunk.sort((a, b) => (orderMap[a.id] ?? 999) - (orderMap[b.id] ?? 999));

  // Update Y and TabIndex
  const isMain = form.name === 'MainForm';
  if (isMain) {
    const labelY = [50, 85, 120, 155, 190, 225, 225];
    const controlY = [48, 83, 118, 153, 188, 223, 223];
    const tabIds = ['tb_ln','tb_n','tb_pat','tb_str','nud_house','nud_flat','mtb_phone'].map(s => prefix + s);
    chunk.forEach(c => {
      const idx = desired.indexOf(c.id);
      if (idx >= 0 && idx < 7) c.props['Location.Y'] = labelY[idx];
      if (idx >= 7 && idx < 14) c.props['Location.Y'] = controlY[idx - 7];
      if (tabIds.includes(c.id)) c.props['TabIndex'] = tabIds.indexOf(c.id) + 2;
    });
  } else {
    const labelY = [20, 55, 90, 125, 160, 195, 195];
    const controlY = [18, 53, 88, 123, 158, 193, 193];
    const tabIds = ['tb_ln','tb_n','tb_pat','tb_str','nud_house','nud_flat','mtb_phone'].map(s => prefix + s);
    chunk.forEach(c => {
      const idx = desired.indexOf(c.id);
      if (idx >= 0 && idx < 7) c.props['Location.Y'] = labelY[idx];
      if (idx >= 7 && idx < 14) c.props['Location.Y'] = controlY[idx - 7];
      if (tabIds.includes(c.id)) c.props['TabIndex'] = tabIds.indexOf(c.id);
    });
  }

  children.splice(start, 0, ...chunk);
}

for (const form of preset.forms) {
  if (form.name === 'MainForm') reorderFormChildren(form, 'c_');
  if (form.name === 'AddForm') reorderFormChildren(form, 'c_add_');
}

const json = JSON.stringify(preset, null, 2);
const out = `export const PHONEBOOK_PRESET = ${json};\n`;
fs.writeFileSync(filePath, out);
console.log('Preset updated successfully');
