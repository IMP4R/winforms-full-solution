import { ControlAdapter } from './base-adapter.js';

export class DateTimePickerAdapter extends ControlAdapter {
  constructor() {
    super('DateTimePicker', {
      cs: 'DateTimePicker',
      defaultSize: [120, 23],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const inp = document.createElement('input');
    inp.className = 'control-datetimepicker';
    inp.type = 'date';
    inp.style.cssText = 'width:100%;height:100%;font-family:inherit;font-size:inherit;box-sizing:border-box;';
    inp.value = p.Value || '';
    inp.disabled = !p.Enabled || mode === 'design';
    if (p.ShowCheckBox) {
      const wrapDiv = document.createElement('label');
      wrapDiv.style.cssText = 'display:flex;align-items:center;gap:4px;height:100%;font-family:inherit;font-size:inherit;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = p.Checked !== false;
      cb.disabled = !p.Enabled || mode === 'design';
      if (mode === 'design') cb.style.pointerEvents = 'none';
      wrapDiv.appendChild(cb);
      wrapDiv.appendChild(inp);
      wrap.appendChild(wrapDiv);
    } else {
      wrap.appendChild(inp);
    }
    if (mode === 'design') inp.style.pointerEvents = 'none';
    if (mode === 'runtime' && runtimeCtx) {
      inp.addEventListener('change', () => { p.Value = inp.value; });
    }
  }

  syncDOM(el, ctrl) {
    const inp = el.querySelector('input[type="date"]');
    if (inp) {
      inp.disabled = !ctrl.props.Enabled;
      inp.value = ctrl.props.Value || '';
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Format && p.Format !== 'Short') {
      lines.push(`            ${name}.Format = System.Windows.Forms.DateTimePickerFormat.${p.Format};`);
    }
    if (p.Value) lines.push(`            ${name}.Value = new DateTime(${p.Value.replace(/-/g, ', ')});`);
    if (p.ShowCheckBox) lines.push(`            ${name}.ShowCheckBox = true;`);
    if (p.Checked === false) lines.push(`            ${name}.Checked = false;`);
    return lines;
  }

  getProperties() {
    return [
      { key: 'Value', type: 'string', group: 'Data', editable: true, default: '' },
      { key: 'Format', type: 'enum', group: 'Appearance', editable: true, default: 'Short', options: ['Short', 'Long', 'Time', 'Custom'] },
      { key: 'ShowCheckBox', type: 'bool', group: 'Appearance', editable: true, default: false },
      { key: 'Checked', type: 'bool', group: 'Appearance', editable: true, default: true },
    ];
  }
}
