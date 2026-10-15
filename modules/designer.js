import {
  ControlTypes, applicablePropsFor, getPropertyDescriptor,
  newControl, walkControls, findControlById, findControlByName,
  emptyProject, newForm, parsePadding
} from './ir.js';
import { renderForm, renderControl, escapeHtml } from './renderer.js';
import { Registry } from './control-registry.js';

/*
 * Designer — drag/drop, properties panel, solution explorer, tabs
 */
export const DesignerState = {
  project: null,
  activeFormId: null,
  selectedControlId: null,
  selectedIds: new Set(),
  selectedFormId: null,
  selectedItemPath: null,    // { ctrlId: string, path: number[] } for MenuStrip/StatusStrip item
  draggingType: null,        // type being dragged from toolbox
  draggingCtrlId: null,      // existing control being moved
  dragOffset: { x: 0, y: 0 },
  mode: 'design',
  runtime: null,
  undoStack: [],
  redoStack: [],
  maxUndo: 50,
  tabOrderMode: false,
  tabOrderNext: 0,
};

export function getActiveForm() {
  return DesignerState.project.forms.find(f => f.id === DesignerState.activeFormId);
}

export function getSelectedControl() {
  const form = getActiveForm();
  if (!form || !DesignerState.selectedControlId) return null;
  return findControlById(form, DesignerState.selectedControlId);
}

/* ---------- Undo / Redo ---------- */
export function pushUndo(label) {
  const snapshot = JSON.stringify({
    project: DesignerState.project,
    activeFormId: DesignerState.activeFormId,
    selectedControlId: DesignerState.selectedControlId,
    selectedIds: Array.from(DesignerState.selectedIds),
    selectedFormId: DesignerState.selectedFormId,
  });
  DesignerState.undoStack.push({ label, snapshot });
  if (DesignerState.undoStack.length > DesignerState.maxUndo) {
    DesignerState.undoStack.shift();
  }
  DesignerState.redoStack = [];
}

export function canUndo() { return DesignerState.undoStack.length > 0; }
export function canRedo() { return DesignerState.redoStack.length > 0; }

export function undo() {
  if (!canUndo()) return;
  const current = JSON.stringify({
    project: DesignerState.project,
    activeFormId: DesignerState.activeFormId,
    selectedControlId: DesignerState.selectedControlId,
    selectedIds: Array.from(DesignerState.selectedIds),
    selectedFormId: DesignerState.selectedFormId,
  });
  const entry = DesignerState.undoStack.pop();
  DesignerState.redoStack.push({ label: 'redo', snapshot: current });
  restoreSnapshot(entry.snapshot);
  showToast('Undo: ' + (entry.label || 'action'), 'success');
}

export function redo() {
  if (!canRedo()) return;
  const current = JSON.stringify({
    project: DesignerState.project,
    activeFormId: DesignerState.activeFormId,
    selectedControlId: DesignerState.selectedControlId,
    selectedIds: Array.from(DesignerState.selectedIds),
    selectedFormId: DesignerState.selectedFormId,
  });
  const entry = DesignerState.redoStack.pop();
  DesignerState.undoStack.push({ label: 'undo', snapshot: current });
  restoreSnapshot(entry.snapshot);
  showToast('Redo', 'success');
}

export function restoreSnapshot(json) {
  const s = JSON.parse(json);
  DesignerState.project = s.project;
  DesignerState.activeFormId = s.activeFormId;
  DesignerState.selectedControlId = s.selectedControlId;
  DesignerState.selectedIds = new Set(s.selectedIds || (s.selectedControlId ? [s.selectedControlId] : []));
  DesignerState.selectedFormId = s.selectedFormId;
  DesignerState.refreshAll();
}

/* ---------- Fast DOM sync (no full rebuild) ---------- */
export function syncControlDOM(ctrl) {
  const el = document.querySelector(`[data-ctrl-id="${ctrl.id}"]`);
  if (!el) return false;
  const p = ctrl.props;
  const td = ControlTypes[ctrl.type];

  // Position / size
  const dock = p.Dock || td.dock;
  if (dock === 'Top') {
    el.style.height = p['Size.Height'] + 'px';
  } else if (dock === 'Bottom') {
    el.style.height = p['Size.Height'] + 'px';
  } else if (dock === 'Left') {
    el.style.width = p['Size.Width'] + 'px';
  } else if (dock === 'Right') {
    el.style.width = p['Size.Width'] + 'px';
  } else if (dock === 'Fill') {
    // nothing to sync
  } else {
    el.style.left = p['Location.X'] + 'px';
    el.style.top = p['Location.Y'] + 'px';
    el.style.width = p['Size.Width'] + 'px';
    el.style.height = p['Size.Height'] + 'px';
  }

  // Font
  el.style.fontFamily = p['Font.Family'] || 'Segoe UI';
  el.style.fontSize = (p['Font.Size'] * 1.333) + 'px';
  el.style.fontWeight = p['Font.Bold'] ? '500' : '';

  // Visible / Enabled / Name
  el.style.display = p.Visible === false ? 'none' : '';
  el.dataset.ctrlName = p.Name;
  if (p.Enabled === false) el.classList.add('disabled');
  else el.classList.remove('disabled');

  // Inner content (lightweight per-type update)
  const adapter = Registry[ctrl.type];
  if (adapter && adapter.syncDOM) {
    const ok = adapter.syncDOM(el, ctrl);
    if (ok) return true;
  }
  return false;
}

export function genUniqueName(form, baseType) {
  let i = 1;
  while (true) {
    const candidate = baseType.charAt(0).toLowerCase() + baseType.slice(1) + i;
    if (!findControlByName(form, candidate)) return candidate;
    i++;
  }
}

// ----- Toolbox -----
export function renderToolbox() {
  const container = document.getElementById('toolbox-content');
  const groups = {};
  for (const [type, td] of Object.entries(ControlTypes)) {
    if (type === 'Form') continue;
    (groups[td.category] = groups[td.category] || []).push(type);
  }
  container.innerHTML = '';
  for (const [group, types] of Object.entries(groups)) {
    const g = document.createElement('div');
    g.className = 'toolbox-group';
    g.innerHTML = `<div class="toolbox-group-header">${group}</div>`;
    for (const t of types) {
      const item = document.createElement('div');
      item.className = 'toolbox-item';
      item.draggable = true;
      item.innerHTML = `<span class="icon">⬚</span>${t}`;
      item.dataset.type = t;
      item.addEventListener('dragstart', e => {
        DesignerState.draggingType = t;
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', t);
      });
      g.appendChild(item);
    }
    container.appendChild(g);
  }
}

