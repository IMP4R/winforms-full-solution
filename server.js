/**
 * Dev server for WinForms Web Simulator
 * Provides two-way sync between winforms.html and PhoneBook/ C# project
 * API:
 *   GET  /api/project      -> reads PhoneBook/*.cs, parses to IR JSON
 *   POST /api/project      -> receives IR JSON, writes C# files to PhoneBook/
 *   POST /api/save         -> receives { files: {...} }, writes raw files
 *   GET  /api/files        -> returns file mtimes for watch
 *   GET  /api/watch        -> long-poll or SSE for file changes (fallback to polling)
 */
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
// Lazy-load transpilers (ES module from CommonJS)
const transpilersPromise = import('./modules/transpilers.mjs');

const PORT = 8824;
const PROJECT_DIR = path.join(__dirname, process.env.WINFORMS_PROJECT || 'PhoneBook');

/* ================================================================
   PORT MANAGER
   ================================================================ */
const PORTS_FILE = path.join(__dirname, '.ports.json');

async function registerPort() {
  let ports = [];
  try {
    const data = await fs.readFile(PORTS_FILE, 'utf8');
    ports = JSON.parse(data);
  } catch { }
  ports = ports.filter(p => p.dir !== __dirname);
  ports.push({ project: 'WinForms', dir: __dirname, port: PORT, date: new Date().toISOString().split('T')[0] });
  await fs.writeFile(PORTS_FILE, JSON.stringify(ports, null, 2));
}

async function unregisterPort() {
  try {
    const data = await fs.readFile(PORTS_FILE, 'utf8');
    const ports = JSON.parse(data).filter(p => p.dir !== __dirname);
    await fs.writeFile(PORTS_FILE, JSON.stringify(ports, null, 2));
  } catch { }
}

async function checkPortConflict() {
  const { exec } = require('child_process');
  const util = require('util');
  const execAsync = util.promisify(exec);
  try {
    const { stdout } = await execAsync(`lsof -ti:${PORT}`);
    if (stdout.trim()) {
      console.error(`ERROR: Port ${PORT} is already in use by PID ${stdout.trim()}`);
      process.exit(1);
    }
  } catch {
    // Port is free
  }
}

process.on('SIGINT', async () => { await unregisterPort(); process.exit(0); });
process.on('SIGTERM', async () => { await unregisterPort(); process.exit(0); });
process.on('exit', () => { try { unregisterPort(); } catch { } });

/* ================================================================
   HELPERS
   ================================================================ */
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function readFileOrNull(filePath) {
  try { return await fs.readFile(filePath, 'utf8'); } catch { return null; }
}

async function writeFiles(files, dir = PROJECT_DIR) {
  for (const [name, content] of Object.entries(files)) {
    const filePath = path.join(dir, name);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8');
  }
}

async function readdirRecursive(dir, base = '') {
  const result = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const rel = base ? path.join(base, entry.name) : entry.name;
      if (entry.isDirectory()) {
        result.push(...await readdirRecursive(path.join(dir, entry.name), rel));
      } else {
        result.push({ name: rel, fullPath: path.join(dir, entry.name) });
      }
    }
  } catch (e) {}
  return result;
}

async function readProjectFiles(dir = PROJECT_DIR) {
  const files = {};
  try {
    const entries = await readdirRecursive(dir);
    for (const entry of entries) {
      if (entry.name.endsWith('.cs') || entry.name.endsWith('.csproj') || entry.name.endsWith('.resx')) {
        const content = await readFileOrNull(entry.fullPath);
        if (content !== null) files[entry.name] = content;
      }
    }
  } catch (e) {}
  return files;
}

async function getFileStats(dir = PROJECT_DIR) {
  const stats = {};
  try {
    const entries = await readdirRecursive(dir);
    for (const entry of entries) {
      if (entry.name.endsWith('.cs') || entry.name.endsWith('.csproj') || entry.name.endsWith('.resx')) {
        const s = await fs.stat(entry.fullPath);
        stats[entry.name] = s.mtimeMs;
      }
    }
  } catch (e) {}
  return stats;
}

