"""
Innovation Republic · FastAPI Backend
======================================
Schlanke REST API die Claude als Matching-Engine nutzt.

Endpunkte:
  GET  /           → Health-Check
  POST /api/match  → Claude sucht passende B2B-Anbieter + verifiziert Websites
"""

import os
import sys
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Projekt-Root zum Suchpfad hinzufügen, damit core/ importierbar ist
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.searcher import suche_loesungsanbieter
from core.verifier import verifiziere_website

# ── App-Initialisierung ────────────────────────────────────────────────────────

app = FastAPI(
    title="Innovation Republic API",
    description="Claude-powered B2B startup matching for SMEs in the DACH region",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # GitHub Pages, Streamlit, lokale Entwicklung
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ── Datenmodelle ───────────────────────────────────────────────────────────────

class MatchAnfrage(BaseModel):
    challenge: str          # Herausforderung in eigenen Worten
    language: str = "de"    # "de" oder "en"
    count: int = 6          # Anzahl gewünschter Ergebnisse (max 10)


# ── Endpunkte ──────────────────────────────────────────────────────────────────

@app.get("/")
def health():
    """Health-Check – zeigt ob der Service läuft."""
    return {
        "status": "ok",
        "version": "2.1.0",
        "service": "Innovation Republic API",
    }


@app.post("/api/match")
def match(req: MatchAnfrage):
    """
    Sucht passende B2B-Lösungsanbieter für eine Herausforderung.

    1. Claude API: Findet real existierende Unternehmen mit Match-Score
    2. Website-Verifikation: Prüft alle URLs parallel per HTTP
    3. Gibt verifizierte Ergebnisse sortiert nach Score zurück
    """
    # API-Key prüfen
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured on server"
        )

    # Eingabe validieren
    challenge = req.challenge.strip()
    if len(challenge) < 10:
        raise HTTPException(
            status_code=400,
            detail="Challenge too short (minimum 10 characters)"
        )

    # Sicherheits-Cap
    count = min(req.count, 10)
    language = req.language if req.language in ("de", "en") else "de"

    # 1. Claude API – passende Anbieter suchen
    try:
        ergebnisse = suche_loesungsanbieter(
            herausforderung=challenge,
            api_key=api_key,
            anzahl=count,
            sprache=language,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Claude API error: {str(exc)[:120]}"
        )

    # 2. Websites parallel verifizieren
    def verifiziere(eintrag: dict) -> dict:
        v = verifiziere_website(eintrag.get("website"))
        eintrag["website_verified"] = v["erreichbar"]
        eintrag["website_final"] = v["finale_url"]
        return eintrag

    with ThreadPoolExecutor(max_workers=8) as pool:
        ergebnisse = list(pool.map(verifiziere, ergebnisse))

    return {
        "results": ergebnisse,
        "count": len(ergebnisse),
        "language": language,
    }
