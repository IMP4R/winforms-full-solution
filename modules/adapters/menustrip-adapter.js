import { ControlAdapter } from './base-adapter.js';

export class MenuStripAdapter extends ControlAdapter {
  constructor() {
    super('MenuStrip', {
      cs: 'MenuStrip',
      defaultSize: [0, 24],
      category: 'Menus & Toolbars',
      dock: 'Top',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    wrap.innerHTML = '';
    const items = ctrl.items || [];
    for (let i = 0; i < items.length; i++) {
      const top = items[i];
      const topEl = document.createElement('div');
      topEl.className = 'menu-top';
      topEl.textContent = top.Text;
      topEl.dataset.itemName = top.Name;
      if (mode === 'design') {
        topEl.dataset.itemPath = JSON.stringify([i]);
      }
      const sub = document.createElement('div');
      sub.className = 'submenu';
      for (let j = 0; j < (top.items || []).length; j++) {
        const child = top.items[j];
        if (child.IsSeparator) {
          const s = document.createElement('div');
          s.className = 'submenu-sep';
          sub.appendChild(s);
          continue;
        }
        const ci = document.createElement('div');
        ci.className = 'submenu-item';
        ci.textContent = child.Text;
        ci.dataset.itemName = child.Name;
        if (mode === 'design') {
          ci.dataset.itemPath = JSON.stringify([i, j]);
        }
        if (mode === 'runtime' && runtimeCtx && child.events?.Click) {
          ci.onclick = (e) => {
            e.stopPropagation();
            topEl.classList.remove('open');
            runtimeCtx.invokeHandler(child.events.Click, { sender: child, eventArgs: {} });
          };
        }
        sub.appendChild(ci);
      }
      topEl.appendChild(sub);
      if (mode === 'runtime') {
        if (runtimeCtx && top.events?.Click) {
          topEl.onclick = (e) => {
            e.stopPropagation();
            runtimeCtx.invokeHandler(top.events.Click, { sender: top, eventArgs: {} });
          };
        } else {
          topEl.onclick = (e) => {
            e.stopPropagation();
            const wasOpen = topEl.classList.contains('open');
            wrap.querySelectorAll('.menu-top.open').forEach(t => t.classList.remove('open'));
            if (!wasOpen) topEl.classList.add('open');
          };
        }
      }
      wrap.appendChild(topEl);
    }
  }

  syncDOM(el, ctrl) {
    // For MenuStrip we just rebuild innerHTML on any change — it's lightweight enough
    this.render(ctrl, el, 'design', null, null);
    return true;
  }

  emitCS(ctrl, name) {
    const lines = [];
    if (ctrl.items?.length) {
      for (const top of ctrl.items) {
        lines.push(`            this.${top.Name}.Name = "${top.Name}";`);
        lines.push(`            this.${top.Name}.Text = ${csStringLit(top.Text)};`);
        if (top.events?.Click) {
          lines.push(`            this.${top.Name}.Click += new System.EventHandler(this.${top.Name}_Click);`);
        }
        if (top.items?.length) {
          for (const sm of top.items) {
            if (sm.IsSeparator) continue;
            lines.push(`            this.${sm.Name}.Name = "${sm.Name}";`);
            lines.push(`            this.${sm.Name}.Text = ${csStringLit(sm.Text)};`);
            if (sm.events?.Click) {
              lines.push(`            this.${sm.Name}.Click += new System.EventHandler(this.${sm.Name}_Click);`);
            }
          }
          const sub = top.items.filter(s => !s.IsSeparator).map(i => `this.${i.Name}`).join(', ');
          lines.push(`            this.${top.Name}.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] { ${sub} });`);
        }
      }
      const topNames = ctrl.items.map(i => `this.${i.Name}`).join(', ');
      lines.push(`            ${name}.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { ${topNames} });`);
    }
    return lines;
  }
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
