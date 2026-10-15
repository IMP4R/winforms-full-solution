import { ControlAdapter } from './base-adapter.js';

export class TreeViewAdapter extends ControlAdapter {
  constructor() {
    super('TreeView', {
      cs: 'TreeView',
      defaultSize: [120, 96],
      category: 'Common Controls',
    });
  }

  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    const p = ctrl.props;
    const tv = document.createElement('div');
    tv.className = 'control-treeview';
    tv.style.cssText = 'width:100%;height:100%;font-family:inherit;font-size:inherit;overflow:auto;border:1px solid var(--win-control-border);background:var(--win-surface);color:var(--win-text);user-select:none;';
    if (p.Nodes) {
      const nodes = parseNodes(String(p.Nodes));
      for (const n of nodes) {
        tv.appendChild(renderNode(n, 0));
      }
    }
    wrap.appendChild(tv);
    if (mode === 'design') tv.style.pointerEvents = 'none';
    if (mode === 'runtime' && runtimeCtx) {
      tv.addEventListener('click', (e) => {
        const nodeEl = e.target.closest('.treeview-node');
        if (!nodeEl) return;
        tv.querySelectorAll('.treeview-node').forEach(el => el.classList.remove('selected'));
        nodeEl.classList.add('selected');
        p.SelectedNode = nodeEl.dataset.nodePath;
        if (ctrl.events && ctrl.events.AfterSelect) {
          runtimeCtx.invokeHandler(ctrl.events.AfterSelect, parentForm);
        }
      });
    }
  }

  syncDOM(el, ctrl) {
    const tv = el.querySelector('.control-treeview');
    if (tv && ctrl.props.Nodes !== undefined) {
      tv.innerHTML = '';
      const nodes = parseNodes(String(ctrl.props.Nodes || ''));
      for (const n of nodes) {
        tv.appendChild(renderNode(n, 0));
      }
    }
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Nodes) {
      const nodes = parseNodes(String(p.Nodes));
      for (const n of nodes) {
        lines.push(...emitNodeCS(n, name, 'treeView1.Nodes'));
      }
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'Nodes', type: 'string', group: 'Data', editable: true, default: '' },
      { key: 'SelectedNode', type: 'string', group: 'Data', editable: false, default: '' },
    ];
  }
}

function parseNodes(text) {
  const lines = text.split(/\r?\n/);
  const stack = [{ children: [], depth: -1 }];
  for (const line of lines) {
    if (!line.trim()) continue;
    const match = line.match(/^(\s*)(.+)$/);
    if (!match) continue;
    const depth = match[1].length;
    const name = match[2].trim();
    const node = { name, children: [], depth };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(node);
    stack.push({ ...node, depth });
  }
  return stack[0].children;
}

function renderNode(node, depth) {
  const el = document.createElement('div');
  el.className = 'treeview-node';
  el.dataset.nodePath = node.name;
  el.style.cssText = `padding:2px 8px 2px ${8 + depth * 16}px;cursor:default;white-space:nowrap;`;
  el.textContent = node.name;
  for (const child of node.children) {
    el.appendChild(renderNode(child, depth + 1));
  }
  return el;
}

function emitNodeCS(node, ctrlName, parentPath, index = 0) {
  const lines = [];
  const varName = `${ctrlName}_Node${index}`;
  lines.push(`            TreeNode ${varName} = new TreeNode(${csStringLit(node.name)});`);
  lines.push(`            ${parentPath}.Add(${varName});`);
  let childIndex = 0;
  for (const child of node.children) {
    lines.push(...emitNodeCS(child, ctrlName, `${varName}.Nodes`, childIndex));
    childIndex++;
  }
  return lines;
}

function csStringLit(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '"';
}
