import { ControlAdapter } from './base-adapter.js';

export class TabPageAdapter extends ControlAdapter {
  constructor() {
    super('TabPage', {
      cs: 'TabPage',
      defaultSize: [0, 0],
      category: 'Containers',
      canHaveChildren: true,
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const tp = document.createElement('div');
    tp.className = 'control-tabpage';
    tp.style.cssText = 'width:100%;height:100%;position:relative;font-family:inherit;font-size:inherit;overflow:hidden;';

    const body = document.createElement('div');
    body.className = 'container-body';
    body.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;';
    tp.appendChild(body);
    wrap.appendChild(tp);
    if (mode === 'design') tp.style.pointerEvents = 'none';
  }

  syncDOM(el, ctrl) {
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    return lines;
  }

  getProperties() {
    return [
      { key: 'Text', type: 'string', group: 'Appearance', editable: true, default: '' },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
