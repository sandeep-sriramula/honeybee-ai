import streamlit as st
from backend.parser import load_and_clean_csv
from backend.gpt_agent import query_gpt

# ✅ Setup page
st.set_page_config(page_title="Bank Statement AI Assistant", layout="centered")
st.title("💬 AI Bank Statement Assistant")

# ✅ Load bank statement once
CSV_PATH = "simulated_bank_statement.csv"
df = load_and_clean_csv(CSV_PATH)

# ✅ Initialize session history
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# ✅ Render existing chat
for entry in st.session_state.chat_history:
    with st.chat_message("user"):
        st.markdown(entry["question"])
    with st.chat_message("assistant"):
        st.markdown(entry["answer"])

# ✅ Chat input
question = st.chat_input("Ask a question about your transactions...")

if question:
    with st.chat_message("user"):
        st.markdown(question)

    with st.spinner("Analyzing..."):
        answer = query_gpt(df, question)

    with st.chat_message("assistant"):
        st.markdown(answer)

    # Save to history
    st.session_state.chat_history.append({"question": question, "answer": answer})
