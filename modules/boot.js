import { emptyProject, newForm, newClass } from './ir.js';
import { WinFormsRuntime } from './runtime.js';
import {
  DesignerState, showToast, syncDesigner,
  _designerView, renderToolbox, renderTree, renderInspector,
  getActiveForm, pushUndo, undo, redo,
  alignSelected, sameSizeSelected,
  bringToFront, sendToBack,
  enterTabOrderMode, exitTabOrderMode, resetTabOrder
} from './designer.js';
import { exportProjectToCSharp, downloadProjectZip } from './exporter.js';
import { PHONEBOOK_PRESET } from '../presets/phonebook.js';

const API_BASE = 'http://localhost:8824';

// Detect project override from URL ?project=PhoneBookPart3
const _urlParams = new URLSearchParams(window.location.search);
const _projectParam = _urlParams.get('project');
const _apiSuffix = _projectParam ? '?project=' + encodeURIComponent(_projectParam) : '';

// Expose key APIs to window for tests and console debugging
if (typeof window !== 'undefined') {
  window.exportProjectToCSharp = exportProjectToCSharp;
  window.downloadProjectZip = downloadProjectZip;
  window.DesignerState = DesignerState;
  window.bringToFront = bringToFront;
  window.sendToBack = sendToBack;
  window.alignSelected = alignSelected;
  window.sameSizeSelected = sameSizeSelected;
  window.renderInspector = renderInspector;
}

async function apiSaveProject() {
  try {
    const resp = await fetch(API_BASE + '/api/project' + _apiSuffix, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DesignerState.project)
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return true;
  } catch (e) {
    console.warn('apiSaveProject failed:', e.message);
    return false;
  }
}

async function apiLoadProject() {
  try {
    const resp = await fetch(API_BASE + '/api/project' + _apiSuffix);
    if (resp.status === 404) return null;
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.json();
  } catch (e) {
    console.warn('apiLoadProject failed:', e.message);
    return null;
  }
}

