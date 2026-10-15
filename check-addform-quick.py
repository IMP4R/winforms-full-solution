import sys, os, signal
sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
from gemini_client import GeminiClient
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')
client = GeminiClient(api_key=os.getenv('GEMINI_API_KEY'), model='gemini-3.5-flash')

reference = '/tmp/lab_extract/images/Телефонный справочник (1)_05.png'
implement = '/tmp/runtime_screenshots/AddForm_runtime.png'

prompt = 'Score 0-100 only.'

try:
    result = client.compare_images(reference, implement, prompt)
    print(result)
except Exception as e:
    print(f"Error: {e}")
