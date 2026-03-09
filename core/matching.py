"""
Matching-Modul für Innovation Republic.
Verbindet KMU-Problembeschreibungen mit passenden Startups
über semantische Vektorähnlichkeit (pgvector cosine similarity).
"""

from typing import List, Dict
from psycopg2.extras import RealDictCursor
from pgvector.psycopg2 import register_vector
from loguru import logger

from core.embedding import erstelle_embedding
from db import get_db


def match_startup_to_kmu(kmu_problem: str, limit: int = 5) -> List[Dict]:
    """
    Findet die besten Startup-Matches für eine KMU-Problembeschreibung.

    Ablauf:
        1. Eingabetext → Embedding-Vektor (384 Dim.)
        2. pgvector cosine similarity gegen alle Startup-Embeddings
        3. Top-N Matches zurückgeben + in match_history speichern

    Args:
        kmu_problem: Problembeschreibung in natürlicher Sprache (Deutsch/Englisch)
        limit: Anzahl der zurückzugebenden Matches (Standard: 5)

    Returns:
        Liste von Dicts mit: id, name, beschreibung, branchen_tags,
        loesung_kategorie, quelle, website, similarity_score
    """
    if not kmu_problem or not kmu_problem.strip():
        return []

    logger.debug(f"Starte Matching für: '{kmu_problem[:80]}...'")

    # Embedding für die Suchanfrage erstellen
    problem_embedding = erstelle_embedding(kmu_problem)
    embedding_liste = problem_embedding.tolist()

    with get_db() as conn:
        register_vector(conn)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:

            # Semantische Suche via pgvector (<=> = cosine distance)
            # website_verifiziert IS NOT FALSE:
            #   NULL (ungeprüft) → wird angezeigt (innocent until proven guilty)
            #   TRUE  (erreichbar) → wird angezeigt
            #   FALSE (tot/Timeout) → wird ausgeblendet
            cur.execute(
                """
                SELECT
                    id,
                    name,
                    beschreibung,
                    branchen_tags,
                    loesung_kategorie,
                    quelle,
                    website,
                    land,
                    website_verifiziert,
                    1 - (embedding <=> %s::vector) AS similarity_score
                FROM startups
                WHERE embedding IS NOT NULL
                  AND (website_verifiziert IS NOT FALSE)
                ORDER BY embedding <=> %s::vector
                LIMIT %s
                """,
                (embedding_liste, embedding_liste, limit),
            )
            ergebnisse = cur.fetchall()

            # Matches in der Historie speichern
            for treffer in ergebnisse:
                cur.execute(
                    """
                    INSERT INTO match_history
                        (startup_id, similarity_score, problem_text)
                    VALUES (%s, %s, %s)
                    """,
                    (
                        treffer["id"],
                        float(treffer["similarity_score"]),
                        kmu_problem[:500],
                    ),
                )

        logger.debug(
            f"Matching abgeschlossen: {len(ergebnisse)} Ergebnisse gefunden"
        )
        return [dict(r) for r in ergebnisse]


def aehnliche_kmu_faelle(problem: str, limit: int = 3) -> List[Dict]:
    """
    Findet ähnliche KMU-Fälle aus der Datenbank (für Diagnose-Anzeige).

    Args:
        problem: Problembeschreibung
        limit: Anzahl ähnlicher Fälle

    Returns:
        Liste von ähnlichen KMU-Profilen mit Ähnlichkeits-Score
    """
    embedding = erstelle_embedding(problem)
    embedding_liste = embedding.tolist()

    with get_db() as conn:
        register_vector(conn)
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT
                    name,
                    branche,
                    problem_beschreibung,
                    1 - (embedding <=> %s::vector) AS aehnlichkeit
                FROM kmu_profile
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> %s::vector
                LIMIT %s
                """,
                (embedding_liste, embedding_liste, limit),
            )
            return [dict(r) for r in cur.fetchall()]
