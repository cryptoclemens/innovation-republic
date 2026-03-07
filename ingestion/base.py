"""
Basis-Klassen und gemeinsame Datenstrukturen für alle Ingestion-Konnektoren.
"""

from dataclasses import dataclass, field
from typing import List, Optional
from abc import ABC, abstractmethod


@dataclass
class StartupRohDaten:
    """
    Einheitliches Rohdaten-Format für Startups aus allen Quellen.
    Wird von normalize.py weiterverarbeitet.
    """
    name: str
    beschreibung: str
    tags: List[str] = field(default_factory=list)
    quelle: str = ""
    externe_id: str = ""
    land: str = ""
    gruendungsjahr: Optional[int] = None
    teamgroesse: str = ""
    finanzierung_gesamt: Optional[float] = None
    website: str = ""
    demo_only: bool = False


class BasisConnector(ABC):
    """
    Abstrakte Basisklasse für alle Datenquell-Konnektoren.
    Jeder Konnektor muss importiere() implementieren.
    """

    @abstractmethod
    def importiere(self) -> int:
        """
        Importiert Startups aus der jeweiligen Quelle.

        Returns:
            Anzahl der erfolgreich gespeicherten Einträge
        """
        ...
