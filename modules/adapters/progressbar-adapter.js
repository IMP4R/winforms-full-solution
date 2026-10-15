import { ControlAdapter } from './base-adapter.js';

export class ProgressBarAdapter extends ControlAdapter {
  constructor() {
    super('ProgressBar', {
      cs: 'ProgressBar',
      defaultSize: [120, 23],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const bar = document.createElement('div');
    bar.className = 'control-progressbar';
    bar.style.cssText = 'width:100%;height:100%;background:#e5e5e5;border:1px solid #c0c0c0;border-radius:3px;overflow:hidden;';
    const fill = document.createElement('div');
    fill.style.cssText = 'height:100%;background:var(--win-accent);transition:width 0.2s;';
    const min = p.Minimum || 0;
    const max = p.Maximum || 100;
    const val = p.Value || 0;
    const pct = max > min ? Math.max(0, Math.min(100, (val - min) / (max - min) * 100)) : 0;
    fill.style.width = pct + '%';
    bar.appendChild(fill);
    wrap.appendChild(bar);
    if (mode === 'design') bar.style.pointerEvents = 'none';
  }

  syncDOM(el, ctrl) {
    const fill = el.querySelector('.control-progressbar > div');
    if (fill) {
      const p = ctrl.props;
      const min = p.Minimum || 0;
      const max = p.Maximum || 100;
      const val = p.Value || 0;
      const pct = max > min ? Math.max(0, Math.min(100, (val - min) / (max - min) * 100)) : 0;
      fill.style.width = pct + '%';
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Minimum !== undefined && p.Minimum !== 0) lines.push(`            ${name}.Minimum = ${p.Minimum};`);
    if (p.Maximum !== undefined && p.Maximum !== 100) lines.push(`            ${name}.Maximum = ${p.Maximum};`);
    if (p.Value !== undefined && p.Value !== 0) lines.push(`            ${name}.Value = ${p.Value};`);
    if (p.Style && p.Style !== 'Blocks') {
      lines.push(`            ${name}.Style = System.Windows.Forms.ProgressBarStyle.${p.Style};`);
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'Minimum', type: 'int', group: 'Behavior', editable: true, default: 0 },
      { key: 'Maximum', type: 'int', group: 'Behavior', editable: true, default: 100 },
      { key: 'Value', type: 'int', group: 'Behavior', editable: true, default: 0 },
      { key: 'Style', type: 'enum', group: 'Appearance', editable: true, default: 'Blocks', options: ['Blocks', 'Continuous', 'Marquee'] },
    ];
  }
}
