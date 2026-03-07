"""
Innovation Republic – Demo-Daten bereinigen
============================================
Entfernt alle Einträge mit demo_only=true aus der Datenbank.
Wird ausgeführt nach der Demo, wenn Crunchbase abgeschaltet wird
und nur noch verifizierte Echtzeiträger verbleiben sollen.

Aufruf: python cleanup_demo_data.py
        python cleanup_demo_data.py --dry-run   (zeigt nur was gelöscht würde)
"""

import sys
import argparse

import psycopg2
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv
import os
from loguru import logger

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://ir_user:ir_password@localhost:5432/innovation_republic"
)


def zaehle_demo_eintraege(conn) -> int:
    """Zählt die Demo-Einträge ohne zu löschen."""
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM startups WHERE demo_only = TRUE")
        return cur.fetchone()[0]


def liste_demo_quellen(conn) -> dict:
    """Gibt eine Übersicht der Demo-Einträge nach Quelle zurück."""
    with conn.cursor() as cur:
        cur.execute("""
            SELECT quelle, COUNT(*) as anzahl
            FROM startups
            WHERE demo_only = TRUE
            GROUP BY quelle
            ORDER BY anzahl DESC
        """)
        return {row[0]: row[1] for row in cur.fetchall()}


def loesche_demo_daten(dry_run: bool = False) -> int:
    """
    Löscht alle Einträge mit demo_only=true aus der Datenbank.

    Args:
        dry_run: Wenn True, wird nichts gelöscht (nur angezeigt)

    Returns:
        Anzahl der gelöschten (oder zu löschenden) Einträge
    """
    conn = psycopg2.connect(DATABASE_URL)
    register_vector(conn)

    try:
        anzahl = zaehle_demo_eintraege(conn)
        quellen = liste_demo_quellen(conn)

        logger.info("=" * 50)
        logger.info("Demo-Daten Übersicht:")
        logger.info(f"  Gesamt: {anzahl} Einträge")
        for quelle, count in quellen.items():
            logger.info(f"  {quelle}: {count} Einträge")
        logger.info("=" * 50)

        if anzahl == 0:
            logger.info("Keine Demo-Daten vorhanden – nichts zu tun")
            return 0

        if dry_run:
            logger.info(
                f"[DRY RUN] Würde {anzahl} Einträge löschen (nichts wurde verändert)"
            )
            return anzahl

        # Sicherheitsabfrage im interaktiven Modus
        antwort = input(
            f"\n⚠️  ACHTUNG: {anzahl} Einträge werden PERMANENT gelöscht!\n"
            f"Fortfahren? (ja/nein): "
        )
        if antwort.strip().lower() not in ("ja", "j", "yes", "y"):
            logger.info("Abgebrochen – keine Änderungen vorgenommen")
            return 0

        # Demo-Daten löschen
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM startups WHERE demo_only = TRUE"
            )
            geloescht = cur.rowcount
        conn.commit()

        logger.success(f"✓ {geloescht} Demo-Einträge erfolgreich gelöscht")

        # Restbestand ausgeben
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM startups")
            verbleibend = cur.fetchone()[0]
        logger.info(f"  Verbleibende Startups in der Datenbank: {verbleibend}")

        return geloescht

    except Exception as e:
        conn.rollback()
        logger.error(f"Fehler beim Löschen: {e}")
        raise
    finally:
        conn.close()


def main():
    parser = argparse.ArgumentParser(
        description="Entfernt Demo-Daten (demo_only=true) aus der Innovation Republic Datenbank"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Zeigt nur an was gelöscht würde, ohne tatsächlich zu löschen",
    )
    args = parser.parse_args()

    logger.info("Innovation Republic – Demo-Daten bereinigen")
    loesche_demo_daten(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
