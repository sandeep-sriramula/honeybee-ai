import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def get_available_models():
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost",
        "X-Title": "BankStatementMVP",
        "Content-Type": "application/json"
    }

    response = requests.get("https://openrouter.ai/api/v1/models", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        try:
            response_data = response.json()
            models = response_data.get("data", [])
            
            print(f"Found {len(models)} models")
            
            # Filter for free models
            free_models = []
            for model in models:
                pricing = model.get("pricing", {})
                if pricing.get("prompt") == "0" or pricing.get("completion") == "0":
                    free_models.append({
                        "id": model.get("id"),
                        "name": model.get("name"),
                        "pricing": pricing
                    })
            
            print(f"Found {len(free_models)} free models:")
            for model in free_models[:10]:  # Show first 10 free models
                print(f"  - {model['id']} ({model['name']})")
                
        except Exception as e:
            print(f"Error parsing JSON: {e}")
            print(f"Response: {response.text[:1000]}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    get_available_models()
