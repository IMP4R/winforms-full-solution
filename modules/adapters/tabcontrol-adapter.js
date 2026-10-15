import { ControlAdapter } from './base-adapter.js';

export class TabControlAdapter extends ControlAdapter {
  constructor() {
    super('TabControl', {
      cs: 'TabControl',
      defaultSize: [300, 200],
      category: 'Containers',
      canHaveChildren: true,
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const tc = document.createElement('div');
    tc.className = 'control-tabcontrol';
    tc.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;font-family:inherit;font-size:inherit;';

    // Tab headers
    const headers = document.createElement('div');
    headers.className = 'tabcontrol-headers';
    headers.style.cssText = 'display:flex;background:#f0f0f0;border-bottom:1px solid #d0d0d0;flex-shrink:0;';

    const pages = ctrl.children || [];
    let selectedIdx = p.SelectedIndex || 0;
    if (selectedIdx >= pages.length) selectedIdx = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const tab = document.createElement('div');
      tab.className = 'tabcontrol-tab' + (i === selectedIdx ? ' active' : '');
      tab.textContent = page.props.Text || page.props.Name || `Tab ${i + 1}`;
      tab.dataset.tabIndex = String(i);
      tab.style.cssText = 'padding:4px 12px;font-size:12px;cursor:pointer;border:1px solid transparent;border-bottom:none;margin-bottom:-1px;position:relative;z-index:1;';
      if (i === selectedIdx) {
        tab.style.background = '#fff';
        tab.style.borderColor = '#d0d0d0';
        tab.style.borderBottomColor = '#fff';
      }
      headers.appendChild(tab);
    }
    tc.appendChild(headers);

    // Tab page body — children are rendered here by renderer.js
    const body = document.createElement('div');
    body.className = 'container-body tabcontrol-body';
    body.style.cssText = 'flex:1;position:relative;overflow:hidden;background:#fff;border:1px solid #d0d0d0;border-top:none;';
    tc.appendChild(body);
    wrap.appendChild(tc);
    if (mode === 'design') tc.style.pointerEvents = 'none';
  }

  syncDOM(el, ctrl) {
    // Update tab headers
    const headers = el.querySelector('.tabcontrol-headers');
    if (headers) {
      const pages = ctrl.children || [];
      let selectedIdx = ctrl.props.SelectedIndex || 0;
      if (selectedIdx >= pages.length) selectedIdx = 0;
      const tabs = headers.querySelectorAll('.tabcontrol-tab');
      tabs.forEach((tab, i) => {
        const page = pages[i];
        if (page) tab.textContent = page.props.Text || page.props.Name || `Tab ${i + 1}`;
        if (i === selectedIdx) {
          tab.classList.add('active');
          tab.style.background = '#fff';
          tab.style.borderColor = '#d0d0d0';
          tab.style.borderBottomColor = '#fff';
        } else {
          tab.classList.remove('active');
          tab.style.background = '';
          tab.style.borderColor = 'transparent';
          tab.style.borderBottomColor = '';
        }
      });
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.SelectedIndex !== undefined && p.SelectedIndex !== 0) {
      lines.push(`            ${name}.SelectedIndex = ${p.SelectedIndex};`);
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'SelectedIndex', type: 'int', group: 'Behavior', editable: true, default: 0 },
    ];
  }
}
