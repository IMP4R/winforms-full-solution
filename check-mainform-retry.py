import sys, time
sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
from gemini_client import GeminiClient
import os
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')
client = GeminiClient(api_key=os.getenv('GEMINI_API_KEY'), model='gemini-2.0-flash')

reference = '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_01.png'
implement = '/tmp/runtime_screenshots/MainForm_runtime.png'

prompt = '''Ты QA инженер. Сравни макет (первое изображение) с реализацией (второе).
Оцени визуальное соответствие в % (0-100). Только число.'''

for attempt in range(20):
    try:
        result = client.compare_images(reference, implement, prompt)
        import re
        m = re.search(r'(\d+)', str(result))
        score = m.group(1) if m else '0'
        print(f"SUCCESS: {score}%")
        break
    except Exception as e:
        print(f"Attempt {attempt+1}: {str(e)[:80]}")
        time.sleep(30)
else:
    print("FAILED: All attempts exhausted")