function jsonResponse(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function resolveProjectDir(query = {}) {
  const name = query.project || process.env.WINFORMS_PROJECT || 'PhoneBook';
  return path.join(__dirname, name);
}

/* ================================================================
   C# -> IR PARSER
   ================================================================ */

const ControlTypes = {
  Form:            { cs: 'Form',            defaultSize: [400, 300], invisible: false, canHaveChildren: true },
  Label:           { cs: 'Label',           defaultSize: [100, 23],  invisible: false },
  TextBox:         { cs: 'TextBox',         defaultSize: [120, 23],  invisible: false },
  NumericUpDown:   { cs: 'NumericUpDown',   defaultSize: [80, 23],   invisible: false },
  MaskedTextBox:   { cs: 'MaskedTextBox',   defaultSize: [120, 23],  invisible: false },
  Button:          { cs: 'Button',          defaultSize: [80, 28],   invisible: false },
  CheckBox:        { cs: 'CheckBox',        defaultSize: [120, 24],  invisible: false },
  RadioButton:     { cs: 'RadioButton',     defaultSize: [120, 24],  invisible: false },
  ComboBox:        { cs: 'ComboBox',        defaultSize: [120, 24],  invisible: false },
  ListBox:         { cs: 'ListBox',         defaultSize: [120, 96],  invisible: false },
  GroupBox:        { cs: 'GroupBox',        defaultSize: [200, 120], invisible: false, canHaveChildren: true },
  Panel:           { cs: 'Panel',           defaultSize: [200, 120], invisible: false, canHaveChildren: true },
  DateTimePicker:  { cs: 'DateTimePicker',  defaultSize: [120, 23],  invisible: false },
  ProgressBar:     { cs: 'ProgressBar',     defaultSize: [120, 23],  invisible: false },
  PictureBox:      { cs: 'PictureBox',      defaultSize: [100, 100], invisible: false },
  CheckedListBox:  { cs: 'CheckedListBox',  defaultSize: [120, 96],  invisible: false },
  RichTextBox:     { cs: 'RichTextBox',     defaultSize: [120, 96],  invisible: false },
  TreeView:        { cs: 'TreeView',        defaultSize: [120, 96],  invisible: false },
  DataGridView:    { cs: 'DataGridView',    defaultSize: [240, 150], invisible: false },
  TabControl:      { cs: 'TabControl',      defaultSize: [300, 200], invisible: false, canHaveChildren: true },
  TabPage:         { cs: 'TabPage',         defaultSize: [0, 0],     invisible: false, canHaveChildren: true },
  MenuStrip:       { cs: 'MenuStrip',       defaultSize: [0, 24],    invisible: false, dock: 'Top' },
  StatusStrip:     { cs: 'StatusStrip',     defaultSize: [0, 22],    invisible: false, dock: 'Bottom' },
  OpenFileDialog:  { cs: 'OpenFileDialog',  defaultSize: [0, 0],     invisible: true },
  SaveFileDialog:  { cs: 'SaveFileDialog',  defaultSize: [0, 0],     invisible: true },
};

// Extract all methods from C# source using brace counting
function dedentBlock(block) {
  const lines = block.split('\n');
  const nonEmpty = lines.filter(l => l.trim());
  if (!nonEmpty.length) return block;
  const indents = nonEmpty.map(l => l.match(/^(\s*)/)[1].length);
  const min = Math.min(...indents);
  const dedented = lines.map(l => l.slice(min));
  // Trim leading/trailing blank lines and collapse multiple blanks to one
  while (dedented.length && !dedented[0].trim()) dedented.shift();
  while (dedented.length && !dedented[dedented.length - 1].trim()) dedented.pop();
  const collapsed = [];
  for (const line of dedented) {
    if (!line.trim() && collapsed.length && !collapsed[collapsed.length - 1].trim()) continue;
    collapsed.push(line);
  }
  return collapsed.join('\n');
}

function extractMethods(content) {
  const methods = [];
  // Regular methods with body: public void Save(...) {
  const regex = /\b(private|public|protected|internal)\s+(override\s+)?(\S+)(?:\s+([^\s(]+))?\s*\(([^)]*)\)\s*\{/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const startBrace = content.indexOf('{', m.index);
    const body = extractBracedBlock(content, startBrace);
    if (body !== null) {
      methods.push({
        access: m[1],
        returnType: m[3],
        name: m[4] || m[3],
        params: m[5].trim(),
        body: dedentBlock(body),
        override: !!m[2]
      });
    }
  }
  // Interface methods without body: void Save(...);
  // More restrictive: avoid matching keywords and expressions like 'new FileStream(...)'
  const interfaceRegex = /\b(?!new\b|return\b|if\b|for\b|while\b|throw\b|catch\b|using\b)([A-Za-z_][A-Za-z0-9_<>]*)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)\s*;/g;
  let im;
  while ((im = interfaceRegex.exec(content)) !== null) {
    const returnType = im[1];
    const name = im[2];
    // Skip if already found as regular method
    if (methods.some(mm => mm.name === name)) continue;
    methods.push({
      access: 'public',
      returnType: returnType,
      name: name,
      params: im[3].trim(),
      body: '',  // no body for interface methods
      override: false
    });
  }
  return methods;
}

function extractBracedBlock(content, startIndex) {
  let depth = 0;
  let inString = false;
  let stringChar = null;
  let started = false;
  let result = '';
  for (let i = startIndex; i < content.length; i++) {
    const ch = content[i];
    const prev = content[i - 1] || '';
    if (inString) {
      result += ch;
      if (ch === stringChar && prev !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true; stringChar = ch; result += ch; continue;
    }
    if (ch === '{') {
      depth++;
      if (depth === 1) { started = true; continue; }
      else result += ch;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && started) return result;
      if (started) result += ch;
    } else if (started) {
      result += ch;
    }
  }
  return null;
}

