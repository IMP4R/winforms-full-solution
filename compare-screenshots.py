import requests
import os
import base64

GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

def analyze_image(image_path, prompt):
    """Send image to Gemini for analysis"""
    with open(image_path, 'rb') as f:
        image_data = base64.b64encode(f.read()).decode('utf-8')
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": image_data
                    }
                }
            ]
        }]
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        data = response.json()
        try:
            return data['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError):
            return str(data)
    else:
        return f"Error {response.status_code}: {response.text}"

def compare_images(ref_path, impl_path, form_name):
    """Compare reference vs implementation screenshots"""
    with open(ref_path, 'rb') as f:
        ref_data = base64.b64encode(f.read()).decode('utf-8')
    with open(impl_path, 'rb') as f:
        impl_data = base64.b64encode(f.read()).decode('utf-8')
    
    prompt = f"""Ты QA инженер. Сравни макет (первое изображение) с реализацией (второе изображение) формы "{form_name}".
Найди ВСЕ несоответствия:
1. Верстка, расположение элементов, размеры
2. Типографика, шрифты, размеры текста
3. Цвета, фоны, границы
4. Компоненты - отсутствующие или лишние элементы
5. Текст на элементах - неверные подписи, отсутствующий текст
6. Оценка соответствия в процентах
7. Критичность ошибок (Critical/Major/Minor)

Дай конкретные рекомендации по исправлению каждой ошибки."""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [
                {"text": prompt},
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": ref_data
                    }
                },
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": impl_data
                    }
                }
            ]
        }]
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        data = response.json()
        try:
            return data['candidates'][0]['content']['parts'][0]['text']
        except (KeyError, IndexError):
            return str(data)
    else:
        return f"Error {response.status_code}: {response.text}"

if __name__ == '__main__':
    import sys
    if len(sys.argv) < 3:
        print("Usage: python compare.py <ref.png> <impl.png> [form_name]")
        sys.exit(1)
    
    result = compare_images(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'Form')
    print(result)
