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
        ref = base64.b64encode(f.read()).decode()
    with open(impl_path, 'rb') as f:
        impl = base64.b64encode(f.read()).decode()
    
    for key in api_keys:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={key}"
        payload = {"contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": "image/png", "data": ref}},
            {"inline_data": {"mime_type": "image/png", "data": impl}}
        ]}]}
        try:
            resp = requests.post(url, json=payload, timeout=60)
            if resp.status_code == 200:
                text = resp.json()['candidates'][0]['content']['parts'][0]['text']
                import re
                m = re.search(r'(\d+)%', text)
                score = int(m.group(1)) if m else 0
                return form_name, score, text
        except:
            pass
    return form_name, 0, "API_ERROR"

# Check SearchNameForm with CORRECT reference
name, score, text = ask(
    '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_07.png',
    '/tmp/runtime_screenshots/SearchNameForm_runtime.png',
    'SearchNameForm'
)
print(f"{name}: {score}%")
print(text)

with open('GEMINI_COMPARISON.md', 'a', encoding='utf-8') as f:
    f.write(f"\n\n{'='*60}\nSearchNameForm CORRECTED check: {score}%\n{'='*60}\n")
    f.write(text)
    f.write("\n")
