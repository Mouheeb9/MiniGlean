from rich.console import Console
from pipeline.retrieval import retrieve
from pipeline.steps import (
    step_decompose_query,
    step_self_reflect,
    step_detect_contradictions,
    step_generate
)
from config import MAX_ITERATIONS

console = Console()


def agentic_rag(question: str, tenant_id: str) -> str:
    # ÉTAPE 1 — Décomposition
    queries = step_decompose_query(question)

    # ÉTAPE 2 — Retrieval multi-queries
    console.print("[cyan]🔍 Étape 2 — Recherche multi-queries...[/cyan]")
    all_chunks = []
    seen_texts = set()

    for query in queries:
        chunks = retrieve(query, tenant_id)
        for chunk in chunks:
            key = chunk["text"][:100]
            if key not in seen_texts:
                seen_texts.add(key)
                all_chunks.append(chunk)

    all_chunks.sort(key=lambda x: x["score"], reverse=True)
    console.print(f"[green]   → {len(all_chunks)} chunks uniques trouvés[/green]")

    if not all_chunks:
        return "Aucun document pertinent trouvé."

    # ÉTAPE 3 — Self-reflection + Iterative retrieval
    iteration = 0
    while iteration < MAX_ITERATIONS:
        reflection = step_self_reflect(question, all_chunks)

        if reflection.get("sufficient", True):
            break

        additional_query = reflection.get("additional_query", "")
        if not additional_query:
            break

        iteration += 1
        console.print(f"[yellow]🔄 Itération {iteration} — Re-recherche : '{additional_query}'[/yellow]")

        extra_chunks = retrieve(additional_query, tenant_id, top_k=4)
        seen = {c["text"][:100] for c in all_chunks}
        for chunk in extra_chunks:
            if chunk["text"][:100] not in seen:
                all_chunks.append(chunk)
                seen.add(chunk["text"][:100])

        console.print(f"[green]   → {len(extra_chunks)} chunks supplémentaires trouvés[/green]")

    console.print(f"[dim]   Itérations effectuées : {iteration}[/dim]")

    # ÉTAPE 4 — Détection contradictions
    console.print("[cyan]🔎 Étape 4 — Détection de contradictions...[/cyan]")
    contradictions = step_detect_contradictions(all_chunks)
    if contradictions:
        for w in contradictions:
            console.print(f"[red]{w}[/red]")
    else:
        console.print("[green]   → Aucune contradiction détectée[/green]")

    # ÉTAPE 5 — Génération
    answer = step_generate(question, all_chunks[:8], contradictions)

    return answer