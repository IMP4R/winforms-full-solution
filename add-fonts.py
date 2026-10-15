import re, sys

files = [
    'PhoneBook/MainForm.Designer.cs',
    'PhoneBook/AddForm.Designer.cs', 
    'PhoneBook/SearchNameForm.Designer.cs',
    'PhoneBookPart3/MainForm.Designer.cs',
    'PhoneBookPart3/AddForm.Designer.cs',
    'PhoneBookPart3/SearchNameForm.Designer.cs'
]

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    while i < len(lines):
        new_lines.append(lines[i])
        # Match: this.ControlName.Name = "...";
        m = re.match(r'(\s+)this\.(\w+)\.Name = "(\w+)";', lines[i])
        if m:
            indent = m.group(1)
            ctrl_name = m.group(2)
            # Check if next lines already have Font
            has_font = False
            for j in range(i+1, min(i+5, len(lines))):
                if 'Font = new System.Drawing.Font' in lines[j]:
                    has_font = True
                    break
            if not has_font:
                # Determine if Label or Button by looking ahead
                is_label = False
                is_button = False
                for j in range(i+1, min(i+8, len(lines))):
                    if f'this.{ctrl_name}.Text = ' in lines[j] or f'this.{ctrl_name}.TabIndex' in lines[j]:
                        if ctrl_name.startswith('lbl') or 'Label' in lines[max(0,i-3):i]:
                            is_label = True
                        if 'Button' in lines[max(0,i-3):i] or ctrl_name.endswith('Button'):
                            is_button = True
                        break
                if is_label or is_button:
                    new_lines.append(f'{indent}this.{ctrl_name}.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);\n')
                else:
                    # TextBox, NumericUpDown, MaskedTextBox etc → 9F Regular
                    new_lines.append(f'{indent}this.{ctrl_name}.Font = new System.Drawing.Font("Tahoma", 9F);\n')
        i += 1
    
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"Updated {path}")
