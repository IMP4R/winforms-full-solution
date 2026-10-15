import sys, os, base64, requests
from dotenv import load_dotenv

sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')

api_keys = [k.strip() for k in os.getenv('GEMINI_API_KEY', '').split(',') if k.strip()]

def check_form(ref_path, impl_path, form_name):
    prompt = f'''Ты эксперт по WinForms UI. Сравни макет (первое изображение) и реализацию (второе изображение) формы "{form_name}".

Оцени ТОЛЬКО по этим критериям (вес в скобках):

1. **Вертикальное расположение элементов** (20%): все ли элементы на своих строках? Нет ли наложений?
2. **Выравнивание полей ввода** (20%): одинаковая ли ширина? Выровнены ли левые/правые края?
3. **Классический Win95 стиль границ** (15%): у полей ввода — вдавленные (sunken) границы? У кнопок — выпуклые (outset)?
4. **Шрифт меток (Labels)** (15%): читаемый размер, соответствует ли макету?
5. **Кнопки навигации/действий** (15%): правильные символы (< > или текст), позиция под полями?
6. **StatusBar** (10%): присутствует? Ячейки с вдавленными границами? Текст читаем?

Пропусти/не учитывай:
- Иконку приложения (синий квадрат vs цветная)
- Стиль заголовка окна (Windows 10 vs Windows 7)
- Размеры NumericUpDown стрелок (веб-симулятор)

Формат ответа:
SCORE: XX% (итоговая оценка)
Проверка по критериям:
1. Вертикальное расположение: OK/НЕТ (что не так)
2. Выравнивание полей: OK/НЕТ
3. Win95 стиль границ: OK/НЕТ
4. Шрифт меток: OK/НЕТ
5. Кнопки: OK/НЕТ
6. StatusBar: OK/НЕТ

Если всё OK — 95%+. Если есть Minor проблемы — 90-94%. Если Major — 80-89%.'''
    
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

# Check AddForm
name, score, text = check_form(
    '/Users/denis/Work/ai-files_reader/output/phonebook_images/image_05.png',
    '/tmp/runtime_screenshots/AddForm_runtime.png',
    'AddForm'
)
print(f"\n{'='*60}")
print(f"{name}: {score}%")
print(f"{'='*60}")
print(text)

with open('GEMINI_COMPARISON.md', 'a', encoding='utf-8') as f:
    f.write(f"\n\n{'='*60}\n{name} precise check: {score}%\n{'='*60}\n")
    f.write(text)
    f.write("\n")
