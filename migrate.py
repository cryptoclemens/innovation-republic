"""
Innovation Republic – Migrations- und Ingestion-Script
======================================================
Führt ausstehende DB-Migrationen durch und startet dann die Ingestion-Pipeline.

Aufruf: python migrate.py

Alternativ über Docker direkt:
    docker exec innovation_republic_db psql -U ir_user -d innovation_republic \
        -f /docker-entrypoint-initdb.d/002_website_verification.sql
"""

import os
import sys
from pathlib import Path

import psycopg2
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv
from loguru import logger

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://ir_user:ir_password@localhost:5432/innovation_republic"
)


def verbinde():
    """Stellt Datenbankverbindung her."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        register_vector(conn)
        return conn
    except Exception as e:
        logger.error(f"Datenbankverbindung fehlgeschlagen: {e}")
        logger.info("Ist Docker running? → docker compose up -d")
        sys.exit(1)


def fuehre_migration_durch(conn, migrations_pfad: Path):
    """Spielt eine SQL-Migrationsdatei ein."""
    sql = migrations_pfad.read_text(encoding="utf-8")
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
        conn.commit()
        logger.success(f"Migration eingespielt: {migrations_pfad.name}")
    except Exception as e:
        conn.rollback()
        logger.error(f"Migration fehlgeschlagen ({migrations_pfad.name}): {e}")
        raise


def pruefe_und_migriere():
    """Prüft ob ausstehende Migrationen vorhanden sind und spielt sie ein."""
    conn = verbinde()

    # Migration 002: website_verifiziert + website_zuletzt_geprueft
    with conn.cursor() as cur:
        cur.execute("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'startups'
              AND column_name = 'website_verifiziert'
        """)
        hat_verifiziert_spalte = cur.fetchone() is not None

    if not hat_verifiziert_spalte:
        logger.info("Migration 002 (website_verifiziert) wird eingespielt...")
        migrations_pfad = Path(__file__).parent / "db" / "migrations" / "002_website_verification.sql"
        fuehre_migration_durch(conn, migrations_pfad)
    else:
        logger.info("Migration 002 bereits eingespielt – überspringe")

    conn.close()


def starte_ingestion():
    """Startet die vollständige Ingestion-Pipeline (inkl. Curated DACH)."""
    logger.info("Starte Ingestion-Pipeline...")
    try:
        from ingestion import starte_alle_quellen
        ergebnisse = starte_alle_quellen()
        gesamt = sum(ergebnisse.values())
        logger.success(f"Ingestion abgeschlossen: {gesamt} neue Einträge")
        return ergebnisse
    except Exception as e:
        logger.error(f"Ingestion fehlgeschlagen: {e}")
        raise


def bereinige_demo_daten():
    """Entfernt Demo-Startups aus der Datenbank."""
    conn = verbinde()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM startups WHERE demo_only = TRUE")
            anzahl = cur.fetchone()[0]

            if anzahl == 0:
                logger.info("Keine Demo-Daten vorhanden")
                return

            cur.execute("DELETE FROM startups WHERE demo_only = TRUE")
            conn.commit()
            logger.success(f"{anzahl} Demo-Startups entfernt")
    finally:
        conn.close()


def main():
    logger.info("=" * 60)
    logger.info("Innovation Republic – Migration & Ingestion")
    logger.info("=" * 60)

    # 1. Migrationen einspielen
    pruefe_und_migriere()

    # 2. Embedding-Modell prüfen
    logger.info("Prüfe Embedding-Modell...")
    try:
        from core.embedding import get_model
        get_model()
        logger.success("Embedding-Modell bereit")
    except Exception as e:
        logger.error(f"Embedding-Modell nicht verfügbar: {e}")
        sys.exit(1)

    # 3. Ingestion starten
    starte_ingestion()

    # 4. Demo-Daten entfernen
    logger.info("Entferne Demo-Daten...")
    bereinige_demo_daten()

    logger.info("=" * 60)
    logger.success("Fertig! Starte die App mit: streamlit run app.py")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
