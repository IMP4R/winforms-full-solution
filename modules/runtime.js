import { ControlTypes, walkControls, findControlByName } from './ir.js';
import { renderForm, renderControl, escapeHtml } from './renderer.js';

/*
 * Handlers are stored as JS function bodies in `project.handlers`.
 *
 * The handler's environment is a "Form-like" object that mimics
 * WinForms API just enough for our use cases:
 *   - this.ControlName.Text, .Value, .Enabled etc. (proxy)
 *   - MessageBox.Show(text, [title])
 *   - openFileDialog / saveFileDialog with .ShowDialog() returning DialogResult
 *   - File.WriteAllText / ReadAllText (browser-backed)
 *   - List<T> -> array with .Count, .Add(), .RemoveAt(), .ElementAt(idx), [idx]
 *
 * In C# export we directly emit the handler body as C# (since the DSL
 * is *almost* C# already, we use a tiny transpile).
 */

export class WinFormsRuntime {
  constructor(project) {
    this.project = project;
    this.openForms = [];       // stack of currently shown forms
    this.formElements = new Map(); // formId -> root DOM
    this.appState = {};        // top-level: fields of the startup form persist here
    this.dialogResult = null;
    this.fileBuffer = null;    // pending file content for open dialog
    this.host = null;          // DOM host element
    this.onClose = null;
  }

  start(host) {
    this.host = host;
    host.innerHTML = '';
    const startName = this.project.startupForm || this.project.forms[0]?.name;
    const startForm = this.project.forms.find(f => f.name === startName);
    if (!startForm) return;

    // Initialize fields of the startup form
    this.appState = this._initFields(startForm);
    this.appState.__form__ = startForm;
    this._showForm(startForm, this.appState);

    // Trigger Load event
    if (startForm.events?.Load) {
      this.invokeHandler(startForm.events.Load, { sender: startForm, eventArgs: {} });
    }
  }

  _initFields(form, baseState = {}) {
    const state = { ...baseState };
    for (const f of (form.fields || []).concat(form.publicFields || [])) {
      // f: { type: 'List<Note>' | 'int' | 'string', name, init }
      // Don't overwrite constructor params unless an explicit init is provided
      if (state[f.name] !== undefined && f.init == null) continue;
      state[f.name] = this._evalInit(f, state);
    }
    return state;
  }

  _evalInit(field, state) {
    if (field.init != null) {
      if (typeof field.init === 'string') {
        // If init is a constructor parameter reference (e.g. "_MyType"), resolve from state
        if (field.init.startsWith('_') && state[field.init.slice(1)] !== undefined) {
          return state[field.init.slice(1)];
        }
        // Rewrite DSL helpers to globally-available JS:
        //   NewList()       -> makeList()
        //   NewNote()       -> makeNote()
        //   NewSomeClass()  -> { ...empty obj... }   (handled by inlining)
        let expr = field.init
          .replace(/\bNewList\s*\(\s*\)/g, 'makeList()')
          .replace(/\bNewNote\s*\(\s*\)/g, 'makeNote()');
        try {
          return new Function('makeList', 'makeNote', '"use strict"; return (' + expr + ');')(makeList, makeNote);
        } catch (e) {
          console.warn('Init eval failed for', field.name, ':', e.message);
          return null;
        }
      }
      return field.init;
    }
    if (field.type.startsWith('List<')) return makeList();
    if (field.type === 'int') return 0;
    if (field.type === 'string') return '';
    return null;
  }

  _showForm(form, state) {
    const root = renderForm(form, 'runtime', this);
    this.formElements.set(form.id, root);
    this.openForms.push({ form, root, state });
    if (this.openForms.length === 1) {
      this.host.appendChild(root);
    } else {
      // Modal dialog overlay
      const overlay = document.createElement('div');
      overlay.className = 'dialog-overlay';
      overlay.appendChild(root);
      this.host.appendChild(overlay);
    }
  }

