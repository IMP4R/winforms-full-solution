import { ControlAdapter } from './base-adapter.js';

export class ListBoxAdapter extends ControlAdapter {
  constructor() {
    super('ListBox', {
      cs: 'ListBox',
      defaultSize: [120, 96],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const box = document.createElement('div');
    box.className = 'control-listbox';
    box.style.cssText = 'width:100%;height:100%;font-family:inherit;font-size:inherit;overflow:auto;';
    if (p.Items) {
      const items = String(p.Items).split(/\r?\n/);
      for (const it of items) {
        const row = document.createElement('div');
        row.className = 'listbox-item';
        row.textContent = it;
        box.appendChild(row);
      }
    }
    wrap.appendChild(box);
    if (mode === 'design') box.style.pointerEvents = 'none';
    if (mode === 'runtime' && runtimeCtx) {
      box.addEventListener('click', (e) => {
        const item = e.target.closest('.listbox-item');
        if (!item) return;
        box.querySelectorAll('.listbox-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        const idx = Array.from(box.children).indexOf(item);
        p.SelectedIndex = idx;
        if (ctrl.events && ctrl.events.SelectedIndexChanged) {
          runtimeCtx.invokeHandler(ctrl.events.SelectedIndexChanged, parentForm);
        }
      });
    }
  }

  syncDOM(el, ctrl) {
    const box = el.querySelector('.control-listbox');
    if (box) {
      if (ctrl.props.Items !== undefined) {
        box.innerHTML = '';
        const items = String(ctrl.props.Items || '').split(/\r?\n/);
        for (const it of items) {
          const row = document.createElement('div');
          row.className = 'listbox-item';
          row.textContent = it;
          box.appendChild(row);
        }
      }
      const selIdx = ctrl.props.SelectedIndex ?? -1;
      box.querySelectorAll('.listbox-item').forEach((el, i) => {
        el.classList.toggle('selected', i === selIdx);
      });
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Items) {
      const items = String(p.Items).split(/\r?\n/).filter(s => s !== '').map(s => csStringLit(s)).join(', ');
      if (items) lines.push(`            ${name}.Items.AddRange(new object[] { ${items} });`);
    }
    if (p.SelectedIndex !== undefined && p.SelectedIndex !== -1) {
      lines.push(`            ${name}.SelectedIndex = ${p.SelectedIndex};`);
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'Items', type: 'string', group: 'Data', editable: true, default: '' },
      { key: 'SelectedIndex', type: 'int', group: 'Data', editable: true, default: -1 },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
