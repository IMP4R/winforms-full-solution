import { ControlAdapter } from './base-adapter.js';

export class StatusStripAdapter extends ControlAdapter {
  constructor() {
    super('StatusStrip', {
      cs: 'StatusStrip',
      defaultSize: [0, 22],
      category: 'Menus & Toolbars',
      dock: 'Bottom',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    wrap.innerHTML = '';
    const items = ctrl.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const lbl = document.createElement('div');
      lbl.className = 'strip-label' + (item.BorderStyle === 'SunkenOuter' ? ' sunken' : '');
      lbl.textContent = item.Text || '';
      lbl.dataset.itemName = item.Name;
      if (mode === 'design') {
        lbl.dataset.itemPath = JSON.stringify([i]);
      }
      if (item.AutoSize === false && item['Size.Width']) {
        lbl.style.width = item['Size.Width'] + 'px';
        lbl.style.justifyContent = 'center';
      }
      wrap.appendChild(lbl);
    }
  }

  syncDOM(el, ctrl) {
    el.innerHTML = '';
    const items = ctrl.items || [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const lbl = document.createElement('div');
      lbl.className = 'strip-label' + (item.BorderStyle === 'SunkenOuter' ? ' sunken' : '');
      lbl.textContent = item.Text || '';
      lbl.dataset.itemName = item.Name;
      // In design mode the host click handler uses data-item-path; syncDOM is always in design mode
      lbl.dataset.itemPath = JSON.stringify([i]);
      if (item.AutoSize === false && item['Size.Width']) {
        lbl.style.width = item['Size.Width'] + 'px';
        lbl.style.justifyContent = 'center';
      }
      el.appendChild(lbl);
    }
    return true;
  }

  emitCS(ctrl, name) {
    const lines = [];
    if (ctrl.items?.length) {
      for (const it of ctrl.items) {
        lines.push(`            this.${it.Name}.Name = "${it.Name}";`);
        lines.push(`            this.${it.Name}.Text = ${csStringLit(it.Text || '')};`);
        if (it.BorderSides) lines.push(`            this.${it.Name}.BorderSides = System.Windows.Forms.ToolStripStatusLabelBorderSides.${it.BorderSides};`);
        if (it.BorderStyle) lines.push(`            this.${it.Name}.BorderStyle = System.Windows.Forms.Border3DStyle.${it.BorderStyle};`);
        if (it.AutoSize === false) lines.push(`            this.${it.Name}.AutoSize = false;`);
        if (it['Size.Width']) lines.push(`            this.${it.Name}.Size = new System.Drawing.Size(${it['Size.Width']}, ${it['Size.Height'] || 17});`);
      }
      const itemNames = ctrl.items.map(i => `this.${i.Name}`).join(', ');
      lines.push(`            ${name}.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { ${itemNames} });`);
    }
    return lines;
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
