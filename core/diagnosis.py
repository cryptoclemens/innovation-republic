"""
Diagnose-Modul für Innovation Republic.
Klassifiziert Problembeschreibungen in eine der 7 Innovationskategorien
und schlägt eine Lösungsrichtung vor.
"""

from dataclasses import dataclass, field
from typing import List, Dict

import numpy as np
from loguru import logger

from core.embedding import erstelle_embedding, erstelle_embeddings_batch, get_model
from core.matching import aehnliche_kmu_faelle
from core.query_normalizer import normalisiere_query

# Die 7 internen Innovationskategorien
INNOVATIONSKATEGORIEN = [
    "Prozessautomatisierung",
    "Predictive Maintenance",
    "Nachhaltige Logistik",
    "Digitale Qualitätssicherung",
    "Energieeffizienz",
    "HR-Tech",
    "Zirkulärwirtschaft",
]

# Beschreibende Texte pro Kategorie für Embedding-Vergleich
KATEGORIE_BESCHREIBUNGEN = {
    "Prozessautomatisierung": (
        "Automatisierung manueller Prozesse, Workflow-Optimierung, RPA, "
        "digitale Transformation, papierlose Büros, ERP-Integration, "
        "Zeitersparnis bei wiederkehrenden Aufgaben"
    ),
    "Predictive Maintenance": (
        "Maschinenüberwachung, Ausfallprävention, IoT-Sensoren, "
        "vorausschauende Wartung, Stillstandsvermeidung, Industrie 4.0, "
        "SCADA, Maschinendaten, ungeplante Ausfälle"
    ),
    "Nachhaltige Logistik": (
        "Logistikoptimierung, Routenplanung, CO2-Reduktion, "
        "Lieferkettenmanagement, Tracking, Transporteffizienz, "
        "Lieferpünktlichkeit, Fuhrparkmanagement"
    ),
    "Digitale Qualitätssicherung": (
        "Qualitätskontrolle, Sichtprüfung, Produktfehler erkennen, "
        "Ausschussreduzierung, automatische Inspektion, Computer Vision, "
        "Reklamationen, Kundenbeschwerden über Produktqualität"
    ),
    "Energieeffizienz": (
        "Energieverbrauch senken, Stromkosten, Energiemanagement, "
        "Smart Metering, Lastoptimierung, Energieeinsparung, "
        "erneuerbare Energien, CO2-Bilanz"
    ),
    "HR-Tech": (
        "Fachkräftemangel, Mitarbeitergewinnung, Recruiting, Onboarding, "
        "Wissensmanagement, Mitarbeiterfluktuation, Stellenbesetzung, "
        "Talentmanagement, Mitarbeiterentwicklung"
    ),
    "Zirkulärwirtschaft": (
        "Abfallreduzierung, Recycling, Materialrückgewinnung, Kreislaufwirtschaft, "
        "Sekundärrohstoffe, Nachhaltigkeit, Entsorgungskosten, Restmaterialien"
    ),
}

# Lösungsrichtungen pro Kategorie
LOESUNGSRICHTUNGEN = {
    "Prozessautomatisierung": (
        "Digitalisierung und Automatisierung Ihrer manuellen Prozesse. "
        "RPA-Tools und KI-gestützte Workflow-Systeme können repetitive Aufgaben "
        "übernehmen und Fehlerquoten drastisch senken."
    ),
    "Predictive Maintenance": (
        "IoT-Sensorik und KI-basierte Anomalieerkennung ermöglichen vorausschauende "
        "Wartung. Statt auf Ausfälle zu reagieren, können Sie diese bis zu zwei "
        "Wochen im Voraus vorhersagen."
    ),
    "Nachhaltige Logistik": (
        "KI-gestützte Routenoptimierung und Echtzeit-Tracking reduzieren Kosten "
        "und CO2-Emissionen gleichzeitig. Moderne Plattformen integrieren sich "
        "nahtlos in bestehende Logistiksysteme."
    ),
    "Digitale Qualitätssicherung": (
        "Computer-Vision-Systeme erkennen Produktfehler schneller und "
        "zuverlässiger als manuelle Kontrolle. Sie lernen kontinuierlich "
        "aus neuen Fehlern und verbessern sich selbst."
    ),
    "Energieeffizienz": (
        "Smart-Energy-Management-Systeme machen Ihren Verbrauch transparent "
        "und identifizieren Einsparpotenziale automatisch. Typische Amortisation "
        "nach 12–24 Monaten."
    ),
    "HR-Tech": (
        "KI-gestützte Recruiting- und Onboarding-Plattformen beschleunigen "
        "Ihren Einstellungsprozess und sichern Unternehmenswissen systematisch. "
        "Mitarbeiterbindung durch strukturierte Entwicklungspfade."
    ),
    "Zirkulärwirtschaft": (
        "Digitale Plattformen für Industriesymbiose verbinden Ihr Unternehmen "
        "mit Abnehmern für Restmaterialien und Sekundärrohstoffe. "
        "Kosten senken und Nachhaltigkeitsziele gleichzeitig erfüllen."
    ),
}


