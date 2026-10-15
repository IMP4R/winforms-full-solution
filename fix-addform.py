import json

with open('PhoneBook/.winforms.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for form in data.get('forms', []):
    if form['name'] == 'AddForm':
        form['props']['Size.Width'] = 400
        form['props']['Size.Height'] = 390
        for ctrl in form.get('children', []):
            if ctrl['type'] in ('TextBox', 'NumericUpDown', 'MaskedTextBox'):
                ctrl['props']['Size.Width'] = 370
            if ctrl['name'] == 'AddButton':
                ctrl['props']['Size.Width'] = 370
                ctrl['props']['Location.X'] = 20

with open('PhoneBook/.winforms.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("AddForm layout fixed: width=400, fields=370, button=370")
