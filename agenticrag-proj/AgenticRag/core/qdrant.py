from qdrant_client import QdrantClient
from config import QDRANT_URL

_qdrant = None


def get_qdrant():
    global _qdrant
    if _qdrant is None:
        _qdrant = QdrantClient(url=QDRANT_URL)
    return _qdrant