@dataclass
class Diagnose:
    """Ergebnis der Problemdiagnose."""
    kategorie: str
    konfidenz: float            # 0.0 – 1.0
    loesung: str
    aehnliche_faelle: List[Dict] = field(default_factory=list)
    alle_kategorien: Dict[str, float] = field(default_factory=dict)
    query_normalisiert: bool = False   # True wenn Haiku die Query erweitert hat


# Kategorie-Embeddings werden beim ersten Aufruf gecacht
_kategorie_embeddings: Dict[str, np.ndarray] | None = None


def _lade_kategorie_embeddings() -> Dict[str, np.ndarray]:
    """Erstellt und cached Embeddings für alle 7 Kategoriebeschreibungen."""
    global _kategorie_embeddings
    if _kategorie_embeddings is None:
        texte = list(KATEGORIE_BESCHREIBUNGEN.values())
        kategorien = list(KATEGORIE_BESCHREIBUNGEN.keys())
        embeddings = erstelle_embeddings_batch(texte)
        _kategorie_embeddings = dict(zip(kategorien, embeddings))
    return _kategorie_embeddings


def diagnose_problem(beschreibung: str) -> Diagnose:
    """
    Klassifiziert eine Problembeschreibung in eine der 7 Innovationskategorien.

    Ablauf:
        1. Eingabetext → Embedding
        2. Cosine similarity gegen alle 7 Kategorie-Embeddings
        3. Kategorie mit höchstem Score wird gewählt
        4. Ähnliche KMU-Fälle aus der Datenbank laden
        5. Passende Lösungsrichtung zurückgeben

    Args:
        beschreibung: Problembeschreibung in natürlicher Sprache

    Returns:
        Diagnose-Objekt mit Kategorie, Konfidenz und Lösungsvorschlag
    """
    if not beschreibung or not beschreibung.strip():
        return Diagnose(
            kategorie="Unbekannt",
            konfidenz=0.0,
            loesung="Bitte beschreiben Sie Ihr Problem ausführlicher.",
        )

    logger.debug(f"Diagnose für: '{beschreibung[:60]}...'")

    # Schritt 0: Query via Haiku in kanonische Industriesprache übersetzen
    embedding_text, via_ki = normalisiere_query(beschreibung)

    # Eingabe-Embedding erstellen (mit normalisiertem Text wenn verfügbar)
    eingabe_embedding = erstelle_embedding(embedding_text)

    # Ähnlichkeit zu allen Kategorien berechnen (cosine similarity via Skalarprodukt
    # da alle Vektoren L2-normalisiert sind)
    kategorie_embeddings = _lade_kategorie_embeddings()
    scores: Dict[str, float] = {}

    for kategorie, kat_embedding in kategorie_embeddings.items():
        similarity = float(np.dot(eingabe_embedding, kat_embedding))
        scores[kategorie] = max(0.0, min(1.0, similarity))  # auf [0,1] clippen

    # Beste Kategorie wählen
    beste_kategorie = max(scores, key=scores.get)
    konfidenz = scores[beste_kategorie]

    # Ähnliche KMU-Fälle laden
    aehnliche = aehnliche_kmu_faelle(beschreibung, limit=2)

    return Diagnose(
        kategorie=beste_kategorie,
        konfidenz=konfidenz,
        loesung=LOESUNGSRICHTUNGEN.get(beste_kategorie, ""),
        aehnliche_faelle=aehnliche,
        alle_kategorien=scores,
        query_normalisiert=via_ki,
    )