  showFormDialog(formName, args) {
    // Find form, create state, push modal
    const form = this.project.forms.find(f => f.name === formName);
    if (!form) { this.toast('Form not found: ' + formName, 'error'); return; }
    // Set up constructor parameters first so _initFields can reference them
    const ctorState = {};
    if (Array.isArray(form.constructorParam)) {
      for (let i = 0; i < form.constructorParam.length; i++) {
        ctorState[form.constructorParam[i].name] = args[i];
      }
    } else if (form.constructorParam) {
      ctorState[form.constructorParam.name] = args[0];
    } else if (args.length > 0) {
      // Legacy fallback
      ctorState['MyRecord'] = args[0];
    }
    const state = this._initFields(form, ctorState);
    state.__form__ = form;
    state.__parent__ = this.openForms[this.openForms.length - 1].state;
    this._showForm(form, state);
    if (form.events?.Load) this.invokeHandler(form.events.Load, { sender: form, eventArgs: {} });
    // Block until form is closed (we simulate ShowDialog with a Promise)
    return new Promise(resolve => {
      this._closeResolvers = this._closeResolvers || new Map();
      this._closeResolvers.set(form.id, resolve);
    });
  }

  closeForm(formInstance, result = 'OK') {
    const idx = this.openForms.findIndex(x => x.form === formInstance);
    if (idx < 0) return;
    // Trigger FormClosing event if present (fire-and-forget: real WinForms can cancel via e.Cancel,
    // but our JS transpilation doesn't support that, so we always close after handler)
    if (formInstance.events?.FormClosing) {
      this.invokeHandler(formInstance.events.FormClosing, { sender: formInstance, eventArgs: {} });
    }
    const popped = this.openForms.splice(idx, 1)[0];
    // Remove DOM
    if (popped.root.parentElement?.classList.contains('dialog-overlay')) {
      popped.root.parentElement.remove();
    } else {
      popped.root.remove();
    }
    // Resolve dialog promise
    const r = this._closeResolvers?.get(formInstance.id);
    if (r) { r(result); this._closeResolvers.delete(formInstance.id); }
    // If startup form closed -> end app (defer slightly so async FormClosing handlers can show msgbox)
    if (this.openForms.length === 0 && this.onClose) {
      setTimeout(() => { if (this.openForms.length === 0 && this.onClose) this.onClose(); }, 50);
    }
  }

  closeCurrentForm(result = 'OK') {
    const top = this.openForms[this.openForms.length - 1];
    if (top) this.closeForm(top.form, result);
  }

  // Updates DOM for a property change at runtime
  refreshControl(controlName) {
    const top = this.openForms[this.openForms.length - 1];
    if (!top) return;
    const ctrl = findControlByName(top.form, controlName);
    if (!ctrl) return;
    const oldEl = top.root.querySelector(`[data-ctrl-id="${ctrl.id}"]`);
    if (!oldEl) return;
    const newEl = renderControl(ctrl, 'runtime', this, top.form);
    oldEl.replaceWith(newEl);
  }

  refreshAll() {
    const top = this.openForms[this.openForms.length - 1];
    if (!top) return;
    for (const ctrl of walkControls(top.form)) {
      const td = ControlTypes[ctrl.type];
      if (td.invisible) continue;
      this.refreshControl(ctrl.props.Name);
    }
  }

  // Provides a JS proxy that maps `LastNameTextBox.Text` to ctrl.props.Text
  // and `LastNameTextBox.Text = "x"` to update + re-render.
  _controlProxy(form, state) {
    const rt = this;
    return new Proxy({}, {
      get(_, name) {
        if (name === 'this' || name === 'state') return state;
        const ctrl = findControlByName(form, name);
        if (!ctrl) return undefined;
        return new Proxy(ctrl.props, {
          get(target, prop) {
            if (prop === 'items') return ctrl.items;
            if (prop === 'children') return ctrl.children;
            return target[prop];
          },
          set(target, prop, value) {
            target[prop] = value;
            // Refresh that one control
            rt.refreshControl(ctrl.props.Name);
            return true;
          }
        });
      }
    });
  }

