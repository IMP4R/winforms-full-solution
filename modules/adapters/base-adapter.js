// Base adapter — every control type provides an instance of this (or a subclass)
export class ControlAdapter {
  constructor(typeName, metadata) {
    this.typeName = typeName;
    this.csClass = metadata.cs;
    this.defaultSize = metadata.defaultSize || [100, 23];
    this.category = metadata.category || 'Common Controls';
    this.dock = metadata.dock || null;
    this.invisible = metadata.invisible || false;
    this.canHaveChildren = metadata.canHaveChildren || false;
  }

  // Create DOM inside `wrap`. `mode` is 'design' or 'runtime'.
  // `runtimeCtx` is the WinFormsRuntime instance (null in design mode).
  // `parentForm` is the form IR object.
  render(ctrl, wrap, mode, runtimeCtx, parentForm) {
    throw new Error(`render() not implemented for ${this.typeName}`);
  }

  // Incrementally update an existing DOM element `el` to match `ctrl.props`.
  // Return true if handled, false if full rebuild needed.
  syncDOM(el, ctrl) {
    return false; // by default, request full rebuild
  }

  // Return an array of C# initialization lines (type-specific only).
  // Common lines (Location, Size, Name, TabIndex, Font, Enabled) are emitted by the caller.
  emitCS(ctrl, name) {
    return [];
  }

  // Return extra property descriptors for this control type.
  getProperties() {
    return [];
  }
}
