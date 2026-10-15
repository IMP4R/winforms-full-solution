import { ControlTypes, walkControls } from './ir.js';
import { showToast } from './designer.js';
import { Registry } from './control-registry.js';
import { transpileBodyToCS } from './transpilers.mjs';

/*
 * with `dotnet build` on Windows. Output is a ZIP-like text bundle.
 *
 * Generated structure:
 *   PhoneBook/
 *     PhoneBook.csproj
 *     Program.cs
 *     Note.cs                  (and other data classes)
 *     MainForm.cs
 *     MainForm.Designer.cs
 *     MainForm.resx
 *     AddForm.cs
 *     AddForm.Designer.cs
 *     AddForm.resx
 */

export const csIndent = '            '; // 3 levels deep (namespace > class > method)

export function exportProjectToCSharp(project) {
  const files = {};
  files[`${project.projectName}.csproj`] = generateCsproj(project);
  files['Program.cs'] = generateProgram(project);

  for (const cls of project.classes || []) {
    files[`${cls.name}.cs`] = generateDataClass(cls, project);
  }

  for (const form of project.forms) {
    files[`${form.props.Name}.cs`] = generateFormCs(form, project);
    files[`${form.props.Name}.Designer.cs`] = generateFormDesignerCs(form, project);
    files[`${form.props.Name}.resx`] = generateResx();
  }

  return files;
}

export function generateCsproj(project) {
  return `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>disable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <RootNamespace>${project.namespace}</RootNamespace>
    <AssemblyName>${project.projectName}</AssemblyName>
    <EnableWindowsTargeting>true</EnableWindowsTargeting>
    <NoWarn>$(NoWarn);SYSLIB0011</NoWarn>
  </PropertyGroup>

</Project>
`;
}

export function generateProgram(project) {
  const startup = project.startupForm || project.forms[0].props.Name;
  return `using System;
using System.Windows.Forms;

namespace ${project.namespace}
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new ${startup}());
        }
    }
}
`;
}

export function generateDataClass(cls, project) {
  const attrs = (cls.attributes || []).map(a => `    [${a}]\n`).join('');
    // Detect interface: name starts with 'I', no fields, and all methods have empty bodies (interface signatures)
    const isInterface = cls.name.startsWith('I') && (!cls.fields || cls.fields.length === 0) && (cls.methods || []).length > 0 && (cls.methods || []).every(m => !m.body || m.body === '' || m.body.includes('NotImplementedException'));
    if (isInterface) {
      const methods = (cls.methods || []).map(m => `        ${m.returnType || 'void'} ${m.name}(${m.params || ''});`).join('\n');
      return `namespace ${project.namespace}
{
${attrs}    public interface ${cls.name}
    {
${methods}
    }
}
`;
    }
  const fields = (cls.fields || []).map(f => `        public ${f.type} ${f.name};`).join('\n');
  const methods = (cls.methods || []).map(m => `
        public ${m.override ? 'override ' : ''}${m.returnType || 'void'} ${m.name}(${m.params || ''})
        {
${indentBody(m.body, '            ')}
        }`).join('\n');
  const impl = cls.implements ? ' : ' + cls.implements : '';
  return `namespace ${project.namespace}
{
${attrs}    public class ${cls.name}${impl}
    {
${fields}${methods}
    }
}
`;
}

export function generateResx() {
  return `<?xml version="1.0" encoding="utf-8"?>
<root>
  <resheader name="resmimetype"><value>text/microsoft-resx</value></resheader>
  <resheader name="version"><value>2.0</value></resheader>
  <resheader name="reader"><value>System.Resources.ResXResourceReader, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value></resheader>
  <resheader name="writer"><value>System.Resources.ResXResourceWriter, System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089</value></resheader>
</root>
`;
}