  _findFormForHandler(handlerId) {
    for (const f of this.project.forms || []) {
      if (f.events) {
        for (const v of Object.values(f.events)) if (v === handlerId) return f;
      }
      for (const c of walkControls(f)) {
        if (c.events) {
          for (const v of Object.values(c.events)) if (v === handlerId) return f;
        }
        if (c.items) {
          for (const it of c.items) {
            if (it.events) {
              for (const v of Object.values(it.events)) if (v === handlerId) return f;
            }
            if (it.items) {
              for (const sub of it.items) {
                if (sub.events) {
                  for (const v of Object.values(sub.events)) if (v === handlerId) return f;
                }
              }
            }
          }
        }
      }
    }
    return null;
  }

  async invokeHandler(handlerId, { sender, eventArgs }) {
    const h = this.project.handlers[handlerId];
    if (!h) { this.toast('Handler not found: ' + handlerId, 'error'); return; }
    const form = this._findFormForHandler(handlerId);
    if (!form) { console.error('Form not found for handler', handlerId); return; }
    const stateEntry = this.openForms.find(e => e.form === form);
    if (!stateEntry) { console.error('Form not open for handler', handlerId); return; }
    const env = this._buildEnv(form, stateEntry.state);
    try {
      // AsyncFunction — handlers may use `await` for ShowDialog and file dialogs
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const fn = new AsyncFunction(...Object.keys(env), '"use strict";' + h.body);
    try {
      await fn(...Object.values(env));
    } catch (e) {
      console.error('Handler error', h.label || handlerId, e.message, e.stack);
    }
    } catch (e) {
      console.error(e);
      this.messageBox('Runtime error in ' + (h.label || handlerId) + ':\n\n' + e.message, 'Error');
    }
  }

