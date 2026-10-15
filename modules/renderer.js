import { ControlTypes } from './ir.js';
import { Registry } from './control-registry.js';

/*
 * Mode: 'design' (selectable, no events fire) | 'runtime' (events fire)
 */

export function renderForm(form, mode = 'design', runtimeCtx = null) {
  const root = document.createElement('div');
  root.className = 'winform';
  root.dataset.formId = form.id;
  const w = form.props['Size.Width'];
  const h = form.props['Size.Height'];
  root.style.width = w + 'px';
  // We add chrome titlebar height, so actual form body = h - titlebar.
  // But VS designer treats Size as client area, so we just use h for body.

  // Title bar (chrome)
  const tb = document.createElement('div');
  tb.className = 'winform-titlebar';
  tb.innerHTML = `
    <div class="icon"></div>
    <div class="title">${escapeHtml(form.props.Text)}</div>
    <div class="controls">
      <button title="Minimize">─</button>
      <button title="Maximize">▢</button>
      <button class="close" title="Close">✕</button>
    </div>`;
  root.appendChild(tb);

  // Body
  const body = document.createElement('div');
  body.className = 'winform-body';
  body.style.width = w + 'px';
  body.style.height = h + 'px';
  body.style.position = 'relative';
  root.appendChild(body);

  // Render children
  for (const child of form.children) {
    const el = renderControl(child, mode, runtimeCtx, form);
    if (el) body.appendChild(el);
  }

  // Wire close button in runtime
  if (mode === 'runtime') {
    tb.querySelector('.close').onclick = () => {
      if (runtimeCtx) runtimeCtx.closeForm(form);
    };
  }

  // Anchor-based resize handling (runtime only)
  if (mode === 'runtime') {
    setupAnchorResize(body, form);
  }

  return root;
}

function setupAnchorResize(body, form) {
  const baseW = form.props['Size.Width'];
  const baseH = form.props['Size.Height'];
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      const newW = entry.contentRect.width;
      const newH = entry.contentRect.height;
      applyAnchorLayout(body, form, baseW, baseH, newW, newH);
    }
  });
  ro.observe(body);
  body._anchorObserver = ro;
}

function parseAnchor(str) {
  if (!str) return { Top: true, Left: true };
  const parts = String(str).split(',').map(s => s.trim());
  return {
    Top: parts.includes('Top'),
    Bottom: parts.includes('Bottom'),
    Left: parts.includes('Left'),
    Right: parts.includes('Right'),
  };
}

function applyAnchorLayout(body, form, baseW, baseH, newW, newH) {
  if (!body.children) return;
  for (const child of form.children) {
    const el = body.querySelector(`[data-ctrl-id="${child.id}"]`);
    if (!el) continue;
    const p = child.props;
    const anchor = parseAnchor(p.Anchor);
    const td = ControlTypes[child.type];
    if ((p.Dock || td.dock)) continue; // docked controls handled separately

    const left = p['Location.X'];
    const top = p['Location.Y'];
    const width = p['Size.Width'];
    const height = p['Size.Height'];
    const rightDist = baseW - (left + width);
    const bottomDist = baseH - (top + height);

    let newLeft = left;
    let newTop = top;
    let newWidth = width;
    let newHeight = height;

    if (anchor.Left && anchor.Right) {
      newWidth = Math.max(1, newW - left - rightDist);
    } else if (!anchor.Left && anchor.Right) {
      newLeft = Math.max(0, newW - width - rightDist);
    } else if (!anchor.Left && !anchor.Right) {
      // None: keep proportional center
      const cx = left + width / 2;
      newLeft = Math.max(0, Math.round((newW / baseW) * cx - width / 2));
    }

    if (anchor.Top && anchor.Bottom) {
      newHeight = Math.max(1, newH - top - bottomDist);
    } else if (!anchor.Top && anchor.Bottom) {
      newTop = Math.max(0, newH - height - bottomDist);
    } else if (!anchor.Top && !anchor.Bottom) {
      const cy = top + height / 2;
      newTop = Math.max(0, Math.round((newH / baseH) * cy - height / 2));
    }

    el.style.left = newLeft + 'px';
    el.style.top = newTop + 'px';
    el.style.width = newWidth + 'px';
    el.style.height = newHeight + 'px';
  }
}

