const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'PhoneBook/MainForm.Designer.cs'), 'utf8');

const lines = content.split('\n');
const controls = new Map();

const fieldRegex = /private\s+System\.Windows\.Forms\.(\w+)\s+(\w+);/;
for (const line of lines) {
  const m = line.match(fieldRegex);
  if (m) {
    const type = m[1];
    const name = m[2];
    console.log('Field:', type, name);
    if (type === 'ToolStripMenuItem' || type === 'ToolStripStatusLabel') continue;
    controls.set(name, { type, name });
  }
}

console.log('Controls keys:', Array.from(controls.keys()));

const ControlTypes = {
  OpenFileDialog: { invisible: true },
  SaveFileDialog: { invisible: true }
};

for (const ctrl of controls.values()) {
  console.log('Check invisible:', ctrl.name, ctrl.type, ControlTypes[ctrl.type]?.invisible);
}
