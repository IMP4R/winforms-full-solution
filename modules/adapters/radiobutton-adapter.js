import { ControlAdapter } from './base-adapter.js';

export class RadioButtonAdapter extends ControlAdapter {
  constructor() {
    super('RadioButton', {
      cs: 'RadioButton',
      defaultSize: [120, 24],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const lbl = document.createElement('label');
    lbl.className = 'control-radiobutton';
    lbl.style.cssText = 'display:flex;align-items:center;gap:4px;height:100%;font-family:inherit;font-size:inherit;cursor:default;';
    const inp = document.createElement('input');
    inp.type = 'radio';
    inp.checked = !!p.Checked;
    inp.disabled = !p.Enabled || mode === 'design';
    if (mode === 'design') inp.style.pointerEvents = 'none';
    lbl.appendChild(inp);
    const txt = document.createElement('span');
    txt.textContent = p.Text || '';
    lbl.appendChild(txt);
    wrap.appendChild(lbl);
    if (mode === 'runtime' && runtimeCtx) {
      inp.addEventListener('change', () => { p.Checked = inp.checked; });
    }
  }

  syncDOM(el, ctrl) {
    const inp = el.querySelector('input');
    const txt = el.querySelector('span');
    if (inp) { inp.checked = !!ctrl.props.Checked; inp.disabled = !ctrl.props.Enabled; }
    if (txt) txt.textContent = ctrl.props.Text || '';
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    if (p.Checked) lines.push(`            ${name}.Checked = true;`);
    return lines;
  }

  getProperties() {
    return [
      { key: 'Checked', type: 'bool', group: 'Appearance', editable: true, default: false },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
