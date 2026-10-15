// =====================================================================

/*
 * The IR is the "Windows Forms language" — a JSON tree that describes:
 *   - Multiple forms in a project
 *   - Each form's tree of controls with positions, sizes, properties
 *   - Event handlers (referenced by handler-ID, body stored separately)
 *   - Application-level state: data classes, lists, variables
 *
 * The two interpreters consume IR:
 *   - Web renderer: IR -> DOM
 *   - C# exporter: IR -> Designer.cs + Form.cs + Program.cs + .csproj
 */

import { Registry } from './control-registry.js';

export const ControlTypes = {
  Form:            { cs: 'Form',            defaultSize: [400, 300], canHaveChildren: true,  category: 'Container' },
  Label:           { cs: 'Label',           defaultSize: [100, 23],  canHaveChildren: false, category: 'Common Controls' },
  TextBox:         { cs: 'TextBox',         defaultSize: [120, 23],  canHaveChildren: false, category: 'Common Controls' },
  NumericUpDown:   { cs: 'NumericUpDown',   defaultSize: [80, 23],   canHaveChildren: false, category: 'Common Controls' },
  MaskedTextBox:   { cs: 'MaskedTextBox',   defaultSize: [120, 23],  canHaveChildren: false, category: 'Common Controls' },
  Button:          { cs: 'Button',          defaultSize: [80, 28],   canHaveChildren: false, category: 'Common Controls' },
  CheckBox:        { cs: 'CheckBox',        defaultSize: [120, 24],  canHaveChildren: false, category: 'Common Controls' },
  RadioButton:     { cs: 'RadioButton',     defaultSize: [120, 24],  canHaveChildren: false, category: 'Common Controls' },
  ComboBox:        { cs: 'ComboBox',        defaultSize: [120, 24],  canHaveChildren: false, category: 'Common Controls' },
  ListBox:         { cs: 'ListBox',         defaultSize: [120, 96],  canHaveChildren: false, category: 'Common Controls' },
  GroupBox:        { cs: 'GroupBox',        defaultSize: [200, 120], canHaveChildren: true,  category: 'Containers' },
  Panel:           { cs: 'Panel',           defaultSize: [200, 120], canHaveChildren: true,  category: 'Containers' },
  DateTimePicker:  { cs: 'DateTimePicker',  defaultSize: [120, 23],  canHaveChildren: false, category: 'Common Controls' },
  ProgressBar:     { cs: 'ProgressBar',     defaultSize: [120, 23],  canHaveChildren: false, category: 'Common Controls' },
  PictureBox:      { cs: 'PictureBox',      defaultSize: [100, 100], canHaveChildren: false, category: 'Common Controls' },
  CheckedListBox:  { cs: 'CheckedListBox',  defaultSize: [120, 96],  canHaveChildren: false, category: 'Common Controls' },
  RichTextBox:     { cs: 'RichTextBox',     defaultSize: [120, 96],  canHaveChildren: false, category: 'Common Controls' },
  TreeView:        { cs: 'TreeView',        defaultSize: [120, 96],  canHaveChildren: false, category: 'Common Controls' },
  DataGridView:    { cs: 'DataGridView',    defaultSize: [240, 150], canHaveChildren: false, category: 'Common Controls' },
  TabControl:      { cs: 'TabControl',      defaultSize: [300, 200], canHaveChildren: true,  category: 'Containers' },
  TabPage:         { cs: 'TabPage',         defaultSize: [0, 0],     canHaveChildren: true,  category: 'Containers' },
  MenuStrip:       { cs: 'MenuStrip',       defaultSize: [0, 24],    canHaveChildren: false, category: 'Menus & Toolbars', dock: 'Top' },
  StatusStrip:     { cs: 'StatusStrip',     defaultSize: [0, 22],    canHaveChildren: false, category: 'Menus & Toolbars', dock: 'Bottom' },
  OpenFileDialog:  { cs: 'OpenFileDialog',  defaultSize: [0, 0],     canHaveChildren: false, category: 'Dialogs',         invisible: true },
  SaveFileDialog:  { cs: 'SaveFileDialog',  defaultSize: [0, 0],     canHaveChildren: false, category: 'Dialogs',         invisible: true },
};

// Common property descriptors (type-agnostic). Type-specific props live in adapters.
export const PropertyDescriptors = {
  // Common
  Name:            { type: 'string', group: 'Design', editable: true },
  Text:            { type: 'string', group: 'Appearance', editable: true },
  Enabled:         { type: 'bool',   group: 'Behavior', editable: true, default: true },
  Visible:         { type: 'bool',   group: 'Behavior', editable: true, default: true },
  TabIndex:        { type: 'int',    group: 'Behavior', editable: true, default: 0 },
  // Layout
  'Location.X':    { type: 'int',    group: 'Layout', editable: true },
  'Location.Y':    { type: 'int',    group: 'Layout', editable: true },
  'Size.Width':    { type: 'int',    group: 'Layout', editable: true },
  'Size.Height':   { type: 'int',    group: 'Layout', editable: true },
  // Font
  'Font.Size':     { type: 'float',  group: 'Appearance', editable: true, default: 9 },
  'Font.Bold':     { type: 'bool',   group: 'Appearance', editable: true, default: false },
  'Font.Family':   { type: 'string', group: 'Appearance', editable: true, default: 'Segoe UI' },
  // Layout
  Dock:            { type: 'enum',   group: 'Layout', editable: true, default: 'None', options: ['None','Top','Bottom','Left','Right','Fill'] },
  Anchor:          { type: 'string', group: 'Layout', editable: true, default: 'Top, Left' },
  Margin:          { type: 'string', group: 'Layout', editable: true, default: '3, 3, 3, 3' },
  Padding:         { type: 'string', group: 'Layout', editable: true, default: '0, 0, 0, 0' },
  // Auto sizing
  AutoSize:        { type: 'bool',   group: 'Behavior', editable: true, default: false },
  // Form-only (Form does not have an adapter in Registry)
  FormBorderStyle: { type: 'enum',   group: 'Window Style', options: ['None','FixedSingle','Fixed3D','FixedDialog','Sizable','FixedToolWindow','SizableToolWindow'], default: 'Sizable' },
  StartPosition:   { type: 'enum',   group: 'Layout', options: ['Manual','CenterScreen','WindowsDefaultLocation','WindowsDefaultBounds','CenterParent'], default: 'WindowsDefaultLocation' },
};

