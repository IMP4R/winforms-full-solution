import sys, os
sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
from gemini_client import GeminiClient
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')
client = GeminiClient(api_key=os.getenv('GEMINI_API_KEY'), model='gemini-3.5-flash')

reference = '/tmp/lab_extract/images/Телефонный справочник (1)_05.png'
implement = '/tmp/runtime_screenshots/AddForm_runtime.png'

prompt = '''Ты QA инженер. Сравни макет (первое изображение) с реализацией (второе).
Найди ВСЕ несоответствия по категориям:
1. Верстка и layout
2. Типографика
3. Цвета и стили
4. Компоненты
5. Контент
Для каждого: что не так, критичность (Critical/Major/Minor), как должно быть.
В конце — оценка соответствия в % (0-100).'''

try:
    result = client.compare_images(reference, implement, prompt)
    print(result)
except Exception as e:
    print(f"Error: {e}")
