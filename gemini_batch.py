import sys, os, base64, requests, json
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
from dotenv import load_dotenv
load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')

api_keys = [k.strip() for k in os.getenv('GEMINI_API_KEY', '').split(',') if k.strip()]

def gemini_score(ref_path, impl_path, form_name, key_idx=0):
    with open(ref_path, 'rb') as f:
        ref = base64.b64encode(f.read()).decode()
    with open(impl_path, 'rb') as f:
        impl = base64.b64encode(f.read()).decode()
    
    prompt = f"""Ты QA инженер. Сравни макет (первое изображение) с реализацией (второе изображение) формы "{form_name}".
Дай ТОЛЬКО:
1. Оценку соответствия в процентах (0-100)
2. Топ-3 несоответствия с критичностью (Critical/Major/Minor)

Ответь в формате:
SCORE: XX%
1. [Major/Minor] Краткое описание
2. [Major/Minor] Краткое описание
3. [Major/Minor] Краткое описание"""

    for i, key in enumerate(api_keys[key_idx:]):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={key}"
        payload = {"contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": "image/png", "data": ref}},
            {"inline_data": {"mime_type": "image/png", "data": impl}}
        ]}]}
        resp = requests.post(url, json=payload, timeout=60)
        if resp.status_code == 200:
            try:
                text = resp.json()['candidates'][0]['content']['parts'][0]['text']
                return form_name, text, key_idx + i
            except:
                return form_name, f"PARSE_ERROR: {resp.text[:200]}", key_idx + i
        elif resp.status_code == 429:
            continue
        else:
            return form_name, f"HTTP_{resp.status_code}: {resp.text[:200]}", key_idx + i
    return form_name, "ALL_KEYS_EXHAUSTED", -1

comparisons = [
    ('MainForm', '/tmp/lab_extract/images/Телефонный справочник (1)_02.png', '/tmp/runtime_screenshots/MainForm_runtime.png'),
    ('AddForm', '/tmp/lab_extract/images/Телефонный справочник (1)_05.png', '/tmp/runtime_screenshots/AddForm_runtime.png'),
    ('SearchNameForm', '/tmp/lab_extract/images/Телефонный справочник (1)_06.png', '/tmp/runtime_screenshots/SearchNameForm_runtime.png'),
]

results = []
key_idx = 0
with ThreadPoolExecutor(max_workers=3) as ex:
    futures = {ex.submit(gemini_score, ref, impl, name, 0): name for name, ref, impl in comparisons}
    for future in futures:
        name, text, used_key = future.result()
        print(f"\n{'='*40}\n{name}\n{'='*40}")
        print(text)
        results.append((name, text))
        if used_key >= 0:
            key_idx = max(key_idx, used_key + 1)

# Append to GEMINI_COMPARISON.md
with open('/Users/denis/Work/WinForms/GEMINI_COMPARISON.md', 'a', encoding='utf-8') as f:
    f.write(f"\n\n{'='*60}\n")
    f.write(f"Round 9 (LAYOUT FIXES) — {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
    f.write(f"Changes: Labels 12F Bold, TextBoxes 9F Regular, layout fixes (button gap, field widths, form sizes)\n")
    f.write(f"{'='*60}\n\n")
    for name, text in results:
        f.write(f"\n{'='*40}\n{name}\n{'='*40}\n")
        f.write(text)
        f.write("\n")

print("\nDone. Results appended.")
