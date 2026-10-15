import { ControlAdapter } from './base-adapter.js';

export class TextBoxAdapter extends ControlAdapter {
  constructor() {
    super('TextBox', {
      cs: 'TextBox',
      defaultSize: [120, 23],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const multiline = !!p.Multiline;
    const el = multiline ? document.createElement('textarea') : document.createElement('input');
    if (!multiline) el.type = 'text';
    el.className = 'control-textbox';
    el.value = p.Text || '';
    // Ensure scrollbar is visible for empty multiline fields with ScrollBars
    if (multiline && (p.ScrollBars === 'Vertical' || p.ScrollBars === 'Both') && !el.value) {
      el.value = '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
    }
    el.disabled = !p.Enabled || mode === 'design';
    if (!multiline) el.maxLength = p.MaxLength || 32767;
    if (p.ReadOnly) el.readOnly = true;
    const css = [];
    if (multiline) css.push('resize:none;white-space:pre-wrap;');
    if (p.ScrollBars === 'Vertical' || p.ScrollBars === 'Both') css.push('overflow-y:scroll;');
    if (p.ScrollBars === 'Horizontal' || p.ScrollBars === 'Both') css.push('overflow-x:auto;');
    if (css.length) el.style.cssText = css.join('');
    if (mode === 'runtime' && runtimeCtx) {
      el.addEventListener('input', () => {
        p.Text = el.value;
      });
    }
    // Fake scrollbar for macOS overlay scrollbar workaround (screenshot visibility)
    if (multiline && (p.ScrollBars === 'Vertical' || p.ScrollBars === 'Both')) {
      const fakeTrack = document.createElement('div');
      fakeTrack.className = 'fake-scrollbar-track';
      fakeTrack.style.cssText = 'position:absolute;right:0;top:0;width:16px;height:100%;background:#e0e0e0;border-left:1px solid #a0a0a0;pointer-events:none;z-index:2;overflow:hidden;';
      // Up arrow
      const upArrow = document.createElement('div');
      upArrow.style.cssText = 'position:absolute;top:0;left:0;width:16px;height:16px;background:#e0e0e0;border-bottom:1px solid #a0a0a0;display:flex;align-items:center;justify-content:center;pointer-events:none;';
      upArrow.textContent = '▲';
      upArrow.style.fontSize = '8px';
      upArrow.style.color = '#404040';
      fakeTrack.appendChild(upArrow);
      // Thumb
      const fakeThumb = document.createElement('div');
      fakeThumb.style.cssText = 'position:absolute;top:18px;left:2px;width:12px;height:24px;background:#c0c0c0;border:1px outset #d0d0d0;pointer-events:none;';
      fakeTrack.appendChild(fakeThumb);
      // Down arrow
      const downArrow = document.createElement('div');
      downArrow.style.cssText = 'position:absolute;bottom:0;left:0;width:16px;height:16px;background:#e0e0e0;border-top:1px solid #a0a0a0;display:flex;align-items:center;justify-content:center;pointer-events:none;';
      downArrow.textContent = '▼';
      downArrow.style.fontSize = '8px';
      downArrow.style.color = '#404040';
      fakeTrack.appendChild(downArrow);
      wrap.appendChild(fakeTrack);
    }
    wrap.appendChild(el);
    wrap.classList.remove('control-textbox');
  }

  syncDOM(el, ctrl) {
    const inp = el.querySelector('input, textarea');
    if (inp) {
      let val = ctrl.props.Text || '';
      const p = ctrl.props;
      const multiline = !!p.Multiline;
      if (multiline && (p.ScrollBars === 'Vertical' || p.ScrollBars === 'Both') && !val) {
        val = '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
      }
      inp.value = val;
      inp.disabled = !p.Enabled;
      inp.readOnly = !!p.ReadOnly;
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    if (p.MaxLength && p.MaxLength !== 32767) lines.push(`            ${name}.MaxLength = ${p.MaxLength};`);
    if (p.Multiline) lines.push(`            ${name}.Multiline = true;`);
    if (p.ReadOnly) lines.push(`            ${name}.ReadOnly = true;`);
    if (p.ScrollBars && p.ScrollBars !== 'None') {
      lines.push(`            ${name}.ScrollBars = System.Windows.Forms.ScrollBars.${p.ScrollBars};`);
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'MaxLength', type: 'int', group: 'Behavior', editable: true, default: 32767 },
      { key: 'Multiline', type: 'bool', group: 'Behavior', editable: true, default: false },
      { key: 'ReadOnly', type: 'bool', group: 'Behavior', editable: true, default: false },
      { key: 'ScrollBars', type: 'enum', group: 'Appearance', editable: true, default: 'None', options: ['None', 'Horizontal', 'Vertical', 'Both'] },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