async function parseClassesCs(content) {
  const { transpileCsToJs } = await transpilersPromise;
  const classes = [];
  const classRegex = /public\s+(?:partial\s+)?(?:class|interface)\s+(\w+)\s*(?::\s*([^{]+))?\s*\{/g;
  let m;
  while ((m = classRegex.exec(content)) !== null) {
    const className = m[1];
    const implementsStr = m[2] ? m[2].trim() : '';
    const start = m.index;
    const end = content.indexOf('public class', start + 1);
    const nextInterface = content.indexOf('public interface', start + 1);
    const classBody = end > 0 ? content.slice(start, end) : (nextInterface > 0 ? content.slice(start, nextInterface) : content.slice(start));
    const fields = [];
    const fieldRegex = /public\s+(\S+)\s+(\w+);/g;
    let fm;
    while ((fm = fieldRegex.exec(classBody)) !== null) {
      fields.push({ type: fm[1], name: fm[2] });
    }
    // Auto-properties: public Type Name { get; set; } [= ...];
    const propRegex = /public\s+(\S+(?:<[^>]+>)?)\s+(\w+)\s*\{\s*get;\s*set;[^}]*\}/g;
    let pm;
    while ((pm = propRegex.exec(classBody)) !== null) {
      if (!fields.some(f => f.name === pm[2])) {
        fields.push({ type: pm[1], name: pm[2] });
      }
    }
    const methods = extractMethods(classBody)
      .filter(m => m.name !== className)
      .map(m => ({ returnType: m.returnType, name: m.name, params: m.params, body: transpileCsToJs(m.body, [], []), override: m.override }));
    // Parse attributes like [Serializable] before class declaration
    const attributes = [];
    const attrRegex = /\[(\w+(?:\([^)]*\))?)\]/g;
    const beforeClass = content.slice(Math.max(0, start - 500), start);
    let am;
    while ((am = attrRegex.exec(beforeClass)) !== null) {
      attributes.push(am[1]);
    }
    classes.push({ name: className, implements: implementsStr, fields, methods, attributes });
  }
  return classes;
}

