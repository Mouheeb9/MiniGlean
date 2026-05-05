from langchain_huggingface import HuggingFaceEmbeddings
from config import EMBEDDING_MODEL
from rich.console import Console

console = Console()
_embeddings = None


def get_embeddings():
    global _embeddings
    if _embeddings is None:
        console.print("[yellow]⏳ Chargement embeddings...[/yellow]")
        _embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True}
        )
    return _embeddings