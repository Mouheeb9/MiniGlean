import os
from dotenv import load_dotenv

load_dotenv()

QDRANT_URL      = os.getenv("QDRANT_URL", "http://localhost:6333")
OPENROUTER_KEY  = os.getenv("OPENROUTER_API_KEY")
LLM_MODEL       = "openai/gpt-oss-20b:free"
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
CHUNK_SIZE      = 600
CHUNK_OVERLAP   = 100
TOP_K           = 6
VECTOR_SIZE     = 768
MAX_ITERATIONS  = 3
PDF_FOLDER      = r"C:\Users\mouhe\source\ps4\agenticrag-proj\AgenticRag\docs"