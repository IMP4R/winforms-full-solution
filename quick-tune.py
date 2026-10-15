import subprocess, sys, os, json, time

# ── 1. Layout fixes in .winforms.json ──
with open('PhoneBook/.winforms.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for form in data.get('forms', []):
    name = form['name']
    if name == 'MainForm':
        # Center buttons with 10px gap
        for ctrl in form.get('children', []):
            if ctrl['name'] == 'PreviousButton':
                ctrl['props']['Location.X'] = 135
                ctrl['props']['Size.Width'] = 40
                ctrl['props']['Size.Height'] = 30
            if ctrl['name'] == 'NextButton':
                ctrl['props']['Location.X'] = 185
                ctrl['props']['Size.Width'] = 40
                ctrl['props']['Size.Height'] = 30
    elif name == 'AddForm':
        # Wider form and fields
        form['props']['Size.Width'] = 390
        form['props']['Size.Height'] = 390
        for ctrl in form.get('children', []):
            if ctrl['type'] in ('TextBox', 'NumericUpDown', 'MaskedTextBox'):
                ctrl['props']['Size.Width'] = 350
            if ctrl['type'] == 'Button' and ctrl['name'] == 'AddButton':
                ctrl['props']['Size.Width'] = 350
    elif name == 'SearchNameForm':
        # Narrower form and fields, wider results
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

with open('PhoneBook/.winforms.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Also apply to preset (simplified: just .winforms.json is source of truth for round-trip)
print("Layout fixes applied")

# ── 2. Kill + restart server ──
subprocess.run("killall -9 node 2>/dev/null; sleep 1; nohup node server.js > server.log 2>&1 &", shell=True)
time.sleep(3)

# Verify server
r = subprocess.run("curl -s http://localhost:8824/api/project > /dev/null && echo OK || echo FAIL", shell=True, capture_output=True, text=True)
print("Server:", r.stdout.strip())

# ── 3. Screenshots ──
r = subprocess.run(["node", "screenshot-forms-v2.mjs"], capture_output=True, text=True, timeout=120)
print(r.stdout)
if r.returncode != 0:
    print("Screenshot error:", r.stderr)
    sys.exit(1)

print("Screenshots done")