function parseDesignerCs(content, formName) {
  const lines = content.split('\n');
  let inInit = false;
  let depth = 0;
  const controls = new Map();
  const children = [];
  let formProps = {
    Name: formName, Text: formName, FormBorderStyle: 'Sizable', StartPosition: 'WindowsDefaultLocation',
    'Size.Width': 520, 'Size.Height': 360, 'Location.X': 0, 'Location.Y': 0,
    TabIndex: 0, Enabled: true, Visible: true, 'Font.Size': 9, 'Font.Bold': false, 'Font.Family': 'Segoe UI'
  };

  // Pre-scan field declarations (supports Cyrillic and other Unicode identifiers)
  const fieldRegex = /private\s+System\.Windows\.Forms\.([^\s;]+)\s+([^\s;]+);/;
  for (const line of lines) {
    const m = line.match(fieldRegex);
    if (m) {
      const type = m[1];
      const name = m[2];
      // Heuristic: MenuStrip items are ToolStripMenuItem, StatusStrip items are ToolStripStatusLabel
      // Skip sub-items, we'll handle them later via items arrays
      // Map CS type to our IR type
      let irType = Object.keys(ControlTypes).find(k => ControlTypes[k].cs === type);
      if (!irType) irType = type;
      // MenuStrip/StatusStrip sub-items are not top-level children, but we keep them
      // in the controls map so that event handlers can be parsed.
      if (type === 'ToolStripMenuItem' || type === 'ToolStripStatusLabel') {
        controls.set(name, {
          id: 'c_' + Math.random().toString(36).slice(2, 8),
          name,
          type: irType,
          props: { Name: name },
          events: {},
          items: undefined,
          _isSubItem: true
        });
      } else {
        controls.set(name, {
          id: 'c_' + Math.random().toString(36).slice(2, 8),
          name,
          type: irType,
          props: { Name: name },
          events: {},
          items: (irType === 'MenuStrip' || irType === 'StatusStrip') ? [] : undefined,
          children: (ControlTypes[irType]?.canHaveChildren || irType === 'MenuStrip') ? [] : undefined
        });
      }
    }
  }

  // Scan InitializeComponent line by line
  for (const line of lines) {
    const t = line.trim();
    if (t.includes('private void InitializeComponent()')) { inInit = true; depth = 0; continue; }
    if (!inInit) continue;

    const open = (t.match(/\{/g) || []).length;
    const close = (t.match(/\}/g) || []).length;
    depth += open - close;
    if (depth <= 0 && t === '}') { inInit = false; continue; }

    // Allocation: this.X = new System.Windows.Forms.Y();
    const alloc = t.match(/this\.(\w+)\s*=\s*new\s+System\.Windows\.Forms\.(\w+)\(\);/);
    if (alloc) {
      const [, name, csType] = alloc;
      // allocation parsed
      let irType = Object.keys(ControlTypes).find(k => ControlTypes[k].cs === csType);
      if (!irType) irType = csType;
      if (!controls.has(name)) {
        controls.set(name, {
          id: 'c_' + Math.random().toString(36).slice(2, 8),
          name,
          type: irType,
          props: { Name: name },
          events: {},
          items: (irType === 'MenuStrip' || irType === 'StatusStrip') ? [] : undefined,
          children: (ControlTypes[irType]?.canHaveChildren || irType === 'MenuStrip') ? [] : undefined
        });
      }
      continue;
    }

    // Form-level property (this.Text = ..., this.ClientSize = ...)
    const formProp = t.match(/this\.(Text|ClientSize|Name|FormBorderStyle|StartPosition|AutoSize|AutoSizeMode)\s*=\s*(.+);/);
    if (formProp) {
      const [, propName, value] = formProp;
      if (propName === 'Text') {
        const tm = value.match(/"([^"]*)"/); if (tm) formProps.Text = tm[1];
      } else if (propName === 'ClientSize' || propName === 'Size') {
        const sm = value.match(/Size\((\d+),\s*(\d+)\)/);
        if (sm) { formProps['Size.Width'] = parseInt(sm[1]); formProps['Size.Height'] = parseInt(sm[2]); }
      } else if (propName === 'Name') {
        const nm = value.match(/"([^"]*)"/); if (nm) formProps.Name = nm[1];
      } else if (propName === 'FormBorderStyle') {
        const fm = value.match(/FormBorderStyle\.(\w+)/); if (fm) formProps.FormBorderStyle = fm[1];
      } else if (propName === 'StartPosition') {
        const sp = value.match(/FormStartPosition\.(\w+)/); if (sp) formProps.StartPosition = sp[1];
      } else if (propName === 'AutoSize') {
        formProps.AutoSize = value === 'true';
      } else if (propName === 'AutoSizeMode') {
        const am = value.match(/AutoSizeMode\.(\w+)/); if (am) formProps.AutoSizeMode = am[1];
      }
      continue;
    }

    // Control property assignment
    const prop = t.match(/this\.([^\s.;=()]+)\.([^\s.;=()]+)\s*=\s*(.+);/);
    if (prop) {
      const [, ctrlName, propName, value] = prop;
      const ctrl = controls.get(ctrlName);
      if (!ctrl) {
        continue;
      }

      if (propName === 'Location') {
        const lm = value.match(/Point\((\d+),\s*(\d+)\)/);
        if (lm) { ctrl.props['Location.X'] = parseInt(lm[1]); ctrl.props['Location.Y'] = parseInt(lm[2]); }
      } else if (propName === 'Size') {
        const sm = value.match(/Size\((\d+),\s*(\d+)\)/);
        if (sm) { ctrl.props['Size.Width'] = parseInt(sm[1]); ctrl.props['Size.Height'] = parseInt(sm[2]); }
      } else if (propName === 'Text') {
        const tm = value.match(/"([^"]*)"/); ctrl.props.Text = tm ? tm[1] : value;
      } else if (propName === 'Name') {
        ctrl.props.Name = value.replace(/"/g, '');
      } else if (propName === 'Enabled' && value === 'false') {
        ctrl.props.Enabled = false;
      } else if (propName === 'TabIndex') {
        ctrl.props.TabIndex = parseInt(value);
      } else if (propName === 'Font') {
        const fm = value.match(/Font\("([^"]+)",\s*([\d.]+)F/);
        if (fm) { ctrl.props['Font.Family'] = fm[1]; ctrl.props['Font.Size'] = parseFloat(fm[2]); }
        if (value.includes('FontStyle.Bold')) ctrl.props['Font.Bold'] = true;
      } else if (propName === 'Maximum') {
        const mm = value.match(/new\s+int\[\]\s*\{\s*(\d+)/); if (mm) ctrl.props.Maximum = parseInt(mm[1]);
      } else if (propName === 'Minimum') {
        const mm = value.match(/new\s+int\[\]\s*\{\s*(\d+)/); if (mm) ctrl.props.Minimum = parseInt(mm[1]);
      } else if (propName === 'Value') {
        const vm = value.match(/new\s+int\[\]\s*\{\s*(\d+)/); if (vm) ctrl.props.Value = parseInt(vm[1]);
      } else if (propName === 'Mask') {
        const mm = value.match(/"([^"]*)"/); if (mm) ctrl.props.Mask = mm[1];
      } else if (propName === 'MaxLength') {
        ctrl.props.MaxLength = parseInt(value);
      } else if (propName === 'Dock') {
        const dm = value.match(/DockStyle\.(\w+)/); if (dm) ctrl.props.Dock = dm[1];
      } else if (propName === 'Anchor') {
        const am = value.match(/AnchorStyles\.([\w\s|]+)/);
        if (am) {
          const parts = am[1].split('|').map(s => s.trim().replace('AnchorStyles.', ''));
          ctrl.props.Anchor = parts.join(', ');
        }
      } else if (propName === 'BorderStyle') {
        const bm = value.match(/Border3DStyle\.(\w+)/); if (bm) ctrl.props.BorderStyle = bm[1];
      } else if (propName === 'BorderSides') {
        const bsm = value.match(/ToolStripStatusLabelBorderSides\.(\w+)/); if (bsm) ctrl.props.BorderSides = bsm[1];
      } else if (propName === 'AutoScroll') {
        ctrl.props.AutoScroll = value === 'true';
      } else if (propName === 'ReadOnly') {
        ctrl.props.ReadOnly = value === 'true';
      } else if (propName === 'Multiline') {
        ctrl.props.Multiline = value === 'true';
      } else if (propName === 'ScrollBars') {
        const sm = value.match(/ScrollBars\.(\w+)/); if (sm) ctrl.props.ScrollBars = sm[1];
      } else if (propName === 'Filter') {
        const fm = value.match(/"([^"]*)"/); if (fm) ctrl.props.Filter = fm[1];
      } else if (propName === 'Checked') {
        ctrl.props.Checked = value === 'true';
      } else if (propName === 'AutoSize') {
        ctrl.props.AutoSize = value === 'true';
      } else if (propName === 'AutoSizeMode') {
        const amm = value.match(/AutoSizeMode\.(\w+)/); if (amm) ctrl.props.AutoSizeMode = amm[1];
      } else if (propName === 'Margin') {
        const mm = value.match(/new\s+Padding\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/);
        if (mm) {
          ctrl.props.Margin = `${mm[1]}, ${mm[2]}, ${mm[3]}, ${mm[4]}`;
        }
      } else if (propName === 'Padding') {
        const pm = value.match(/new\s+Padding\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/);
        if (pm) {
          ctrl.props.Padding = `${pm[1]}, ${pm[2]}, ${pm[3]}, ${pm[4]}`;
        }
      } else if (propName === 'Items') {
        // Items.AddRange — handled separately by adapter logic if needed
      }
      continue;
    }

    // Event handler
    const ev = t.match(/this\.(\w+)\.(\w+)\s*\+=\s*new\s+System\.EventHandler\(this\.(\w+)\);/);
    if (ev) {
      const ctrl = controls.get(ev[1]);
      if (ctrl) { ctrl.events = ctrl.events || {}; ctrl.events[ev[2]] = ev[3]; }
      continue;
    }

    // Controls.Add (top-level or nested container)
    const add = t.match(/this(?:\.(\w+))?\.Controls\.Add\(this\.(\w+)\);/);
    if (add) {
      const [, parentName, childName] = add;
      const ctrl = controls.get(childName);
      if (!ctrl) continue;
      if (!parentName) {
        children.push(ctrl);
      } else {
        const parentCtrl = controls.get(parentName);
        if (parentCtrl) {
          parentCtrl.children = parentCtrl.children || [];
          parentCtrl.children.push(ctrl);
        } else {
          children.push(ctrl); // fallback to top-level
        }
      }
    }

    // MainMenuStrip
    const mainMenu = t.match(/this\.MainMenuStrip\s*=\s*this\.(\w+);/);
    if (mainMenu) {
      // Already handled by controls list
    }
  }

  // Add invisible controls (dialogs) to children even though not in Controls.Add
  for (const ctrl of controls.values()) {
    if (ControlTypes[ctrl.type]?.invisible) {
      if (!children.includes(ctrl)) children.push(ctrl);
    }
  }

  // Build MenuStrip / StatusStrip items hierarchy
  for (const line of lines) {
    const t = line.trim();
    // this.parent.DropDownItems.AddRange(new ... { this.child1, this.child2 })
    const dd = t.match(/this\.([^\s.]+)\.DropDownItems\.AddRange\(new\s+[^}]*\{\s*([^}]+)\s*\}\);/);
    if (dd) {
      const parentName = dd[1];
      const parentCtrl = controls.get(parentName);
      if (parentCtrl) {
        const names = dd[2].split(',').map(s => s.trim().replace('this.', ''));
        parentCtrl.items = names.map(n => {
          const c = controls.get(n);
          return c ? { ...c.props, Name: c.props.Name, Text: c.props.Text || '', events: c.events || {}, items: c.items || undefined } : { Name: n, Text: '' };
        });
      }
      continue;
    }
  }
  for (const line of lines) {
    const t = line.trim();
    const itemsAdd = t.match(/this\.([^\s.]+)\.Items\.AddRange\(new\s+[^}]*\{\s*([^}]+)\s*\}\);/);
    if (itemsAdd) {
      const parentName = itemsAdd[1];
      const parentCtrl = controls.get(parentName);
      if (parentCtrl && (parentCtrl.type === 'MenuStrip' || parentCtrl.type === 'StatusStrip')) {
        const names = itemsAdd[2].split(',').map(s => s.trim().replace('this.', ''));
        parentCtrl.items = names.map(n => {
          const c = controls.get(n);
          return c ? { ...c.props, Name: c.props.Name, Text: c.props.Text || '', events: c.events || {}, items: c.items || undefined } : { Name: n, Text: '' };
        });
      }
    }
  }

  // Default props for missing values
  for (const ctrl of controls.values()) {
    const td = ControlTypes[ctrl.type] || { defaultSize: [100, 23] };
    if (ctrl.props['Location.X'] === undefined) ctrl.props['Location.X'] = 10;
    if (ctrl.props['Location.Y'] === undefined) ctrl.props['Location.Y'] = 10;
    if (ctrl.props['Size.Width'] === undefined) ctrl.props['Size.Width'] = td.defaultSize[0];
    if (ctrl.props['Size.Height'] === undefined) ctrl.props['Size.Height'] = td.defaultSize[1];
    if (ctrl.props.Enabled === undefined) ctrl.props.Enabled = true;
    if (ctrl.props.Visible === undefined) ctrl.props.Visible = true;
    if (ctrl.props.TabIndex === undefined) ctrl.props.TabIndex = 0;
    if (ctrl.props['Font.Size'] === undefined) ctrl.props['Font.Size'] = 9;
    if (ctrl.props['Font.Bold'] === undefined) ctrl.props['Font.Bold'] = false;
    if (ctrl.props['Font.Family'] === undefined) ctrl.props['Font.Family'] = 'Segoe UI';
  }

  return { controls: Array.from(controls.values()), children, formProps };
}

