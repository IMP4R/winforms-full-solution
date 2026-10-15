import { ControlAdapter } from './base-adapter.js';

export class OpenFileDialogAdapter extends ControlAdapter {
  constructor() {
    super('OpenFileDialog', {
      cs: 'OpenFileDialog',
      defaultSize: [0, 0],
      category: 'Dialogs',
      invisible: true,
    });
  }

  render() {
    // invisible — no DOM
  }

  syncDOM() {
    return true;
  }

  emitCS(ctrl, name) {
    const p = ctrl.props;
    const lines = [];
    if (p.Filter) {
      lines.push(`            ${name}.Filter = "${String(p.Filter).replace(/"/g, '\\"')}";`);
    }
    return lines;
  }

  getProperties() {
    return [
      { key: 'Filter', type: 'string', group: 'Behavior', editable: true, default: '' },
    ];
  }
}
