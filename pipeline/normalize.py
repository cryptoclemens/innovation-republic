"""
Normalisierungs-Pipeline für Innovation Republic.
Verarbeitet Rohdaten aus allen Quellen:
    1. Englische Beschreibungen → Deutsch (via deep-translator, kostenlos)
    2. Externe Tags → 7 interne Innovationskategorien
    3. Deduplizierung via cosine similarity (Schwellwert: 0.92)
    4. Embedding-Erstellung via sentence-transformers
    5. Speicherung in PostgreSQL via pgvector

Quell-Priorisierung bei Merge-Konflikten:
    Dealroom > AngelList > EU Startup Monitor > Crunchbase
"""

from typing import List, Optional
from loguru import logger

from deep_translator import GoogleTranslator
from psycopg2.extras import RealDictCursor
from pgvector.psycopg2 import register_vector

from ingestion.base import StartupRohDaten
from core.embedding import erstelle_embedding
from db import get_db

# Schwellwert für Duplikat-Erkennung (cosine similarity)
DEDUPLIZIERUNGS_SCHWELLWERT = 0.92

# Priorisierung der Quellen bei Merges (höhere Zahl = höhere Priorität)
QUELLEN_PRIORITAET = {
    "dealroom": 4,
    "angellist": 3,
    "eu_startup_monitor": 2,
    "crunchbase": 1,
    "demo_seed": 0,
}

# 7 interne Innovationskategorien
INNOVATIONSKATEGORIEN = [
    "Prozessautomatisierung",
    "Predictive Maintenance",
    "Nachhaltige Logistik",
    "Digitale Qualitätssicherung",
    "Energieeffizienz",
    "HR-Tech",
    "Zirkulärwirtschaft",
]

# Keyword-Mapping: externe Tags/Kategorien → interne Kategorien
KATEGORIE_MAPPING = {
    # Prozessautomatisierung
    "automation": "Prozessautomatisierung",
    "rpa": "Prozessautomatisierung",
    "workflow": "Prozessautomatisierung",
    "process": "Prozessautomatisierung",
    "robotics": "Prozessautomatisierung",
    "digitalization": "Prozessautomatisierung",
    "erp": "Prozessautomatisierung",
    "b2b software": "Prozessautomatisierung",
    "enterprise software": "Prozessautomatisierung",
    "saas": "Prozessautomatisierung",
    # Predictive Maintenance
    "iot": "Predictive Maintenance",
    "sensor": "Predictive Maintenance",
    "maintenance": "Predictive Maintenance",
    "industrial": "Predictive Maintenance",
    "manufacturing": "Predictive Maintenance",
    "industry 4.0": "Predictive Maintenance",
    "scada": "Predictive Maintenance",
    "machine monitoring": "Predictive Maintenance",
    "predictive": "Predictive Maintenance",
    # Nachhaltige Logistik
    "logistics": "Nachhaltige Logistik",
    "supply chain": "Nachhaltige Logistik",
    "transport": "Nachhaltige Logistik",
    "shipping": "Nachhaltige Logistik",
    "fleet": "Nachhaltige Logistik",
    "delivery": "Nachhaltige Logistik",
    "routing": "Nachhaltige Logistik",
    "tracking": "Nachhaltige Logistik",
    # Digitale Qualitätssicherung
    "quality": "Digitale Qualitätssicherung",
    "inspection": "Digitale Qualitätssicherung",
    "computer vision": "Digitale Qualitätssicherung",
    "testing": "Digitale Qualitätssicherung",
    "defect": "Digitale Qualitätssicherung",
    "visual inspection": "Digitale Qualitätssicherung",
    "quality control": "Digitale Qualitätssicherung",
    # Energieeffizienz
    "energy": "Energieeffizienz",
    "cleantech": "Energieeffizienz",
    "renewable": "Energieeffizienz",
    "smart grid": "Energieeffizienz",
    "power": "Energieeffizienz",
    "electricity": "Energieeffizienz",
    "emission": "Energieeffizienz",
    "carbon": "Energieeffizienz",
    # HR-Tech
    "hr": "HR-Tech",
    "recruiting": "HR-Tech",
    "talent": "HR-Tech",
    "people": "HR-Tech",
    "workforce": "HR-Tech",
    "onboarding": "HR-Tech",
    "hr tech": "HR-Tech",
    "human resources": "HR-Tech",
    "staffing": "HR-Tech",
    # Zirkulärwirtschaft
    "circular": "Zirkulärwirtschaft",
    "recycling": "Zirkulärwirtschaft",
    "waste": "Zirkulärwirtschaft",
    "reuse": "Zirkulärwirtschaft",
    "sustainability": "Zirkulärwirtschaft",
    "circular economy": "Zirkulärwirtschaft",
    "upcycling": "Zirkulärwirtschaft",
    "secondary materials": "Zirkulärwirtschaft",
}

