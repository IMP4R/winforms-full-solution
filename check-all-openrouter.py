import sys, os, base64, requests
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

def check_form(ref_path, impl_path, form_name):
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
    
    url = 'https://openrouter.ai/api/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {OPENROUTER_API_KEY}',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:8824',
        'X-Title': 'WinForms Check'
    }
    
    payload = {
        'model': 'google/gemma-4-26b-a4b-it',
        'messages': [{
            'role': 'user',
            'content': [
                {'type': 'text', 'text': prompt},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{ref_data}'}},
                {'type': 'image_url', 'image_url': {'url': f'data:image/png;base64,{impl_data}'}}
            ]
        }]
    }
    
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=120)
        if resp.status_code == 200:
            text = resp.json()['choices'][0]['message']['content']
            import re
            m = re.search(r'(\d+)%', text)
            score = int(m.group(1)) if m else 0
            return form_name, score, text
        else:
            return form_name, 0, f"HTTP {resp.status_code}: {resp.text[:500]}"
    except Exception as e:
        return form_name, 0, f"Error: {e}"

# Check all forms
forms = [
    ('MainForm', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_03.png', '/tmp/runtime_screenshots/MainForm_runtime.png'),
    ('AddForm', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_05.png', '/tmp/runtime_screenshots/AddForm_runtime.png'),
    ('SearchNameForm', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_06.png', '/tmp/runtime_screenshots/SearchNameForm_runtime.png'),
]

results = []
for name, ref, impl in forms:
    print(f"\nChecking {name}...")
    form_name, score, text = check_form(ref, impl, name)
    results.append((form_name, score, text))
    print(f"{form_name}: {score}%")
    print(text[:500])

# Write results
with open('GEMINI_COMPARISON.md', 'a', encoding='utf-8') as f:
    f.write(f"\n\n{'='*60}\nFINAL CHECK (OpenRouter) — {os.popen('date').read().strip()}\n{'='*60}\n")
    for name, score, text in results:
        f.write(f"\n{name}: {score}%\n{text}\n")
    
    # Summary table
    f.write(f"\n\n## Final Scores Summary\n\n")
    f.write(f"| Form | Score | Status |\n")
    f.write(f"|------|-------|--------|\n")
    for name, score, _ in results:
        status = "✅ Target met (≥90%)" if score >= 90 else "⚠️ Below target"
        f.write(f"| {name} | **{score}%** | {status} |\n")

print(f"\n{'='*60}")
print("FINAL RESULTS:")
for name, score, _ in results:
    status = "✅ PASS" if score >= 90 else "⚠️ NEEDS WORK"
    print(f"  {name}: {score}% {status}")
