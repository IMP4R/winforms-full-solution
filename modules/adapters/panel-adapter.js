import { ControlAdapter } from './base-adapter.js';

export class PanelAdapter extends ControlAdapter {
  constructor() {
    super('Panel', {
      cs: 'Panel',
      defaultSize: [200, 120],
      category: 'Containers',
      canHaveChildren: true,
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const panel = document.createElement('div');
    panel.className = 'control-panel';
    let css = 'width:100%;height:100%;position:relative;font-family:inherit;font-size:inherit;';
    if (p.AutoScroll) css += 'overflow:auto;';
    else css += 'overflow:hidden;';
    if (p.BorderStyle === 'FixedSingle') css += 'border:1px solid var(--win-border-strong);';
    else if (p.BorderStyle === 'Fixed3D') css += 'border:1px solid var(--win-border);border-right-color:#808080;border-bottom-color:#808080;';
    panel.style.cssText = css;

    const body = document.createElement('div');
    body.className = 'container-body';
    body.style.cssText = 'position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;';
    panel.appendChild(body);
    wrap.appendChild(panel);
    if (mode === 'design') panel.style.pointerEvents = 'none';
  }

  syncDOM(el, ctrl) {
    const panel = el.querySelector('.control-panel');
    if (!panel) return false;
    const p = ctrl.props;
    panel.style.overflow = p.AutoScroll ? 'auto' : 'hidden';
    panel.style.border = p.BorderStyle === 'FixedSingle' ? '1px solid var(--win-border-strong)' : 
                          p.BorderStyle === 'Fixed3D' ? '1px solid var(--win-border)' : 'none';
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.BorderStyle && p.BorderStyle !== 'None') {
      lines.push(`            ${name}.BorderStyle = System.Windows.Forms.BorderStyle.${p.BorderStyle};`);
    }
    if (p.AutoScroll) lines.push(`            ${name}.AutoScroll = true;`);
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
      { key: 'BorderStyle', type: 'enum', group: 'Appearance', editable: true, default: 'None', options: ['None', 'FixedSingle', 'Fixed3D'] },
      { key: 'AutoScroll', type: 'bool', group: 'Behavior', editable: true, default: false },
      { key: 'AutoSize', type: 'bool', group: 'Behavior', editable: true, default: false },
      { key: 'AutoSizeMode', type: 'enum', group: 'Behavior', editable: true, default: 'GrowOnly', options: ['GrowOnly', 'GrowAndShrink'] },
    ];
  }
}
