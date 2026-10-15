import sys
sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
from gemini_client import GeminiClient
import os
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')
client = GeminiClient(api_key=os.getenv('GEMINI_API_KEY'), model='gemini-3.5-flash')

prompt = '''Ты QA инженер. Сравни макет (первое изображение — эталон из методички)
с реализацией (второе изображение — веб-симулятор WinForms).
Оцени визуальное соответствие в % (0–100). Только число.'''

part3_dir = '/tmp/runtime_screenshots_part3'
for name in ['MainForm', 'AddForm', 'SearchNameForm']:
    ref = f'/tmp/lab_extract/images/Телефонный справочник (1)_01.png' if name == 'MainForm' else \
          f'/tmp/lab_extract/images/Телефонный справочник (1)_02.png' if name == 'AddForm' else \
          f'/tmp/lab_extract/images/Телефонный справочник (1)_04.png'
    impl = f'{part3_dir}/{name}_runtime.png'
    if os.path.exists(impl):
        result = client.compare_images(ref, impl, prompt)
        print(f"{name}: {result}")
    else:
        print(f"{name}: MISSING {impl}")
