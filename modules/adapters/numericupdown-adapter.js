import { ControlAdapter } from './base-adapter.js';

export class NumericUpDownAdapter extends ControlAdapter {
  constructor() {
    super('NumericUpDown', {
      cs: 'NumericUpDown',
      defaultSize: [80, 23],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const inner = document.createElement('div');
    inner.style.cssText = 'display:flex;width:100%;height:100%;';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'control-textbox';
    // Ensure p.Value is initialized as a number so runtime handlers get a numeric value
    if (p.Value === undefined || p.Value === null) {
      p.Value = parseInt(p.Minimum ?? 0, 10);
    }
    inp.value = String(p.Value);
    inp.disabled = !p.Enabled || mode === 'design';
    const spin = document.createElement('div');
    spin.className = 'spin';
    const up = document.createElement('button'); up.textContent = '▲';
    const dn = document.createElement('button'); dn.textContent = '▼';
    spin.appendChild(up); spin.appendChild(dn);
    inner.appendChild(inp);
    inner.appendChild(spin);
    wrap.appendChild(inner);
    const clamp = v => Math.max(p.Minimum ?? 0, Math.min(p.Maximum ?? 100, v));
    if (mode === 'runtime') {
      up.onclick = () => {
        const v = clamp(parseInt(inp.value || '0', 10) + 1);
        inp.value = String(v); p.Value = v;
      };
      dn.onclick = () => {
        const v = clamp(parseInt(inp.value || '0', 10) - 1);
        inp.value = String(v); p.Value = v;
      };
      inp.addEventListener('change', () => {
        const v = clamp(parseInt(inp.value || '0', 10) || 0);
        inp.value = String(v); p.Value = v;
      });
    } else {
      up.disabled = true; dn.disabled = true;
    }
  }

  syncDOM(el, ctrl) {
    const inp = el.querySelector('input');
    if (inp) {
      inp.value = String(ctrl.props.Value ?? ctrl.props.Minimum ?? 0);
      inp.disabled = !ctrl.props.Enabled;
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    lines.push(`            ${name}.Minimum = new decimal(new int[] { ${p.Minimum}, 0, 0, 0 });`);
    lines.push(`            ${name}.Maximum = new decimal(new int[] { ${p.Maximum}, 0, 0, 0 });`);
    lines.push(`            ${name}.Value = new decimal(new int[] { ${p.Value || p.Minimum}, 0, 0, 0 });`);
    return lines;
  }

  getProperties() {
    return [
      { key: 'Minimum', type: 'int', group: 'Data', editable: true, default: 0 },
      { key: 'Maximum', type: 'int', group: 'Data', editable: true, default: 100 },
      { key: 'Value', type: 'int', group: 'Data', editable: true, default: 0 },
    ];
  }
}
