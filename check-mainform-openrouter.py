import sys, os, base64, requests
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

def check_with_openrouter(ref_path, impl_path, form_name):
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

# Check MainForm
name, score, text = check_with_openrouter(
    '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_03.png',
    '/tmp/runtime_screenshots/MainForm_runtime.png',
    'MainForm'
)
print(f"{name}: {score}%")
print(text)

with open('GEMINI_COMPARISON.md', 'a', encoding='utf-8') as f:
    f.write(f"\n\n{'='*40}\nMainForm OpenRouter check: {score}%\n{'='*40}\n")
    f.write(text)
    f.write("\n")
