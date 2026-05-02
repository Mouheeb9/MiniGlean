import asyncio
import logging
from typing import List
from pypdf import PdfReader
from docx import Document as DocxDocument
from langchain.text_splitter import RecursiveCharacterTextSplitter
from services.embedding_service import EmbeddingService
from services.qdrant_store import QdrantStore

logger = logging.getLogger("rag-service")


class DocumentProcessor:
    def __init__(self, embedder: EmbeddingService, store: QdrantStore):
        self._embedder = embedder
        self._store = store
        self._splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

    async def process(self, job: dict) -> int:
        text = await self._load_text(job["file_path"], job["file_type"])
        if not text:
            raise ValueError("Document content is empty")
        chunks = await asyncio.to_thread(self._splitter.split_text, text)
        embeddings = await self._embedder.embed_texts(chunks)
        return await self._store.upsert_chunks(
            collection_name=job["tenant_id"],
            document_id=job["document_id"],
            tenant_id=job["tenant_id"],
            file_name=job["file_name"],
            chunks=chunks,
            embeddings=embeddings,
        )

    async def _load_text(self, path: str, file_type: str) -> str:
        if file_type.lower() == "pdf":
            return await asyncio.to_thread(self._read_pdf, path)
        if file_type.lower() == "docx":
            return await asyncio.to_thread(self._read_docx, path)
        return await asyncio.to_thread(self._read_txt, path)

    def _read_pdf(self, path: str) -> str:
        reader = PdfReader(path)
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    def _read_docx(self, path: str) -> str:
        doc = DocxDocument(path)
        return "\n".join(p.text for p in doc.paragraphs)

    def _read_txt(self, path: str) -> str:
        with open(path, "r", encoding="utf-8") as file:
            return file.read()