export function generateFormCs(form, project) {
  const fields = (form.fields || []).map(f => {
    return `        private ${f.type} ${f.name};`;
  }).join('\n');

  // Constructor: initialize fields (matches textbook style)
  const ctorInits = (form.fields || []).map(f => {
    if (f.init) {
      return `            ${f.name} = ${transpileExpressionToCS(f.init)};`;
    }
    return null;
  }).filter(Boolean).join('\n');

  // Constructor parameters (single object or array for multiple)
  let ctorParams = '';
  let ctorParamAssign = '';
  if (form.constructorParam) {
    const params = Array.isArray(form.constructorParam) ? form.constructorParam : [form.constructorParam];
    ctorParams = params.map(p => `${p.type} _${p.name}`).join(', ');
    ctorParamAssign = params.map(p => `            ${p.name} = _${p.name};`).join('\n');
  }

  // Public field (e.g. AddForm exposes MyRecord publicly)
  const publicFields = (form.publicFields || []).map(f => `        public ${f.type} ${f.name};`).join('\n');

  // Collect handlers attached to controls and ToolStrip items
  const handlers = [];
  function collectEvents(node, namePrefix) {
    if (!node.events) return;
    for (const [evName, hid] of Object.entries(node.events)) {
      const h = project.handlers[hid];
      if (!h) continue;
      handlers.push({
        name: `${namePrefix || node.props?.Name}_${evName}`,
        body: h.body,
      });
    }
  }
  for (const ctrl of walkControls(form)) {
    collectEvents(ctrl, ctrl.props.Name);
    // MenuStrip / StatusStrip sub-items
    if (ctrl.items) {
      const visitItems = (items) => {
        for (const it of items) {
          if (it.events) {
            for (const [evName, hid] of Object.entries(it.events)) {
              const h = project.handlers[hid];
              if (!h) continue;
              handlers.push({ name: `${it.Name}_${evName}`, body: h.body });
            }
          }
          if (it.items) visitItems(it.items);
        }
      };
      visitItems(ctrl.items);
    }
  }
  // Form events
  if (form.events) {
    for (const [evName, hid] of Object.entries(form.events)) {
      const h = project.handlers[hid];
      if (!h) continue;
      handlers.push({
        name: `${form.props.Name}_${evName}`,
        body: h.body,
      });
    }
  }

  const handlerCode = handlers.map(h => `
        private void ${h.name}(object sender, EventArgs e)
        {
${indentBody(transpileBodyToCS(h.body), '            ')}
        }`).join('\n');

  // Helper methods (PrintElement etc.) — emitted from project.helperMethods if present
  const helpers = (form.helperMethods || []).map(m => `
        private ${m.returnType || 'void'} ${m.name}(${m.params || ''})
        {
${indentBody(transpileBodyToCS(m.body), '            ')}
        }`).join('\n');

  return `using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using System.Xml.Serialization;
using PhoneBook.Save;
using PhoneBook.Open;

namespace ${project.namespace}
{
    public partial class ${form.props.Name} : Form
    {
${publicFields}
${fields}

        public ${form.props.Name}(${ctorParams})
        {
            InitializeComponent();
${ctorParamAssign}
${ctorInits}
        }
${helpers}
${handlerCode}
    }
}
`;
}

function buildAddControlsLines(children, parentName) {
  const lines = [];
  for (const c of children) {
    const td = ControlTypes[c.type];
    if (!td || td.invisible) continue;
    lines.push(`            ${parentName}.Controls.Add(this.${c.props.Name});`);
    if (td.canHaveChildren && c.children) {
      lines.push(...buildAddControlsLines(c.children, `this.${c.props.Name}`));
    }
  }
  return lines;
}

export function generateFormDesignerCs(form, project) {
  // Collect all top-level controls (including invisible dialogs)
  const allCtrls = walkControls(form);

  // Collect ToolStrip nested items (menu items, status labels)
  // These need their own field declarations.
  const subItems = [];
  for (const ctrl of allCtrls) {
    if (!ctrl.items) continue;
    const visit = (items, csType) => {
      for (const it of items) {
        if (it.IsSeparator) continue;
        if (!it.Name) continue;
        subItems.push({ name: it.Name, csType });
        if (it.items) visit(it.items, csType);
      }
    };
    if (ctrl.type === 'MenuStrip') visit(ctrl.items, 'ToolStripMenuItem');
    if (ctrl.type === 'StatusStrip') visit(ctrl.items, 'ToolStripStatusLabel');
  }

  // Field declarations
  const fieldDecls = [
    ...allCtrls.map(c => `        private System.Windows.Forms.${c.type} ${c.props.Name};`),
    ...subItems.map(s => `        private System.Windows.Forms.${s.csType} ${s.name};`),
  ].join('\n');

  // "new ..." for every field, up front (matches VS-generated style)
  const newAllocs = [
    ...allCtrls.map(c => `            this.${c.props.Name} = new System.Windows.Forms.${c.type}();`),
    ...subItems.map(s => `            this.${s.name} = new System.Windows.Forms.${s.csType}();`),
  ].join('\n');

  // Per-control initialization
  const ctrlInits = allCtrls.map(c => generateControlInitCS(c, form, project)).join('\n');

  // Form-level setup
  const formSetup = generateFormInitCS(form);

  // Add controls recursively (form or container Controls collections)
  const addControlsLines = buildAddControlsLines(form.children, 'this').join('\n');

  // MenuStrip needs MainMenuStrip pointer (but ONLY if we don't already have a field
  // of the same name causing a self-assign)
  const menuStrip = form.children.find(c => c.type === 'MenuStrip');
  const mainMenuLine = (menuStrip && menuStrip.props.Name !== 'MainMenuStrip')
    ? `            this.MainMenuStrip = this.${menuStrip.props.Name};` : '';

  return `namespace ${project.namespace}
{
    partial class ${form.props.Name}
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

${fieldDecls}

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
${newAllocs}
            this.SuspendLayout();

${ctrlInits}

            // 
            // ${form.props.Name}
            // 
${formSetup}
${addControlsLines}
${mainMenuLine}

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion
    }
}
`;
}

