from rich.console import Console
from core.embeddings import get_embeddings
from core.qdrant import get_qdrant
from config import TOP_K

console = Console()


def retrieve(query: str, tenant_id: str, top_k: int = TOP_K) -> list[dict]:
    emb          = get_embeddings()
    query_vector = emb.embed_query(query)
    client       = get_qdrant()
    collection   = f"tenant_{tenant_id}"

    existing = [c.name for c in client.get_collections().collections]
    if collection not in existing:
        console.print(f"[red]❌ Aucun document indexé pour '{tenant_id}'.[/red]")
        return []

    results = client.query_points(
        collection_name=collection,
        query=query_vector,
        limit=top_k,
        with_payload=True,
        score_threshold=0.25
    ).points

    return [
        {
            "text":   r.payload["text"],
            "source": r.payload.get("source", "inconnu"),
            "page":   r.payload.get("page", 0),
            "score":  round(r.score, 3)
        }
        for r in results
    ]