import sys, os, base64, requests
from dotenv import load_dotenv

sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')

api_keys = [k.strip() for k in os.getenv('GEMINI_API_KEY', '').split(',') if k.strip()]

def ask(ref_path, impl_path, form_name):
    prompt = f'''Ты QA инженер. Сравни макет (первое изображение — эталон из методички)
с реализацией (второе изображение — веб-симулятор WinForms) формы "{form_name}".

Дай ТОЛЬКО:
1. Оценку соответствия в процентах (0-100)
2. Топ-3 несоответствия с критичностью (Critical/Major/Minor)

Формат:
SCORE: XX%
1. [Major/Minor] Описание
2. [Major/Minor] Описание
3. [Major/Minor] Описание'''
    
    with open(ref_path, 'rb') as f:
        ref_data = base64.b64encode(f.read()).decode()
    with open(impl_path, 'rb') as f:
        impl_data = base64.b64encode(f.read()).decode()
    
    for key in api_keys:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={key}"
        payload = {"contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": "image/png", "data": ref_data}},
            {"inline_data": {"mime_type": "image/png", "data": impl_data}}
        ]}]}
        try:
            resp = requests.post(url, json=payload, timeout=60)
            if resp.status_code == 200:
                text = resp.json()['candidates'][0]['content']['parts'][0]['text']
                import re
                m = re.search(r'(\d+)%', text)
                score = int(m.group(1)) if m else 0
                return form_name, score, text
            else:
                print(f"Key failed: {resp.status_code}")
        except Exception as e:
            print(f"Key error: {e}")
            pass
    return form_name, 0, "API_ERROR"

# Test all forms
forms = [
    ('MainForm', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_03.png', '/tmp/runtime_screenshots/MainForm_runtime.png'),
    ('AddForm', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_05.png', '/tmp/runtime_screenshots/AddForm_runtime.png'),
    ('SearchNameForm', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_06.png', '/tmp/runtime_screenshots/SearchNameForm_runtime.png'),
]

print("="*60)
print("GEMINI CHECK — ALL FORMS")
print("="*60)

for name, ref, impl in forms:
    print(f"\n{'='*40}")
    print(f"Checking {name}...")
    form_name, score, text = ask(ref, impl, name)
    print(f"\nSCORE: {score}%")
    print(text[:500])
    print(f"\n{'='*40}")