function findControlByName(form, name) {
  function visit(node) {
    if (node.props?.Name === name || node.Name === name) return node;
    if (node.items) {
      const stack = [...node.items];
      while (stack.length) {
        const it = stack.pop();
        if (it.Name === name) return it;
        if (it.items) stack.push(...it.items);
      }
    }
    if (node.children) {
      for (const child of node.children) {
        const found = visit(child);
        if (found) return found;
      }
    }
    return null;
  }
  for (const ctrl of form.children) {
    const found = visit(ctrl);
    if (found) return found;
  }
  return null;
}

async function parseFormCsToIR(content, form, ir) {
  const { transpileCsToJs } = await transpilersPromise;
  const methods = extractMethods(content);
  const fieldNames = [];
  const controlNames = Array.from(new Set(form.children.map(c => c.props.Name)));

  // Parse fields (including inline initializers for defense-in-depth round-trip)
  for (const line of content.split('\n')) {
    const fm = line.match(/private\s+(\S+(?:<[^>]+>)?)\s+(\w+)(?:\s*=\s*([^;]+))?;/);
    if (fm) {
      const field = { type: fm[1], name: fm[2] };
      if (fm[3] && !field.init) {
        field.init = transpileCsToJs(fm[3].trim(), fieldNames, controlNames);
      }
      form.fields.push(field);
      fieldNames.push(fm[2]);
    }
    const pfm = line.match(/public\s+(\S+(?:<[^>]+>)?)\s+(\w+)(?:\s*=\s*([^;]+))?;/);
    if (pfm) {
      const pf = { type: pfm[1], name: pfm[2] };
      if (pfm[3] && !pf.init) {
        pf.init = transpileCsToJs(pfm[3].trim(), fieldNames, controlNames);
      }
      form.publicFields.push(pf);
      fieldNames.push(pfm[2]);
    }
  }

  // Constructor params (extractMethods now captures constructors, but keep body parsing)
  const ctorRegex = new RegExp(`public\\s+${form.name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\s*\\(([^)]*)\\)\\s*\\{`);
  const ctorMatch = content.match(ctorRegex);
  if (ctorMatch) {
    // Parse constructor body for field initializations
    // Find the constructor body by matching braces
    const ctorStart = content.indexOf('{', content.indexOf(ctorMatch[0]));
    if (ctorStart >= 0) {
      let braceDepth = 0;
      let ctorBody = '';
      let inString = false;
      let stringChar = null;
      for (let i = ctorStart; i < content.length; i++) {
        const ch = content[i];
        if (inString) {
          ctorBody += ch;
          if (ch === stringChar && content[i-1] !== '\\') inString = false;
          continue;
        }
        if (ch === '"' || ch === "'") {
          inString = true; stringChar = ch; ctorBody += ch; continue;
        }
        if (ch === '{') { braceDepth++; if (braceDepth === 1) continue; }
        if (ch === '}') { braceDepth--; if (braceDepth === 0) break; }
        ctorBody += ch;
      }
      // Parse assignments like "PhoneNote = new List<Note>();" or "current = -1;"
      const assignRegex = /(\w+)\s*=\s*([^;]+);/g;
      let am;
      while ((am = assignRegex.exec(ctorBody)) !== null) {
        const varName = am[1];
        const initExpr = am[2].trim();
        const field = form.fields.find(f => f.name === varName);
        if (field && !field.init) {
          field.init = transpileCsToJs(initExpr, fieldNames, controlNames);
        }
      }
    }
  }
  // Fallback to extractMethods if it somehow captured it
  if (!form.constructorParam) {
    const ctor = methods.find(m => m.name === form.name && m.params);
    if (ctor && ctor.params) {
      const params = [];
      const re = /(\S+)\s+_(\w+)/g;
      let m;
      while ((m = re.exec(ctor.params)) !== null) {
        params.push({ type: m[1], name: m[2] });
      }
      if (params.length === 1) {
        form.constructorParam = params[0];
      } else if (params.length > 1) {
        form.constructorParam = params;
      }
    }
  }

  // Helper methods & handlers
  for (const m of methods) {
    if (m.name === form.name) continue; // constructor skip
    if (m.returnType === 'void' && m.params === '') {
      // Helper method
      form.helperMethods.push({
        name: m.name,
        returnType: 'void',
        params: '',
        body: transpileCsToJs(m.body, fieldNames, controlNames)
      });
    } else if (m.params.startsWith('object sender, ') && m.params.endsWith('EventArgs e')) {
      // Event handler (matches EventArgs, FormClosingEventArgs, etc.)
      const parts = m.name.split('_');
      if (parts.length >= 2) {
        const eventName = parts.pop();
        const controlName = parts.join('_');
        // Find control (including MenuStrip/StatusStrip sub-items)
        const ctrl = findControlByName(form, controlName);
        if (ctrl) {
          const handlerId = 'h_' + Math.random().toString(36).slice(2, 8);
          ctrl.events = ctrl.events || {};
          ctrl.events[eventName] = handlerId;
          ir.handlers[handlerId] = {
            label: m.name,
            eventType: eventName,
            body: transpileCsToJs(m.body, fieldNames, controlNames)
          };
        } else if (controlName === form.name) {
          const handlerId = 'h_' + Math.random().toString(36).slice(2, 8);
          form.events = form.events || {};
          form.events[eventName] = handlerId;
          ir.handlers[handlerId] = {
            label: m.name,
            eventType: eventName,
            body: transpileCsToJs(m.body, fieldNames, controlNames)
          };
        }
      }
    }
  }
}