  _buildEnv(form, state) {
    const rt = this;
    const env = {};

    // Each control becomes a top-level variable with a property-proxy
    for (const ctrl of walkControls(form)) {
      env[ctrl.props.Name] = new Proxy({}, {
        get(_, prop) {
          if (prop === '_ctrl') return ctrl;
          if (prop === 'Items') return ctrl.items;
          return ctrl.props[prop];
        },
        set(_, prop, value) {
          ctrl.props[prop] = value;
          rt.refreshControl(ctrl.props.Name);
          return true;
        }
      });
    }

    // ToolStrip items (StatusStrip labels, MenuStrip menu items) also get
    // their own top-level proxies so handlers can do `NumberToolStripStatusLabel.Text = ...`
    for (const ctrl of walkControls(form)) {
      if (!ctrl.items) continue;
      const visitItems = (items, parent) => {
        for (const it of items) {
          if (!it.Name) continue;
          env[it.Name] = new Proxy(it, {
            get(t, prop) { return t[prop]; },
            set(t, prop, value) {
              t[prop] = value;
              // Re-render the parent strip so changes show up
              rt.refreshControl(parent.props.Name);
              return true;
            }
          });
          if (it.items) visitItems(it.items, parent);
        }
      };
      visitItems(ctrl.items, ctrl);
    }

    // State object — handlers access fields via state.fieldName
    // (this avoids new Function's inability to use getter/setter with raw param names)
    env.state = state;
    // Form-level reference to itself
    env['__form__'] = form;
    // MyRecord (parameter passed from parent form) is now accessed via state.MyRecord

    // Helper methods declared on the form (e.g., PrintElement) — make them callable.
    // We wrap each in an async closure that re-builds the env, so they can call
    // each other and access updated state.
    for (const m of form.helperMethods || []) {
      env[m.name] = async () => {
        const innerEnv = rt._buildEnv(form, state);
        const AsyncFunction = Object.getPrototypeOf(async function foo(){}).constructor;
        const fn = new AsyncFunction(...Object.keys(innerEnv), '"use strict";' + m.body);
        return fn(...Object.values(innerEnv));
      };
    }

    // === Standard library shims ===

    // MessageBox.Show
    env.MessageBox = {
      Show: (text, title = '', buttons = 'OK') => {
        return rt.messageBox(text, title, buttons);
      }
    };

    // DialogResult enum
    env.DialogResult = { OK: 'OK', Cancel: 'Cancel', Yes: 'Yes', No: 'No' };
    env.MessageBoxIcon = { Error: 'Error', Question: 'Question', Information: 'Information', Warning: 'Warning' };
    env.AddOrEdit = { Add: 0, Edit: 1 };

    // File dialogs — get the actual dialog control from form's children
    const findInvisibleDialog = (type) => {
      const dlg = walkControls(form).find(c => c.type === type);
      if (!dlg) return null;
      return {
        FileName: dlg.props.FileName || '',
        ShowDialog: async () => {
          const result = await rt.showFileDialog(type);
          if (result) { dlg.props.FileName = result.name; dlg.props.__content__ = result.content; }
          return result ? 'OK' : 'Cancel';
        },
        get __content__() { return dlg.props.__content__; },
      };
    };
    // Pre-create proxies for any dialog controls on this form
    for (const ctrl of walkControls(form)) {
      if (ctrl.type === 'OpenFileDialog' || ctrl.type === 'SaveFileDialog') {
        env[ctrl.props.Name] = findInvisibleDialog(ctrl.type);
      }
    }

    // File class
    env.File = {
      WriteAllText: (path, content) => rt.downloadFile(path, content),
      ReadAllText: (path) => rt.readPendingFile(),
      Exists: (path) => true,
    };

    // StreamWriter / StreamReader emulation (simplified)
    env.StreamWriter = class {
      constructor(path) { this._path = path; this._buf = ''; }
      WriteLine(s) { this._buf += (s ?? '') + '\n'; }
      Write(s) { this._buf += (s ?? ''); }
      Close() { rt.downloadFile(this._path, this._buf); }
      Dispose() { this.Close(); }
    };
    env.StreamReader = class {
      constructor(path) {
        this._lines = (rt._currentFileContent || '').split('\n');
        this._idx = 0;
      }
      ReadLine() { return this._idx < this._lines.length ? this._lines[this._idx++] : null; }
      ReadToEnd() { return (rt._currentFileContent || ''); }
      get EndOfStream() { return this._idx >= this._lines.length; }
      Close() {}
      Dispose() {}
    };

    env.FileStream = class FileStream {
      constructor(path, mode) { this._path = path; this._mode = mode; }
      Close() {}
      Dispose() {}
    };

    env.Path = {
      GetExtension: (path) => {
        const idx = path.lastIndexOf('.');
        return idx >= 0 ? path.slice(idx) : '';
      },
      GetFileName: (path) => {
        const sep = path.includes('/') ? '/' : '\\';
        return path.split(sep).pop() || path;
      }
    };

    env.XmlSerializer = class XmlSerializer {
      constructor(typeName) { this._typeName = typeName; }
      _escapeXml(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      }
      Serialize(stream, obj) {
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        xml += '<ArrayOfNote xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n';
        for (const item of obj) {
          xml += '  <Note>\n';
          for (const key of ['LastName', 'Name', 'Patronymic', 'Street', 'House', 'Flat', 'Phone']) {
            xml += `    <${key}>${this._escapeXml(item[key] ?? '')}</${key}>\n`;
          }
          xml += '  </Note>\n';
        }
        xml += '</ArrayOfNote>';
        rt.downloadFile(stream._path, xml);
      }
      Deserialize(stream) {
        const xml = rt._currentFileContent || '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const root = doc.documentElement;
        const result = makeList();
        for (const node of root.children) {
          if (node.tagName === 'Note') {
            const rec = makeNote();
            for (const child of node.children) {
              const val = child.textContent;
              if (child.tagName === 'House' || child.tagName === 'Flat') {
                rec[child.tagName] = parseInt(val, 10) || 0;
              } else {
                rec[child.tagName] = val;
              }
            }
            result.Add(rec);
          }
        }
        return result;
      }
    };

    // Form navigation helpers
    env.ShowDialog = async (formName, ...args) => {
      return await rt.showFormDialog(formName, args);
    };
    env.Close = () => rt.closeCurrentForm();

    // List<T> factory — when handler does `new List<Note>()` we replace with makeList()
    env.NewList = () => makeList();
    env.NewNote = () => makeNote();  // create instance of Note class (or any data class)

    // EF Core mocks (Part 3)
    env.DbContext = class DbContext {
      constructor() { this._changeTracker = []; }
      Add(entity) {
        // Track add; actual DbSet mutation happens immediately for simplicity
        this._changeTracker.push({ op: 'add', entity });
      }
      Remove(entity) {
        this._changeTracker.push({ op: 'remove', entity });
      }
      SaveChanges() {
        // No-op for in-memory mock (data already mutated)
        this._changeTracker = [];
      }
    };
    env.DbSet = class DbSet {
      constructor(entityType) { this._entityType = entityType; this._data = makeList(); }
      Load() {
        // Seed sample phonebook data on first load
        if (this._entityType === 'Phonebook' && this._data.length === 0) {
          this._data.Add({ Id: 1, Lastname: 'Иванов', Name: 'Иван', Patronymic: 'Иванович', Street: 'ул. Ленина', House: 1, Flat: 2, Phone: '1234567890' });
          this._data.Add({ Id: 2, Lastname: 'Пертров', Name: 'Петр', Patronymic: 'Петрович', Street: 'ул. Ленина', House: 2, Flat: 3, Phone: '2345678901' });
          this._data.Add({ Id: 3, Lastname: 'Сидоров', Name: 'Сидор', Patronymic: 'Сидорович', Street: 'ул. Ленина', House: 2, Flat: 3, Phone: '2345678901' });
        }
      }
      get Local() { return { ToBindingList: () => this._data }; }
      OrderBy(fn) { return this._data.OrderBy(fn); }
      Where(fn) { return this._data.Where(fn); }
      First() { return this._data.First(); }
      ToArray() { return this._data.ToArray(); }
      ToList() { return this._data.ToList(); }
      Any() { return this._data.Any(); }
      Count() { return this._data.length; }
      Add(entity) { this._data.Add(entity); }
      Remove(entity) { this._data.Remove(entity); }
    };

    // Generic class instantiation for user-defined classes
    for (const cls of rt.project.classes || []) {
      // Don't overwrite specialized factories (e.g. makeNote for Note class)
      if (env['New' + cls.name]) continue;
      env['New' + cls.name] = () => {
        const obj = {};
        for (const fld of cls.fields) {
          obj[fld.name] = fld.type === 'int' || fld.type === 'ushort' || fld.type === 'short' || fld.type === 'decimal' ? 0 :
                          fld.type === 'string' ? '' :
                          fld.type === 'bool' ? false : null;
        }
        return obj;
      };

      // Create actual JS constructor classes so `new ClassName()` works in transpiled handlers
      const isDbContext = cls.implements && cls.implements.includes('DbContext');
      if (isDbContext) {
        env[cls.name] = class extends env.DbContext {
          constructor() {
            super();
            // Initialize DbSet fields based on type annotations
            for (const fld of cls.fields || []) {
              if (fld.type && fld.type.startsWith('DbSet<')) {
                const m = fld.type.match(/DbSet<([^>]+)>/);
                const entityType = m ? m[1] : 'Entity';
                this[fld.name] = new env.DbSet(entityType);
              }
            }
          }
        };
      } else {
        const Cls = env[cls.name] = class {
          constructor() {
            for (const fld of cls.fields || []) {
              this[fld.name] = fld.type === 'int' || fld.type === 'ushort' || fld.type === 'short' || fld.type === 'decimal' ? 0 :
                              fld.type === 'string' ? '' :
                              fld.type === 'bool' ? false : null;
            }
          }
        };
        // Compile class methods onto prototype (for IComparer, Equals, etc.)
        for (const m of cls.methods || []) {
          const params = (m.params || '').split(',').map(s => s.trim().split(/\s+/).pop()).filter(Boolean);
          let body = m.body;
          // Prefix bare field references with `this.` (class fields are stored on `this`)
          for (const fld of cls.fields || []) {
            body = body.replace(new RegExp(`(?<![.\\w])${fld.name}(?![.\\w])`, 'g'), `this.${fld.name}`);
          }
          try {
            const fn = new Function(...params, `"use strict"; ${body}`);
            Cls.prototype[m.name] = fn;
          } catch (e) {
            console.warn(`Failed to compile method ${cls.name}.${m.name}: ${e.message}`);
          }
        }
      }
    }

    // BinaryFormatter / JsonSerializer (Part 2)
    env.BinaryFormatter = class BinaryFormatter {
      Serialize(stream, obj) {
        const json = JSON.stringify(obj);
        rt.downloadFile(stream._path, json);
      }
      Deserialize(stream) {
        const json = rt._currentFileContent || '';
        return JSON.parse(json);
      }
    };
    env.JsonSerializerOptions = class JsonSerializerOptions {
      constructor() { this.WriteIndented = false; }
    };
    env.JsonSerializer = {
      Serialize: (obj, options) => JSON.stringify(obj, null, options && options.WriteIndented ? 2 : 0),
      Deserialize: (s) => JSON.parse(s)
    };

    // Strategy classes for save/open (Part 2)
    env.SaveTxt = class SaveTxt {
      Save(notes, fileName) {
        const sw = new env.StreamWriter(fileName);
        for (const MyRecord of notes) {
          sw.WriteLine(MyRecord.LastName);
          sw.WriteLine(MyRecord.Name);
          sw.WriteLine(MyRecord.Patronymic);
          sw.WriteLine(MyRecord.Street);
          sw.WriteLine(MyRecord.House);
          sw.WriteLine(MyRecord.Flat);
          sw.WriteLine(MyRecord.Phone);
        }
        sw.Dispose();
      }
    };
    env.SaveXml = class SaveXml {
      Save(notes, fileName) {
        const xs = new env.XmlSerializer('List<Note>');
        const fs = new env.FileStream(fileName, 'Create');
        xs.Serialize(fs, notes);
        fs.Close();
      }
    };
    env.OpenTxt = class OpenTxt {
      OpenFile(fileName) {
        const notes = env.NewList();
        const sr = new env.StreamReader(fileName);
        while (!sr.EndOfStream) {
          const rec = env.NewNote();
          rec.LastName = sr.ReadLine();
          rec.Name = sr.ReadLine();
          rec.Patronymic = sr.ReadLine();
          rec.Street = sr.ReadLine();
          rec.House = parseInt(sr.ReadLine()) || 1;
          rec.Flat = parseInt(sr.ReadLine()) || 1;
          rec.Phone = sr.ReadLine();
          notes.Add(rec);
        }
        sr.Dispose();
        return notes;
      }
      AddFromFile(fileName, existing) {
        const newNotes = this.OpenFile(fileName);
        for (const note of newNotes) {
          if (!existing.includes(note)) existing.Add(note);
        }
        return existing;
      }
    };
    env.OpenXml = class OpenXml {
      OpenFile(fileName) {
        const xs = new env.XmlSerializer('List<Note>');
        const fs = new env.FileStream(fileName, 'Open');
        const notes = xs.Deserialize(fs);
        fs.Close();
        return notes;
      }
      AddFromFile(fileName, existing) {
        const newNotes = this.OpenFile(fileName);
        for (const note of newNotes) {
          if (!existing.includes(note)) existing.Add(note);
        }
        return existing;
      }
    };
    env.SerializeBin = class SerializeBin {
      Save(notes, fileName) {
        const bf = new env.BinaryFormatter();
        const fs = new env.FileStream(fileName, 'Create');
        bf.Serialize(fs, notes);
        fs.Close();
      }
    };
    env.DeserializeBin = class DeserializeBin {
      OpenFile(fileName) {
        const bf = new env.BinaryFormatter();
        const fs = new env.FileStream(fileName, 'Open');
        const notes = bf.Deserialize(fs);
        fs.Close();
        return notes;
      }
      AddFromFile(fileName, existing) {
        const newNotes = this.OpenFile(fileName);
        for (const note of newNotes) {
          if (!existing.includes(note)) existing.Add(note);
        }
        return existing;
      }
    };
    env.SerializeJson = class SerializeJson {
      Save(notes, fileName) {
        const options = new env.JsonSerializerOptions();
        options.WriteIndented = true;
        const json = env.JsonSerializer.Serialize(notes, options);
        env.File.WriteAllText(fileName, json);
      }
    };
    env.DeserializeJson = class DeserializeJson {
      OpenFile(fileName) {
        const s = env.File.ReadAllText(fileName);
        return env.JsonSerializer.Deserialize(s);
      }
      AddFromFile(fileName, existing) {
        const newNotes = this.OpenFile(fileName);
        for (const note of newNotes) {
          if (!existing.includes(note)) existing.Add(note);
        }
        return existing;
      }
    };

    // Simple Factory classes (Part 2, Exercise 4)
    env.OpenCreater = class OpenCreater {
      static Create(fileName) {
        const ext = env.Path.GetExtension(fileName).toLowerCase();
        if (ext === '.txt') return new env.OpenTxt();
        if (ext === '.xml') return new env.OpenXml();
        if (ext === '.dat') return new env.DeserializeBin();
        if (ext === '.json') return new env.DeserializeJson();
        return null;
      }
    };
    env.SaveCreater = class SaveCreater {
      static Create(fileName) {
        const ext = env.Path.GetExtension(fileName).toLowerCase();
        if (ext === '.txt') return new env.SaveTxt();
        if (ext === '.xml') return new env.SaveXml();
        if (ext === '.dat') return new env.SerializeBin();
        if (ext === '.json') return new env.SerializeJson();
        return null;
      }
    };

    return env;
  }

