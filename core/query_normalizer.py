"""
Query-Normalisierer für Innovation Republic.

Übersetzt Nutzer-Freitext in kanonische industrielle Fachsprache,
bevor das Embedding-Matching läuft (Option C: Query Normalization via Haiku).

Ablauf:
    Nutzer-Input → Haiku → normalisierte Fachbegriffe → Embedding → Kategorie

Kostenmodell:
    ~80 Input + ~60 Output Token pro Anfrage (claude-haiku-4-5)
    → ca. $0,00008 pro Query
    → Fallback auf Original-Text wenn kein API-Key vorhanden
"""

import hashlib
import os
from typing import Optional

from loguru import logger

# ---------------------------------------------------------------------------
# Prompt-Template
# ---------------------------------------------------------------------------
_SYSTEM_PROMPT = """Du bist ein Industrieexperte für KMU-Digitalisierung im DACH-Raum.
Du kennst die sieben Innovationsbereiche, in die Unternehmensherausforderungen fallen:

1. Prozessautomatisierung – manuelle/repetitive Prozesse, Workflow, RPA, Lagerinventur,
   autonome Drohnen, Bestandserfassung, AIDC, papierlose Prozesse, ERP-Integration
2. Predictive Maintenance – Maschinenüberwachung, Ausfallprävention, IoT-Sensoren,
   Stillstandsvermeidung, Industrie 4.0, SCADA, Zustandsüberwachung
3. Nachhaltige Logistik – Transportoptimierung, Lieferkette, CO2-Reduktion,
   Fuhrparkmanagement, Routenplanung, Letzte Meile, Versand
4. Digitale Qualitätssicherung – Sichtprüfung, Ausschussreduzierung, Computer Vision,
   Produktfehler, automatische Inspektion, Reklamationen, Prüfprozesse
5. Energieeffizienz – Stromverbrauch senken, Energiemanagement, Smart Metering,
   Lastoptimierung, Photovoltaik, Wärmerückgewinnung
6. HR-Tech – Fachkräftemangel, Recruiting, Onboarding, Wissenstransfer,
   Mitarbeiterbindung, Stellenbesetzung, Personalentwicklung
7. Zirkulärwirtschaft – Abfallreduzierung, Recycling, Restmaterialien,
   Sekundärrohstoffe, Kreislaufwirtschaft, Entsorgungskosten"""

_USER_PROMPT_TEMPLATE = """Nutzereingabe: "{beschreibung}"

Übersetze diese Problembeschreibung in 8–12 präzise deutsche Industriefachbegriffe,
die das eigentliche betriebliche Problem benennen.
Antworte NUR mit einer kommaseparierten Liste. Kein Fließtext, keine Erklärung."""

# ---------------------------------------------------------------------------
# In-Memory-Cache (verhindert doppelte API-Calls in einer Session)
# ---------------------------------------------------------------------------
_cache: dict[str, str] = {}


def _cache_key(text: str) -> str:
    return hashlib.sha256(text.strip().lower().encode()).hexdigest()[:16]


# ---------------------------------------------------------------------------
# Hauptfunktion
# ---------------------------------------------------------------------------
def normalisiere_query(beschreibung: str) -> tuple[str, bool]:
    """
    Normalisiert eine Nutzer-Problembeschreibung via Claude Haiku.

    Args:
        beschreibung: Roher Nutzertext

    Returns:
        (normalisierter_text, via_ki_normalisiert)
        Falls kein API-Key vorhanden oder Fehler → (original, False)
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()

    if not api_key:
        logger.debug("ANTHROPIC_API_KEY nicht gesetzt – Query-Normalisierung übersprungen")
        return beschreibung, False

    key = _cache_key(beschreibung)
    if key in _cache:
        logger.debug("Query-Normalisierung aus Cache")
        return _cache[key], True

    try:
        import anthropic  # lazy import – nur wenn API-Key vorhanden

        client = anthropic.Anthropic(api_key=api_key)
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=120,
            system=_SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": _USER_PROMPT_TEMPLATE.format(beschreibung=beschreibung)
            }]
        )

        normalisiert = response.content[0].text.strip()

        # Sicherheits-Check: Antwort muss Kommas enthalten (Fachbegriff-Liste)
        if "," not in normalisiert or len(normalisiert) > 500:
            logger.warning(f"Unerwartete Normalisierungsantwort: {normalisiert[:80]}")
            return beschreibung, False

        # Kombination: Original + normalisierte Begriffe → beste Coverage
        kombiniert = f"{beschreibung}. {normalisiert}"

        _cache[key] = kombiniert
        logger.info(f"Query normalisiert: '{beschreibung[:50]}' → '{normalisiert[:80]}'")
        return kombiniert, True

    except ImportError:
        logger.warning("anthropic-Paket nicht installiert – pip install anthropic")
        return beschreibung, False
    except Exception as e:
        logger.warning(f"Query-Normalisierung fehlgeschlagen ({type(e).__name__}): {e}")
        return beschreibung, False
