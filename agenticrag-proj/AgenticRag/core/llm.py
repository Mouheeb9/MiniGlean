from langchain_openai import ChatOpenAI
from config import OPENROUTER_KEY, LLM_MODEL

_llm = None


def get_llm():
    global _llm
    if _llm is None:
        _llm = ChatOpenAI(
            model=LLM_MODEL,
            openai_api_key=OPENROUTER_KEY,
            openai_api_base="https://openrouter.ai/api/v1",
            temperature=0.1,
            max_tokens=2000,
            default_headers={
                "HTTP-Referer": "http://localhost",
                "X-Title": "KnowledgeHub"
            }
        )
    return _llm