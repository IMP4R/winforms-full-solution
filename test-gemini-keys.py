import sys
sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
import requests
import os
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')
keys = os.getenv('GEMINI_API_KEY', '').split(',')

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent"

# Simple test payload
payload = {
    "contents": [{"parts": [{"text": "Test"}]}],
    "generationConfig": {"temperature": 0.1, "maxOutputTokens": 10}
}

for i, key in enumerate(keys[5:8]):  # Test keys 5-8
    full_url = f"{url}?key={key.strip()}"
    try:
        resp = requests.post(full_url, json=payload, timeout=30)
        print(f"Key {i}: Status={resp.status_code}")
        if resp.status_code != 200:
            print(f"  Error: {resp.text[:200]}")
        else:
            print(f"  SUCCESS")
            break
    except Exception as e:
        print(f"Key {i}: Exception={e}")
