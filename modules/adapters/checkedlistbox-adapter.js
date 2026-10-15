import { ControlAdapter } from './base-adapter.js';

export class CheckedListBoxAdapter extends ControlAdapter {
  constructor() {
    super('CheckedListBox', {
      cs: 'CheckedListBox',
      defaultSize: [120, 96],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const box = document.createElement('div');
    box.className = 'control-checkedlistbox';
    box.style.cssText = 'width:100%;height:100%;font-family:inherit;font-size:inherit;overflow:auto;border:1px solid var(--win-control-border);border-bottom-color:var(--win-control-border-bottom);';
    if (p.Items) {
      const items = String(p.Items).split(/\r?\n/);
      for (const it of items) {
        const row = document.createElement('label');
        row.className = 'checkedlistbox-item';
        row.style.cssText = 'display:block;padding:2px 8px;cursor:default;white-space:nowrap;';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.style.marginRight = '4px';
        cb.disabled = !p.Enabled || mode === 'design';
        row.appendChild(cb);
        const txt = document.createElement('span');
        txt.textContent = it;
        row.appendChild(txt);
        box.appendChild(row);
      }
    }
    wrap.appendChild(box);
    if (mode === 'design') box.style.pointerEvents = 'none';
    if (mode === 'runtime' && runtimeCtx) {
      box.addEventListener('click', (e) => {
        const row = e.target.closest('.checkedlistbox-item');
        if (!row) return;
        const cb = row.querySelector('input');
        cb.checked = !cb.checked;
        // Update CheckedItems prop
        const checkedTexts = Array.from(box.querySelectorAll('.checkedlistbox-item')).filter(r => r.querySelector('input').checked).map(r => r.querySelector('span').textContent);
        p.CheckedItems = checkedTexts.join('\n');
        if (ctrl.events && ctrl.events.ItemCheck) {
          runtimeCtx.invokeHandler(ctrl.events.ItemCheck, parentForm);
        }
      });
    }
  }

  syncDOM(el, ctrl) {
    const box = el.querySelector('.control-checkedlistbox');
    if (box) {
      if (ctrl.props.Items !== undefined) {
        box.innerHTML = '';
        const items = String(ctrl.props.Items || '').split(/\r?\n/);
        const checkedSet = new Set(String(ctrl.props.CheckedItems || '').split(/\r?\n/));
        for (const it of items) {
          const row = document.createElement('label');
          row.className = 'checkedlistbox-item';
          row.style.cssText = 'display:block;padding:2px 8px;cursor:default;white-space:nowrap;';
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.style.marginRight = '4px';
          cb.checked = checkedSet.has(it);
          row.appendChild(cb);
          const txt = document.createElement('span');
          txt.textContent = it;
          row.appendChild(txt);
          box.appendChild(row);
        }
      }
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
    return lines;
  }

  getProperties() {
    return [
      { key: 'Items', type: 'string', group: 'Data', editable: true, default: '' },
      { key: 'CheckedItems', type: 'string', group: 'Data', editable: false, default: '' },
    ];
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