export function generateControlInitCS(ctrl, form, project) {
  const p = ctrl.props;
  const td = ControlTypes[ctrl.type];
  const name = `this.${p.Name}`;
  const lines = [`            // `, `            // ${p.Name}`, `            // `];

  // Invisible dialogs: only emit adapter-specific properties (e.g. Filter)
  if (td.invisible) {
    const adapter = Registry[ctrl.type];
    if (adapter && adapter.emitCS) {
      for (const line of adapter.emitCS(ctrl, name)) {
        lines.push(line);
      }
    }
    return lines.join('\n');
  }

  // Common
  const dock = p.Dock || td.dock;
  if (!dock) {
    lines.push(`            ${name}.Location = new System.Drawing.Point(${p['Location.X']}, ${p['Location.Y']});`);
  }
  lines.push(`            ${name}.Size = new System.Drawing.Size(${p['Size.Width']}, ${p['Size.Height']});`);
  lines.push(`            ${name}.Name = "${p.Name}";`);
  lines.push(`            ${name}.TabIndex = ${p.TabIndex || 0};`);
  if (!p.Enabled) lines.push(`            ${name}.Enabled = false;`);
  if (p['Font.Size'] !== 9 || p['Font.Bold']) {
    const styles = [];
    if (p['Font.Bold']) styles.push('System.Drawing.FontStyle.Bold');
    const styleStr = styles.length ? ', ' + styles.join(' | ') : '';
    lines.push(`            ${name}.Font = new System.Drawing.Font("${p['Font.Family']}", ${p['Font.Size']}F${styleStr});`);
  }
  // Dock
  if (p.Dock && p.Dock !== 'None') {
    lines.push(`            ${name}.Dock = System.Windows.Forms.DockStyle.${p.Dock};`);
  }
  // Anchor
  if (!p.Dock && p.Anchor && p.Anchor !== 'Top, Left') {
    const parts = String(p.Anchor).split(',').map(s => s.trim()).filter(Boolean);
    const flags = parts.map(part => `System.Windows.Forms.AnchorStyles.${part}`).join(' | ');
    lines.push(`            ${name}.Anchor = ${flags || 'System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left'};`);
  }
  // Margin
  if (p.Margin && p.Margin !== '3, 3, 3, 3') {
    const m = p.Margin.split(',').map(s => parseInt(s.trim(), 10) || 0);
    lines.push(`            ${name}.Margin = new System.Windows.Forms.Padding(${m[0] || 0}, ${m[1] || 0}, ${m[2] || 0}, ${m[3] || 0});`);
  }
  // Padding (mainly for containers, but all controls have it in WinForms)
  if (p.Padding && p.Padding !== '0, 0, 0, 0') {
    const pd = p.Padding.split(',').map(s => parseInt(s.trim(), 10) || 0);
    lines.push(`            ${name}.Padding = new System.Windows.Forms.Padding(${pd[0] || 0}, ${pd[1] || 0}, ${pd[2] || 0}, ${pd[3] || 0});`);
  }

  // Type-specific
  const adapter = Registry[ctrl.type];
  if (adapter && adapter.emitCS) {
    const extra = adapter.emitCS(ctrl, name);
    if (extra && extra.length) lines.push(...extra);
  }

  // Event wiring (visible controls)
  if (ctrl.events) {
    for (const [evName, hid] of Object.entries(ctrl.events)) {
      const h = project.handlers[hid];
      if (!h) continue;
      lines.push(`            ${name}.${evName} += new System.EventHandler(this.${p.Name}_${evName});`);
    }
  }

  return lines.join('\n');
}