async function parseProjectToIR(dir = PROJECT_DIR) {
  const files = await readProjectFiles(dir);
  if (Object.keys(files).length === 0) return null;

  const csprojName = Object.keys(files).find(f => f.endsWith('.csproj')) || 'PhoneBook.csproj';
  const csproj = files[csprojName] || '';
  const projectName = (csproj.match(/<AssemblyName>([^<]+)<\/AssemblyName>/) || ['', csprojName.replace('.csproj', '')])[1];
  const namespace = (csproj.match(/<RootNamespace>([^<]+)<\/RootNamespace>/) || ['', projectName])[1];

  const ir = {
    projectName,
    namespace,
    startupForm: null,
    forms: [],
    classes: [],
    handlers: {}
  };

  // Discover forms (all .cs files except Note, Program)
  const csFiles = Object.keys(files).filter(f =>
    f.endsWith('.cs') &&
    !f.endsWith('.Designer.cs') &&
    f !== 'Program.cs'
  );

  const nonFormContents = [];
  for (const formFile of csFiles) {
    const formName = formFile.replace('.cs', '');
    const formCs = files[formFile] || '';

    // Skip non-form classes (e.g. IComparer implementations)
    if (!formCs.includes(`public partial class ${formName} : Form`)) {
      nonFormContents.push(formCs);
      continue;
    }

    const designerFile = formFile.replace('.cs', '.Designer.cs');
    const designerCs = files[designerFile] || '';

    const { controls, children, formProps } = parseDesignerCs(designerCs, formName);

    const form = {
      id: 'f_' + Math.random().toString(36).slice(2, 8),
      name: formName,
      type: 'Form',
      isMain: formName === 'MainForm',
      props: formProps,
      children,
      fields: [],
      events: {},
      helperMethods: [],
      publicFields: [],
      constructorParam: null
    };

    // Add default props for form
    if (!form.props['Size.Width']) form.props['Size.Width'] = 520;
    if (!form.props['Size.Height']) form.props['Size.Height'] = 360;
    if (!form.props.FormBorderStyle) form.props.FormBorderStyle = 'Sizable';
    if (!form.props.StartPosition) form.props.StartPosition = 'WindowsDefaultLocation';

    await parseFormCsToIR(formCs, form, ir);

    ir.forms.push(form);
    if (form.isMain) ir.startupForm = formName;
  }

  if (!ir.startupForm && ir.forms.length > 0) ir.startupForm = ir.forms[0].name;

  // Parse non-form classes (Note, IComparer implementations, etc.)
  for (const content of nonFormContents) {
    const parsedClasses = await parseClassesCs(content);
    for (const cls of parsedClasses) {
      // Merge with existing if same name (deduplicate)
      const existing = ir.classes.find(c => c.name === cls.name);
      if (existing) {
        if (cls.implements) existing.implements = cls.implements;
        if (cls.methods?.length) existing.methods = cls.methods;
        if (cls.fields?.length) existing.fields = cls.fields;
      } else {
        ir.classes.push(cls);
      }
    }
  }

  // Merge with .winforms.json if it exists (preserves fields init, publicFields, constructorParam)
  const winformsPath = path.join(dir, '.winforms.json');
  try {
    const winformsJson = await fs.readFile(winformsPath, 'utf8');
    const winformsIR = JSON.parse(winformsJson);
    for (const form of ir.forms) {
      const wf = winformsIR.forms?.find(f => f.name === form.name);
      if (!wf) continue;
      if (wf.fields) {
        // Merge: preserve init from .winforms.json, add new fields discovered in C#
        const wfMap = Object.fromEntries((wf.fields || []).map(f => [f.name, f]));
        const merged = [];
        for (const f of form.fields || []) {
          if (wfMap[f.name]) {
            merged.push({ ...f, init: wfMap[f.name].init });
          } else {
            merged.push(f);
          }
        }
        // Append any fields in .winforms.json that are not in C# (shouldn't happen, but safe)
        for (const f of wf.fields || []) {
          if (!merged.some(m => m.name === f.name)) merged.push(f);
        }
        form.fields = merged;
      }
      if (wf.publicFields) form.publicFields = wf.publicFields;
      if (wf.constructorParam) form.constructorParam = wf.constructorParam;
      // Font merge DISABLED - .Designer.cs is the single source of truth for fonts
      // (prevents Bold/Regular oscillation between .winforms.json and .Designer.cs)
      // Merge MenuStrip/StatusStrip items to preserve Text through round-trip
      if (wf.children) {
        for (const ctrl of form.children || []) {
          if (ctrl.type === 'MenuStrip' || ctrl.type === 'StatusStrip') {
            const wfCtrl = wf.children.find(c => c.name === ctrl.name && c.type === ctrl.type);
            if (wfCtrl && wfCtrl.items && ctrl.items) {
              const mergeItems = (items, wfItems) => {
                for (const item of items) {
                  const wfItem = wfItems.find(wi => wi.Name === item.Name);
                  if (wfItem) {
                    if ((!item.Text || item.Text === '') && wfItem.Text) {
                      item.Text = wfItem.Text;
                    }
                    if (item.items && wfItem.items) {
                      mergeItems(item.items, wfItem.items);
                    }
                  }
                }
              };
              mergeItems(ctrl.items, wfCtrl.items);
            }
          }
        }
      }
    }
  } catch (e) {
    // .winforms.json missing or corrupt — continue with pure C# parse
  }

  return ir;
}

