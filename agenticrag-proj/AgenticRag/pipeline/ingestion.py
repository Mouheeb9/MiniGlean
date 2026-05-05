import os
import uuid
import pdfplumber
from rich.console import Console
from rich.progress import track
from langchain_text_splitters import RecursiveCharacterTextSplitter
from qdrant_client.models import Distance, VectorParams, PointStruct
from core.embeddings import get_embeddings
from core.qdrant import get_qdrant
from config import CHUNK_SIZE, CHUNK_OVERLAP, VECTOR_SIZE

console = Console()


def index_pdf(pdf_path: str, tenant_id: str) -> int:
    if not os.path.exists(pdf_path):
        console.print(f"[red]❌ Fichier introuvable : {pdf_path}[/red]")
        return 0

    pages = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text and len(text.strip()) > 50:
                pages.append({"text": text, "page": i + 1})

    console.print(f"[green]✅ {len(pages)} pages lues[/green]")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ".", "!", "?", ";", " "]
    )

    chunks = []
    for page in pages:
        splits = splitter.split_text(page["text"])
        for split in splits:
            chunks.append({
                "text":   split,
                "page":   page["page"],
                "source": os.path.basename(pdf_path)
            })

    console.print(f"[green]✅ {len(chunks)} chunks créés[/green]")
    console.print("[yellow]⏳ Génération des embeddings...[/yellow]")

    emb     = get_embeddings()
    vectors = emb.embed_documents([c["text"] for c in chunks])

    client     = get_qdrant()
    collection = f"tenant_{tenant_id}"

    existing = [c.name for c in client.get_collections().collections]
    if collection not in existing:
        client.create_collection(
            collection_name=collection,
            vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE)
        )

    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=vectors[i],
            payload={
                "text":   chunks[i]["text"],
                "page":   chunks[i]["page"],
                "source": chunks[i]["source"]
            }
        )
        for i in track(range(len(chunks)), description=f"Indexation {os.path.basename(pdf_path)}...")
    ]

    for i in range(0, len(points), 100):
        client.upsert(collection_name=collection, points=points[i:i + 100])

    console.print(f"[bold green]✅ {len(points)} chunks indexés[/bold green]")
    return len(points)