"""
AngelList-Konnektor für Innovation Republic.
EARLY-STAGE-ERGÄNZUNG: Besonders stark bei Angel- und Seed-Runden,
die in Dealroom unterrepräsentiert sind. Kostenlos zugänglich.

API-Dokumentation: https://angel.co/api
Kostenlose Registrierung erforderlich.
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

ANGELLIST_BASIS_URL = "https://api.angel.co/1"

# Relevante Markt-Tags für DACH-B2B
RELEVANTE_MAERKTE = [
    "Manufacturing", "Logistics", "CleanTech", "B2B Software",
    "Enterprise Software", "IoT", "Robotics", "Automation",
    "HR Tech", "Energy", "Sustainability", "Quality Control",
]


class AngelListConnector(BasisConnector):
    """
    Lädt Startup-Daten aus der AngelList API.

    Merkmale:
    - Kostenlos, aber Rate-Limiting (60 Anfragen/Minute)
    - Gut für frühe Finanzierungsrunden (Angel, Pre-Seed, Seed)
    - Ergänzt Dealroom im Early-Stage-Bereich
    - Alle Einträge mit quelle='angellist' markiert
    """

    QUELLE = "angellist"

    def __init__(self):
        self.api_key = os.getenv("ANGELLIST_API_KEY")
        if not self.api_key:
            raise ValueError("ANGELLIST_API_KEY ist nicht gesetzt")

        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }
        self.max_startups = int(os.getenv("MAX_STARTUPS_PER_SOURCE", "1000"))

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=30))
    def _api_anfrage(self, endpoint: str, params: Dict) -> Dict:
        """Führt einen API-Aufruf mit Retry-Logik durch."""
        url = f"{ANGELLIST_BASIS_URL}{endpoint}"
        with httpx.Client(timeout=30) as client:
            response = client.get(url, headers=self.headers, params=params)

        if response.status_code == 429:
            logger.warning("Rate-Limit erreicht – warte 60s...")
            time.sleep(60)
            response.raise_for_status()

        response.raise_for_status()
        return response.json()

    def _suche_startups_nach_markt(self, markt: str) -> List[Dict]:
        """Sucht Startups für einen bestimmten Markt-Tag."""
        try:
            # Markt-ID über Tag-Suche herausfinden
            tag_daten = self._api_anfrage("/tags/search", {"query": markt})
            tags = tag_daten.get("tags", [])
            if not tags:
                return []

            tag_id = tags[0].get("id")
            if not tag_id:
                return []

            # Startups für diesen Markt abrufen
            startups_daten = self._api_anfrage(
                "/startups",
                {
                    "filter": "all",
                    "tag_id": tag_id,
                    "startup_roles[]": "company",
                    "per_page": 50,
                },
            )
            return startups_daten.get("startups", [])

        except Exception as e:
            logger.debug(f"Fehler bei Markt '{markt}': {e}")
            return []

    def _parse_startup(self, eintrag: Dict) -> Optional[StartupRohDaten]:
        """Wandelt einen AngelList-Eintrag in das interne Format um."""
        name = eintrag.get("name", "").strip()
        if not name:
            return None

        beschreibung = (
            eintrag.get("product_desc")
            or eintrag.get("high_concept")
            or ""
        ).strip()

        # Märkte als Tags
        markets = eintrag.get("markets", [])
        tags = [m.get("name", m) if isinstance(m, dict) else str(m) for m in markets]

        # Unternehmens-URL
        website = eintrag.get("company_url") or eintrag.get("angellist_url", "")

        return StartupRohDaten(
            name=name,
            beschreibung=beschreibung,
            tags=tags,
            quelle=self.QUELLE,
            externe_id=str(eintrag.get("id", "")),
            land=eintrag.get("locations", [{}])[0].get("name", "") if eintrag.get("locations") else "",
            website=website,
            demo_only=False,
        )

    def importiere(self) -> int:
        """
        Importiert Early-Stage-Startups aus AngelList.

        Returns:
            Anzahl der erfolgreich importierten Startups
        """
        from pipeline.normalize import normalisiere_und_speichere

        logger.info("Starte AngelList-Ingestion...")
        alle_eintraege: Dict[str, StartupRohDaten] = {}  # name → daten (Deduplizierung)

        for markt in RELEVANTE_MAERKTE:
            rohdaten = self._suche_startups_nach_markt(markt)
            for eintrag in rohdaten:
                parsed = self._parse_startup(eintrag)
                if parsed and parsed.name not in alle_eintraege:
                    alle_eintraege[parsed.name] = parsed

            if len(alle_eintraege) >= self.max_startups:
                break

            time.sleep(1)  # Höfliche Pause zwischen Anfragen

        batch = list(alle_eintraege.values())
        if not batch:
            logger.warning("AngelList: Keine Daten gefunden")
            return 0

        importiert = normalisiere_und_speichere(batch)

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

        logger.success(f"AngelList-Ingestion abgeschlossen: {importiert} Startups")
        return importiert