async function apiGetFileStats() {
  try {
    const resp = await fetch(API_BASE + '/api/files' + _apiSuffix);
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}

/* ---------- Auto-save ---------- */
export let _saveTimeout = null;
export let _lastServerMtimes = null;
export let _unsavedIndicator = null;

export function scheduleAutoSave(delay = 1500) {
  setUnsaved(true);
  clearTimeout(_saveTimeout);
  _saveTimeout = setTimeout(() => {
    immediateSave();
  }, delay);
}

async function computeMtimesHash(stats) {
  if (!stats) return null;
  const hash = Object.entries(stats).sort((a,b)=>a[0].localeCompare(b[0])).map(([k,v])=>k+':'+v).join('|');
  return hash;
}

async function immediateSave() {
  clearTimeout(_saveTimeout);
  const ok = await apiSaveProject();
  if (ok) {
    setUnsaved(false);
    showToast('Saved to PhoneBook/', 'success');
    // After saving, record current server mtimes so we don't false-positive on our own changes
    const stats = await apiGetFileStats();
    _lastServerMtimes = await computeMtimesHash(stats);
  } else {
    showToast('Save failed — is server running? (node server.js)', 'error');
  }
}

export function setUnsaved(flag) {
  const st = document.getElementById('status-text');
  if (!st) return;
  if (flag) {
    if (!st.textContent.includes('●')) st.textContent = '● ' + st.textContent.replace(/^● /, '');
  } else {
    st.textContent = st.textContent.replace(/^● /, '');
  }
}

/* ---------- External change watch ---------- */
export let _watchInterval = null;
export let _pendingReloadToast = null;

async function watchExternalChanges() {
  const stats = await apiGetFileStats();
  if (!stats) return;
  const hash = await computeMtimesHash(stats);
  if (_lastServerMtimes && _lastServerMtimes !== hash) {
    if (!_pendingReloadToast) {
      _pendingReloadToast = showToast('Files changed externally. Press F5 to reload from VS Code.', 'error');
    }
  }
}

/* ---------- Boot ---------- */
export function boot() {
  // Event bindings (always bind, even if server unavailable)
  document.getElementById('btn-design').onclick = () => setMode('design');
  document.getElementById('btn-runtime').onclick = () => setMode('runtime');
  document.getElementById('btn-run').onclick = () => setMode('runtime');
  document.getElementById('btn-export').onclick = () => {
    downloadProjectZip(DesignerState.project);
  };
  document.getElementById('btn-save-project').onclick = () => {
    const json = JSON.stringify(DesignerState.project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = DesignerState.project.projectName + '.winforms.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast('Project saved');
  };
  document.getElementById('btn-load-project').onclick = () => {
    const inp = document.getElementById('file-input-hidden');
    const h = (e) => {
      inp.removeEventListener('change', h);
      const file = e.target.files[0]; inp.value = '';
      if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          DesignerState.project = JSON.parse(r.result);
          DesignerState.activeFormId = DesignerState.project.forms[0].id;
          DesignerState.refreshAll();
          scheduleAutoSave(500);
          showToast('Project loaded');
        } catch (err) { showToast('Failed: ' + err.message, 'error'); }
      };
      r.readAsText(file);
    };
    inp.addEventListener('change', h);
    inp.click();
  };

  // New Form / New Class buttons
  document.getElementById('btn-new-form').onclick = () => {
    const name = prompt('Form name (e.g. SearchForm):', 'Form1');
    if (!name) return;
    const form = newForm(name, name);
    DesignerState.project.forms.push(form);
    DesignerState.activeFormId = form.id;
    DesignerState.refreshAll();
    scheduleAutoSave(500);
    showToast(`Form '${name}' added`);
  };

  document.getElementById('btn-new-class').onclick = () => {
    const name = prompt('Class name (e.g. Note):', 'MyClass');
    if (!name) return;
    const cls = newClass(name);
    DesignerState.project.classes = DesignerState.project.classes || [];
    DesignerState.project.classes.push(cls);
    DesignerState.refreshAll();
    scheduleAutoSave(500);
    showToast(`Class '${name}' added`);
  };

  // Align toolbar bindings
  const bindAlign = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  };
  bindAlign('align-left', () => alignSelected('left'));
  bindAlign('align-right', () => alignSelected('right'));
  bindAlign('align-top', () => alignSelected('top'));
  bindAlign('align-bottom', () => alignSelected('bottom'));
  bindAlign('same-width', () => sameSizeSelected('width'));
  bindAlign('same-height', () => sameSizeSelected('height'));
  bindAlign('same-size', () => sameSizeSelected('size'));
  bindAlign('bring-front', () => bringToFront());
  bindAlign('send-back', () => sendToBack());

  // Tab Order bindings
  const tabOrderBtn = document.getElementById('btn-tab-order');
  if (tabOrderBtn) {
    tabOrderBtn.onclick = () => {
      if (DesignerState.tabOrderMode) exitTabOrderMode();
      else enterTabOrderMode();
    };
  }
  const tabOrderReset = document.getElementById('taborder-reset');
  if (tabOrderReset) tabOrderReset.onclick = () => resetTabOrder();
  const tabOrderDone = document.getElementById('taborder-done');
  if (tabOrderDone) tabOrderDone.onclick = () => exitTabOrderMode();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F5') { e.preventDefault(); setMode(DesignerState.mode === 'design' ? 'runtime' : 'design'); }
    if (e.key === 'Escape' && DesignerState.mode === 'runtime') setMode('design');
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      immediateSave();
    }
    if (e.key.toLowerCase() === 'f5' && _pendingReloadToast) {
      // F5 reloads external changes
      loadFromServer();
      _pendingReloadToast = null;
    }
  });

  // Hook designer mutations for auto-save
  let _skipInitialAutoSave = true;
  const originalRefreshAll = DesignerState.refreshAll;
  DesignerState.refreshAll = function() {
    originalRefreshAll();
    if (_skipInitialAutoSave) {
      _skipInitialAutoSave = false;
      return;
    }
    scheduleAutoSave();
  };
  DesignerState._onMutate = () => scheduleAutoSave();

  // Start
  loadFromServer();
}

