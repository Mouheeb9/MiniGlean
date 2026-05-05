import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rich.console import Console
from models.schemas import ChatRequest, ChatResponse
from pipeline.agent import agentic_rag
from pipeline.ingestion import index_pdf
from config import PDF_FOLDER

app     = FastAPI(title="KnowledgeHub — Agentic RAG")
console = Console()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_index():
    """Indexe tous les PDFs au démarrage."""
    if not os.path.exists(PDF_FOLDER):
        os.makedirs(PDF_FOLDER)
        return

    pdf_files = [f for f in os.listdir(PDF_FOLDER) if f.endswith(".pdf")]
    console.print(f"\n[yellow]📚 {len(pdf_files)} PDF(s) — indexation...[/yellow]")

    for pdf_file in pdf_files:
        console.print(f"\n[cyan]📄 {pdf_file}[/cyan]")
        index_pdf(os.path.join(PDF_FOLDER, pdf_file), "default")

    console.print("\n[bold green]✅ Tous les documents indexés ![/bold green]")


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    answer = agentic_rag(req.question, req.tenant_id)
    return ChatResponse(answer=answer, tenant_id=req.tenant_id)


@app.get("/health")
def health():
    return {"status": "ok"}