export function getPropertyDescriptor(key, type) {
  if (PropertyDescriptors[key]) return PropertyDescriptors[key];
  const adapter = Registry[type];
  if (adapter && adapter.getProperties) {
    return adapter.getProperties().find(p => p.key === key) || null;
  }
  return null;
}

export function defaultPropsFor(type) {
  const td = ControlTypes[type];
  const props = {
    Name: '', // assigned by caller
    Text: '',
    Enabled: true,
    Visible: true,
    TabIndex: 0,
    'Location.X': 10,
    'Location.Y': 10,
    'Size.Width': td.defaultSize[0],
    'Size.Height': td.defaultSize[1],
    'Font.Size': 9,
    'Font.Bold': false,
    'Font.Family': 'Segoe UI',
    Margin: '3, 3, 3, 3',
    Padding: '0, 0, 0, 0',
  };
  // Add type-specific props from adapter
  const adapter = Registry[type];
  if (adapter && adapter.getProperties) {
    for (const prop of adapter.getProperties()) {
      if (!(prop.key in props)) {
        props[prop.key] = prop.default;
      }
    }
  }
  // Form-only props (Form is not in Registry)
  if (type === 'Form') {
    for (const [key, d] of Object.entries(PropertyDescriptors)) {
      if (d.group === 'Window Style' || d.group === 'Layout') {
        if (!(key in props)) props[key] = d.default;
      }
    }
  }
  return props;
}

export function applicablePropsFor(type) {
  // Returns ordered list of property keys grouped
  const groups = {};
  const baseKeys = ['Name','Text','Enabled','Visible','TabIndex',
    'Location.X','Location.Y','Size.Width','Size.Height',
    'Font.Family','Font.Size','Font.Bold'];

  for (const k of baseKeys) {
    const d = PropertyDescriptors[k];
    if (!d) continue;
    (groups[d.group] = groups[d.group] || []).push(k);
  }

  // Type-specific props from adapter
  const adapter = Registry[type];
  if (adapter && adapter.getProperties) {
    for (const prop of adapter.getProperties()) {
      (groups[prop.group] = groups[prop.group] || []).push(prop.key);
    }
  }

  // Form-only props
  if (type === 'Form') {
    for (const [k, d] of Object.entries(PropertyDescriptors)) {
      if (baseKeys.includes(k)) continue;
      (groups[d.group] = groups[d.group] || []).push(k);
    }
  }

  return groups;
}

// Project IR — the root document
export function emptyProject(name = 'PhoneBook') {
  return {
    projectName: name,
    namespace: name,
    forms: [],
    classes: [], // user-defined data classes like Note
    startupForm: null, // form name
    handlers: {},  // handlerId -> { language, body, eventType }
  };
}

export function newForm(name, title) {
  return {
    id: 'f_' + Math.random().toString(36).slice(2, 8),
    name,
    type: 'Form',
    props: {
      ...defaultPropsFor('Form'),
      Name: name,
      Text: title || name,
      'Size.Width': 540,
      'Size.Height': 360,
      FormBorderStyle: 'FixedSingle',
      StartPosition: 'CenterScreen',
    },
    children: [],
    fields: [],   // class-level fields: { type, name, init }
    events: {},   // event-name -> handler-id (e.g., 'Load' -> 'h_xyz')
    isMain: false,
  };
}

export function newClass(name) {
  return {
    name,
    attributes: [],
    fields: [],
    methods: [],
  };
}

export function newControl(type, name) {
  return {
    id: 'c_' + Math.random().toString(36).slice(2, 8),
    name,
    type,
    props: { ...defaultPropsFor(type), Name: name },
    children: (ControlTypes[type]?.canHaveChildren || type === 'MenuStrip') ? [] : undefined,
    items: type === 'StatusStrip' || type === 'MenuStrip' ? [] : undefined,
    events: {},
  };
}

// Walk all top-level controls of a form (returns flat list).
// Note: MenuStrip/StatusStrip items are NOT controls themselves —
// they are sub-items stored separately and only used inside their parent's renderer.
export function walkControls(form) {
  const out = [];
  function visit(node) {
    if (!ControlTypes[node.type]) return; // skip non-control nodes
    out.push(node);
    if (node.children) node.children.forEach(visit);
  }
  form.children.forEach(visit);
  return out;
}

export function findControlByName(form, name) {
  return walkControls(form).find(c => c.props.Name === name);
}

export function findControlById(form, id) {
  return walkControls(form).find(c => c.id === id);
}

// Parse Margin/Padding string "Left, Top, Right, Bottom" into object
export function parsePadding(str) {
  if (!str) return { left: 0, top: 0, right: 0, bottom: 0 };
  const parts = String(str).split(',').map(s => parseInt(s.trim(), 10) || 0);
  if (parts.length === 1) return { left: parts[0], top: parts[0], right: parts[0], bottom: parts[0] };
  return {
    left: parts[0] || 0,
    top: parts[1] || 0,
    right: parts[2] || 0,
    bottom: parts[3] || 0,
  };
}
