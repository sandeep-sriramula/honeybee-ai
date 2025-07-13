# backend/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
from dotenv import load_dotenv
from parser import load_and_clean_csv
from gpt_agent import query_gpt

# Load environment variables
load_dotenv()

# Load data once
CSV_PATH = os.getenv("CSV_PATH", "simulated_bank_statement.csv")
df = load_and_clean_csv(CSV_PATH)

# FastAPI app setup
app = FastAPI()

# Allow frontend (React) to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace with specific domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class Query(BaseModel):
    question: str

@app.post("/ask")
async def ask(query: Query):
    answer = query_gpt(df, query.question)
    return {"answer": answer}
