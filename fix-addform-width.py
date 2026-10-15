import json

with open('PhoneBook/.winforms.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for form in data.get('forms', []):
    if form['name'] == 'AddForm':
        for ctrl in form.get('children', []):
            if ctrl['type'] in ('TextBox', 'NumericUpDown', 'MaskedTextBox'):
                ctrl['props']['Size.Width'] = 365
            if ctrl['name'] == 'AddButton':
                ctrl['props']['Size.Width'] = 365

with open('PhoneBook/.winforms.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("AddForm fields widened to 365px")