// ----- Solution tree -----
export function renderTree() {
  const panel = document.getElementById('tree-panel');
  panel.innerHTML = '';
  // Forms
  for (const form of DesignerState.project.forms) {
    const fnode = document.createElement('div');
    fnode.className = 'tree-node form' + (form.id === DesignerState.activeFormId ? ' selected' : '');
    fnode.textContent = form.props.Name + '.cs' + (form.isMain ? '  [Main]' : '');
    fnode.onclick = () => { switchForm(form.id); };
    panel.appendChild(fnode);
    for (const ctrl of walkControls(form)) {
      const td = ControlTypes[ctrl.type];
      if (td.invisible) {
        const cnode = document.createElement('div');
        cnode.className = 'tree-node' + (DesignerState.selectedIds.has(ctrl.id) ? ' selected' : '');
        cnode.textContent = '◇ ' + ctrl.props.Name;
        cnode.style.paddingLeft = '36px';
        cnode.onclick = (e) => selectControl(ctrl.id, e.ctrlKey || e.metaKey);
        panel.appendChild(cnode);
      } else {
        const cnode = document.createElement('div');
        cnode.className = 'tree-node' + (DesignerState.selectedIds.has(ctrl.id) ? ' selected' : '');
        cnode.textContent = ctrl.props.Name + ' : ' + ctrl.type;
        cnode.style.paddingLeft = '36px';
        cnode.onclick = (e) => selectControl(ctrl.id, e.ctrlKey || e.metaKey);
        panel.appendChild(cnode);
      }
      // Render MenuStrip / StatusStrip items as nested tree nodes
      if (ctrl.items && ctrl.items.length) {
        for (let i = 0; i < ctrl.items.length; i++) {
          const it = ctrl.items[i];
          const inode = document.createElement('div');
          const isSel = DesignerState.selectedItemPath &&
            DesignerState.selectedItemPath.ctrlId === ctrl.id &&
            DesignerState.selectedItemPath.path.length === 1 &&
            DesignerState.selectedItemPath.path[0] === i;
          inode.className = 'tree-node' + (isSel ? ' selected' : '');
          inode.textContent = (ctrl.type === 'MenuStrip' ? '▸ ' : '▪ ') + (it.Name || it.Text || 'Item');
          inode.style.paddingLeft = '54px';
          inode.style.fontSize = '11px';
          inode.style.opacity = '0.8';
          inode.onclick = (e) => { e.stopPropagation(); selectItem(ctrl.id, [i]); };
          panel.appendChild(inode);
          // Nested sub-items for MenuStrip top-level items
          if (it.items && it.items.length) {
            for (let j = 0; j < it.items.length; j++) {
              const sub = it.items[j];
              const snode = document.createElement('div');
              const isSubSel = DesignerState.selectedItemPath &&
                DesignerState.selectedItemPath.ctrlId === ctrl.id &&
                DesignerState.selectedItemPath.path.length === 2 &&
                DesignerState.selectedItemPath.path[0] === i &&
                DesignerState.selectedItemPath.path[1] === j;
              snode.className = 'tree-node' + (isSubSel ? ' selected' : '');
              snode.textContent = (sub.IsSeparator ? '—' : (sub.Name || sub.Text || 'Item'));
              snode.style.paddingLeft = '72px';
              snode.style.fontSize = '11px';
              snode.style.opacity = '0.7';
              snode.onclick = (e) => { e.stopPropagation(); selectItem(ctrl.id, [i, j]); };
              panel.appendChild(snode);
            }
          }
        }
      }
    }
  }
  // Classes
  const classes = DesignerState.project.classes || [];
  if (classes.length > 0) {
    const sep = document.createElement('div');
    sep.className = 'tree-sep';
    sep.style.cssText = 'height:1px;background:#444;margin:8px 0;';
    panel.appendChild(sep);
    for (const cls of classes) {
      const cnode = document.createElement('div');
      cnode.className = 'tree-node';
      cnode.textContent = cls.name + '.cs';
      cnode.style.paddingLeft = '18px';
      // Clicking a class shows its fields/methods in inspector (basic)
      cnode.onclick = () => {
        DesignerState.activeClass = cls;
        renderInspector();
      };
      panel.appendChild(cnode);
    }
  }
}

// ----- Persistent designer view layer -----
export const _designerView = { root: null, body: null, domMap: new Map() };

export function syncTabs() {
  const tabs = document.getElementById('designer-tabs');
  const formIds = DesignerState.project.forms.map(f => f.id);
  const existingIds = Array.from(tabs.children).map(t => t.dataset.formId);
  if (JSON.stringify(formIds) !== JSON.stringify(existingIds)) {
    tabs.innerHTML = '';
    for (const form of DesignerState.project.forms) {
      const tab = document.createElement('div');
      tab.className = 'designer-tab' + (form.id === DesignerState.activeFormId ? ' active' : '');
      tab.textContent = form.props.Name + '.cs [Design]';
      tab.dataset.formId = form.id;
      tab.onclick = () => switchForm(form.id);
      tabs.appendChild(tab);
    }
  } else {
    Array.from(tabs.children).forEach(tab => {
      tab.classList.toggle('active', tab.dataset.formId === DesignerState.activeFormId);
    });
  }
}

