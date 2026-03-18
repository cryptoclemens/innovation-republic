/**
 * Innovation Republic · Website-Verifikation (portiert aus core/verifier.py)
 *
 * HTTP-Checker mit URL-Varianten-Fallback.
 */

export interface VerificationResult {
  erreichbar: boolean | null;
  finale_url: string | null;
  fehler: string | null;
}

const USER_AGENT =
  "Mozilla/5.0 (compatible; InnovationRepublic/2.0; +https://github.com/cryptoclemens/innovation-republic)";
const TIMEOUT_MS = 7000;

function normalisiere(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}

function urlVarianten(url: string): string[] {
  const varianten: string[] = [url];

  // www-Variante
  if (url.includes("://www.")) {
    varianten.push(url.replace("://www.", "://"));
  } else {
    varianten.push(url.replace("://", "://www."));
  }

  // http <-> https
  if (url.startsWith("https://")) {
    varianten.push(url.replace("https://", "http://"));
  } else {
    varianten.push(url.replace("http://", "https://"));
  }

  // Deduplizieren, Reihenfolge beibehalten
  return [...new Set(varianten)];
}

async function pruefeUrl(
  url: string,
): Promise<{ ok: boolean; finaleUrl: string; fehler: string | null }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: controller.signal,
    });

    // Manche Server lehnen HEAD ab – Fallback auf GET
    if ([405, 403, 406, 501].includes(res.status)) {
      clearTimeout(timer);
      const timer2 = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res2 = await fetch(url, {
          method: "GET",
          headers: { "User-Agent": USER_AGENT },
          redirect: "follow",
          signal: controller.signal,
        });
        clearTimeout(timer2);
        const ok = res2.status < 400;
        return {
          ok,
          finaleUrl: res2.url || url,
          fehler: ok ? null : `HTTP ${res2.status}`,
        };
      } finally {
        clearTimeout(timer2);
      }
    }

    const ok = res.status < 400;
    return {
      ok,
      finaleUrl: res.url || url,
      fehler: ok ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, finaleUrl: url, fehler: "Timeout" };
    }
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, finaleUrl: url, fehler: msg.slice(0, 60) };
  } finally {
    clearTimeout(timer);
  }
}

export async function verifziereWebsite(
  url: string | null,
): Promise<VerificationResult> {
  if (!url) {
    return { erreichbar: null, finale_url: null, fehler: "Keine URL" };
  }

  const normUrl = normalisiere(url.trim());
  const varianten = urlVarianten(normUrl);

  let letzterFehler: string | null = null;
  for (const variante of varianten) {
    const { ok, finaleUrl, fehler } = await pruefeUrl(variante);
    if (ok) {
      return { erreichbar: true, finale_url: finaleUrl, fehler: null };
    }
    letzterFehler = fehler;
  }

  return { erreichbar: false, finale_url: null, fehler: letzterFehler };
}
