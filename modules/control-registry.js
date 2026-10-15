import { ControlAdapter } from './adapters/base-adapter.js';
import { LabelAdapter } from './adapters/label-adapter.js';
import { TextBoxAdapter } from './adapters/textbox-adapter.js';
import { ButtonAdapter } from './adapters/button-adapter.js';
import { MaskedTextBoxAdapter } from './adapters/maskedtextbox-adapter.js';
import { NumericUpDownAdapter } from './adapters/numericupdown-adapter.js';
import { CheckBoxAdapter } from './adapters/checkbox-adapter.js';
import { RadioButtonAdapter } from './adapters/radiobutton-adapter.js';
import { ComboBoxAdapter } from './adapters/combobox-adapter.js';
import { ListBoxAdapter } from './adapters/listbox-adapter.js';
import { GroupBoxAdapter } from './adapters/groupbox-adapter.js';
import { PanelAdapter } from './adapters/panel-adapter.js';
import { DateTimePickerAdapter } from './adapters/datetimepicker-adapter.js';
import { ProgressBarAdapter } from './adapters/progressbar-adapter.js';
import { PictureBoxAdapter } from './adapters/picturebox-adapter.js';
import { CheckedListBoxAdapter } from './adapters/checkedlistbox-adapter.js';
import { RichTextBoxAdapter } from './adapters/richtextbox-adapter.js';
import { TreeViewAdapter } from './adapters/treeview-adapter.js';
import { DataGridViewAdapter } from './adapters/datagridview-adapter.js';
import { TabControlAdapter } from './adapters/tabcontrol-adapter.js';
import { TabPageAdapter } from './adapters/tabpage-adapter.js';
import { StatusStripAdapter } from './adapters/statusstrip-adapter.js';
import { MenuStripAdapter } from './adapters/menustrip-adapter.js';
import { OpenFileDialogAdapter } from './adapters/openfiledialog-adapter.js';
import { SaveFileDialogAdapter } from './adapters/savefiledialog-adapter.js';

export const Registry = {};

function register(type, adapter) {
  Registry[type] = adapter;
}

register('Label', new LabelAdapter());
register('TextBox', new TextBoxAdapter());
register('Button', new ButtonAdapter());
register('MaskedTextBox', new MaskedTextBoxAdapter());
register('NumericUpDown', new NumericUpDownAdapter());
register('CheckBox', new CheckBoxAdapter());
register('RadioButton', new RadioButtonAdapter());
register('ComboBox', new ComboBoxAdapter());
register('ListBox', new ListBoxAdapter());
register('GroupBox', new GroupBoxAdapter());
register('Panel', new PanelAdapter());
register('DateTimePicker', new DateTimePickerAdapter());
register('ProgressBar', new ProgressBarAdapter());
register('PictureBox', new PictureBoxAdapter());
register('CheckedListBox', new CheckedListBoxAdapter());
register('RichTextBox', new RichTextBoxAdapter());
register('TreeView', new TreeViewAdapter());
register('DataGridView', new DataGridViewAdapter());
register('TabControl', new TabControlAdapter());
register('TabPage', new TabPageAdapter());
register('StatusStrip', new StatusStripAdapter());
register('MenuStrip', new MenuStripAdapter());
register('OpenFileDialog', new OpenFileDialogAdapter());
register('SaveFileDialog', new SaveFileDialogAdapter());