async function loadFromServer() {
  const serverProject = await apiLoadProject();
  if (serverProject && !serverProject.empty) {
    DesignerState.project = serverProject;
    DesignerState.activeFormId = serverProject.forms.find(f => f.name === serverProject.startupForm)?.id || serverProject.forms[0]?.id || null;
    // Record current server mtimes so we don't false-positive on initial state
    const stats = await apiGetFileStats();
    _lastServerMtimes = await computeMtimesHash(stats);
    showToast('Loaded project from PhoneBook/ (VS Code)', 'success');
    DesignerState.refreshAll();
    // Start watch
    if (!_watchInterval) _watchInterval = setInterval(watchExternalChanges, 3000);
    return;
  }

  // If URL has ?project=XXX and server returned empty — don't fallback to preset.
  // Show an empty project so user can build from scratch (like VS "new project").
  if (_projectParam) {
    showToast(`Project '${_projectParam}' not found on server. Start with empty project.`, 'warning');
    DesignerState.project = emptyProject(_projectParam);
    DesignerState.project.forms.push(newForm('MainForm', 'MainForm'));
    DesignerState.activeFormId = DesignerState.project.forms[0].id;
    DesignerState.refreshAll();
    if (!_watchInterval) _watchInterval = setInterval(watchExternalChanges, 3000);
    scheduleAutoSave(500);
    return;
  }

  // Fallback to preset (default lab)
  const preset = PHONEBOOK_PRESET || null;
  if (!preset) {
    showToast('Preset not loaded. Start server: node server.js', 'error');
    DesignerState.project = emptyProject('PhoneBook');
    DesignerState.project.forms.push(newForm('MainForm', 'MainForm'));
    DesignerState.activeFormId = DesignerState.project.forms[0].id;
    DesignerState.refreshAll();
    return;
  }
  DesignerState.project = JSON.parse(JSON.stringify(preset));
  DesignerState.activeFormId = DesignerState.project.forms[0].id;
  DesignerState.refreshAll();
  // Also start watch (so if user later opens VS Code, we'll detect)
  if (!_watchInterval) _watchInterval = setInterval(watchExternalChanges, 3000);
  // Auto-save once to write initial C# files
  scheduleAutoSave(500);
}

export function setMode(mode) {
  DesignerState.mode = mode;
  document.getElementById('btn-design').classList.toggle('active', mode === 'design');
  document.getElementById('btn-runtime').classList.toggle('active', mode === 'runtime');
  document.getElementById('mode-tag').textContent = mode === 'design' ? 'Design' : 'Runtime';
  document.getElementById('status-text').textContent = mode === 'design' ? 'Ready' : 'Application running — press Esc to stop';

  const designerArea = document.getElementById('designer');
  designerArea.classList.toggle('runtime', mode === 'runtime');
  designerArea.classList.toggle('designer', mode === 'design');

  if (mode === 'runtime') {
    // Hide design tabs
    document.getElementById('designer-tabs').style.display = 'none';
    const host = document.getElementById('form-host');
    host.innerHTML = '';
    _designerView.root = null;
    _designerView.body = null;
    _designerView.domMap.clear();
    host._designerBound = false;
    const rt = new WinFormsRuntime(deepCopy(DesignerState.project));
    rt.onClose = () => setMode('design');
    rt.start(host);
    DesignerState.runtime = rt;
  } else {
    document.getElementById('designer-tabs').style.display = '';
    if (DesignerState.runtime) DesignerState.runtime = null;
    DesignerState.refreshAll();
  }
}

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

boot();