/* ================================================================
   IR -> C# GENERATORS — imported from modules/exporter.js
   ================================================================ */

let _exporter = null;
async function getExporter() {
  if (!_exporter) {
    _exporter = await import('./modules/exporter.js');
  }
  return _exporter;
}

async function writeProjectFromIR(ir, dir = PROJECT_DIR) {
  try {
    const exporter = await getExporter();
    const { generateCsproj, generateProgram, generateDataClass, generateFormCs, generateFormDesignerCs, generateResx } = exporter;
    const files = {};
    // Preserve existing .csproj (so NuGet packages aren't lost on round-trip)
    const csprojName = `${ir.projectName}.csproj`;
    const existingCsproj = await readFileOrNull(path.join(dir, csprojName));
    if (!existingCsproj) {
      files[csprojName] = generateCsproj(ir);
    }
    files['Program.cs'] = generateProgram(ir);

    const existingEntries = await readdirRecursive(dir);
    for (const cls of ir.classes || []) {
      const fileName = `${cls.name}.cs`;
      const alreadyExists = existingEntries.some(e => e.name === fileName || e.name.endsWith(`/${fileName}`));
      if (!alreadyExists) {
        files[fileName] = generateDataClass(cls, ir);
      }
    }

    for (const form of ir.forms || []) {
      files[`${form.name}.cs`] = generateFormCs(form, ir);
      files[`${form.name}.Designer.cs`] = generateFormDesignerCs(form, ir);
      files[`${form.name}.resx`] = generateResx();
    }

    await writeFiles(files, dir);

    // Auto-format generated C# files with dotnet-format (if installed)
    try {
      const { execSync } = require('child_process');
      const csFiles = Object.keys(files).filter(f => f.endsWith('.cs'));
      if (csFiles.length > 0) {
        execSync(`dotnet format --include ${csFiles.join(' ')}`, { cwd: dir, stdio: 'ignore' });
      }
    } catch (_) {
      // dotnet-format not installed — ignore
    }
  } catch (e) {
    console.error('writeProjectFromIR error:', e.message, e.stack);
    throw e;
  }
}



