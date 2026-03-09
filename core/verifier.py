"""
Innovation Republic · Website-Verifikation
==========================================
HTTP-Checker mit URL-Varianten-Fallback:
Prüft die angegebene URL und probiert automatisch gängige Varianten
(www/kein-www, https/http, .de/.com/.io), falls die erste fehlschlägt.
"""

import re
import httpx

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; InnovationRepublic/2.0; "
        "+https://github.com/cryptoclemens/innovation-republic)"
    )
}
_TIMEOUT = 7.0


def _normalisiere(url: str) -> str:
    """Ergänzt https:// falls kein Schema vorhanden."""
    if not url.startswith(("http://", "https://")):
        return "https://" + url
    return url


def _url_varianten(url: str) -> list[str]:
    """
    Erzeugt bis zu 4 Varianten einer URL zum Ausprobieren:
    - Original
    - www hinzufügen / entfernen
    - https ↔ http
    """
    varianten: list[str] = [url]

    # www-Variante
    if "://www." in url:
        varianten.append(url.replace("://www.", "://"))
    else:
        varianten.append(re.sub(r"://((?!www\.)\S)", r"://www.\1", url))

    # http ↔ https
    if url.startswith("https://"):
        varianten.append(url.replace("https://", "http://", 1))
    else:
        varianten.append(url.replace("http://", "https://", 1))

    # Duplikate entfernen, Reihenfolge beibehalten
    gesehen: set[str] = set()
    ergebnis: list[str] = []
    for v in varianten:
        if v not in gesehen:
            gesehen.add(v)
            ergebnis.append(v)
    return ergebnis


def _pruefe_url(client: httpx.Client, url: str) -> tuple[bool, str, str | None]:
    """
    Prüft eine einzelne URL. Gibt (ok, finale_url, fehler) zurück.
    """
    try:
        r = client.head(url)
        if r.status_code in (405, 403, 406, 501):
            r = client.get(url)
        ok = r.status_code < 400
        return ok, str(r.url), None if ok else f"HTTP {r.status_code}"
    except httpx.TimeoutException:
        return False, url, "Timeout"
    except httpx.ConnectError:
        return False, url, "Verbindung fehlgeschlagen"
    except Exception as exc:
        return False, url, str(exc)[:60]


def verifiziere_website(url: str | None) -> dict:
    """
    Prüft ob eine URL erreichbar ist. Versucht bei Fehlschlag automatisch
    gängige URL-Varianten (www/kein-www, https/http).

    Args:
        url: URL (mit oder ohne https://)

    Returns:
        {
            "erreichbar":  True | False | None,
            "finale_url":  str | None,
            "fehler":      str | None,
        }
    """
    if not url:
        return {"erreichbar": None, "finale_url": None, "fehler": "Keine URL"}

    url = _normalisiere(url.strip())
    varianten = _url_varianten(url)

    with httpx.Client(
        timeout=_TIMEOUT,
        follow_redirects=True,
        headers=_HEADERS,
    ) as client:
        letzter_fehler = None
        for variante in varianten:
            ok, finale_url, fehler = _pruefe_url(client, variante)
            if ok:
                return {"erreichbar": True, "finale_url": finale_url, "fehler": None}
            letzter_fehler = fehler

    # Alle Varianten fehlgeschlagen
    return {"erreichbar": False, "finale_url": None, "fehler": letzter_fehler}
