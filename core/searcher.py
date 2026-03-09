"""
Innovation Republic · Suche via Claude API
==========================================
Keine Datenbank erforderlich. Claude liefert passende B2B-Lösungsanbieter
direkt aus seinem Wissen – priorisiert DACH, ergänzt international.
"""

import json
import re

import anthropic

# ── Prompts ──────────────────────────────────────────────────────────────────

_SYSTEM_DE = """Du bist ein führender Experte für B2B-Lösungsanbieter, Startups und
etablierte Softwareunternehmen, mit Schwerpunkt auf dem DACH-Raum (Deutschland,
Österreich, Schweiz).

Aufgabe: Ein KMU-Mitarbeiter nennt eine berufliche Herausforderung. Du findest
die real existierenden Unternehmen, die diese Herausforderung am direktesten lösen.

Regeln:
1. Nenne nur REAL EXISTIERENDE Unternehmen – niemals erfundene Namen.
2. Priorisiere DACH-Anbieter (DE, AT, CH). Ergänze internationale Marktführer
   (USA, UK, EU), wenn kein gleichwertiger DACH-Anbieter existiert.
3. match_score (0–100): Bewertet wie DIREKT der Anbieter die spezifische
   Herausforderung löst – nicht die allgemeine Branchennähe.
4. website: STRENGE REGEL – gib NUR die URL an, die du mit Sicherheit kennst
   (z.B. celonis.com, personio.de). Bei der geringsten Unsicherheit: null setzen.
   NIEMALS eine URL raten oder konstruieren. Falsche URLs schaden den Nutzern.
5. kontakt_email: Nur wenn du die offizielle Kontakt-E-Mail sicher kennst, sonst null.
6. Antworte AUSSCHLIESSLICH mit einem validen JSON-Array. Kein Markdown. Kein Text.

Schema jedes Objekts:
{
  "name":              "Exakter Unternehmensname",
  "tagline":           "Ein Satz was das Unternehmen macht",
  "match_score":       85,
  "match_begruendung": "1-2 Sätze warum dieses Unternehmen passt",
  "land":              "Deutschland",
  "website":           "https://www.beispiel.de",
  "kontakt_email":     "info@beispiel.de oder null",
  "gruendungsjahr":    2018,
  "teamgroesse":       "50-200"
}"""

_SYSTEM_EN = """You are a leading expert on B2B solution providers, startups and
established software companies, with a focus on the DACH region (Germany, Austria,
Switzerland) and international markets.

Task: A professional at an SME describes a workplace challenge. You find the real
companies that most directly solve this challenge.

Rules:
1. Only name REAL, EXISTING companies – never invented names.
2. Prioritize DACH providers (DE, AT, CH). Add international leaders (USA, UK, EU)
   when no equivalent DACH provider exists.
3. match_score (0–100): Rates how DIRECTLY the provider solves this specific
   challenge – not general industry proximity.
4. website: STRICT RULE – only provide a URL you know with certainty (e.g. celonis.com).
   If there is any doubt about the exact URL, set it to null. NEVER guess or construct
   a URL. Wrong URLs harm users.
5. kontakt_email: Only if you know the official contact email with certainty, else null.
6. Respond ONLY with a valid JSON array. No markdown. No text.

Schema of each object:
{
  "name":              "Exact company name",
  "tagline":           "One sentence describing what the company does",
  "match_score":       85,
  "match_begruendung": "1-2 sentences why this company fits",
  "land":              "Germany",
  "website":           "https://www.example.com",
  "kontakt_email":     "info@example.com or null",
  "gruendungsjahr":    2018,
  "teamgroesse":       "50-200"
}"""

_USER_DE = """Herausforderung eines KMU-Mitarbeiters:
"{challenge}"

Finde {n} real existierende Unternehmen, die diese Herausforderung lösen.
Sortiere nach match_score absteigend. Nur JSON-Array:"""

_USER_EN = """Challenge described by an SME professional:
"{challenge}"

Find {n} real companies that solve this challenge.
Sort by match_score descending. JSON array only:"""


# ── Hauptfunktion ─────────────────────────────────────────────────────────────

def suche_loesungsanbieter(
    herausforderung: str,
    api_key: str,
    anzahl: int = 8,
    sprache: str = "de",
    modell: str = "claude-sonnet-4-6",
) -> list[dict]:
    """
    Sucht passende Lösungsanbieter für eine Herausforderung via Claude API.

    Args:
        herausforderung: Die Herausforderung in einem Satz
        api_key:         Anthropic API Key
        anzahl:          Anzahl gewünschter Ergebnisse (Standard: 8)
        sprache:         "de" oder "en"
        modell:          Claude-Modell

    Returns:
        Liste von Unternehmens-Dicts, sortiert nach match_score (beste zuerst)

    Raises:
        json.JSONDecodeError: Wenn Claude kein valides JSON liefert
        anthropic.APIError:   Bei API-Fehlern
    """
    client = anthropic.Anthropic(api_key=api_key)

    system = _SYSTEM_EN if sprache == "en" else _SYSTEM_DE
    user_tmpl = _USER_EN if sprache == "en" else _USER_DE

    nachricht = client.messages.create(
        model=modell,
        max_tokens=4096,
        system=system,
        messages=[{
            "role": "user",
            "content": user_tmpl.format(
                challenge=herausforderung.strip(),
                n=anzahl,
            ),
        }],
    )

    raw = nachricht.content[0].text.strip()

    # Strip Markdown-Code-Fences falls vorhanden (```json ... ```)
    raw = re.sub(r"^```(?:json)?\s*\n?", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\n?```\s*$", "", raw, flags=re.MULTILINE)
    raw = raw.strip()

    ergebnisse: list[dict] = json.loads(raw)

    # Felder normalisieren & absichern
    for e in ergebnisse:
        e["match_score"] = max(0, min(100, int(e.get("match_score") or 0)))
        e.setdefault("name", "—")
        e.setdefault("tagline", "")
        e.setdefault("match_begruendung", "")
        e.setdefault("land", "")
        e.setdefault("website", None)
        e.setdefault("kontakt_email", None)
        e.setdefault("gruendungsjahr", None)
        e.setdefault("teamgroesse", None)

    # Sicherheitshalber nach Score sortieren
    ergebnisse.sort(key=lambda x: x["match_score"], reverse=True)
    return ergebnisse