  toast(msg, kind = 'success') { showToast(msg, kind); }

  messageBox(text, title = '', buttons = 'OK') {
    return new Promise((resolve) => {
      const ov = document.createElement('div');
      ov.className = 'msgbox-overlay';
      const btns = buttons === 'YesNo' ? ['Yes','No'] :
                   buttons === 'OKCancel' ? ['OK','Cancel'] : ['OK'];
      ov.innerHTML = `
        <div class="msgbox">
          <div class="msgbox-title">${escapeHtml(title || 'Сообщение')}</div>
          <div class="msgbox-body">${escapeHtml(text).replace(/\n/g,'<br>')}</div>
          <div class="msgbox-buttons">
            ${btns.map((b,i) => `<button class="${i===0?'primary':''}" data-r="${b}">${b}</button>`).join('')}
          </div>
        </div>`;
      ov.querySelectorAll('button').forEach(b => {
        b.onclick = () => { ov.remove(); resolve(b.dataset.r); };
      });
      this.host.appendChild(ov);
    });
  }

  downloadFile(name, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.split(/[\/\\]/).pop() || 'export.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  showFileDialog(type) {
    return new Promise(resolve => {
      const inp = document.getElementById('file-input-hidden');
      const handler = (e) => {
        inp.removeEventListener('change', handler);
        inp.value = '';
        const file = e.target.files[0];
        if (!file) { resolve(null); return; }
        if (type === 'SaveFileDialog') {
          resolve({ name: file.name, content: '' });
        } else {
          const r = new FileReader();
          r.onload = () => {
            this._currentFileContent = r.result;
            resolve({ name: file.name, content: r.result });
          };
          r.readAsText(file);
        }
      };
      inp.addEventListener('change', handler);
      if (type === 'SaveFileDialog') {
        // Just ask for a filename via prompt (browsers can't open native Save dialog)
        const name = prompt('Имя файла для сохранения:', 'phonebook.txt');
        if (name) resolve({ name, content: '' });
        else resolve(null);
      } else {
        inp.click();
      }
    });
  }
}

