"""
Crunchbase-Konnektor für Innovation Republic.
⚠️  NUR FÜR DEMO-BETRIEB!

WICHTIGER HINWEIS:
    Die Crunchbase ToS erlauben keine dauerhafte Persistenz in eigenen
    Datenbanken. Alle importierten Einträge werden mit demo_only=true markiert
    und nach der Demo via cleanup_demo_data.py entfernt.

    Deaktivierung nach Demo:
        CRUNCHBASE_ENABLED=false in .env setzen
        Dann: python cleanup_demo_data.py

API-Dokumentation: https://data.crunchbase.com/docs
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

CRUNCHBASE_BASIS_URL = "https://api.crunchbase.com/api/v4"

# DACH-Regionen für den Crunchbase-Filter
DACH_LOCATION_IDS = [
    "germany",
    "austria",
    "switzerland",
    "berlin",
    "munich",
    "hamburg",
    "frankfurt",
    "vienna",
    "zurich",
]

# Maximale Anfragen pro Minute (Crunchbase-Limit: 200/min)
MAX_ANFRAGEN_PRO_MINUTE = 200
ANFRAGE_PAUSE = 60 / MAX_ANFRAGEN_PRO_MINUTE  # ~0.3s zwischen Anfragen


class CrunchbaseConnector(BasisConnector):
    """
    Lädt Startup-Daten aus Crunchbase (nur für Demo-Betrieb).

    ⚠️  DEMO-MODUS: Alle Einträge werden mit demo_only=true gespeichert.
    Nach der Demo müssen diese via cleanup_demo_data.py entfernt werden.

    Merkmale:
    - Größte Datenbasis (75 Mio. Profile global)
    - Nur für initialen Demo-Betrieb
    - Konnektor deaktivierbar via CRUNCHBASE_ENABLED=false
    - Rate-Limiting: 200 Anfragen/Minute mit exponential backoff
    """

    QUELLE = "crunchbase"

    def __init__(self):
        # Prüfe ob Crunchbase überhaupt aktiviert ist
        crunchbase_enabled = os.getenv("CRUNCHBASE_ENABLED", "false").lower() == "true"
        if not crunchbase_enabled:
            raise ValueError(
                "Crunchbase ist deaktiviert (CRUNCHBASE_ENABLED=false). "
                "Setze CRUNCHBASE_ENABLED=true für Demo-Betrieb."
            )

        self.api_key = os.getenv("CRUNCHBASE_API_KEY")
        if not self.api_key:
            raise ValueError("CRUNCHBASE_API_KEY ist nicht gesetzt")

        self.max_startups = int(os.getenv("MAX_STARTUPS_PER_SOURCE", "500"))
        self._anfragen_zaehler = 0
        self._anfragen_start = time.time()

        logger.warning(
            "⚠️  DEMO-MODUS: Crunchbase-Daten werden mit demo_only=true gespeichert. "
            "Nach der Demo: python cleanup_demo_data.py"
        )

    def _rate_limit_pause(self):
        """Respektiert das Crunchbase Rate-Limit (200 Anfragen/Minute)."""
        self._anfragen_zaehler += 1
        vergangen = time.time() - self._anfragen_start

        # Nach 180 Anfragen kurz warten (Sicherheitspuffer)
        if self._anfragen_zaehler >= 180:
            wartezeit = max(0, 60 - vergangen)
            if wartezeit > 0:
                logger.debug(f"Rate-Limit-Pause: {wartezeit:.1f}s")
                time.sleep(wartezeit)
            self._anfragen_zaehler = 0
            self._anfragen_start = time.time()
        else:
            time.sleep(ANFRAGE_PAUSE)

    @retry(
        stop=stop_after_attempt(5),
        wait=wait_exponential(multiplier=2, min=2, max=120),
    )
    def _api_anfrage(self, endpoint: str, payload: Dict) -> Dict:
        """Führt einen POST-API-Aufruf mit exponential backoff durch."""
        url = f"{CRUNCHBASE_BASIS_URL}{endpoint}"
        params = {"user_key": self.api_key}

        self._rate_limit_pause()

        with httpx.Client(timeout=30) as client:
            response = client.post(url, params=params, json=payload)

        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            logger.warning(
                f"Rate-Limit überschritten. Warte {retry_after}s (exponential backoff)..."
            )
            time.sleep(retry_after)
            response.raise_for_status()

        if response.status_code == 401:
            logger.error("Crunchbase: Ungültiger API-Key")
            raise ValueError("Crunchbase API-Key ist ungültig")

        response.raise_for_status()
        return response.json()

    def _parse_startup(self, eintrag: Dict) -> Optional[StartupRohDaten]:
        """Wandelt einen Crunchbase-Eintrag in das interne Format um."""
        properties = eintrag.get("properties", eintrag)

        name = properties.get("name", "").strip()
        if not name:
            return None

        beschreibung = properties.get("short_description", "").strip()

        # Kategorie-Gruppen als Tags
        kategorien = properties.get("category_groups", [])
        tags = []
        if isinstance(kategorien, list):
            for k in kategorien:
                if isinstance(k, dict):
                    tags.append(k.get("value", k.get("name", "")))
                else:
                    tags.append(str(k))

        # Gründungsjahr parsen
        founded_raw = properties.get("founded_on")
        gruendungsjahr = None
        if founded_raw:
            try:
                gruendungsjahr = int(str(founded_raw)[:4])
            except (ValueError, TypeError):
                pass

        # Teamgröße
        teamgroesse = properties.get("num_employees_enum", "")

        return StartupRohDaten(
            name=name,
            beschreibung=beschreibung,
            tags=[t for t in tags if t],
            quelle=self.QUELLE,
            externe_id=properties.get("permalink", properties.get("uuid", "")),
            land="",  # Wird aus location_identifiers extrahiert falls nötig
            gruendungsjahr=gruendungsjahr,
            teamgroesse=teamgroesse,
            demo_only=True,  # ⚠️  IMMER true für Crunchbase-Daten!
        )

    def importiere(self) -> int:
        """
        Importiert DACH-Startups aus Crunchbase für den Demo-Betrieb.
        ALLE Einträge werden mit demo_only=true gespeichert.

        Returns:
            Anzahl der erfolgreich importierten Startups
        """
        from pipeline.normalize import normalisiere_und_speichere

        logger.info("Starte Crunchbase-Demo-Ingestion (DACH, operativ)...")
        importiert = 0
        nach_startpunkt = None

        while importiert < self.max_startups:
            payload = {
                "field_ids": [
                    "name",
                    "short_description",
                    "category_groups",
                    "founded_on",
                    "num_employees_enum",
                    "permalink",
                ],
                "limit": 100,
                "query": [
                    {
                        "type": "predicate",
                        "field_id": "location_identifiers",
                        "operator_id": "includes",
                        "values": DACH_LOCATION_IDS,
                    },
                    {
                        "type": "predicate",
                        "field_id": "facet_ids",
                        "operator_id": "includes",
                        "values": ["company"],
                    },
                    {
                        "type": "predicate",
                        "field_id": "status",
                        "operator_id": "eq",
                        "values": ["operating"],
                    },
                ],
            }

            if nach_startpunkt:
                payload["after_id"] = nach_startpunkt

            try:
                daten = self._api_anfrage("/searches/organizations", payload)
            except Exception as e:
                logger.error(f"Crunchbase API-Fehler: {e}")
                break

            eintraege = daten.get("entities", [])
            if not eintraege:
                break

            batch: List[StartupRohDaten] = []
            for eintrag in eintraege:
                parsed = self._parse_startup(eintrag)
                if parsed:
                    batch.append(parsed)

            if batch:
                importiert += normalisiere_und_speichere(batch)

            logger.info(
                f"Crunchbase: {len(batch)} Einträge verarbeitet (gesamt: {importiert})"
            )

            # Nächste Seite
            nach_startpunkt = daten.get("after_id")
            if not nach_startpunkt or len(eintraege) < 100:
                break

        try:
            from db import get_db
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO ingestion_log (quelle, anzahl_importiert) VALUES (%s, %s)",
                        (self.QUELLE, importiert),
                    )
        except Exception as e:
            logger.warning(f"Konnte Ingestion-Log nicht schreiben: {e}")

        logger.success(
            f"Crunchbase-Demo-Ingestion abgeschlossen: {importiert} Startups "
            f"(demo_only=true, werden nach Demo via cleanup_demo_data.py entfernt)"
        )
        return importiert
