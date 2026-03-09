"""
Website-Verifizierer für Innovation Republic.

Prüft ob Startups noch existieren, indem ihre Website per HTTP erreichbar ist.
Wird beim Ingestion-Lauf einmalig pro Startup aufgerufen und schreibt das
Ergebnis in die Spalten website_verifiziert + website_zuletzt_geprueft.

Logik:
    - website_verifiziert = TRUE  → HTTP 1xx–3xx (Website erreichbar)
    - website_verifiziert = FALSE → Timeout oder HTTP 4xx/5xx
    - website_verifiziert = NULL  → Noch nicht geprüft

Startups mit website_verifiziert = FALSE werden im Matching-Query ausgeblendet.
"""

from typing import Optional
from datetime import datetime

import httpx
from loguru import logger

from db import get_db

# Timeouts und Limits
_TIMEOUT_SEKUNDEN = 8.0
_MAX_REDIRECTS = 5


def _normalisiere_url(url: str) -> Optional[str]:
    """Stellt sicher dass die URL mit https:// oder http:// beginnt."""
    if not url or not url.strip():
        return None
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"
    return url


def pruefe_website_erreichbar(url: str) -> bool:
    """
    Prüft ob eine Website per HTTP erreichbar ist.

    Strategie:
        1. HEAD-Request (schnell, kein Body)
        2. Falls HEAD abgelehnt wird (405 / 403) → GET-Fallback
        3. Jeder Status < 400 gilt als „erreichbar"

    Args:
        url: Website-URL (mit oder ohne Schema)

    Returns:
        True wenn erreichbar, False bei Fehler/Timeout/4xx+5xx
    """
    normiert = _normalisiere_url(url)
    if not normiert:
        return False

    try:
        with httpx.Client(
            follow_redirects=True,
            timeout=_TIMEOUT_SEKUNDEN,
            max_redirects=_MAX_REDIRECTS,
            headers={"User-Agent": "Innovation-Republic-Bot/1.0 (startup-verification)"},
        ) as client:
            try:
                response = client.head(normiert)
                # Manche Server lehnen HEAD explizit ab → GET versuchen
                if response.status_code in (405, 403, 501):
                    response = client.get(normiert)
            except httpx.RemoteProtocolError:
                # HTTP/2-Protokollfehler bei HEAD → direkt GET
                response = client.get(normiert)

            erreichbar = response.status_code < 400
            logger.debug(
                f"Website-Check {normiert}: HTTP {response.status_code} → "
                f"{'✓' if erreichbar else '✗'}"
            )
            return erreichbar

    except httpx.TimeoutException:
        logger.debug(f"Website-Check Timeout: {normiert}")
        return False
    except httpx.ConnectError:
        logger.debug(f"Website-Check Verbindungsfehler: {normiert}")
        return False
    except Exception as e:
        logger.debug(f"Website-Check Fehler ({type(e).__name__}): {normiert} – {e}")
        return False


def schreibe_verifikationsergebnis(startup_id: int, erreichbar: bool) -> None:
    """
    Schreibt das Verifikationsergebnis in die Datenbank.

    Args:
        startup_id: ID des Startups
        erreichbar: True wenn Website erreichbar, False sonst
    """
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE startups
                SET website_verifiziert    = %s,
                    website_zuletzt_geprueft = %s
                WHERE id = %s
                """,
                (erreichbar, datetime.utcnow(), startup_id),
            )


def verifiziere_startup(startup_id: int, website_url: str) -> bool:
    """
    Prüft die Website eines Startups und speichert das Ergebnis.

    Args:
        startup_id: Datenbank-ID des Startups
        website_url: URL der Website

    Returns:
        True wenn erreichbar, False sonst
    """
    erreichbar = pruefe_website_erreichbar(website_url)
    try:
        schreibe_verifikationsergebnis(startup_id, erreichbar)
    except Exception as e:
        logger.warning(f"Konnte Verifikationsergebnis nicht speichern (ID {startup_id}): {e}")
    return erreichbar


def verifiziere_ungepruefte_startups(limit: int = 50) -> dict:
    """
    Batch-Verifikation: Prüft alle Startups deren Website noch nicht verifiziert wurde.
    Nützlich für Hintergrundläufe und Erstbefüllung nach der Migration.

    Args:
        limit: Maximale Anzahl Startups pro Lauf (0 = unbegrenzt)

    Returns:
        Dict mit Statistik: {geprüft, erreichbar, nicht_erreichbar, übersprungen}
    """
    stat = {"geprueft": 0, "erreichbar": 0, "nicht_erreichbar": 0, "uebersprungen": 0}

    with get_db() as conn:
        with conn.cursor() as cur:
            sql = """
                SELECT id, name, website
                FROM startups
                WHERE website IS NOT NULL
                  AND website_verifiziert IS NULL
                ORDER BY id
            """
            if limit > 0:
                sql += f" LIMIT {limit}"
            cur.execute(sql)
            zu_pruefen = cur.fetchall()

    logger.info(f"Website-Verifikation: {len(zu_pruefen)} Startups werden geprüft")

    for row in zu_pruefen:
        startup_id, name, website = row[0], row[1], row[2]
        if not website:
            stat["uebersprungen"] += 1
            continue

        logger.debug(f"Prüfe {name}: {website}")
        erreichbar = verifiziere_startup(startup_id, website)
        stat["geprueft"] += 1

        if erreichbar:
            stat["erreichbar"] += 1
        else:
            stat["nicht_erreichbar"] += 1
            logger.info(f"Website nicht erreichbar: {name} ({website})")

    logger.info(
        f"Verifikation abgeschlossen: "
        f"{stat['erreichbar']} erreichbar, "
        f"{stat['nicht_erreichbar']} nicht erreichbar"
    )
    return stat