# Übersetzungs-Cache (verhindert doppelte API-Aufrufe)
_uebersetzungs_cache: dict = {}


def uebersetze_ins_deutsche(text: str) -> str:
    """
    Übersetzt englischen Text ins Deutsche via Google Translate (kostenlos).
    Erkennt automatisch ob Übersetzung nötig ist.

    Args:
        text: Eingabetext (Englisch oder bereits Deutsch)

    Returns:
        Deutschen Text
    """
    if not text or len(text) < 5:
        return text

    # Cache-Treffer?
    if text in _uebersetzungs_cache:
        return _uebersetzungs_cache[text]

    # Einfache Spracherkennung: wenn viele deutsche Wörter → nicht übersetzen
    deutsche_indikatoren = [
        " und ", " der ", " die ", " das ", " für ", " von ",
        " mit ", " bei ", " durch ", " wird ", "ü", "ä", "ö", "ß"
    ]
    ist_deutsch = sum(1 for w in deutsche_indikatoren if w in text.lower()) >= 2
    if ist_deutsch:
        return text

    try:
        uebersetzt = GoogleTranslator(source="auto", target="de").translate(text)
        _uebersetzungs_cache[text] = uebersetzt
        return uebersetzt
    except Exception as e:
        logger.debug(f"Übersetzung fehlgeschlagen (Original wird verwendet): {e}")
        return text


def mappe_kategorie(tags: List[str]) -> Optional[str]:
    """
    Mappt externe Tags auf eine der 7 internen Innovationskategorien.

    Args:
        tags: Liste von externen Tags/Kategorien

    Returns:
        Interne Kategorie oder None wenn kein Mapping gefunden
    """
    for tag in tags:
        tag_lower = tag.lower().strip()
        for schluessel, kategorie in KATEGORIE_MAPPING.items():
            if schluessel in tag_lower or tag_lower in schluessel:
                return kategorie
    return None


def bereinige_beschreibung(text: str) -> str:
    """Bereinigt eine Beschreibung (HTML, überschüssige Whitespace, etc.)."""
    if not text:
        return ""
    # Einfache HTML-Tag-Entfernung
    import re
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def pruefe_auf_duplikat(
    name: str,
    embedding: list,
    conn,
) -> Optional[dict]:
    """
    Prüft ob ein ähnliches Startup bereits in der Datenbank existiert.
    Kriterium: gleicher Name ODER cosine similarity > 0.92

    Returns:
        Existierender Datenbankeintrag oder None
    """
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        # Erst nach gleichem Namen suchen (schnell)
        cur.execute(
            "SELECT id, name, quelle FROM startups WHERE LOWER(name) = LOWER(%s)",
            (name,),
        )
        namens_treffer = cur.fetchone()
        if namens_treffer:
            return dict(namens_treffer)

        # Dann semantische Ähnlichkeitsprüfung
        cur.execute(
            """
            SELECT id, name, quelle,
                   1 - (embedding <=> %s::vector) AS similarity
            FROM startups
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> %s::vector
            LIMIT 1
            """,
            (embedding, embedding),
        )
        result = cur.fetchone()
        if result and result["similarity"] >= DEDUPLIZIERUNGS_SCHWELLWERT:
            return dict(result)

    return None