/* ================================================================
   HTTP SERVER
   ================================================================ */

const server = http.createServer(async (req, res) => {
  setCORS(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsed = url.parse(req.url, true);

  // API: POST /api/save -> write raw files to project dir
  if (parsed.pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        await writeFiles(data.files || {}, resolveProjectDir(parsed.query));
        jsonResponse(res, { ok: true });
      } catch (e) {
        jsonResponse(res, { error: e.message }, 500);
      }
    });
    return;
  }

  // API: POST /api/project -> write IR as C# files
  if (parsed.pathname === '/api/project' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const ir = JSON.parse(body);
        await writeProjectFromIR(ir, resolveProjectDir(parsed.query));
        jsonResponse(res, { ok: true });
      } catch (e) {
        jsonResponse(res, { error: e.message }, 500);
      }
    });
    return;
  }

  // API: GET /api/project -> read C# files, parse to IR
  if (parsed.pathname === '/api/project' && req.method === 'GET') {
    try {
      const ir = await parseProjectToIR(resolveProjectDir(parsed.query));
      if (ir) {
        jsonResponse(res, ir);
      } else {
        jsonResponse(res, { empty: true }, 404);
      }
    } catch (e) {
      jsonResponse(res, { error: e.message }, 500);
    }
    return;
  }

  // API: GET /api/files -> file mtimes for watch
  if (parsed.pathname === '/api/files' && req.method === 'GET') {
    try {
      const stats = await getFileStats(resolveProjectDir(parsed.query));
      jsonResponse(res, stats);
    } catch (e) {
      jsonResponse(res, { error: e.message }, 500);
    }
    return;
  }

  // Static file serving
  let reqPath = parsed.pathname === '/' ? '/winforms.html' : parsed.pathname;
  // Security: prevent path traversal
  reqPath = path.normalize(reqPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(__dirname, reqPath);

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.cs': 'text/plain',
    '.csproj': 'text/plain',
    '.resx': 'text/plain'
  };

  try {
    const data = await fs.readFile(filePath);
    const headers = { 'Content-Type': mimeTypes[ext] || 'application/octet-stream', 'Content-Length': data.length };
    if (ext === '.js' || ext === '.mjs' || ext === '.html' || ext === '.json' || ext === '.css') {
      headers['Cache-Control'] = 'no-store';
    }
    res.writeHead(200, headers);
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found');
  }
});

(async () => {
  await checkPortConflict();
  server.listen(PORT, async () => {
    await registerPort();
    console.log(`Server running at http://localhost:${PORT}/winforms.html`);
    console.log(`Project dir: ${PROJECT_DIR}`);
  });
})();
