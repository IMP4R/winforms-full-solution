import json

with open('PhoneBook/.winforms.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for form in data.get('forms', []):
    if form['name'] == 'AddForm':
        form['props']['Size.Width'] = 390
        form['props']['Size.Height'] = 460
        
        # Labels above fields, fields full width
        y = 20
        for ctrl in form.get('children', []):
            cname = ctrl['name']
            if cname.startswith('lbl'):
                ctrl['props']['Location.X'] = 20
                ctrl['props']['Location.Y'] = y
                ctrl['props']['Size.Width'] = 100
                y += 23
            elif ctrl['type'] in ('TextBox', 'NumericUpDown', 'MaskedTextBox'):
                ctrl['props']['Location.X'] = 20
                ctrl['props']['Location.Y'] = y
                ctrl['props']['Size.Width'] = 350
                y += 35
            elif ctrl['type'] == 'Button' and cname == 'AddButton':
                ctrl['props']['Location.X'] = 20
                ctrl['props']['Location.Y'] = y + 10
                ctrl['props']['Size.Width'] = 350
                ctrl['props']['Size.Height'] = 32

with open('PhoneBook/.winforms.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("AddForm vertical layout applied")