export function generateFormInitCS(form) {
  const p = form.props;
  const lines = [];
  lines.push(`            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);`);
  lines.push(`            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;`);
  lines.push(`            this.ClientSize = new System.Drawing.Size(${p['Size.Width']}, ${p['Size.Height']});`);
  lines.push(`            this.Name = "${p.Name}";`);
  lines.push(`            this.Text = ${csStringLit(p.Text)};`);
  if (p.FormBorderStyle && p.FormBorderStyle !== 'Sizable')
    lines.push(`            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.${p.FormBorderStyle};`);
  if (p.StartPosition && p.StartPosition !== 'WindowsDefaultLocation')
    lines.push(`            this.StartPosition = System.Windows.Forms.FormStartPosition.${p.StartPosition};`);
  if (p.AutoSize) {
    lines.push(`            this.AutoSize = true;`);
    if (p.AutoSizeMode && p.AutoSizeMode !== 'GrowOnly') {
      lines.push(`            this.AutoSizeMode = System.Windows.Forms.AutoSizeMode.${p.AutoSizeMode};`);
    }
  }
  if (form.events?.Load) {
    lines.push(`            this.Load += new System.EventHandler(this.${form.props.Name}_Load);`);
  }
  if (form.events?.FormClosing) {
    lines.push(`            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.${form.props.Name}_FormClosing);`);
  }
  return lines.join('\n');
}

// String literal for C#
export function csStringLit(s) {
  if (s == null) return '""';
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}

export function indentBody(body, indent) {
  return body.split('\n').map(line => {
    const trimmed = line.replace(/^\s+/, '');
    return trimmed ? indent + trimmed : line;
  }).join('\n');
}

// Body transpiler: handler body is C#-like JS with a few DSL adaptations.
// We undo them to produce idiomatic C#:
//   state.X       -> X                (state is our JS-only field container; in C# they're class fields)
export function transpileExpressionToCS(jsExpr) {
  if (typeof jsExpr !== 'string') return JSON.stringify(jsExpr);
  let s = jsExpr;
  s = s.replace(/\bNewList\s*\(\s*\)/g, 'new List<Note>()');
  s = s.replace(/\bNew([A-Z]\w*)\s*\(\s*\)/g, 'new $1()');
  return s;
}

// Bundle into a downloadable archive — we use a JS implementation of zip
export async function downloadProjectZip(project) {
  const files = exportProjectToCSharp(project);
  // Simple zip via blob with a basic store-only zip writer
  const zipBlob = createSimpleZip(files);
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = project.projectName + '.zip';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Exported ${Object.keys(files).length} files to ${project.projectName}.zip`, 'success');
}

// Minimal store-only ZIP writer (no compression).
// Compatible with all .NET tools.
export function createSimpleZip(files) {
  const encoder = new TextEncoder();
  const fileRecords = [];
  let offset = 0;
  const chunks = [];

  // CRC-32 table
  const crcTable = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c >>> 0;
    }
    return t;
  })();
  const crc32 = (bytes) => {
    let c = 0xFFFFFFFF;
    for (const b of bytes) c = (c >>> 8) ^ crcTable[(c ^ b) & 0xFF];
    return (c ^ 0xFFFFFFFF) >>> 0;
  };

  function u16(n) { return new Uint8Array([n & 0xff, (n >>> 8) & 0xff]); }
  function u32(n) { return new Uint8Array([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]); }
  function concat(...arrs) {
    const total = arrs.reduce((s, a) => s + a.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const a of arrs) { out.set(a, off); off += a.length; }
    return out;
  }

  // Use folder prefix
  const projName = Object.keys(files).find(k => k.endsWith('.csproj')).replace('.csproj', '');
  const folder = projName + '/';

  for (const [name, content] of Object.entries(files)) {
    const fullName = folder + name;
    const nameBytes = encoder.encode(fullName);
    const data = encoder.encode(content);
    const crc = crc32(data);
    const size = data.length;

    // Local file header
    const lfh = concat(
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(crc), u32(size), u32(size), u16(nameBytes.length), u16(0),
      nameBytes, data
    );

    fileRecords.push({ name: nameBytes, crc, size, offset });
    chunks.push(lfh);
    offset += lfh.length;
  }

  // Central directory
  const cdStart = offset;
  for (const rec of fileRecords) {
    const cd = concat(
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
      u32(rec.crc), u32(rec.size), u32(rec.size),
      u16(rec.name.length), u16(0), u16(0), u16(0), u16(0),
      u32(0), u32(rec.offset),
      rec.name
    );
    chunks.push(cd);
    offset += cd.length;
  }
  const cdSize = offset - cdStart;

  // End of central directory
  const eocd = concat(
    u32(0x06054b50), u16(0), u16(0), u16(fileRecords.length), u16(fileRecords.length),
    u32(cdSize), u32(cdStart), u16(0)
  );
  chunks.push(eocd);

  return new Blob(chunks, { type: 'application/zip' });
}
