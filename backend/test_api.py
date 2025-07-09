import os
import requests
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def test_api_call():
    print(f"API Key loaded: {'Yes' if OPENROUTER_API_KEY else 'No'}")
    print(f"API Key length: {len(OPENROUTER_API_KEY) if OPENROUTER_API_KEY else 0}")
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost",
        "X-Title": "BankStatementMVP",
        "Content-Type": "application/json"
    }

    # Try with the confirmed available model
    body = {
        "model": "tencent/hunyuan-a13b-instruct:free",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello, how are you?"}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                             headers=headers, json=body, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {response.headers}")
    print(f"Response Text: {response.text}")
    
    if response.status_code == 200:
        try:
            response_data = response.json()
            print(f"Response JSON: {response_data}")
        except Exception as e:
            print(f"Error parsing JSON: {e}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    test_api_call()
