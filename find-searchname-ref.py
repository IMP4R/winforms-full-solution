import sys, os, base64, requests
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')

api_keys = [k.strip() for k in os.getenv('GEMINI_API_KEY', '').split(',') if k.strip()]

def quick_check(ref_path, impl_path):
    prompt = '''Ты QA инженер. Сравни макет (первое изображение) с реализацией (второе). 
Если это совершенно разные формы (например, форма добавления vs форма поиска), скажи "DIFFERENT_FORMS".
Иначе дай оценку 0-100. Формат: SCORE: XX%'''
    
    with open(ref_path, 'rb') as f:
        ref = base64.b64encode(f.read()).decode()
    with open(impl_path, 'rb') as f:
        impl = base64.b64encode(f.read()).decode()
    
    for key in api_keys[:3]:  # Use first 3 keys
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={key}"
        payload = {"contents": [{"parts": [
            {"text": prompt},
            {"inline_data": {"mime_type": "image/png", "data": ref}},
            {"inline_data": {"mime_type": "image/png", "data": impl}}
        ]}]}
        try:
            resp = requests.post(url, json=payload, timeout=30)
            if resp.status_code == 200:
                text = resp.json()['candidates'][0]['content']['parts'][0]['text']
                return text
        except:
            pass
    return "ERROR"

# Test all reference images against SearchNameForm implementation
impl = '/tmp/runtime_screenshots/SearchNameForm_runtime.png'
refs = [
    ('image_02', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_02.png'),
    ('image_03', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_03.png'),
    ('image_04', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_04.png'),
    ('image_05', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_05.png'),
    ('image_06', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_06.png'),
    ('image_07', '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_07.png'),
]

print("Checking which reference matches SearchNameForm:")
for name, path in refs:
    if os.path.exists(path):
        print(f"\n{name} vs SearchNameForm:")
        result = quick_check(path, impl)
        print(result[:200])
        import time
        time.sleep(2)  # Rate limit
