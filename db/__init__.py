"""
Datenbankverbindungs-Management für Innovation Republic.
Stellt eine psycopg2-Verbindung mit pgvector-Unterstützung bereit.
"""

import os
from contextlib import contextmanager

import psycopg2
from psycopg2.extras import RealDictCursor
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv
from loguru import logger

load_dotenv()

# Verbindungs-URL aus Umgebungsvariable oder Standardwert
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://ir_user:ir_password@localhost:5432/innovation_republic"
)


def get_connection():
    """Erstellt eine neue Datenbankverbindung mit pgvector-Unterstützung."""
    conn = psycopg2.connect(DATABASE_URL)
    register_vector(conn)
    return conn


@contextmanager
def get_db():
    """
    Kontextmanager für sichere Datenbankverbindungen.
    Führt automatisch COMMIT oder ROLLBACK aus.

    Verwendung:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute(...)
    """
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Datenbankfehler, Rollback durchgeführt: {e}")
        raise
    finally:
        conn.close()


def teste_verbindung() -> bool:
    """Prüft ob die Datenbankverbindung funktioniert."""
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
        logger.info("Datenbankverbindung erfolgreich")
        return True
    except Exception as e:
        logger.error(f"Datenbankverbindung fehlgeschlagen: {e}")
        return False


def zaehle_startups_pro_quelle() -> dict:
    """Gibt die Anzahl der Startups pro Quelle zurück (für Statistik-Anzeige)."""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT quelle, COUNT(*) as anzahl
                FROM startups
                GROUP BY quelle
                ORDER BY anzahl DESC
            """)
            return {row["quelle"]: row["anzahl"] for row in cur.fetchall()}


def zaehle_gesamt_startups() -> int:
    """Gibt die Gesamtanzahl der Startups in der Datenbank zurück."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM startups")
            return cur.fetchone()[0]
