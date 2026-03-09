"""
Innovation Republic · Website-Verifikation
==========================================
Einfacher HTTP-Checker: Prüft ob eine URL tatsächlich erreichbar ist.
Kein Datenbank-Schreiben – gibt nur ein Dict mit dem Ergebnis zurück.
"""

import httpx

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; InnovationRepublic/2.0; "
        "+https://github.com/cryptoclemens/innovation-republic)"
    )
}
_TIMEOUT = 7.0


def verifiziere_website(url: str | None) -> dict:
    """
    Prüft ob eine URL erreichbar ist (HTTP 2xx/3xx).

    Args:
        url: Vollständige URL (mit oder ohne https://)

    Returns:
        {
            "erreichbar":  True | False | None  (None = keine URL angegeben),
            "finale_url":  str | None            (URL nach Weiterleitungen),
            "fehler":      str | None            (Fehlermeldung falls nicht erreichbar),
        }
    """
    if not url:
        return {"erreichbar": None, "finale_url": None, "fehler": "Keine URL"}

    # Schema ergänzen falls fehlt
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        with httpx.Client(
            timeout=_TIMEOUT,
            follow_redirects=True,
            headers=_HEADERS,
        ) as client:
            r = client.head(url)
            # Manche Server mögen kein HEAD – GET als Fallback
            if r.status_code in (405, 403, 406, 501):
                r = client.get(url)

        ok = r.status_code < 400
        return {
            "erreichbar": ok,
            "finale_url": str(r.url),
            "fehler": None if ok else f"HTTP {r.status_code}",
        }

    except httpx.TimeoutException:
        return {"erreichbar": False, "finale_url": None, "fehler": "Timeout"}
    except httpx.ConnectError:
        return {"erreichbar": False, "finale_url": None, "fehler": "Verbindung fehlgeschlagen"}
    except Exception as exc:
        return {"erreichbar": False, "finale_url": None, "fehler": str(exc)[:80]}
