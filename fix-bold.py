import json

with open('/Users/denis/Work/WinForms/PhoneBook/.winforms.json', 'r') as f:
    data = json.load(f)

for form in data['forms']:
    if form['name'] == 'MainForm':
        # Remove Font.Bold from form level
        if 'Font.Bold' in form.get('props', {}):
            del form['props']['Font.Bold']
        
        # Remove Font.Bold from all children except buttons
        for child in form.get('children', []):
            if child['type'] == 'Label' or child['type'] == 'MenuStrip' or child['type'] == 'StatusStrip':
                if 'Font.Bold' in child.get('props', {}):
                    del child['props']['Font.Bold']
            elif child['type'] in ['TextBox', 'NumericUpDown', 'MaskedTextBox']:
                if 'Font.Bold' in child.get('props', {}):
                    del child['props']['Font.Bold']
            # Keep Font.Bold for Buttons if it exists

with open('/Users/denis/Work/WinForms/PhoneBook/.winforms.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Fixed MainForm Font.Bold in .winforms.json")