export function updateDesignerSelection() {
  if (!_designerView.root) return;
  _designerView.root.querySelectorAll('.control.selected').forEach(el => el.classList.remove('selected'));
  _designerView.root.querySelectorAll('.selection-chrome').forEach(el => el.remove());
  _designerView.root.querySelectorAll('[data-item-path]').forEach(el => { el.style.outline = ''; el.style.outlineOffset = ''; });
  const ids = Array.from(DesignerState.selectedIds);
  for (const id of ids) {
    const el = _designerView.domMap.get(id);
    if (el) el.classList.add('selected');
  }
  if (ids.length === 1 && DesignerState.selectedControlId) {
    const el = _designerView.domMap.get(DesignerState.selectedControlId);
    if (el) {
      const rect = el.getBoundingClientRect();
      const bodyRect = _designerView.body.getBoundingClientRect();
      const chrome = document.createElement('div');
      chrome.className = 'selection-chrome';
      chrome.style.left = (rect.left - bodyRect.left) + 'px';
      chrome.style.top = (rect.top - bodyRect.top) + 'px';
      chrome.style.width = rect.width + 'px';
      chrome.style.height = rect.height + 'px';
      ['nw','n','ne','w','e','sw','s','se'].forEach(dir => {
        const h = document.createElement('div');
        h.className = 'resize-handle ' + dir;
        h.dataset.dir = dir;
        chrome.appendChild(h);
      });
      _designerView.body.appendChild(chrome);
    }
  } else if (ids.length > 1) {
    for (const id of ids) {
      const el = _designerView.domMap.get(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const bodyRect = _designerView.body.getBoundingClientRect();
      const chrome = document.createElement('div');
      chrome.className = 'selection-chrome';
      chrome.style.left = (rect.left - bodyRect.left) + 'px';
      chrome.style.top = (rect.top - bodyRect.top) + 'px';
      chrome.style.width = rect.width + 'px';
      chrome.style.height = rect.height + 'px';
      _designerView.body.appendChild(chrome);
    }
  }
  // Highlight selected item inside MenuStrip/StatusStrip
  if (DesignerState.selectedItemPath) {
    const ctrlEl = _designerView.domMap.get(DesignerState.selectedItemPath.ctrlId);
    if (ctrlEl) {
      const pathStr = JSON.stringify(DesignerState.selectedItemPath.path);
      const itemEl = ctrlEl.querySelector(`[data-item-path='${pathStr}']`);
      if (itemEl) {
        itemEl.style.outline = '2px solid #0e639c';
        itemEl.style.outlineOffset = '-2px';
      }
    }
  }
}

export function bindDesignerEvents(host) {
  if (host._designerBound) return;
  host._designerBound = true;
  host.addEventListener('click', (e) => {
    if (DesignerState.mode !== 'design') return;
    // Click on MenuStrip/StatusStrip item
    const itemTarget = e.target.closest('[data-item-path]');
    if (itemTarget) {
      const ctrlEl = itemTarget.closest('.control');
      if (ctrlEl) {
        e.stopPropagation();
        const path = JSON.parse(itemTarget.dataset.itemPath);
        selectItem(ctrlEl.dataset.ctrlId, path);
        return;
      }
    }
    const target = e.target.closest('.control');
    const formBody = e.target.closest('.winform-body');
    if (!formBody) return;
    const form = getActiveForm();
    if (target && form) {
      e.stopPropagation();
      const ctrl = findControlById(form, target.dataset.ctrlId);
      if (!ctrl) return;
      const td = ControlTypes[ctrl.type];
      if (ctrl.props.Dock || td.dock) return;
      if (DesignerState.tabOrderMode) {
        ctrl.props.TabIndex = DesignerState.tabOrderNext++;
        updateTabOrderBadges();
        pushUndo('tab order');
        return;
      }
      selectControl(target.dataset.ctrlId, e.ctrlKey || e.metaKey);
    } else if (form) {
      selectForm(form.id);
    }
  });
  host.addEventListener('dragover', (e) => {
    if (DesignerState.mode !== 'design') return;
    const body = e.target.closest('.winform-body');
    if (body) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  });
  host.addEventListener('drop', (e) => {
    if (DesignerState.mode !== 'design') return;
    const body = e.target.closest('.winform-body');
    if (!body) return;
    e.preventDefault();
    const type = DesignerState.draggingType;
    DesignerState.draggingType = null;
    if (!type) return;
    const rect = body.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const form = getActiveForm();
    const ctrl = newControl(type, genUniqueName(form, type));
    ctrl.props['Location.X'] = Math.max(0, Math.round(x / 8) * 8);
    ctrl.props['Location.Y'] = Math.max(0, Math.round(y / 8) * 8);
    if (type === 'Label') ctrl.props.Text = ctrl.props.Name;
    if (type === 'Button') ctrl.props.Text = ctrl.props.Name;
    pushUndo('add control');
    form.children.push(ctrl);
    DesignerState.selectedIds.clear();
    DesignerState.selectedControlId = ctrl.id;
    DesignerState.selectedIds.add(ctrl.id);
    syncDesigner();
    updateAlignToolbar();
  });
  host.addEventListener('mousedown', (e) => {
    if (DesignerState.mode !== 'design') return;
    const handleEl = e.target.closest('.resize-handle');
    if (handleEl) {
      if (DesignerState.selectedIds.size !== 1) return;
      e.preventDefault();
      const dir = handleEl.dataset.dir;
      const form = getActiveForm();
      const ctrl = findControlById(form, DesignerState.selectedControlId);
      if (!ctrl) return;
      const td = ControlTypes[ctrl.type];
      if (ctrl.props.Dock || td.dock) return;
      const target = _designerView.domMap.get(DesignerState.selectedControlId);
      const startX = e.clientX, startY = e.clientY;
      const origX = ctrl.props['Location.X'], origY = ctrl.props['Location.Y'];
      const origW = ctrl.props['Size.Width'], origH = ctrl.props['Size.Height'];
      let changed = false;
      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (Math.abs(dx) + Math.abs(dy) > 0) changed = true;
        let newX = origX, newY = origY, newW = origW, newH = origH;
        if (dir.includes('e')) newW = Math.max(8, origW + dx);
        if (dir.includes('s')) newH = Math.max(8, origH + dy);
        if (dir.includes('w')) { newW = Math.max(8, origW - dx); newX = origX + (origW - newW); }
        if (dir.includes('n')) { newH = Math.max(8, origH - dy); newY = origY + (origH - newH); }
        ctrl.props['Location.X'] = Math.max(0, newX);
        ctrl.props['Location.Y'] = Math.max(0, newY);
        ctrl.props['Size.Width'] = newW;
        ctrl.props['Size.Height'] = newH;
        if (target) {
          target.style.left = ctrl.props['Location.X'] + 'px';
          target.style.top = ctrl.props['Location.Y'] + 'px';
          target.style.width = ctrl.props['Size.Width'] + 'px';
          target.style.height = ctrl.props['Size.Height'] + 'px';
        }
        updateDesignerSelection();
        renderInspector();
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (changed) pushUndo('resize control');
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      return;
    }
    const target = e.target.closest('.control');
    if (!target) return;
    const body = e.target.closest('.winform-body');
    if (!body) return;
    const form = getActiveForm();
    const ctrl = findControlById(form, target.dataset.ctrlId);
    if (!ctrl) return;
    const td = ControlTypes[ctrl.type];
    if (ctrl.props.Dock || td.dock) return;
    if (!DesignerState.selectedIds.has(ctrl.id)) {
      selectControl(ctrl.id);
    }
    // Hide resize chrome while dragging — it would lag behind
    _designerView.root.querySelectorAll('.selection-chrome').forEach(el => el.remove());
    const startX = e.clientX, startY = e.clientY;
    const moving = Array.from(DesignerState.selectedIds).map(id => {
      const c = findControlById(form, id);
      if (!c) return null;
      const ctd = ControlTypes[c.type];
      if (c.props.Dock || ctd.dock) return null;
      const el = _designerView.domMap.get(id);
      return { id, ctrl: c, origX: c.props['Location.X'], origY: c.props['Location.Y'], el };
    }).filter(Boolean);
    let moved = false;
    let snaplines = [];
    const onMove = (ev) => {
      let dx = ev.clientX - startX;
      let dy = ev.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      // Snapline logic: use first selected control as anchor
      if (moving.length > 0) {
        const anchor = moving[0];
        const snapX = computeSnapX(anchor.ctrl, dx, form, moving.map(m => m.ctrl));
        const snapY = computeSnapY(anchor.ctrl, dy, form, moving.map(m => m.ctrl));
        if (snapX.snapped) dx = snapX.dx;
        if (snapY.snapped) dy = snapY.dy;
        clearSnaplines();
        if (snapX.snapped || snapY.snapped) {
          const lines = [];
          if (snapX.snapped) lines.push(...snapX.lines);
          if (snapY.snapped) lines.push(...snapY.lines);
          drawSnaplines(lines);
          snaplines = lines;
        }
      }
      for (const m of moving) {
        m.ctrl.props['Location.X'] = Math.max(0, m.origX + dx);
        m.ctrl.props['Location.Y'] = Math.max(0, m.origY + dy);
        if (m.el) {
          m.el.style.left = m.ctrl.props['Location.X'] + 'px';
          m.el.style.top = m.ctrl.props['Location.Y'] + 'px';
        }
      }
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      clearSnaplines();
      if (moved) { pushUndo('move control'); renderInspector(); }
      updateDesignerSelection();
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// ----- Designer canvas -----
export function syncDesigner() {
  const host = document.getElementById('form-host');
  const form = getActiveForm();
  syncTabs();
  if (!form) {
    host.innerHTML = '';
    _designerView.root = null;
    _designerView.body = null;
    _designerView.domMap.clear();
    return;
  }
  const existingRoot = _designerView.root;
  // Full rebuild only on form switch
  if (!existingRoot || !existingRoot.parentElement || existingRoot.dataset.formId !== form.id) {
    host.innerHTML = '';
    _designerView.domMap.clear();
    const root = renderForm(form, 'design');
    _designerView.root = root;
    _designerView.body = root.querySelector('.winform-body');
    host.appendChild(root);
    _designerView.body.querySelectorAll('.control').forEach(el => {
      _designerView.domMap.set(el.dataset.ctrlId, el);
    });
    bindDesignerEvents(host);
    updateDesignerSelection();
    return;
  }
  // Incremental sync — same form
  const title = existingRoot.querySelector('.winform-titlebar .title');
  if (title) title.textContent = form.props.Text;
  const w = form.props['Size.Width'] || 520;
  const h = form.props['Size.Height'] || 360;
  existingRoot.style.width = w + 'px';
  _designerView.body.style.width = w + 'px';
  _designerView.body.style.height = h + 'px';
  const presentIds = new Set();
  for (const child of form.children) {
    presentIds.add(child.id);
    let el = _designerView.domMap.get(child.id);
    if (!el || !_designerView.body.contains(el)) {
      el = renderControl(child, 'design');
      if (el) {
        _designerView.body.appendChild(el);
        _designerView.domMap.set(child.id, el);
      }
    } else {
      syncControlDOM(child, el);
    }
    const td = ControlTypes[child.type];
    if (td && td.canHaveChildren && child.children) {
      syncContainerChildren(child, el, presentIds, 'design');
    }
  }
  for (const [id, el] of Array.from(_designerView.domMap.entries())) {
    if (!presentIds.has(id)) {
      el.remove();
      _designerView.domMap.delete(id);
    }
  }
  // Ensure DOM order matches form.children (Z-order via bringToFront/sendToBack)
  let prevEl = null;
  for (const child of form.children) {
    const el = _designerView.domMap.get(child.id);
    if (el && el.parentElement === _designerView.body) {
      if (prevEl) {
        if (prevEl.nextElementSibling !== el) {
          _designerView.body.insertBefore(el, prevEl.nextElementSibling);
        }
      } else if (_designerView.body.firstElementChild !== el) {
        _designerView.body.insertBefore(el, _designerView.body.firstElementChild);
      }
      prevEl = el;
    }
  }
  updateDesignerSelection();
}

function syncContainerChildren(containerCtrl, parentEl, presentIds, mode) {
  const containerBody = parentEl.querySelector('.container-body') || parentEl;
  for (const child of (containerCtrl.children || [])) {
    presentIds.add(child.id);
    let el = _designerView.domMap.get(child.id);
    if (!el || !containerBody.contains(el)) {
      el = renderControl(child, mode);
      if (el) {
        el.style.position = 'absolute';
        containerBody.appendChild(el);
        _designerView.domMap.set(child.id, el);
      }
    } else {
      syncControlDOM(child, el);
    }
    const td = ControlTypes[child.type];
    if (td && td.canHaveChildren && child.children) {
      const childEl = _designerView.domMap.get(child.id);
      if (childEl) syncContainerChildren(child, childEl, presentIds, mode);
    }
  }
}

// ----- Inspector -----
export function renderInspector() {
  const target = document.getElementById('inspector-target');
  const props = document.getElementById('inspector-props');

  // --- Item inspector (MenuStrip / StatusStrip items) ---
  if (DesignerState.selectedItemPath) {
    const { ctrlId, path } = DesignerState.selectedItemPath;
    const ctrl = findControlById(getActiveForm(), ctrlId);
    if (ctrl) {
      let item = ctrl;
      for (const idx of path) item = (item.items || [])[idx];
      if (item) {
        target.innerHTML = `<div class="target-name">${escapeHtml(item.Name || item.Text || 'Item')}</div><div class="target-type">${ctrl.type} item</div>`;
        props.innerHTML = '';
        const fields = [
          { key: 'Name', val: item.Name || '' },
          { key: 'Text', val: item.Text || '' },
        ];
        if (ctrl.type === 'MenuStrip') {
          fields.push({ key: 'IsSeparator', val: item.IsSeparator ? 'true' : 'false' });
        }
        for (const f of fields) {
          const row = document.createElement('div');
          row.className = 'prop-row';
          row.innerHTML = `<div class="key">${f.key}</div><div class="val"><input type="text" value="${escapeHtml(f.val)}"></div>`;
          const ed = row.querySelector('input');
          ed.addEventListener('change', () => {
            pushUndo('item property change');
            item[f.key] = ed.value;
            if (f.key === 'Text' || f.key === 'Name') {
              syncControlDOM(ctrl);
              renderTree();
            }
            renderInspector();
            if (DesignerState._onMutate) DesignerState._onMutate();
          });
          props.appendChild(row);
        }
        // Click event for MenuStrip sub-items
        if (ctrl.type === 'MenuStrip' && path.length === 2) {
          const evRow = document.createElement('div');
          evRow.className = 'prop-row';
          const handlerId = item.events?.Click;
          const hasHandler = !!handlerId;
          evRow.innerHTML = `<div class="key">Click</div><div class="val"><button style="width:100%">${hasHandler ? 'Edit handler' : 'Add handler'}</button></div>`;
          evRow.querySelector('button').onclick = () => {
            openHandlerEditor(item, 'Click');
          };
          props.appendChild(evRow);
        }
        // Item management buttons
        const btns = document.createElement('div');
        btns.className = 'prop-group-header';
        btns.style.display = 'flex';
        btns.style.gap = '4px';
        btns.style.marginTop = '8px';
        btns.innerHTML = `<button>+</button><button>-</button><button>↑</button><button>↓</button>`;
        const [btnAdd, btnRem, btnUp, btnDown] = btns.querySelectorAll('button');
        btnAdd.onclick = () => {
          pushUndo('add item');
          const parent = path.length === 1 ? ctrl : (ctrl.items[path[0]]);
          const newItem = { Name: 'newItemToolStripMenuItem', Text: 'New Item' };
          if (ctrl.type === 'StatusStrip') newItem.Name = 'newToolStripStatusLabel';
          parent.items = parent.items || [];
          parent.items.splice(path[path.length - 1] + 1, 0, newItem);
          syncControlDOM(ctrl);
          renderTree();
          renderInspector();
          if (DesignerState._onMutate) DesignerState._onMutate();
        };
        btnRem.onclick = () => {
          pushUndo('remove item');
          const parent = path.length === 1 ? ctrl : (ctrl.items[path[0]]);
          parent.items.splice(path[path.length - 1], 1);
          DesignerState.selectedItemPath = null;
          syncControlDOM(ctrl);
          renderTree();
          renderInspector();
          if (DesignerState._onMutate) DesignerState._onMutate();
        };
        btnUp.onclick = () => {
          const idx = path[path.length - 1];
          if (idx <= 0) return;
          pushUndo('move item up');
          const parent = path.length === 1 ? ctrl : (ctrl.items[path[0]]);
          [parent.items[idx - 1], parent.items[idx]] = [parent.items[idx], parent.items[idx - 1]];
          DesignerState.selectedItemPath.path[path.length - 1] = idx - 1;
          syncControlDOM(ctrl);
          renderTree();
          renderInspector();
          if (DesignerState._onMutate) DesignerState._onMutate();
        };
        btnDown.onclick = () => {
          const idx = path[path.length - 1];
          const parent = path.length === 1 ? ctrl : (ctrl.items[path[0]]);
          if (idx >= parent.items.length - 1) return;
          pushUndo('move item down');
          [parent.items[idx], parent.items[idx + 1]] = [parent.items[idx + 1], parent.items[idx]];
          DesignerState.selectedItemPath.path[path.length - 1] = idx + 1;
          syncControlDOM(ctrl);
          renderTree();
          renderInspector();
          if (DesignerState._onMutate) DesignerState._onMutate();
        };
        props.appendChild(btns);
        return;
      }
    }
  }

  const ids = Array.from(DesignerState.selectedIds);
  const selForm = !ids.length && DesignerState.selectedFormId === DesignerState.activeFormId ? getActiveForm() : null;

  if (ids.length > 1) {
    target.innerHTML = `<div class="target-name">${ids.length} controls selected</div><div class="target-type">Multiple selection</div>`;
    props.innerHTML = `<div class="empty-inspector">Select a single control to edit properties</div>`;
    return;
  }

  const sel = getSelectedControl();
  const ent = sel || selForm;

  if (!ent) {
    target.innerHTML = `<div class="target-name">(nothing selected)</div><div class="target-type"></div>`;
    props.innerHTML = `<div class="empty-inspector">Select a control to view properties</div>`;
    return;
  }

  const type = ent.type;
  target.innerHTML = `
    <div class="target-name">${escapeHtml(ent.props.Name)}</div>
    <div class="target-type">${type}${ent === selForm ? ' (Form)' : ''}</div>`;

  const groups = applicablePropsFor(type);
  props.innerHTML = '';

  // Categorized
  for (const [groupName, keys] of Object.entries(groups)) {
    const gh = document.createElement('div');
    gh.className = 'prop-group-header';
    gh.textContent = groupName;
    props.appendChild(gh);

    for (const key of keys) {
      const d = getPropertyDescriptor(key, ent.type);
      if (!d) continue;
      const row = document.createElement('div');
      row.className = 'prop-row' + (d.type === 'bool' ? ' bool' : '');
      const val = ent.props[key];

      let editor = '';
      if (d.type === 'bool') {
        editor = `<select><option value="true" ${val ? 'selected' : ''}>True</option><option value="false" ${!val ? 'selected' : ''}>False</option></select>`;
      } else if (d.type === 'enum') {
        editor = `<select>${d.options.map(o => `<option ${o===val?'selected':''}>${o}</option>`).join('')}</select>`;
      } else {
        const t = d.type === 'string' ? 'text' : 'number';
        editor = `<input type="${t}" value="${escapeHtml(val ?? '')}" ${d.type==='float'?'step="0.5"':''}>`;
      }
      row.innerHTML = `<div class="key">${key}</div><div class="val">${editor}</div>`;
      const ed = row.querySelector('input, select');
      ed.addEventListener('change', () => {
        pushUndo('property change');
        let newVal = ed.value;
        if (d.type === 'bool') newVal = newVal === 'true';
        else if (d.type === 'int') newVal = parseInt(newVal, 10) || 0;
        else if (d.type === 'float') newVal = parseFloat(newVal) || 0;
        ent.props[key] = newVal;
        if (key === 'Name') {
          DesignerState.refreshAll();
        } else {
          // Fast DOM sync — no full rebuild
          if (ent.type === 'Form') {
            // Form-level props (Text, Size) need full render
            syncDesigner();
          } else {
            const ok = syncControlDOM(ent);
            if (!ok) syncDesigner();
          }
          // Rebuild inspector so values stay in sync
          renderInspector();
          updateDesignerSelection();
          // Trigger auto-save for non-Name property changes too
          if (DesignerState._onMutate) DesignerState._onMutate();
        }
      });
      props.appendChild(row);
    }
  }

  // Events section
  if (sel) {
    const evHeader = document.createElement('div');
    evHeader.className = 'prop-group-header';
    evHeader.textContent = 'Events';
    props.appendChild(evHeader);

    const commonEvents = ['Click'];
    const textEvents = ['Click', 'TextChanged'];
    const checkEvents = ['Click', 'CheckedChanged'];
    const valueEvents = ['Click', 'ValueChanged'];
    const selectEvents = ['Click', 'SelectedIndexChanged'];
    const cellEvents = ['Click', 'CellClick'];
    const treeEvents = ['Click', 'AfterSelect'];
    const eventMap = {
      'Button': commonEvents,
      'TextBox': textEvents,
      'MaskedTextBox': textEvents,
      'RichTextBox': textEvents,
      'NumericUpDown': valueEvents,
      'CheckBox': checkEvents,
      'RadioButton': checkEvents,
      'ComboBox': selectEvents,
      'ListBox': selectEvents,
      'CheckedListBox': selectEvents.concat(['ItemCheck']),
      'DataGridView': cellEvents,
      'TreeView': treeEvents,
      'Form': ['Load', 'Shown', 'FormClosing'],
      'ProgressBar': [],
      'PictureBox': commonEvents,
      'DateTimePicker': ['ValueChanged'],
      'Label': commonEvents,
      'Panel': commonEvents,
      'GroupBox': commonEvents,
      'MenuStrip': [],
      'StatusStrip': [],
    };
    const eventNames = eventMap[sel.type] || [];
    const alwaysEvents = sel.type === 'Form' ? [] : ['DoubleClick', 'MouseClick'];
    const eventNamesFinal = [...eventNames, ...alwaysEvents];
    for (const evName of eventNamesFinal) {
      const row = document.createElement('div');
      row.className = 'prop-row';
      const handlerId = sel.events?.[evName] || '';
      const handlerLabel = handlerId ? (DesignerState.project.handlers[handlerId]?.label || handlerId) : '(none)';
      row.innerHTML = `<div class="key">${evName}</div><div class="val"><input type="text" readonly value="${escapeHtml(handlerLabel)}" style="cursor:pointer;"></div>`;
      row.querySelector('input').onclick = () => openHandlerEditor(sel, evName);
      props.appendChild(row);
    }
  }
}

export function openHandlerEditor(target, eventName) {
  const proj = DesignerState.project;
  let handlerId = target.events?.[eventName];
  let body = '';
  let label = '';
  if (handlerId && proj.handlers[handlerId]) {
    body = proj.handlers[handlerId].body;
    label = proj.handlers[handlerId].label;
  } else {
    handlerId = 'h_' + Math.random().toString(36).slice(2, 8);
    label = `${target.props?.Name || target.Name || 'Item'}_${eventName}`;
    body = '// ' + label + '\n';
  }

  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;';
  ov.innerHTML = `
    <div style="background:#1e1e1e;border:1px solid #3e3e42;border-radius:6px;width:720px;max-width:90vw;height:520px;display:flex;flex-direction:column;">
      <div style="padding:10px 14px;border-bottom:1px solid #3e3e42;display:flex;align-items:center;gap:12px;">
        <span style="font-size:13px;color:#fff;">Edit handler: <code style="color:#4ec9b0;">${label}</code></span>
        <span style="color:#858585;font-size:11px;margin-left:auto;">Language: C#-flavored JS (transpiled to C# on export)</span>
      </div>
      <textarea id="handler-body" style="flex:1;background:#1e1e1e;color:#dcdcdc;border:none;font-family:Consolas,Menlo,monospace;font-size:13px;padding:12px;resize:none;outline:none;">${escapeHtml(body)}</textarea>
      <div style="padding:10px 14px;border-top:1px solid #3e3e42;display:flex;justify-content:flex-end;gap:8px;">
        <button id="handler-cancel" style="background:#3e3e42;color:#fff;border:none;padding:6px 16px;border-radius:3px;cursor:pointer;">Cancel</button>
        <button id="handler-save" style="background:#0e639c;color:#fff;border:none;padding:6px 16px;border-radius:3px;cursor:pointer;">Save</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#handler-cancel').onclick = () => ov.remove();
  ov.querySelector('#handler-save').onclick = () => {
    const newBody = ov.querySelector('#handler-body').value;
    proj.handlers[handlerId] = { label, body: newBody, eventType: eventName };
    target.events = target.events || {};
    target.events[eventName] = handlerId;
    ov.remove();
    renderInspector();
  };
}

// ----- Selection -----
export function selectControl(id, keepMulti = false) {
  if (keepMulti) {
    if (DesignerState.selectedIds.has(id)) {
      DesignerState.selectedIds.delete(id);
      if (DesignerState.selectedControlId === id) {
        const remaining = Array.from(DesignerState.selectedIds);
        DesignerState.selectedControlId = remaining.length ? remaining[remaining.length - 1] : null;
      }
    } else {
      DesignerState.selectedIds.add(id);
      DesignerState.selectedControlId = id;
    }
  } else {
    DesignerState.selectedIds.clear();
    DesignerState.selectedIds.add(id);
    DesignerState.selectedControlId = id;
  }
  DesignerState.selectedFormId = null;
  DesignerState.selectedItemPath = null;
  updateDesignerSelection();
  renderTree();
  renderInspector();
  updateAlignToolbar();
}
export function selectForm(id) {
  DesignerState.selectedControlId = null;
  DesignerState.selectedIds.clear();
  DesignerState.selectedItemPath = null;
  DesignerState.selectedFormId = id;
  updateDesignerSelection();
  renderTree();
  renderInspector();
  updateAlignToolbar();
}

export function selectItem(ctrlId, path) {
  DesignerState.selectedIds.clear();
  DesignerState.selectedControlId = ctrlId;
  DesignerState.selectedIds.add(ctrlId);
  DesignerState.selectedItemPath = { ctrlId, path: path.slice() };
  DesignerState.selectedFormId = null;
  updateDesignerSelection();
  renderTree();
  renderInspector();
  updateAlignToolbar();
}
export function switchForm(id) {
  DesignerState.activeFormId = id;
  DesignerState.selectedControlId = null;
  DesignerState.selectedIds.clear();
  DesignerState.selectedFormId = null;
  DesignerState.refreshAll();
}

DesignerState.refreshAll = function() {
  renderToolbox();
  renderTree();
  syncDesigner();
  renderInspector();
};

// Delete selected
if (typeof window !== 'undefined') {
window.addEventListener('keydown', (e) => {
  if (DesignerState.mode !== 'design') return;
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (DesignerState.selectedIds.size === 0) return;
    if (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    const form = getActiveForm();
    pushUndo('delete controls');
    function removeIds(parent, ids) {
      for (let i = parent.children.length - 1; i >= 0; i--) {
        const c = parent.children[i];
        if (ids.has(c.id)) {
          parent.children.splice(i, 1);
        } else if (c.children) {
          removeIds(c, ids);
        }
      }
    }
    removeIds(form, DesignerState.selectedIds);
    DesignerState.selectedIds.clear();
    DesignerState.selectedControlId = null;
    DesignerState.refreshAll();
  }
  // Nudge with arrow keys
  if (['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)) {
    if (DesignerState.selectedIds.size > 0 && !(document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName))) {
      e.preventDefault();
      const step = e.shiftKey ? 8 : 1;
      let changed = false;
      const form = getActiveForm();
      for (const id of DesignerState.selectedIds) {
        const ctrl = findControlById(form, id);
        if (!ctrl) continue;
        const td = ControlTypes[ctrl.type];
        if (ctrl.props.Dock || td.dock) continue;
        let x = ctrl.props['Location.X'];
        let y = ctrl.props['Location.Y'];
        if (e.key === 'ArrowLeft') x -= step;
        if (e.key === 'ArrowUp') y -= step;
        if (e.key === 'ArrowRight') x += step;
        if (e.key === 'ArrowDown') y += step;
        ctrl.props['Location.X'] = Math.max(0, x);
        ctrl.props['Location.Y'] = Math.max(0, y);
        const el = _designerView.domMap.get(id);
        if (el) {
          el.style.left = ctrl.props['Location.X'] + 'px';
          el.style.top = ctrl.props['Location.Y'] + 'px';
        }
        changed = true;
      }
      if (changed) {
        updateDesignerSelection();
        renderInspector();
        pushUndo('nudge control');
      }
    }
  }
  // Undo / Redo
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault();
    undo();
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') {
    e.preventDefault();
    redo();
  }
});
}

// Align toolbar visibility
export function updateAlignToolbar() {
  const bar = document.getElementById('align-toolbar');
  if (!bar) return;
  bar.style.display = DesignerState.selectedIds.size > 1 ? 'flex' : 'none';
}

// Tab Order mode
export function enterTabOrderMode() {
  DesignerState.tabOrderMode = true;
  DesignerState.tabOrderNext = 0;
  DesignerState.selectedIds.clear();
  DesignerState.selectedControlId = null;
  updateDesignerSelection();
  updateTabOrderToolbar();
  updateTabOrderBadges();
}

export function exitTabOrderMode() {
  DesignerState.tabOrderMode = false;
  updateTabOrderToolbar();
  clearTabOrderBadges();
}

export function resetTabOrder() {
  DesignerState.tabOrderNext = 0;
  for (const ctrl of walkControls(getActiveForm())) {
    ctrl.props.TabIndex = 0;
  }
  updateTabOrderBadges();
}

export function updateTabOrderToolbar() {
  const bar = document.getElementById('taborder-toolbar');
  if (!bar) return;
  bar.style.display = DesignerState.tabOrderMode ? 'flex' : 'none';
}

export function updateTabOrderBadges() {
  clearTabOrderBadges();
  if (!DesignerState.tabOrderMode) return;
  const form = getActiveForm();
  if (!form) return;
  for (const ctrl of walkControls(form)) {
    const el = _designerView.domMap.get(ctrl.id);
    if (!el) continue;
    const badge = document.createElement('div');
    badge.className = 'tabindex-badge';
    badge.textContent = ctrl.props.TabIndex;
    el.appendChild(badge);
  }
}

export function clearTabOrderBadges() {
  document.querySelectorAll('.tabindex-badge').forEach(el => el.remove());
}

export function alignSelected(align) {
  const form = getActiveForm();
  if (!form || DesignerState.selectedIds.size < 2) return;
  pushUndo('align controls');
  const ctrls = Array.from(DesignerState.selectedIds).map(id => findControlById(form, id)).filter(Boolean);
  if (ctrls.length < 2) return;
  let value;
  switch (align) {
    case 'left':
      value = Math.min(...ctrls.map(c => c.props['Location.X']));
      for (const c of ctrls) c.props['Location.X'] = value;
      break;
    case 'right':
      value = Math.max(...ctrls.map(c => c.props['Location.X'] + c.props['Size.Width']));
      for (const c of ctrls) c.props['Location.X'] = value - c.props['Size.Width'];
      break;
    case 'top':
      value = Math.min(...ctrls.map(c => c.props['Location.Y']));
      for (const c of ctrls) c.props['Location.Y'] = value;
      break;
    case 'bottom':
      value = Math.max(...ctrls.map(c => c.props['Location.Y'] + c.props['Size.Height']));
      for (const c of ctrls) c.props['Location.Y'] = value - c.props['Size.Height'];
      break;
    case 'centerH':
      value = ctrls.reduce((s, c) => s + c.props['Location.X'] + c.props['Size.Width'] / 2, 0) / ctrls.length;
      for (const c of ctrls) c.props['Location.X'] = Math.round(value - c.props['Size.Width'] / 2);
      break;
    case 'centerV':
      value = ctrls.reduce((s, c) => s + c.props['Location.Y'] + c.props['Size.Height'] / 2, 0) / ctrls.length;
      for (const c of ctrls) c.props['Location.Y'] = Math.round(value - c.props['Size.Height'] / 2);
      break;
  }
  for (const c of ctrls) syncControlDOM(c);
  updateDesignerSelection();
}

export function sameSizeSelected(mode) {
  const form = getActiveForm();
  if (!form || DesignerState.selectedIds.size < 2) return;
  pushUndo('make same size');
  const ctrls = Array.from(DesignerState.selectedIds).map(id => findControlById(form, id)).filter(Boolean);
  if (ctrls.length < 2) return;
  if (mode === 'width' || mode === 'size') {
    const w = ctrls[0].props['Size.Width'];
    for (const c of ctrls) c.props['Size.Width'] = w;
  }
  if (mode === 'height' || mode === 'size') {
    const h = ctrls[0].props['Size.Height'];
    for (const c of ctrls) c.props['Size.Height'] = h;
  }
  for (const c of ctrls) syncControlDOM(c);
  updateDesignerSelection();
}

export function bringToFront() {
  const form = getActiveForm();
  if (!form || DesignerState.selectedIds.size === 0) return;
  pushUndo('bring to front');
  const ids = Array.from(DesignerState.selectedIds);
  for (const id of ids) {
    const idx = form.children.findIndex(c => c.id === id);
    if (idx >= 0) {
      const ctrl = form.children.splice(idx, 1)[0];
      form.children.push(ctrl);
    }
  }
  syncDesigner();
}

export function sendToBack() {
  const form = getActiveForm();
  if (!form || DesignerState.selectedIds.size === 0) return;
  pushUndo('send to back');
  const ids = Array.from(DesignerState.selectedIds);
  for (let i = ids.length - 1; i >= 0; i--) {
    const id = ids[i];
    const idx = form.children.findIndex(c => c.id === id);
    if (idx >= 0) {
      const ctrl = form.children.splice(idx, 1)[0];
      form.children.unshift(ctrl);
    }
  }
  syncDesigner();
}

// ----- Snaplines (margin + alignment) -----
const SNAP_THRESHOLD = 8;

function getCtrlRect(ctrl) {
  return {
    x: ctrl.props['Location.X'],
    y: ctrl.props['Location.Y'],
    w: ctrl.props['Size.Width'],
    h: ctrl.props['Size.Height'],
    mx: parsePadding(ctrl.props.Margin || '3, 3, 3, 3'),
  };
}

export function computeSnapX(anchorCtrl, dx, form, exclude = []) {
  const r = getCtrlRect(anchorCtrl);
  const newX = r.x + dx;
  const newR = newX + r.w;
  const newCX = newX + r.w / 2;
  const lines = [];
  let bestDx = dx;
  let snapped = false;
  const excludeSet = new Set(exclude.map(c => c.id));

  for (const other of walkControls(form)) {
    if (other.id === anchorCtrl.id) continue;
    if (excludeSet.has(other.id)) continue;
    const or = getCtrlRect(other);
    const ox = or.x, oR = ox + or.w, oCX = ox + or.w / 2;

    // Left-to-left alignment
    let dist = Math.abs(newX - ox);
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDx - dx))) {
      bestDx = ox - r.x; snapped = true;
      lines.push({ type: 'v', x: ox, y1: Math.min(newX ? r.y : 0, or.y), y2: Math.max(r.y + r.h, or.y + or.h) });
    }
    // Right-to-right alignment
    dist = Math.abs(newR - oR);
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDx - dx))) {
      bestDx = (oR - r.w) - r.x; snapped = true;
      lines.push({ type: 'v', x: oR, y1: Math.min(r.y, or.y), y2: Math.max(r.y + r.h, or.y + or.h) });
    }
    // Left-to-right margin snap (anchor left to other right + margins)
    const marginGap = or.mx.right + r.mx.left;
    dist = Math.abs(newX - (oR + marginGap));
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDx - dx))) {
      bestDx = (oR + marginGap) - r.x; snapped = true;
      lines.push({ type: 'v', x: oR + marginGap, y1: Math.min(r.y, or.y), y2: Math.max(r.y + r.h, or.y + or.h), label: String(marginGap) });
    }
    // Horizontal center alignment
    dist = Math.abs(newCX - oCX);
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDx - dx))) {
      bestDx = (oCX - r.w / 2) - r.x; snapped = true;
      lines.push({ type: 'v', x: oCX, y1: Math.min(r.y, or.y), y2: Math.max(r.y + r.h, or.y + or.h), style: 'dashed' });
    }
  }
  return { snapped, dx: bestDx, lines };
}

export function computeSnapY(anchorCtrl, dy, form, exclude = []) {
  const r = getCtrlRect(anchorCtrl);
  const newY = r.y + dy;
  const newB = newY + r.h;
  const newCY = newY + r.h / 2;
  const lines = [];
  let bestDy = dy;
  let snapped = false;
  const excludeSet = new Set(exclude.map(c => c.id));

  for (const other of walkControls(form)) {
    if (other.id === anchorCtrl.id) continue;
    if (excludeSet.has(other.id)) continue;
    const or = getCtrlRect(other);
    const oy = or.y, oB = oy + or.h, oCY = oy + or.h / 2;

    // Top-to-top alignment
    let dist = Math.abs(newY - oy);
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDy - dy))) {
      bestDy = oy - r.y; snapped = true;
      lines.push({ type: 'h', y: oy, x1: Math.min(r.x, or.x), x2: Math.max(r.x + r.w, or.x + or.w) });
    }
    // Bottom-to-bottom alignment
    dist = Math.abs(newB - oB);
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDy - dy))) {
      bestDy = (oB - r.h) - r.y; snapped = true;
      lines.push({ type: 'h', y: oB, x1: Math.min(r.x, or.x), x2: Math.max(r.x + r.w, or.x + or.w) });
    }
    // Top-to-bottom margin snap (anchor top to other bottom + margins)
    const marginGap = or.mx.bottom + r.mx.top;
    dist = Math.abs(newY - (oB + marginGap));
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDy - dy))) {
      bestDy = (oB + marginGap) - r.y; snapped = true;
      lines.push({ type: 'h', y: oB + marginGap, x1: Math.min(r.x, or.x), x2: Math.max(r.x + r.w, or.x + or.w), label: String(marginGap) });
    }
    // Vertical center alignment
    dist = Math.abs(newCY - oCY);
    if (dist < SNAP_THRESHOLD && (!snapped || dist < Math.abs(bestDy - dy))) {
      bestDy = (oCY - r.h / 2) - r.y; snapped = true;
      lines.push({ type: 'h', y: oCY, x1: Math.min(r.x, or.x), x2: Math.max(r.x + r.w, or.x + or.w), style: 'dashed' });
    }
  }
  return { snapped, dy: bestDy, lines };
}

export function drawSnaplines(lines) {
  if (!_designerView.body) return;
  const bodyRect = _designerView.body.getBoundingClientRect();
  for (const line of lines) {
    const el = document.createElement('div');
    el.className = 'snapline' + (line.style === 'dashed' ? ' dashed' : '');
    if (line.type === 'v') {
      el.style.left = line.x + 'px';
      el.style.top = Math.min(line.y1, line.y2) + 'px';
      el.style.height = Math.abs(line.y2 - line.y1) + 'px';
      el.style.width = '1px';
    } else {
      el.style.top = line.y + 'px';
      el.style.left = Math.min(line.x1, line.x2) + 'px';
      el.style.width = Math.abs(line.x2 - line.x1) + 'px';
      el.style.height = '1px';
    }
    if (line.label) {
      el.dataset.label = line.label;
    }
    _designerView.body.appendChild(el);
  }
}

export function clearSnaplines() {
  if (!_designerView.body) return;
  _designerView.body.querySelectorAll('.snapline').forEach(el => el.remove());
}

// Toast
export function showToast(msg, kind = 'success') {
  const t = document.createElement('div');
  t.className = 'toast ' + kind;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}
