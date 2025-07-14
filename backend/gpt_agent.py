import os
import requests
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

def query_gpt(transactions_df, question):
    csv_data = transactions_df.to_csv(index=False)

    prompt = f"""
You are a financial assistant helping users understand their bank transactions.
Below is their transaction history:

{csv_data}

Now answer this question based on the data:
\"{question}\"

Important: When displaying monetary amounts, always format them to exactly 2 decimal places (e.g., $123.45, not $123.4567890123).
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost",
        "X-Title": "BankStatementMVP",
        "Content-Type": "application/json"
    }

    body = {
        "model": "openrouter/cypher-alpha:free",
        "messages": [
            {"role": "system", "content": "You are a helpful bank statement analyst."},
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body)

    if response.status_code != 200:
        return f"❌ Error from model: {response.status_code} — {response.text}"

    return response.json()["choices"][0]["message"]["content"]
