import sys, os, base64, requests, json
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv

sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')

api_keys = [k.strip() for k in os.getenv('GEMINI_API_KEY', '').split(',') if k.strip()]

def ask_gemini(ref_path, impl_path, form_name):
    prompt = f'''Ты QA инженер. Сравни макет (первое изображение — эталон из методички)
с реализацией (второе изображение — веб-симулятор WinForms) формы "{form_name}".
Найди ТОЛЬКО Major несоответствия (игнорируй Minor).
В конце дай ОДНУ цифру: оценка соответствия в процентах (0-100).'''
    
    with open(ref_path, 'rb') as f:
        ref = base64.b64encode(f.read()).decode()
    with open(impl_path, 'rb') as f:
        impl = base64.b64encode(f.read()).decode()
    
    for key in api_keys:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={key}"
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": "image/png", "data": ref}},
                    {"inline_data": {"mime_type": "image/png", "data": impl}}
                ]
            }]
        }
        try:
            resp = requests.post(url, json=payload, timeout=60)
            if resp.status_code == 200:
                data = resp.json()
                text = data['candidates'][0]['content']['parts'][0]['text']
                # Extract percentage
                import re
                m = re.search(r'(\d+)%', text)
                score = int(m.group(1)) if m else 0
                return form_name, score, text
        except Exception as e:
            pass
    return form_name, 0, "API_ERROR"

forms = [
    ('MainForm', '/tmp/lab_extract/images/Телефонный справочник (1)_02.png', '/tmp/runtime_screenshots/MainForm_runtime.png'),
    ('AddForm', '/tmp/lab_extract/images/Телефонный справочник (1)_05.png', '/tmp/runtime_screenshots/AddForm_runtime.png'),
    ('SearchNameForm', '/tmp/lab_extract/images/Телефонный справочник (1)_06.png', '/tmp/runtime_screenshots/SearchNameForm_runtime.png'),
]

results = []
with ThreadPoolExecutor(max_workers=3) as ex:
    futures = [ex.submit(ask_gemini, ref, impl, name) for name, ref, impl in forms]
    for f in futures:
        name, score, text = f.result()
        results.append((name, score, text))
        print(f"{name}: {score}%")

# Append to comparison file
with open('GEMINI_COMPARISON.md', 'a', encoding='utf-8') as f:
    f.write(f"\n\n{'='*60}\n")
    f.write(f"Round 9 (LAYOUT FIXES) — quick batch\n")
    f.write(f"{'='*60}\n\n")
    for name, score, text in results:
        f.write(f"\n{'='*30}\n{name}: {score}%\n{'='*30}\n")
        f.write(text)
        f.write("\n")

print("\nDone — appended to GEMINI_COMPARISON.md")
