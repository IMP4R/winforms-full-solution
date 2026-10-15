import sys, os
sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
from gemini_client import GeminiClient
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')
client = GeminiClient(api_key=os.getenv('GEMINI_API_KEY'), model='gemini-3.5-flash')

reference = '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_03.png'
implement = '/tmp/runtime_screenshots/MainForm_runtime.png'

prompt = '''Ты QA инженер. Сравни макет (первое изображение — эталон из методички)
с реализацией (второе изображение — веб-симулятор WinForms).
Найди ВСЕ несоответствия по категориям:
1. Верстка и layout — позиции, отступы, выравнивание, размеры
2. Типографика — шрифты, размеры, жирность
3. Цвета и стили — фон, границы, кнопки, поля
4. Компоненты — отсутствующие/лишние элементы
5. Контент — текст на кнопках, в полях, заголовки
Для каждого: что не так, критичность (Critical/Major/Minor), как должно быть.
В конце — оценка соответствия в %.'''

try:
    result = client.compare_images(reference, implement, prompt)
    print(result)
except Exception as e:
    print(f"Error: {e}")
