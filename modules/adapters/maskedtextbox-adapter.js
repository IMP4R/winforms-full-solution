import { ControlAdapter } from './base-adapter.js';

export class MaskedTextBoxAdapter extends ControlAdapter {
  constructor() {
    super('MaskedTextBox', {
      cs: 'MaskedTextBox',
      defaultSize: [120, 23],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'control-maskedtextbox';
    inp.value = p.Text || '';
    inp.placeholder = maskToPlaceholder(p.Mask || '');
    inp.disabled = !p.Enabled || mode === 'design';
    inp.maxLength = p.MaxLength || 32767;
    if (mode === 'runtime') {
      inp.addEventListener('input', () => {
        inp.value = applyMask(inp.value, p.Mask || '');
        p.Text = inp.value;
      });
    }
    wrap.appendChild(inp);
    wrap.classList.remove('control-maskedtextbox');
  }

  syncDOM(el, ctrl) {
    const inp = el.querySelector('input');
    if (inp) {
      inp.value = ctrl.props.Text || '';
      inp.placeholder = maskToPlaceholder(ctrl.props.Mask || '');
      inp.disabled = !ctrl.props.Enabled;
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Mask) lines.push(`            ${name}.Mask = "${p.Mask}";`);
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    return lines;
  }

  getProperties() {
    return [
      { key: 'MaxLength', type: 'int', group: 'Behavior', editable: true, default: 32767 },
      { key: 'Mask', type: 'string', group: 'Behavior', editable: true, default: '' },
    ];
  }
}

function maskToPlaceholder(mask) {
  if (!mask) return '';
  return mask.replace(/[09#?&AaCc]/g, '_');
}

function applyMask(value, mask) {
  if (!mask) return value;
  let out = '';
  let vi = 0;
  for (let mi = 0; mi < mask.length && vi <= value.length; mi++) {
    const m = mask[mi];
    if (m === '0' || m === '9') {
      while (vi < value.length && !/\d/.test(value[vi])) vi++;
      if (vi < value.length) {
        out += value[vi];
        vi++;
      } else break;
    } else {
      out += m;
      if (vi < value.length && value[vi] === m) vi++;
    }
  }
  return out;
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
