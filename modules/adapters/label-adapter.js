import { ControlAdapter } from './base-adapter.js';

export class LabelAdapter extends ControlAdapter {
  constructor() {
    super('Label', {
      cs: 'Label',
      defaultSize: [100, 23],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    wrap.textContent = ctrl.props.Text || '';
  }

  syncDOM(el, ctrl) {
    el.textContent = ctrl.props.Text || '';
    return true;
  }

  emitCS(ctrl, name) {
    const lines = [];
    if (ctrl.props.Text) {
      lines.push(`            ${name}.Text = ${csStringLit(ctrl.props.Text)};`);
    }
    return lines;
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
