"""
Dealroom-Konnektor für Innovation Republic.
PRIMÄRQUELLE: Höchste Datenqualität für DACH-Startups durch verifizierte
Partnerschaften mit europäischen Regierungen und Acceleratoren.

API-Dokumentation: https://dealroom.co/api
Free Tier verfügbar für Non-Profits und Forschungseinrichtungen.
"""

import os
import time
from typing import Dict, List, Optional

import httpx
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential
from dotenv import load_dotenv

from ingestion.base import BasisConnector, StartupRohDaten

load_dotenv()

DEALROOM_BASIS_URL = "https://api.dealroom.co/api/v1"


class DealroomConnector(BasisConnector):
    """
    Lädt DACH-Startups aus der Dealroom API.

    Merkmale:
    - Cursor-basierte Pagination für vollständigen Datenabruf
    - Automatisches Rate-Limiting via X-RateLimit-Header
    - Alle Einträge werden mit quelle='dealroom' markiert
    - Dealroom-Einträge erhalten kein demo_only-Flag
    """

    QUELLE = "dealroom"

    def __init__(self):
        self.api_key = os.getenv("DEALROOM_API_KEY")
        if not self.api_key:
            raise ValueError("DEALROOM_API_KEY ist nicht gesetzt")

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }
        self.max_startups = int(os.getenv("MAX_STARTUPS_PER_SOURCE", "1000"))

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=2, max=30))
    def _api_anfrage(self, endpoint: str, params: Dict) -> Dict:
        """Führt einen API-Aufruf durch mit automatischem Retry bei Fehlern."""
        url = f"{DEALROOM_BASIS_URL}{endpoint}"
        with httpx.Client(timeout=30) as client:
            response = client.get(url, headers=self.headers, params=params)

        # Rate-Limit-Header auswerten
        remaining = response.headers.get("X-RateLimit-Remaining")
        if remaining and int(remaining) < 5:
            reset_time = int(response.headers.get("X-RateLimit-Reset", 60))
            logger.warning(
                f"Rate-Limit fast erreicht ({remaining} verbleibend). "
                f"Warte {reset_time}s..."
            )
            time.sleep(reset_time)

        if response.status_code == 429:
            # Too Many Requests – explizit warten und Retry auslösen
            retry_after = int(response.headers.get("Retry-After", 60))
            logger.warning(f"Rate-Limit überschritten. Warte {retry_after}s...")
            time.sleep(retry_after)
            response.raise_for_status()  # Löst Retry aus

        response.raise_for_status()
        return response.json()

    def _parse_startup(self, eintrag: Dict) -> Optional[StartupRohDaten]:
        """Wandelt einen Dealroom-API-Eintrag in das interne Format um."""
        name = eintrag.get("name", "").strip()
        if not name:
            return None

        beschreibung = eintrag.get("tagline", "") or eintrag.get("description", "")
        tags_roh = eintrag.get("tags", [])
        tags = [t.get("value", t) if isinstance(t, dict) else str(t) for t in tags_roh]

        # Teamgröße aus Range-Format extrahieren
        team_range = eintrag.get("team_size_range", "")
        teamgroesse = team_range if isinstance(team_range, str) else ""

        # Finanzierung (in USD, wird direkt gespeichert)
        funding = eintrag.get("total_funding")
        finanzierung = float(funding) if funding and str(funding).replace(".", "").isdigit() else None

        return StartupRohDaten(
            name=name,
            beschreibung=beschreibung,
            tags=tags,
            quelle=self.QUELLE,
            externe_id=str(eintrag.get("id", "")),
            land=eintrag.get("hq_country", ""),
            gruendungsjahr=None,   # Dealroom liefert kein gründungsjahr im Basic-Tier
            teamgroesse=teamgroesse,
            finanzierung_gesamt=finanzierung,
            website=eintrag.get("website", ""),
            demo_only=False,       # Dealroom-Daten sind Echtdaten – kein demo_only
        )

    def importiere(self) -> int:
        """
        Importiert DACH-B2B-Startups aus Dealroom mit vollständiger Pagination.

        Returns:
            Anzahl der erfolgreich importierten Startups
        """
        from pipeline.normalize import normalisiere_und_speichere

        logger.info("Starte Dealroom-Ingestion (DACH, B2B)...")
        importiert = 0
        cursor = None
        seite = 0

        while True:
            seite += 1
            params = {
                "hq_region": "dach",
                "tags": "b2b",
                "fields": "id,name,tagline,description,tags,total_funding,hq_country,launch_stage,team_size_range,website",
                "per_page": 50,
            }
            if cursor:
                params["after"] = cursor

            try:
                daten = self._api_anfrage("/companies", params)
            except Exception as e:
                logger.error(f"Dealroom API-Fehler auf Seite {seite}: {e}")
                break

            eintraege = daten.get("items", daten.get("companies", []))
            if not eintraege:
                logger.info("Keine weiteren Einträge – Pagination abgeschlossen")
                break

            # Batch normalisieren und speichern
            batch: List[StartupRohDaten] = []
            for eintrag in eintraege:
                parsed = self._parse_startup(eintrag)
                if parsed:
                    batch.append(parsed)

            if batch:
                importiert += normalisiere_und_speichere(batch)

            logger.info(
                f"Seite {seite}: {len(batch)} Einträge verarbeitet "
                f"(gesamt: {importiert})"
            )

            # Cursor für nächste Seite
            pagination = daten.get("pagination", {})
            cursor = pagination.get("next_cursor") or pagination.get("after")

            # Prüfe ob das Maximum erreicht ist
            if self.max_startups and importiert >= self.max_startups:
                logger.info(f"Maximum von {self.max_startups} Einträgen erreicht")
                break

            if not cursor:
                break

            # Höfliche Pause zwischen Anfragen
            time.sleep(0.5)

        self._log_ingestion(self.QUELLE, importiert)
        logger.success(f"Dealroom-Ingestion abgeschlossen: {importiert} Startups")
        return importiert

    def _log_ingestion(self, quelle: str, anzahl: int):
        """Schreibt den Ingestion-Abschluss in die ingestion_log-Tabelle."""
        try:
            from db import get_db
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO ingestion_log (quelle, anzahl_importiert) VALUES (%s, %s)",
                        (quelle, anzahl),
                    )
        except Exception as e:
            logger.warning(f"Konnte Ingestion-Log nicht schreiben: {e}")
