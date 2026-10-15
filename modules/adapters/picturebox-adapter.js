import { ControlAdapter } from './base-adapter.js';

export class PictureBoxAdapter extends ControlAdapter {
  constructor() {
    super('PictureBox', {
      cs: 'PictureBox',
      defaultSize: [100, 100],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const box = document.createElement('div');
    box.className = 'control-picturebox';
    let css = 'width:100%;height:100%;background:#f0f0f0;border:1px solid #d0d0d0;display:flex;align-items:center;justify-content:center;overflow:hidden;';
    box.style.cssText = css;
    const label = document.createElement('span');
    label.textContent = p.Image || '(none)';
    label.style.cssText = 'color:#808080;font-size:11px;pointer-events:none;';
    box.appendChild(label);
    wrap.appendChild(box);
    if (mode === 'design') box.style.pointerEvents = 'none';
  }

  syncDOM(el, ctrl) {
    const label = el.querySelector('span');
    if (label) label.textContent = ctrl.props.Image || '(none)';
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Image) lines.push(`            ${name}.Image = global::${name}.Properties.Resources.${p.Image};`);
    if (p.SizeMode && p.SizeMode !== 'Normal') {
      lines.push(`            ${name}.SizeMode = System.Windows.Forms.PictureBoxSizeMode.${p.SizeMode};`);
    }
    if (p.BorderStyle && p.BorderStyle !== 'None') {
      lines.push(`            ${name}.BorderStyle = System.Windows.Forms.BorderStyle.${p.BorderStyle};`);
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'Image', type: 'string', group: 'Appearance', editable: true, default: '' },
      { key: 'SizeMode', type: 'enum', group: 'Behavior', editable: true, default: 'Normal', options: ['Normal', 'StretchImage', 'AutoSize', 'CenterImage', 'Zoom'] },
      { key: 'BorderStyle', type: 'enum', group: 'Appearance', editable: true, default: 'None', options: ['None', 'FixedSingle', 'Fixed3D'] },
    ];
  }
}