// List<T> emulation
export function makeList() {
  const arr = [];
  Object.defineProperty(arr, 'Count', { get: () => arr.length });
  arr.Add = (x) => arr.push(x);
  arr.AddRange = (xs) => arr.push(...xs);
  arr.Clear = () => arr.length = 0;
  const smartIncludes = (x) => {
    if (x && typeof x.Equals === 'function') {
      return arr.some(item => x.Equals(item));
    }
    return Array.prototype.includes.call(arr, x);
  };
  arr.Contains = smartIncludes;
  arr.includes = smartIncludes;
  arr.IndexOf = (x) => arr.indexOf(x);
  arr.RemoveAt = (i) => arr.splice(i, 1);
  arr.Remove = (x) => { const i = arr.indexOf(x); if (i >= 0) arr.splice(i, 1); };
  arr.Insert = (i, x) => arr.splice(i, 0, x);
  arr.ElementAt = (i) => arr[i];
  arr.Sort = (cmp) => {
    if (cmp && typeof cmp.Compare === 'function') {
      return arr.sort((a, b) => cmp.Compare(a, b));
    }
    return arr.sort(cmp);
  };
  arr.Reverse = () => arr.reverse();
  arr.Find = (p) => arr.find(p);
  arr.FindAll = (p) => { const r = makeList(); arr.filter(p).forEach(x => r.Add(x)); return r; };
  arr.FindIndex = (p) => arr.findIndex(p);

  // LINQ-style methods (Part 3 — EF Core mock)
  arr.OrderBy = (fn) => {
    const r = makeList();
    r.push(...arr.slice().sort((a, b) => {
      const av = fn(a), bv = fn(b);
      return typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
    }));
    return r;
  };
  arr.ThenBy = (fn) => arr; // chaining stub; real ThenBy needs IOrderedEnumerable tracking
  arr.Where = (fn) => {
    const r = makeList();
    r.push(...arr.filter(fn));
    return r;
  };
  arr.First = () => arr[0];
  arr.FirstOrDefault = () => arr[0] ?? null;
  arr.ToArray = () => arr.slice();
  arr.ToList = () => {
    const r = makeList();
    r.push(...arr);
    return r;
  };
  arr.Any = () => arr.length > 0;
  arr.Max = (fn) => {
    if (arr.length === 0) return 0;
    const vals = arr.map(fn);
    return Math.max(...vals);
  };
  arr.Min = (fn) => {
    if (arr.length === 0) return 0;
    const vals = arr.map(fn);
    return Math.min(...vals);
  };
  arr.Select = (fn) => arr.map(fn);
  arr.Sum = (fn) => arr.map(fn).reduce((s, v) => s + v, 0);

  return arr;
}

export function makeNote() {
  return {
    LastName:'', Name:'', Patronymic:'', Street:'', House:0, Flat:0, Phone:'',
    Equals(other) {
      if (!other || typeof other !== 'object') return false;
      return this.LastName === other.LastName &&
             this.Name === other.Name &&
             this.Patronymic === other.Patronymic &&
             this.Street === other.Street &&
             this.House === other.House &&
             this.Flat === other.Flat &&
             this.Phone === other.Phone;
    },
    GetHashCode() { return 0; }
  };
}

// Support C# CompareTo round-trip for numeric sorts
Number.prototype.localeCompare = function(other) { return this - other; };
