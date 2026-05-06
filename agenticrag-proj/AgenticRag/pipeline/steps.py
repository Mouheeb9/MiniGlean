import json
from rich.console import Console
from langchain_core.messages import HumanMessage, SystemMessage
from core.llm import get_llm

console = Console()


def step_decompose_query(question: str) -> list[str]:
    console.print("[cyan]🧠 Étape 1 — Décomposition de la question...[/cyan]")

    prompt = f"""Analyse cette question et décompose-la en sous-questions simples si nécessaire.
Si la question est déjà simple, retourne-la telle quelle.

Question : {question}

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après :
{{"queries": ["sous-question 1", "sous-question 2"]}}

Si la question est simple :
{{"queries": ["{question}"]}}"""

    llm      = get_llm()
    response = llm.invoke([HumanMessage(content=prompt)])

    try:
        content = response.content.strip()
        start   = content.find("{")
        end     = content.rfind("}") + 1
        if start != -1 and end != 0:
            data    = json.loads(content[start:end])
            queries = data.get("queries", [question])
            console.print(f"[green]   → {len(queries)} sous-question(s) identifiée(s)[/green]")
            for q in queries:
                console.print(f"   • [dim]{q}[/dim]")
            return queries
    except Exception:
        pass

    return [question]


def step_self_reflect(question: str, chunks: list[dict]) -> dict:
    console.print("[cyan]🤔 Étape 3 — Auto-évaluation...[/cyan]")

    context = "\n\n".join([
        f"[{c['source']}, p.{c['page']}] {c['text'][:200]}..."
        for c in chunks[:5]
    ])

    prompt = f"""Tu es un agent RAG. Évalue si le contexte suivant est suffisant pour répondre à la question.

Question : {question}

Contexte disponible :
{context}

Réponds UNIQUEMENT avec un JSON valide :
{{
  "sufficient": true/false,
  "confidence": 0.0-1.0,
  "missing": "ce qui manque (vide si sufficient=true)",
  "additional_query": "query supplémentaire si needed (vide si sufficient=true)"
}}"""

    llm      = get_llm()
    response = llm.invoke([HumanMessage(content=prompt)])

    try:
        content = response.content.strip()
        start   = content.find("{")
        end     = content.rfind("}") + 1
        if start != -1 and end != 0:
            result     = json.loads(content[start:end])
            sufficient = result.get("sufficient", True)
            confidence = result.get("confidence", 0.5)

            if sufficient:
                console.print(f"[green]   → Contexte suffisant (confiance: {confidence:.0%})[/green]")
            else:
                missing = result.get("missing", "")
                console.print(f"[yellow]   → Contexte insuffisant — manque: {missing}[/yellow]")

            return result
    except Exception:
        pass

    return {"sufficient": True, "confidence": 0.5, "missing": "", "additional_query": ""}


def step_detect_contradictions(chunks: list[dict]) -> list[str]:
    negations    = ["ne pas", "n'est pas", "interdit", "impossible", "jamais", "aucun"]
    affirmations = ["est", "peut", "autorisé", "possible", "toujours", "obligatoire"]

    warnings = []
    for i in range(len(chunks)):
        for j in range(i + 1, len(chunks)):
            ti = chunks[i]["text"].lower()
            tj = chunks[j]["text"].lower()

            if (any(w in ti for w in negations) and any(w in tj for w in affirmations)) or \
               (any(w in tj for w in negations) and any(w in ti for w in affirmations)):
                warnings.append(
                    f"⚠️  Contradiction : {chunks[i]['source']} p.{chunks[i]['page']} "
                    f"↔ {chunks[j]['source']} p.{chunks[j]['page']}"
                )
    return warnings


def step_generate(question: str, chunks: list[dict], contradictions: list[str]) -> str:
    console.print("[cyan]✍️  Étape 5 — Génération de la réponse...[/cyan]")

    context = "\n\n---\n\n".join([
        f"[Source {i+1} — {c['source']}, Page {c['page']}]\n{c['text']}"
        for i, c in enumerate(chunks)
    ])

    contradiction_warning = ""
    if contradictions:
        contradiction_warning = f"\n⚠️ CONTRADICTIONS DÉTECTÉES :\n" + "\n".join(contradictions) + "\n"

    system = """Tu es un assistant expert en analyse documentaire.

RÈGLES STRICTES :
1. Réponds UNIQUEMENT en te basant sur les sources fournies
2. Réponse courte et directe — 3 à 5 phrases maximum
3. PAS de tableau, PAS de liste à puces excessive
4. Une seule citation de source est suffisante [Source X, Page Y]
5. NE RÉPÈTE JAMAIS la même information
6. Si l'information est absente → dis-le en une phrase
7. Réponds en français si la question est en français"""

    user = f"""DOCUMENTS :
{context}
{contradiction_warning}
QUESTION : {question}

Réponds de façon concise et directe en 3-5 phrases. Une seule citation suffit."""

    llm      = get_llm()
    response = llm.invoke([
        SystemMessage(content=system),
        HumanMessage(content=user)
    ])
    return response.content





























