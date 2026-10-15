import fs from 'fs';
import path from 'path';

const filePath = path.resolve('presets/phonebook.js');
const text = fs.readFileSync(filePath, 'utf-8');

// Extract JSON object from export const PHONEBOOK_PRESET = { ... };
const match = text.match(/export const PHONEBOOK_PRESET = (\{[\s\S]*\n\});/);
if (!match) throw new Error('Cannot parse preset');

const preset = JSON.parse(match[1]);

function swapPhoneAndStreet(children) {
  // Find indices of Phone and Street label/control blocks
  // We need to find the block with "id": "c_lbl_phone" and "c_lbl_str"
  const idxPhoneLabel = children.findIndex(c => c.id === 'c_lbl_phone');
  const idxStreetLabel = children.findIndex(c => c.id === 'c_lbl_str');
  const idxPhoneControl = children.findIndex(c => c.id === 'c_mtb_phone');
  const idxStreetControl = children.findIndex(c => c.id === 'c_tb_str');
  const idxHouseLabel = children.findIndex(c => c.id === 'c_lbl_house');
  const idxHouseControl = children.findIndex(c => c.id === 'c_nud_house');
  const idxFlatControl = children.findIndex(c => c.id === 'c_nud_flat');

  if (idxPhoneLabel === -1 || idxStreetLabel === -1 || idxPhoneControl === -1 || idxStreetControl === -1) {
    console.log('Could not find all elements, skipping form');
    return;
  }

  // Swap label blocks
  [children[idxPhoneLabel], children[idxStreetLabel]] = [children[idxStreetLabel], children[idxPhoneLabel]];
  // Swap control blocks
  [children[idxPhoneControl], children[idxStreetControl]] = [children[idxStreetControl], children[idxPhoneControl]];

  // Now reorder: label blocks should be: lblLastName, lblName, lblPatronymic, lblStreet, lblHouse, lblFlat, lblPhone
  // But House/Flat are already after Street in the original. Wait original order was:
  // lblLastName, lblName, lblPatronymic, lblPhone, lblStreet, lblHouse, lblFlat
  // After swapping lblPhone and lblStreet:
  // lblLastName, lblName, lblPatronymic, lblStreet, lblPhone, lblHouse, lblFlat
  // But we want lblStreet, lblHouse, lblFlat, lblPhone.
  // So we need to move lblHouse and lblFlat to be before lblPhone.
  // Let's just rebuild the label order array.

  // Similarly for controls: LastNameTB, NameTB, PatronymicTB, PhoneMTB, StreetTB, HouseNUD, FlatNUD
  // After swap: LastNameTB, NameTB, PatronymicTB, StreetTB, PhoneMTB, HouseNUD, FlatNUD
  // We want: LastNameTB, NameTB, PatronymicTB, StreetTB, HouseNUD, FlatNUD, PhoneMTB
  // So move PhoneMTB after FlatNUD.

  // Simpler: extract the sub-array of labels+controls, reorder, and reinsert.
  // But there are other controls in between (buttons, menustrip, statusstrip).
  // We only want to reorder the field-related children.
  // Let's just find the range from lblLastName to FlatNumericUpDown and reorder within.

  const start = children.findIndex(c => c.id === 'c_lbl_ln');
  const end = children.findIndex(c => c.id === 'c_nud_flat');
  if (start === -1 || end === -1) return;
  const fieldChildren = children.splice(start, end - start + 1);

  // Reorder fieldChildren by desired id order
  const desiredOrder = ['c_lbl_ln','c_lbl_n','c_lbl_pat','c_lbl_str','c_lbl_house','c_lbl_flat','c_lbl_phone',
                        'c_tb_ln','c_tb_n','c_tb_pat','c_tb_str','c_nud_house','c_nud_flat','c_mtb_phone'];
  // Note: for AddForm the ids might differ slightly (e.g., c_mtb_phone exists, c_tb_str etc.)
  // But the ids for AddForm are the same names (e.g., LastNameTextBox etc.)
  // Actually, AddForm ids in preset: let's check. They might be c_tb_ln2 etc. Let's rely on original order.
  // Actually, the preset might reuse the same control names but with different ids? Let's check AddForm ids in preset.

  // Instead, let's just sort fieldChildren by a comparator based on desired Y order.
  // Desired order: LastName label+textbox, Name label+textbox, Patronymic label+textbox,
  // Street label+textbox, House label+nud, Flat label+nud, Phone label+masked.
  const orderMap = {};
  desiredOrder.forEach((id, i) => orderMap[id] = i);

  fieldChildren.sort((a, b) => {
    const ai = orderMap[a.id] ?? 999;
    const bi = orderMap[b.id] ?? 999;
    return ai - bi;
  });

  // Now update Y coordinates to match MainForm.Designer.cs new layout
  // MainForm original Y spacing: labels every 35px (50,85,120,155,190,225)
  // After swap: Street=155, House=190, Flat=190, Phone=225
  // TextBoxes are 2px less than labels (48,83,118,153,188,223)
  // For AddForm, original labels: 20,55,90,125,160,195. Textboxes: 18,53,88,123,158,193.
  // After swap: Street=125, House=160, Flat=160, Phone=195. Textboxes: 123,158,193.

  // Apply Y shifts based on form type
  const isMain = children.some(c => c.id === 'c_ms_main'); // MenuStrip id for MainForm
  // Actually easier: check if any child id starts with c_ms (menustrip)
  const hasMenuStrip = children.some(c => c.type === 'MenuStrip');

  if (hasMenuStrip) {
    // MainForm
    const labelY = [50, 85, 120, 155, 190, 225, 225];
    const controlY = [48, 83, 118, 153, 188, 223, 223];
    // Map id to new Y
    const labelIds = ['c_lbl_ln','c_lbl_n','c_lbl_pat','c_lbl_str','c_lbl_house','c_lbl_flat','c_lbl_phone'];
    const controlIds = ['c_tb_ln','c_tb_n','c_tb_pat','c_tb_str','c_nud_house','c_nud_flat','c_mtb_phone'];
    labelIds.forEach((id, i) => {
      const c = fieldChildren.find(x => x.id === id);
      if (c) c.props['Location.Y'] = labelY[i];
    });
    controlIds.forEach((id, i) => {
      const c = fieldChildren.find(x => x.id === id);
      if (c) c.props['Location.Y'] = controlY[i];
    });
    // Update TabIndex for controls
    const tabIds = ['c_tb_ln','c_tb_n','c_tb_pat','c_tb_str','c_nud_house','c_nud_flat','c_mtb_phone'];
    tabIds.forEach((id, i) => {
      const c = fieldChildren.find(x => x.id === id);
      if (c) c.props['TabIndex'] = i + 2;
    });
  } else {
    // AddForm
    const labelY = [20, 55, 90, 125, 160, 160, 195];
    const controlY = [18, 53, 88, 123, 158, 158, 193];
    const labelIds = ['c_lbl_ln','c_lbl_n','c_lbl_pat','c_lbl_str','c_lbl_house','c_lbl_flat','c_lbl_phone'];
    const controlIds = ['c_tb_ln','c_tb_n','c_tb_pat','c_tb_str','c_nud_house','c_nud_flat','c_mtb_phone'];
    labelIds.forEach((id, i) => {
      const c = fieldChildren.find(x => x.id === id);
      if (c) c.props['Location.Y'] = labelY[i];
    });
    controlIds.forEach((id, i) => {
      const c = fieldChildren.find(x => x.id === id);
      if (c) c.props['Location.Y'] = controlY[i];
    });
    const tabIds = ['c_tb_ln','c_tb_n','c_tb_pat','c_tb_str','c_nud_house','c_nud_flat','c_mtb_phone'];
    tabIds.forEach((id, i) => {
      const c = fieldChildren.find(x => x.id === id);
      if (c) c.props['TabIndex'] = i;
    });
  }

  // Reinsert
  children.splice(start, 0, ...fieldChildren);
}

for (const form of preset.forms) {
  if (form.name === 'MainForm' || form.name === 'AddForm') {
    swapPhoneAndStreet(form.children);
  }
}

const json = JSON.stringify(preset, null, 2);
const out = `export const PHONEBOOK_PRESET = ${json};\n`;
fs.writeFileSync(filePath, out);
console.log('Preset updated');
