import { ControlAdapter } from './base-adapter.js';

export class ComboBoxAdapter extends ControlAdapter {
  constructor() {
    super('ComboBox', {
      cs: 'ComboBox',
      defaultSize: [120, 24],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const sel = document.createElement('select');
    sel.className = 'control-combobox';
    sel.style.cssText = 'width:100%;height:100%;font-family:inherit;font-size:inherit;';
    sel.disabled = !p.Enabled || mode === 'design';
    if (p.Items) {
      const items = String(p.Items).split(/\r?\n/);
      for (const it of items) {
        const opt = document.createElement('option');
        opt.textContent = it;
        sel.appendChild(opt);
      }
    }
    wrap.appendChild(sel);
    if (mode === 'design') sel.style.pointerEvents = 'none';
    if (mode === 'runtime' && runtimeCtx) {
      sel.addEventListener('change', () => { p.Text = sel.value; });
    }
  }

  syncDOM(el, ctrl) {
    const sel = el.querySelector('select');
    if (sel) {
      sel.disabled = !ctrl.props.Enabled;
      if (ctrl.props.Items !== undefined) {
        sel.innerHTML = '';
        const items = String(ctrl.props.Items || '').split(/\r?\n/);
        for (const it of items) {
          const opt = document.createElement('option');
          opt.textContent = it;
          sel.appendChild(opt);
        }
      }
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    if (p.Items) {
      const items = String(p.Items).split(/\r?\n/).filter(s => s !== '').map(s => csStringLit(s)).join(', ');
      if (items) lines.push(`            ${name}.Items.AddRange(new object[] { ${items} });`);
    }
    if (p.DropDownStyle && p.DropDownStyle !== 'DropDown') {
      lines.push(`            ${name}.DropDownStyle = System.Windows.Forms.ComboBoxStyle.${p.DropDownStyle};`);
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'Items', type: 'string', group: 'Data', editable: true, default: '' },
      { key: 'DropDownStyle', type: 'enum', group: 'Behavior', editable: true, default: 'DropDown', options: ['DropDown', 'DropDownList', 'Simple'] },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
