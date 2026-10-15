import re

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
        content = f.read()
    
    # Add Tahoma 12F Bold font for ALL controls that don't have it
    # Pattern: this.ControlName.Name = "...";
    # Need to insert Font line after Name line (and TabIndex if present)
    
    def add_font(match):
        full = match.group(0)
        ctrl_name = match.group(2)
        
        # Check if already has Font in nearby lines
        start = match.start()
        nearby = content[start:start+300]
        if 'Font = new System.Drawing.Font' in nearby:
            return full
        
        # Determine font based on control name
        if ctrl_name.startswith('lbl') or ctrl_name.endswith('Button'):
            font_line = f'            this.{ctrl_name}.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);\n'
        else:
            font_line = f'            this.{ctrl_name}.Font = new System.Drawing.Font("Tahoma", 9F);\n'
        
        return full + font_line
    
    # Match: this.ControlName.Name = "..."; followed by optional TabIndex
    pattern = r'(            this\.(\w+)\.Name = "\w+";\n)(            this\.\w+\.TabIndex = \d+;\n)?'
    content = re.sub(pattern, add_font, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {path}")
