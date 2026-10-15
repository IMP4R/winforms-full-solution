import { ControlAdapter } from './base-adapter.js';

export class RichTextBoxAdapter extends ControlAdapter {
  constructor() {
    super('RichTextBox', {
      cs: 'RichTextBox',
      defaultSize: [120, 96],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const ta = document.createElement('textarea');
    ta.className = 'control-richtextbox';
    ta.value = p.Text || '';
    ta.readOnly = !!p.ReadOnly;
    ta.disabled = !p.Enabled || mode === 'design';
    let css = 'width:100%;height:100%;font-family:Consolas,Menlo,monospace;font-size:inherit;box-sizing:border-box;padding:4px;resize:none;outline:none;border:1px solid var(--win-control-border);border-bottom-color:var(--win-control-border-bottom);background:var(--win-surface);color:var(--win-text);';
    if (p.Multiline === false) css += 'white-space:nowrap;overflow-x:auto;';
    else {
      if (p.ScrollBars === 'Vertical' || p.ScrollBars === 'Both') css += 'overflow-y:auto;';
      if (p.ScrollBars === 'Horizontal' || p.ScrollBars === 'Both') css += 'overflow-x:auto;';
    }
    ta.style.cssText = css;
    wrap.appendChild(ta);
    if (mode === 'design') ta.style.pointerEvents = 'none';
    if (mode === 'runtime' && runtimeCtx) {
      ta.addEventListener('input', () => { p.Text = ta.value; });
    }
  }

  syncDOM(el, ctrl) {
    const ta = el.querySelector('textarea');
    if (ta) {
      ta.value = ctrl.props.Text || '';
      ta.disabled = !ctrl.props.Enabled;
      ta.readOnly = !!ctrl.props.ReadOnly;
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.ReadOnly) lines.push(`            ${name}.ReadOnly = true;`);
    if (p.Multiline === false) lines.push(`            ${name}.Multiline = false;`);
    else if (p.Multiline !== undefined) lines.push(`            ${name}.Multiline = true;`);
    if (p.ScrollBars && p.ScrollBars !== 'None') {
      lines.push(`            ${name}.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.${p.ScrollBars};`);
    }
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    return lines;
  }

  getProperties() {
    return [
      { key: 'Multiline', type: 'bool', group: 'Behavior', editable: true, default: true },
      { key: 'ReadOnly', type: 'bool', group: 'Behavior', editable: true, default: false },
      { key: 'ScrollBars', type: 'enum', group: 'Behavior', editable: true, default: 'None', options: ['None', 'Horizontal', 'Vertical', 'Both', 'ForcedHorizontal', 'ForcedVertical', 'ForcedBoth'] },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
