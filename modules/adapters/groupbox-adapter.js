import { ControlAdapter } from './base-adapter.js';

export class GroupBoxAdapter extends ControlAdapter {
  constructor() {
    super('GroupBox', {
      cs: 'GroupBox',
      defaultSize: [200, 120],
      category: 'Containers',
      canHaveChildren: true,
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const gb = document.createElement('div');
    gb.className = 'control-groupbox';
    gb.style.cssText = 'width:100%;height:100%;position:relative;font-family:inherit;font-size:inherit;overflow:hidden;';

    const label = document.createElement('div');
    label.className = 'groupbox-label';
    label.textContent = p.Text || '';
    gb.appendChild(label);

    const body = document.createElement('div');
    body.className = 'container-body';
    body.style.cssText = 'position:absolute;left:0;top:12px;right:0;bottom:0;overflow:hidden;';
    gb.appendChild(body);

    wrap.appendChild(gb);
    if (mode === 'design') gb.style.pointerEvents = 'none';
  }

  syncDOM(el, ctrl) {
    const label = el.querySelector('.groupbox-label');
    if (label) label.textContent = ctrl.props.Text || '';
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    if (p.AutoSize) {
      lines.push(`            ${name}.AutoSize = true;`);
      if (p.AutoSizeMode && p.AutoSizeMode !== 'GrowOnly') {
        lines.push(`            ${name}.AutoSizeMode = System.Windows.Forms.AutoSizeMode.${p.AutoSizeMode};`);
      }
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'AutoSize', type: 'bool', group: 'Behavior', editable: true, default: false },
      { key: 'AutoSizeMode', type: 'enum', group: 'Behavior', editable: true, default: 'GrowOnly', options: ['GrowOnly', 'GrowAndShrink'] },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
