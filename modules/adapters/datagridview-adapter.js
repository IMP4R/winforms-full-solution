import { ControlAdapter } from './base-adapter.js';

export class DataGridViewAdapter extends ControlAdapter {
  constructor() {
    super('DataGridView', {
      cs: 'DataGridView',
      defaultSize: [240, 150],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const grid = document.createElement('table');
    grid.className = 'control-datagridview';
    grid.style.cssText = 'width:100%;height:100%;font-family:inherit;font-size:inherit;border-collapse:collapse;table-layout:fixed;background:var(--win-surface);color:var(--win-text);';

    // Header
    const thead = document.createElement('thead');
    const hrow = document.createElement('tr');
    const columns = parseColumns(String(p.Columns || 'Column1\nColumn2\nColumn3'));
    for (const col of columns) {
      const th = document.createElement('th');
      th.textContent = col;
      th.style.cssText = 'padding:4px 8px;border:1px solid var(--win-border);background:#f5f5f5;font-weight:600;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      hrow.appendChild(th);
    }
    thead.appendChild(hrow);
    grid.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    const rows = parseRows(String(p.Rows || ''));
    for (const row of rows) {
      const tr = document.createElement('tr');
      tr.style.cssText = 'cursor:default;';
      for (let i = 0; i < columns.length; i++) {
        const td = document.createElement('td');
        td.textContent = row[i] || '';
        td.style.cssText = 'padding:3px 8px;border:1px solid var(--win-border);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    grid.appendChild(tbody);
    wrap.appendChild(grid);
    if (mode === 'design') grid.style.pointerEvents = 'none';
    if (mode === 'runtime' && runtimeCtx) {
      tbody.addEventListener('click', (e) => {
        const tr = e.target.closest('tr');
        if (!tr) return;
        tbody.querySelectorAll('tr').forEach(el => {
          el.style.background = '';
          el.style.color = '';
        });
        tr.style.background = 'var(--win-accent)';
        tr.style.color = '#fff';
        p.CurrentRow = tbody.children.length > 0 ? Array.from(tbody.children).indexOf(tr) : -1;
        if (ctrl.events && ctrl.events.CellClick) {
          runtimeCtx.invokeHandler(ctrl.events.CellClick, parentForm);
        }
      });
    }
  }

  syncDOM(el, ctrl) {
    const grid = el.querySelector('.control-datagridview');
    if (grid) {
      const p = ctrl.props;
      const columns = parseColumns(String(p.Columns || 'Column1\nColumn2\nColumn3'));
      // Rebuild header
      grid.querySelector('thead').innerHTML = '';
      const hrow = document.createElement('tr');
      for (const col of columns) {
        const th = document.createElement('th');
        th.textContent = col;
        th.style.cssText = 'padding:4px 8px;border:1px solid var(--win-border);background:#f5f5f5;font-weight:600;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
        hrow.appendChild(th);
      }
      grid.querySelector('thead').appendChild(hrow);
      // Rebuild body
      const tbody = grid.querySelector('tbody');
      tbody.innerHTML = '';
      const rows = parseRows(String(p.Rows || ''));
      for (const row of rows) {
        const tr = document.createElement('tr');
        tr.style.cssText = 'cursor:default;';
        for (let i = 0; i < columns.length; i++) {
          const td = document.createElement('td');
          td.textContent = row[i] || '';
          td.style.cssText = 'padding:3px 8px;border:1px solid var(--win-border);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    const columns = parseColumns(String(p.Columns || ''));
    for (const col of columns) {
      lines.push(`            ${name}.Columns.Add(${csStringLit(col)}, ${csStringLit(col)});`);
    }
    // Rows as data binding, not static rows in Designer.cs
    return lines;
  }

  getProperties() {
    return [
      { key: 'Columns', type: 'string', group: 'Data', editable: true, default: 'Column1\nColumn2\nColumn3' },
      { key: 'Rows', type: 'string', group: 'Data', editable: true, default: '' },
      { key: 'CurrentRow', type: 'int', group: 'Data', editable: false, default: -1 },
      { key: 'ReadOnly', type: 'bool', group: 'Behavior', editable: true, default: false },
      { key: 'AllowUserToAddRows', type: 'bool', group: 'Behavior', editable: true, default: true },
      { key: 'SelectionMode', type: 'enum', group: 'Behavior', editable: true, default: 'FullRowSelect', options: ['CellSelect', 'FullRowSelect', 'RowHeaderSelect', 'ColumnHeaderSelect'] },
    ];
  }
}

function parseColumns(text) {
  return text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}

function parseRows(text) {
  return text.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(line => line.split('\t').map(c => c.trim()));
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