export function renderControl(ctrl, mode, runtimeCtx, parentForm) {
  const td = ControlTypes[ctrl.type];
  if (td.invisible) return null;

  const wrap = document.createElement('div');
  wrap.className = 'control control-' + ctrl.type.toLowerCase();
  wrap.dataset.ctrlId = ctrl.id;
  wrap.dataset.ctrlName = ctrl.props.Name;
  wrap.dataset.ctrlType = ctrl.type;

  const p = ctrl.props;

  // Position & size
  const dock = p.Dock || td.dock;
  if (dock === 'Top') {
    wrap.style.left = '0';
    wrap.style.top = '0';
    wrap.style.right = '0';
    wrap.style.width = '100%';
    wrap.style.height = p['Size.Height'] + 'px';
  } else if (dock === 'Bottom') {
    wrap.style.left = '0';
    wrap.style.bottom = '0';
    wrap.style.width = '100%';
    wrap.style.height = p['Size.Height'] + 'px';
  } else if (dock === 'Left') {
    wrap.style.left = '0';
    wrap.style.top = '0';
    wrap.style.bottom = '0';
    wrap.style.width = p['Size.Width'] + 'px';
    wrap.style.height = '100%';
  } else if (dock === 'Right') {
    wrap.style.right = '0';
    wrap.style.top = '0';
    wrap.style.bottom = '0';
    wrap.style.width = p['Size.Width'] + 'px';
    wrap.style.height = '100%';
  } else if (dock === 'Fill') {
    wrap.style.left = '0';
    wrap.style.top = '0';
    wrap.style.right = '0';
    wrap.style.bottom = '0';
    wrap.style.width = '100%';
    wrap.style.height = '100%';
  } else {
    wrap.style.left = p['Location.X'] + 'px';
    wrap.style.top = p['Location.Y'] + 'px';
    wrap.style.width = p['Size.Width'] + 'px';
    wrap.style.height = p['Size.Height'] + 'px';
  }

  // Font — WinForms GDI-style rendering
  wrap.style.fontFamily = p['Font.Family'] || 'Segoe UI';
  wrap.style.fontSize = (p['Font.Size'] * 1.333) + 'px'; // pt -> px approx
  wrap.style.fontWeight = p['Font.Bold'] ? '700' : '400'; // Explicit 400 for non-Bold
  wrap.style.webkitFontSmoothing = 'antialiased';
  wrap.style.mozOsxFontSmoothing = 'grayscale';

  if (!p.Visible) wrap.style.display = 'none';

  // Render inner content per type
  renderControlInner(ctrl, wrap, mode, runtimeCtx, parentForm);

  // Recursively render children for container controls
  if (td.canHaveChildren && ctrl.children) {
    const containerBody = wrap.querySelector('.container-body') || wrap;
    for (const child of ctrl.children) {
      const childEl = renderControl(child, mode, runtimeCtx, parentForm);
      if (childEl) {
        childEl.style.position = 'absolute';
        containerBody.appendChild(childEl);
      }
    }
  }

  return wrap;
}

export function renderControlInner(ctrl, wrap, mode, runtimeCtx, parentForm) {
  const adapter = Registry[ctrl.type];
  if (adapter) {
    adapter.render(ctrl, wrap, mode, runtimeCtx, parentForm);
    return;
  }
  console.warn('Unknown control type for render:', ctrl.type);
}

// Simple mask logic: 9 = optional digit, 0 = required digit, anything else literal
export function applyMask(value, mask) {
  if (!mask) return value;
  let out = '';
  let vi = 0;
  for (let mi = 0; mi < mask.length && vi <= value.length; mi++) {
    const m = mask[mi];
    if (m === '0' || m === '9') {
      // find next digit in value
      while (vi < value.length && !/\d/.test(value[vi])) vi++;
      if (vi < value.length) {
        out += value[vi];
        vi++;
      } else {
        break;
      }
    } else {
      out += m;
      if (vi < value.length && value[vi] === m) vi++;
    }
  }
  return out;
}

export function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}