def merge_quellen(bestehende_quelle: str, neue_quelle: str) -> str:
    """
    Entscheidet bei Duplikaten welche Quelle gespeichert wird.
    Bei unterschiedlichen Quellen → 'mehrere'
    """
    if bestehende_quelle == neue_quelle:
        return bestehende_quelle
    # Höhere Priorität gewinnt, außer wenn verschiedene Quellen → "mehrere"
    return "mehrere"


def normalisiere_und_speichere(batch: List[StartupRohDaten]) -> int:
    """
    Normalisiert, dedupliziert und speichert eine Batch von Startups.

    Ablauf pro Eintrag:
        1. Beschreibung bereinigen
        2. Ins Deutsche übersetzen
        3. Kategorie mappen
        4. Embedding erstellen
        5. Auf Duplikate prüfen (skip oder merge)
        6. In PostgreSQL speichern

    Args:
        batch: Liste von StartupRohDaten aus beliebiger Quelle

    Returns:
        Anzahl der tatsächlich gespeicherten/aktualisierten Einträge
    """
    if not batch:
        return 0

    gespeichert = 0
    uebersprungen = 0

    with get_db() as conn:
        register_vector(conn)

        for startup in batch:
            try:
                # Leere Beschreibungen überspringen
                if not startup.name:
                    continue

                # Beschreibung bereinigen
                beschreibung = bereinige_beschreibung(startup.beschreibung)

                # Ins Deutsche übersetzen falls nötig
                beschreibung_de = uebersetze_ins_deutsche(beschreibung)

                # Kategorie mappen
                kategorie = mappe_kategorie(startup.tags)

                # Embedding aus Name + Beschreibung erstellen
                embedding_text = f"{startup.name} {beschreibung_de}"
                embedding = erstelle_embedding(embedding_text)
                embedding_liste = embedding.tolist()

                # Duplikat-Prüfung
                duplikat = pruefe_auf_duplikat(startup.name, embedding_liste, conn)

                if duplikat:
                    # Quelle im bestehenden Eintrag aktualisieren wenn nötig
                    neue_quelle = merge_quellen(duplikat["quelle"], startup.quelle)
                    if neue_quelle != duplikat["quelle"]:
                        with conn.cursor() as cur:
                            cur.execute(
                                "UPDATE startups SET quelle = %s WHERE id = %s",
                                (neue_quelle, duplikat["id"]),
                            )
                    uebersprungen += 1
                    continue

                # Neuen Eintrag speichern
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO startups
                            (name, beschreibung, branchen_tags, loesung_kategorie,
                             quelle, externe_id, embedding, land, gruendungsjahr,
                             teamgroesse, finanzierung_gesamt, website, demo_only)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (quelle, externe_id) DO UPDATE SET
                            beschreibung = EXCLUDED.beschreibung,
                            embedding = EXCLUDED.embedding,
                            zuletzt_aktualisiert = CURRENT_TIMESTAMP
                        """,
                        (
                            startup.name,
                            beschreibung_de,
                            startup.tags,
                            kategorie,
                            startup.quelle,
                            startup.externe_id or None,
                            embedding_liste,
                            startup.land or None,
                            startup.gruendungsjahr,
                            startup.teamgroesse or None,
                            startup.finanzierung_gesamt,
                            startup.website or None,
                            startup.demo_only,
                        ),
                    )
                gespeichert += 1

            except Exception as e:
                logger.warning(
                    f"Fehler bei Startup '{startup.name}': {e}"
                )
                continue

    logger.debug(
        f"Batch verarbeitet: {gespeichert} gespeichert, {uebersprungen} Duplikate übersprungen"
    )
    return gespeichert
