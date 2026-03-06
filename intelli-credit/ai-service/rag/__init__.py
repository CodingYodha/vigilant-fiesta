"""
RAG module — Retrieval Augmented Generation pipeline for Intelli-Credit.

Sub-modules:
  - qdrant_client : Qdrant connection singleton, collection setup, health check
  - embedder      : Jina AI cloud API embedding (768-dim, batch of 32)
"""

from .qdrant_client import (
    get_client,
    ensure_collection_exists,
    qdrant_health_check,
    COLLECTION_NAME,
    VECTOR_DIM,
)
from .embedder import (
    embed_texts,
    embed_single,
    embed_chunks_batched,
    ChunkInput,
    ChunkEmbedding,
    JINA_MODEL,
)

__all__ = [
    "get_client",
    "ensure_collection_exists",
    "qdrant_health_check",
    "COLLECTION_NAME",
    "VECTOR_DIM",
    "embed_texts",
    "embed_single",
    "embed_chunks_batched",
    "ChunkInput",
    "ChunkEmbedding",
    "JINA_MODEL",
]
