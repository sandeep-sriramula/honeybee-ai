# bank_statement_mvp/
# └── app.py (Streamlit UI)
#     gpt_agent.py (GPT interaction)
#     parser.py (CSV loader and cleaner)

# -------------------------
# parser.py
# -------------------------
import pandas as pd

def load_and_clean_csv(file_path):
    df = pd.read_csv(file_path)
    df['Date'] = pd.to_datetime(df['Date'])
    df['Amount'] = pd.to_numeric(df['Amount'])
    return df

def summarize_by_category(df):
    return df.groupby('Category')['Amount'].sum().sort_values(ascending=False)

def filter_by_date(df, start_date=None, end_date=None):
    if start_date:
        df = df[df['Date'] >= pd.to_datetime(start_date)]
    if end_date:
        df = df[df['Date'] <= pd.to_datetime(end_date)]
    return df

