import { ControlAdapter } from './base-adapter.js';

export class ButtonAdapter extends ControlAdapter {
  constructor() {
    super('Button', {
      cs: 'Button',
      defaultSize: [80, 28],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const btn = document.createElement('button');
    btn.className = 'control-button';
    btn.textContent = p.Text || '';
    btn.disabled = !p.Enabled;
    if (p['Font.Bold']) btn.style.fontWeight = '500';
    btn.style.fontSize = (p['Font.Size'] * 1.333) + 'px';
    if (mode === 'runtime' && runtimeCtx) {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (ctrl.events?.Click) {
          runtimeCtx.invokeHandler(ctrl.events.Click, { sender: ctrl, eventArgs: {} });
        }
      };
    } else if (mode === 'design') {
      btn.style.pointerEvents = 'none';
    }
    wrap.appendChild(btn);
    wrap.classList.remove('control-button');
  }

  syncDOM(el, ctrl) {
    const btn = el.querySelector('button');
    if (btn) {
      btn.textContent = ctrl.props.Text || '';
      btn.disabled = !ctrl.props.Enabled;
      btn.style.fontWeight = ctrl.props['Font.Bold'] ? '500' : '';
      btn.style.fontSize = (ctrl.props['Font.Size'] * 1.333) + 'px';
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Text) lines.push(`            ${name}.Text = ${csStringLit(p.Text)};`);
    return lines;
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
