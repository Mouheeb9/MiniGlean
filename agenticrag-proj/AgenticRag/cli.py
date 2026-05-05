import os
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from pipeline.agent import agentic_rag
from pipeline.ingestion import index_pdf
from config import PDF_FOLDER

console = Console()


def main():
    console.print(Panel.fit(
        "[bold blue]KnowledgeHub — TRUE Agentic RAG[/bold blue]\n"
        "[dim]Query Decomposition → Multi-Retrieval → Self-Reflection → Iterative Search[/dim]\n"
        "[dim]Llama 3.1 70B · paraphrase-multilingual-mpnet · Qdrant[/dim]",
        border_style="blue"
    ))

    tenant_id = Prompt.ask("Tenant ID", default="test")

    if not os.path.exists(PDF_FOLDER):
        os.makedirs(PDF_FOLDER)
        console.print(f"[red]❌ Dossier créé mais vide : {PDF_FOLDER}[/red]")
        return

    pdf_files = [f for f in os.listdir(PDF_FOLDER) if f.endswith(".pdf")]

    if not pdf_files:
        console.print(f"[red]❌ Aucun PDF dans {PDF_FOLDER}[/red]")
        return

    console.print(f"\n[yellow]📚 {len(pdf_files)} PDF(s) — indexation automatique...[/yellow]")
    for pdf_file in pdf_files:
        console.print(f"\n[cyan]📄 {pdf_file}[/cyan]")
        index_pdf(os.path.join(PDF_FOLDER, pdf_file), tenant_id)

    console.print("\n[bold green]✅ Tous les documents indexés ![/bold green]")
    console.print("[dim]Tape 'exit' pour quitter[/dim]\n")

    while True:
        question = Prompt.ask("[bold blue]Question[/bold blue]")

        if question.lower() == "exit":
            console.print("[yellow]Au revoir ![/yellow]")
            break

        console.rule()
        console.print(Panel(
            f"[bold blue]{question}[/bold blue]",
            title="❓ Question",
            border_style="blue"
        ))

        answer = agentic_rag(question, tenant_id)

        console.print(Panel(answer, title="💬 Réponse", border_style="green"))


if __name__ == "__main__":
    main()