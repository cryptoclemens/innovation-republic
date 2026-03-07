"""
Ingestion-Modul für Innovation Republic.
Verwaltet alle Datenquell-Konnektoren und startet die Pipeline.

Priorisierung der Quellen:
    Dealroom > EU Startup Monitor > AngelList > Crunchbase (nur Demo)
"""

import os
from loguru import logger
from dotenv import load_dotenv

load_dotenv()


def starte_alle_quellen():
    """
    Startet die Ingestion-Pipeline für alle konfigurierten Quellen.
    Fehlende API-Keys werden übersprungen (kein harter Abbruch).
    """
    logger.info("Ingestion-Pipeline gestartet")
    ergebnisse = {}

    # 1. Dealroom (Primärquelle)
    if os.getenv("DEALROOM_API_KEY"):
        try:
            from ingestion.dealroom import DealroomConnector
            connector = DealroomConnector()
            ergebnisse["dealroom"] = connector.importiere()
        except Exception as e:
            logger.warning(f"Dealroom-Ingestion fehlgeschlagen: {e}")
    else:
        logger.info("DEALROOM_API_KEY nicht gesetzt – Dealroom wird übersprungen")

    # 2. EU Startup Monitor (kostenfrei, kein Key nötig)
    try:
        from ingestion.eu_startup_monitor import EUStartupMonitorConnector
        connector = EUStartupMonitorConnector()
        ergebnisse["eu_startup_monitor"] = connector.importiere()
    except Exception as e:
        logger.warning(f"EU Startup Monitor-Ingestion fehlgeschlagen: {e}")

    # 3. AngelList
    if os.getenv("ANGELLIST_API_KEY"):
        try:
            from ingestion.angellist import AngelListConnector
            connector = AngelListConnector()
            ergebnisse["angellist"] = connector.importiere()
        except Exception as e:
            logger.warning(f"AngelList-Ingestion fehlgeschlagen: {e}")
    else:
        logger.info("ANGELLIST_API_KEY nicht gesetzt – AngelList wird übersprungen")

    # 4. Crunchbase (nur wenn aktiviert – nur für Demo)
    crunchbase_enabled = os.getenv("CRUNCHBASE_ENABLED", "false").lower() == "true"
    if crunchbase_enabled and os.getenv("CRUNCHBASE_API_KEY"):
        try:
            from ingestion.crunchbase import CrunchbaseConnector
            connector = CrunchbaseConnector()
            ergebnisse["crunchbase"] = connector.importiere()
        except Exception as e:
            logger.warning(f"Crunchbase-Ingestion fehlgeschlagen: {e}")
    elif crunchbase_enabled:
        logger.info("CRUNCHBASE_API_KEY nicht gesetzt – Crunchbase wird übersprungen")
    else:
        logger.info("Crunchbase deaktiviert (CRUNCHBASE_ENABLED=false)")

    # Abschlussbericht
    gesamt = sum(ergebnisse.values())
    logger.success(f"Ingestion abgeschlossen: {gesamt} Startups importiert")
    for quelle, anzahl in ergebnisse.items():
        logger.info(f"  {quelle}: {anzahl} Einträge")

    return ergebnisse
