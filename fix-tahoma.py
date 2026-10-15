import json

with open('PhoneBook/.winforms.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for form in data.get('forms', []):
    name = form['name']
    for ctrl in form.get('children', []):
        cname = ctrl['name']
        cprops = ctrl.get('props', {})
        
        # ALL labels: Tahoma 12F Bold (closer to classic WinForms reference)
        if cname.startswith('lbl'):
            cprops['Font.Family'] = 'Tahoma'
            cprops['Font.Size'] = 12
            cprops['Font.Bold'] = True
        # ALL buttons: Tahoma 12F Bold
        elif ctrl['type'] == 'Button':
            cprops['Font.Family'] = 'Tahoma'
            cprops['Font.Size'] = 12
            cprops['Font.Bold'] = True
        # Text inputs: Tahoma 9F Regular
        elif ctrl['type'] in ('TextBox', 'NumericUpDown', 'MaskedTextBox'):
            cprops['Font.Family'] = 'Tahoma'
            cprops['Font.Size'] = 9
            cprops['Font.Bold'] = False
        # Menu/StatusStrip: Tahoma 9F Regular  
        elif ctrl['type'] in ('MenuStrip', 'StatusStrip'):
            cprops['Font.Family'] = 'Tahoma'
            cprops['Font.Size'] = 9
            cprops['Font.Bold'] = False

    # Layout fixes
    if name == 'AddForm':
        form['props']['Size.Width'] = 390
        form['props']['Size.Height'] = 390
        for ctrl in form.get('children', []):
            if ctrl['type'] in ('TextBox', 'NumericUpDown', 'MaskedTextBox'):
                ctrl['props']['Size.Width'] = 350
            if ctrl['name'] == 'AddButton':
                ctrl['props']['Size.Width'] = 350
                
    elif name == 'SearchNameForm':
        form['props']['Size.Width'] = 400
        form['props']['Size.Height'] = 350
        for ctrl in form.get('children', []):
            if ctrl['type'] == 'TextBox' and ctrl['name'] in ('LastNameTextBox','NameTextBox','PatronymicTextBox'):
                ctrl['props']['Size.Width'] = 200
                ctrl['props']['Location.X'] = 170
            if ctrl['name'] == 'ResultsTextBox':
                ctrl['props']['Size.Width'] = 360
                ctrl['props']['Size.Height'] = 130
            if ctrl['type'] == 'Button' and ctrl['name'] == 'SearchButton':
                ctrl['props']['Size.Width'] = 120

    elif name == 'MainForm':
        for ctrl in form.get('children', []):
            if ctrl['name'] == 'PreviousButton':
                ctrl['props']['Location.X'] = 135
                ctrl['props']['Size.Width'] = 40
                ctrl['props']['Size.Height'] = 30
            if ctrl['name'] == 'NextButton':
                ctrl['props']['Location.X'] = 185
                ctrl['props']['Size.Width'] = 40
                ctrl['props']['Size.Height'] = 30

with open('PhoneBook/.winforms.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Font → Tahoma, layout fixes applied")
