"""
Embedding-Modul für Innovation Republic.
Kapselt das Laden und die Verwendung des Sprachmodells.
Das Modell paraphrase-multilingual-MiniLM-L12-v2 unterstützt
Deutsch, Englisch und 49 weitere Sprachen.
"""

import os
from typing import Union, List

import numpy as np
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from loguru import logger

load_dotenv()

# Modell wird global gecacht – nur einmal laden
_model: SentenceTransformer | None = None

MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL",
    "paraphrase-multilingual-MiniLM-L12-v2"
)
EMBEDDING_DIM = 384  # Ausgabedimension des Modells


def get_model() -> SentenceTransformer:
    """
    Lädt das Sentence-Transformer-Modell (gecacht nach erstem Laden).
    Beim ersten Aufruf wird das Modell heruntergeladen (~120 MB).
    """
    global _model
    if _model is None:
        logger.info(f"Lade Sprachmodell: {MODEL_NAME}")
        _model = SentenceTransformer(MODEL_NAME)
        logger.success("Sprachmodell erfolgreich geladen")
    return _model


def erstelle_embedding(text: str) -> np.ndarray:
    """
    Erstellt einen normalisierten 384-dimensionalen Embedding-Vektor.

    Args:
        text: Eingabetext (Deutsch oder Englisch)

    Returns:
        NumPy-Array mit L2-normalisierten Embeddings (384 Dimensionen)
    """
    if not text or not text.strip():
        # Nullvektor als Fallback für leere Texte
        return np.zeros(EMBEDDING_DIM)

    model = get_model()
    embedding = model.encode(
        text.strip(),
        normalize_embeddings=True,   # L2-Normalisierung für cosine similarity
        show_progress_bar=False,
    )
    return embedding.astype(np.float32)


def erstelle_embeddings_batch(texte: List[str], batch_size: int = 32) -> List[np.ndarray]:
    """
    Erstellt Embeddings für eine Liste von Texten (effizienter als Einzelaufrufe).

    Args:
        texte: Liste von Eingabetexten
        batch_size: Anzahl der gleichzeitig verarbeiteten Texte

    Returns:
        Liste von Embedding-Vektoren
    """
    model = get_model()
    embeddings = model.encode(
        texte,
        batch_size=batch_size,
        normalize_embeddings=True,
        show_progress_bar=len(texte) > 50,
    )
    return [e.astype(np.float32) for e in embeddings]
